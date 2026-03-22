// ============================================================
//  +page.server.js — reused for ALL category pages
//  Location: src/routes/[category]/+page.server.js
//
//  Reads the category from the URL and fetches matching products.
//  Add new categories to the CONFIG object below — no other
//  files need changing.
// ============================================================
import { fetchProducts } from '$lib/data/products.js';
import { error } from '@sveltejs/kit';

// ── CATEGORY CONFIG ─────────────────────────────────────────
// key       = URL segment  e.g. /women
// title     = display name
// subtitle  = small label above title
// image     = hero background image (put in static/images/)
// filter    = function to match products to this category
const CONFIG = {
  women: {
    title:    'Women',
    subtitle: 'The Collection',
    image:    '/images/cat-women.jpg',
    filter:   p => p.category === 'women' || p.tags?.includes('women'),
  },
  men: {
    title:    'Men',
    subtitle: 'The Collection',
    image:    '/images/cat-men.jpg',
    filter:   p => p.category === 'men' || p.tags?.includes('men'),
  },
  new: {
    title:    'New In',
    subtitle: 'Latest Arrivals',
    image:    '/images/cat-new.jpg',
    filter:   p => p.tags?.includes('new'),
  },
  jewellery: {
    title:    'Jewellery & Watches',
    subtitle: 'Fine Jewellery',
    image:    '/images/cat-jewellery.jpg',
    filter:   p => p.category === 'jewellery' || p.tags?.includes('jewellery'),
  },
  handbags: {
    title:    'Handbags',
    subtitle: 'The Collection',
    image:    '/images/cat-bags.jpg',
    filter:   p => p.category === 'handbags' || p.tags?.includes('handbags'),
  },
};

export async function load({ params }) {
  const cat = CONFIG[params.category];

  // Unknown category → 404
  if (!cat) throw error(404, 'Category not found');

  const all      = await fetchProducts();
  const products = all.filter(cat.filter);

  return {
    title:    cat.title,
    subtitle: cat.subtitle,
    image:    cat.image,
    products,
  };
}