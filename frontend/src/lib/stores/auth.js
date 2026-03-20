// ── Auth Store ────────────────────────────────────────────────────────────
// Location: src/lib/stores/auth.js
//
// RIGHT NOW:  fake in-memory auth — no backend needed
// LATER:      swap the internals of login/register/logout to real API calls
//             the pages and components won't need to change at all
//
// SECURITY NOTES:
//  - Passwords are NEVER stored anywhere — not in the store, not in memory
//  - No sensitive data goes to localStorage
//  - Session persists in sessionStorage (cleared when browser closes)
//  - When backend is ready: use HTTP-only cookies + JWT instead
// ─────────────────────────────────────────────────────────────────────────
import { writable, derived, get } from 'svelte/store';

// ── Session key ───────────────────────────────────────────────────────────
// Only non-sensitive data is persisted (name, email — NOT password)
const SESSION_KEY = 'thaminas_session';

// ── Load existing session ─────────────────────────────────────────────────
function loadSession() {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── Core user store ───────────────────────────────────────────────────────
// Shape: { id, firstName, lastName, email, phone, address } | null
export const user = writable(loadSession());

// ── Derived helpers ───────────────────────────────────────────────────────
export const isLoggedIn = derived(user, $u => $u !== null);
export const userName   = derived(user, $u => $u ? `${$u.firstName} ${$u.lastName}` : '');

// ── In-memory "database" — replace with real API calls later ──────────────
// Stored in module scope — lives as long as the tab is open
// NEVER store passwords. In real app: server hashes with bcrypt.
const _users = [];   // { id, firstName, lastName, email, phone, address, _pwHash }
const _orders = [];  // { id, userId, items, total, address, status, createdAt }

// Simple non-crypto ID generator — replace with UUID from backend
const uid = () => Math.random().toString(36).slice(2, 10);

// ── Save / clear session ──────────────────────────────────────────────────
function saveSession(userData) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData)); } catch {}
  user.set(userData);
}
function clearSession() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch {}
  user.set(null);
}

// ── Sanitize input — strip leading/trailing whitespace ────────────────────
const clean = (s) => (s || '').trim();

// ── REGISTER ──────────────────────────────────────────────────────────────
// Returns: { ok: true } | { ok: false, error: string }
export function register({ firstName, lastName, email, password }) {
  const f = clean(firstName);
  const l = clean(lastName);
  const e = clean(email).toLowerCase();
  const p = password || '';

  // Basic validation
  if (!f || !l)          return { ok: false, error: 'Name is required.' };
  if (!e)                return { ok: false, error: 'Email is required.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
                         return { ok: false, error: 'Invalid email address.' };
  if (p.length < 8)      return { ok: false, error: 'Password must be at least 8 characters.' };
  if (!/[A-Z]/.test(p))  return { ok: false, error: 'Password must contain at least one uppercase letter.' };
  if (!/[0-9]/.test(p))  return { ok: false, error: 'Password must contain at least one number.' };

  // Check duplicate email
  if (_users.find(u => u.email === e))
    return { ok: false, error: 'An account with this email already exists.' };

  // Create user — store a fake hash placeholder
  // REAL APP: send to backend, bcrypt hashes there, never comes back to frontend
  const newUser = {
    id: uid(),
    firstName: f,
    lastName: l,
    email: e,
    phone: '',
    address: { line1: '', line2: '', city: '', district: '', division: '', postcode: '' },
    _pwHash: btoa(p), // ← placeholder only, NOT real hashing. Backend will do bcrypt.
  };
  _users.push(newUser);

  // Save session without password
  const { _pwHash, ...sessionData } = newUser;
  saveSession(sessionData);
  return { ok: true };
}

// ── LOGIN ─────────────────────────────────────────────────────────────────
// Returns: { ok: true } | { ok: false, error: string }
export function login({ email, password }) {
  const e = clean(email).toLowerCase();
  const p = password || '';

  if (!e || !p) return { ok: false, error: 'Email and password are required.' };

  const found = _users.find(u => u.email === e);

  // Deliberately vague error — don't reveal whether email exists
  // REAL APP: constant-time comparison on backend to prevent timing attacks
  if (!found || found._pwHash !== btoa(p))
    return { ok: false, error: 'Incorrect email or password.' };

  const { _pwHash, ...sessionData } = found;
  saveSession(sessionData);
  return { ok: true };
}

// ── LOGOUT ────────────────────────────────────────────────────────────────
export function logout() {
  clearSession();
}

// ── UPDATE PROFILE ────────────────────────────────────────────────────────
export function updateProfile({ firstName, lastName, phone }) {
  const current = get(user);
  if (!current) return { ok: false, error: 'Not logged in.' };

  const updated = {
    ...current,
    firstName: clean(firstName) || current.firstName,
    lastName:  clean(lastName)  || current.lastName,
    phone:     clean(phone),
  };

  // Update in-memory store
  const idx = _users.findIndex(u => u.id === current.id);
  if (idx !== -1) {
    _users[idx] = { ..._users[idx], ...updated };
  }

  saveSession(updated);
  return { ok: true };
}

// ── UPDATE ADDRESS ────────────────────────────────────────────────────────
export function updateAddress(address) {
  const current = get(user);
  if (!current) return { ok: false, error: 'Not logged in.' };

  const updated = { ...current, address };

  const idx = _users.findIndex(u => u.id === current.id);
  if (idx !== -1) _users[idx] = { ..._users[idx], address };

  saveSession(updated);
  return { ok: true };
}

// ── SAVE ORDER (called from checkout after place order) ───────────────────
// Call this in checkout's placeOrder() function before clearCart()
export function saveOrder({ items, total, address, notes }) {
  const current = get(user);
  const order = {
    id:        'TH-' + uid().toUpperCase(),
    userId:    current?.id || 'guest',
    items,
    total,
    address,
    notes,
    status:    'Confirmed',
    createdAt: new Date().toISOString(),
  };
  _orders.push(order);
  return order;
}

// ── GET ORDERS for current user ───────────────────────────────────────────
export function getOrders() {
  const current = get(user);
  if (!current) return [];
  return _orders
    .filter(o => o.userId === current.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}