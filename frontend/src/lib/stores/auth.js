// ── Auth Store (Supabase) ─────────────────────────────────────────────────
// Location: src/lib/stores/auth.js
// ─────────────────────────────────────────────────────────────────────────
import { writable, derived, get } from 'svelte/store';
import { supabase } from '$lib/supabaseClient.js';

// ── Core user store ───────────────────────────────────────────────────────
export const user = writable(null);

// ── Derived helpers ───────────────────────────────────────────────────────
export const isLoggedIn = derived(user, $u => $u !== null);
export const userName   = derived(user, $u => $u ? `${$u.firstName ?? ''} ${$u.lastName ?? ''}`.trim() : '');

// ── Initialise: check existing session on load ───────────────────────────
async function initAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) user.set(mapUser(session.user));
}
initAuth();

supabase.auth.onAuthStateChange((_event, session) => {
  user.set(session?.user ? mapUser(session.user) : null);
});

// ── Map Supabase user → store shape ──────────────────────────────────────
function mapUser(sbUser) {
  const meta = sbUser.user_metadata || {};
  return {
    id:        sbUser.id,
    email:     sbUser.email,
    firstName: meta.first_name || meta.firstName || '',
    lastName:  meta.last_name  || meta.lastName  || '',
    phone:     sbUser.phone || meta.phone || '',
  };
}

// ── REGISTER ──────────────────────────────────────────────────────────────
export async function register({ firstName, lastName, email, password }) {
  const f = (firstName || '').trim();
  const l = (lastName  || '').trim();
  const e = (email     || '').trim().toLowerCase();
  const p = password || '';

  if (!f || !l)          return { ok: false, error: 'Name is required.' };
  if (!e)                return { ok: false, error: 'Email is required.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
                         return { ok: false, error: 'Invalid email address.' };
  if (p.length < 8)      return { ok: false, error: 'Password must be at least 8 characters.' };
  if (!/[A-Z]/.test(p))  return { ok: false, error: 'Password must contain at least one uppercase letter.' };
  if (!/[0-9]/.test(p))  return { ok: false, error: 'Password must contain at least one number.' };

  const { data, error: sbError } = await supabase.auth.signUp({
    email: e,
    password: p,
    options: { data: { first_name: f, last_name: l } },
  });

  if (sbError) return { ok: false, error: sbError.message };
  if (data.user && !data.session) return { ok: true, needsConfirmation: true };
  return { ok: true };
}

// ── LOGIN ─────────────────────────────────────────────────────────────────
export async function login({ email, password }) {
  const e = (email || '').trim().toLowerCase();
  const p = password || '';

  if (!e || !p) return { ok: false, error: 'Email and password are required.' };

  const { error: sbError } = await supabase.auth.signInWithPassword({ email: e, password: p });
  if (sbError) return { ok: false, error: sbError.message };
  return { ok: true };
}

// ── LOGOUT ────────────────────────────────────────────────────────────────
export async function logout() {
  await supabase.auth.signOut();
  user.set(null);
}

// ── UPDATE PROFILE ────────────────────────────────────────────────────────
export async function updateProfile({ firstName, lastName, phone }) {
  const { error: sbError } = await supabase.auth.updateUser({
    data: {
      first_name: (firstName || '').trim(),
      last_name:  (lastName  || '').trim(),
      phone:      (phone     || '').trim(),
    },
  });

  if (sbError) return { ok: false, error: sbError.message };

  const { data: { user: updated } } = await supabase.auth.getUser();
  if (updated) user.set(mapUser(updated));
  return { ok: true };
}

// ── SAVE ORDER ────────────────────────────────────────────────────────────
export async function saveOrder({ items, total, address, notes, email, phone }) {

  // Get client_id if logged in
  let client_id = null;
  const current = get(user);
  if (current) {
    const { data: customer } = await supabase
      .from('registered_customers')
      .select('client_id')
      .eq('auth_id', current.id)
      .single();
    if (customer) client_id = customer.client_id;
  }

  // Insert into order_calls
  // NOTE: do NOT pass order_no — the DB trigger generates it automatically
  const { data: order, error: orderError } = await supabase
    .from('order_calls')
    .insert({
      client_id,                              // null for guests
      email:          email || current?.email || '',
      phone:          phone || '',
      address,
      notes:          notes || null,
      payment_method: 'COD',
      status:         'Confirmed',
      total_price:    Math.round(total * 100), // BDT → paisa
    })
    .select('order_no')
    .single();

  if (orderError) {
    console.error('order_calls insert error:', orderError);
    return { ok: false, error: orderError.message };
  }

  // Insert line items
  const { error: itemsError } = await supabase
    .from('order_line_items')
    .insert(
      items.map(item => ({
        order_no:   order.order_no,
        product_id: item.id,
        quantity:   item.qty,
        size:       item.size || null,
        unit_price: Math.round(item.price * 100), // BDT → paisa
      }))
    );

  if (itemsError) {
    console.error('order_line_items insert error:', itemsError);
    return { ok: false, error: itemsError.message };
  }

  return { ok: true, orderNo: order.order_no };
}

// ── GET ORDERS for current user ───────────────────────────────────────────
export async function getOrders() {
  const current = get(user);
  if (!current) return [];

  // Step 1: get client_id from registered_customers
  const { data: customer, error: customerError } = await supabase
    .from('registered_customers')
    .select('client_id')
    .eq('auth_id', current.id)
    .single();

  if (customerError || !customer) {
    console.error('getOrders: customer lookup failed', customerError);
    return [];
  }

  // Step 2: fetch orders for that client_id
  const { data, error: sbError } = await supabase
    .from('order_calls')
    .select(`
      order_no,
      address,
      status,
      payment_method,
      total_price,
      created_at,
      order_line_items (
        product_id,
        quantity,
        size,
        unit_price
      )
    `)
    .eq('client_id', customer.client_id)
    .order('created_at', { ascending: false });

  if (sbError) {
    console.error('getOrders error:', sbError);
    return [];
  }

  // Convert paisa → BDT for display
  return (data || []).map(o => ({
    ...o,
    total_price: o.total_price / 100,
    order_line_items: o.order_line_items.map(i => ({
      ...i,
      unit_price: i.unit_price / 100,
    })),
  }));
}