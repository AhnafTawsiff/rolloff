// ============================================================
//  products.js
//  Location: src/lib/data/products.js
// ============================================================
import { supabase } from '$lib/supabaseClient.js';

// ── Fallback (used if Supabase fetch fails) ──────────────────
const fallbackProducts = [
  {
    id:       'thaminas-tote-001',
    slug:     'thaminas-tote',
    sku:      'TH-001',
    name:     'The Thaminas Tote',
    subtitle: 'Available Now',
    price:    1250,
    images:   ['/images/products/tote-1.jpg', '/images/products/tote-2.jpg', '/images/products/tote-3.jpg'],
    sizes:    ['XS', 'S', 'M', 'L', 'XL'],
    description: 'A timeless everyday tote crafted from full-grain leather. The structured silhouette and signature Thaminas hardware make it instantly recognisable.',
    details: [
      { heading: 'Product Care',       content: 'Store in the provided dust bag when not in use. Clean with a soft dry cloth.' },
      { heading: 'In-store Service',   content: 'Complimentary engraving and personalisation available at all Thaminas boutiques.' },
      { heading: 'Gifting',            content: 'All orders are delivered in our signature Thaminas box with complimentary gift wrapping upon request.' },
      { heading: 'Shipping & Returns', content: 'Complimentary shipping on all orders. Returns accepted within 30 days.' },
    ],
    category: 'handbags',
    tags:     ['new', 'women', 'handbags'],
  },
  {
    id:       'monogram-jacket-001',
    slug:     'monogram-jacket',
    sku:      'TH-002',
    name:     'Monogram Track Jacket',
    subtitle: 'Preorder Now',
    price:    980,
    images:   ['/images/products/jacket-1.jpg', '/images/products/jacket-2.jpg'],
    sizes:    ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'A light and sporty layer crafted from technical ripstop fabric printed with the Thaminas Blooming Monogram motif.',
    details: [
      { heading: 'Product Care',       content: 'Machine wash cold on gentle cycle. Do not tumble dry.' },
      { heading: 'In-store Service',   content: 'Complimentary monogramming available at all Thaminas boutiques.' },
      { heading: 'Gifting',            content: 'All orders are delivered in our signature Thaminas box.' },
      { heading: 'Shipping & Returns', content: 'Complimentary shipping on all orders. Returns within 30 days.' },
    ],
    category: 'men',
    tags:     ['new', 'men', 'clothing'],
  },
];

// ── In-memory cache ──────────────────────────────────────────
let _cached = null;

// ── Fetch all products ───────────────────────────────────────
export async function fetchProducts() {
  if (_cached) return _cached;

  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, slug, sku, name, subtitle, price, sizes, description, category, tags')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (data && data.length > 0) {
      // price is stored in paisa in DB — convert to BDT for display
      _cached = data.map(p => ({
        ...p,
        price:   p.price / 100,
        // images not in DB — use fallback images matched by id
        images:  fallbackProducts.find(f => f.id === p.id)?.images ?? [],
        details: fallbackProducts.find(f => f.id === p.id)?.details ?? [],
      }));
      return _cached;
    }
  } catch (err) {
    console.warn('Supabase products fetch failed, using fallback:', err.message);
  }

  return fallbackProducts;
}

// ── Fetch single product by slug ─────────────────────────────
export async function fetchProduct(slug) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, slug, sku, name, subtitle, price, sizes, description, category, tags')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    if (data) {
      const fb = fallbackProducts.find(f => f.id === data.id);
      return {
        ...data,
        price:   data.price / 100,
        images:  fb?.images  ?? [],
        details: fb?.details ?? [],
      };
    }
  } catch (err) {
    console.warn('Supabase product fetch failed, using fallback:', err.message);
  }

  return fallbackProducts.find(p => p.slug === slug) ?? null;
}

// ── Synchronous fallback exports ─────────────────────────────
export const products = fallbackProducts;
export function getProduct(slug) {
  return fallbackProducts.find(p => p.slug === slug) ?? null;
}