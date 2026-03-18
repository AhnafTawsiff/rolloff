// ============================================================
//  products.js
//  Location: src/lib/data/products.js
//
//  THIS IS WHERE YOU MANAGE ALL YOUR PRODUCTS.
//  No need to touch any component or page code.
//
//  TO ADD A PRODUCT    → copy one object and paste it below
//  TO EDIT A PRODUCT   → change any value in the object
//  TO REMOVE A PRODUCT → delete the object
//
//  IMAGES: put all photos in frontend/static/images/products/
//  Use an array for multiple images — first one is the main image
// ============================================================

export const products = [

  {
    // ── IDENTIFIERS ──────────────────────────────────────────
    id:   'thaminas-tote-001',       // unique id — used in the URL
    slug: 'thaminas-tote',           // URL: /products/thaminas-tote

    // ── DISPLAY INFO ─────────────────────────────────────────
    sku:      'TH-001',
    name:     'The Thaminas Tote',
    subtitle: 'Available Now',       // e.g. "Preorder Now", "Limited Edition"
    price:    1250,
    currency: 'USD',

    // ── IMAGES ───────────────────────────────────────────────
    // First image = main displayed image
    // Add as many as you want — they all show in the gallery
    images: [
      '/images/products/tote-1.jpg',
      '/images/products/tote-2.jpg',
      '/images/products/tote-3.jpg',
    ],

    // ── SIZES ────────────────────────────────────────────────
    // Leave empty [] if no sizes (e.g. bags, accessories)
    sizes: ['XS', 'S', 'M', 'L', 'XL'],

    // ── DESCRIPTION ──────────────────────────────────────────
    description: `A timeless everyday tote crafted from full-grain leather. 
The structured silhouette and signature Thaminas hardware make it 
instantly recognisable. Features an interior zip pocket and magnetic closure.`,

    // ── ACCORDION SECTIONS ───────────────────────────────────
    // Each shows as a collapsible section below the description
    details: [
      {
        heading: 'Product Care',
        content: 'Store in the provided dust bag when not in use. Clean with a soft dry cloth. Avoid prolonged exposure to direct sunlight and moisture.',
      },
      {
        heading: 'In-store Service',
        content: 'Complimentary engraving and personalisation available at all Thaminas boutiques. Book an appointment online.',
      },
      {
        heading: 'Gifting',
        content: 'All orders are delivered in our signature Thaminas box with complimentary gift wrapping upon request.',
      },
      {
        heading: 'Shipping & Returns',
        content: 'Complimentary shipping on all orders. Returns accepted within 30 days of delivery in original condition.',
      },
    ],

    // ── TAGS ─────────────────────────────────────────────────
    // Used for filtering and related products
    category: 'handbags',
    tags: ['new', 'women', 'handbags'],
  },

  {
    id:   'monogram-jacket-001',
    slug: 'monogram-jacket',
    sku:  'TH-002',
    name: 'Monogram Track Jacket',
    subtitle: 'Preorder Now',
    price: 980,
    currency: 'USD',
    images: [
      '/images/products/jacket-1.jpg',
      '/images/products/jacket-2.jpg',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: `A light and sporty layer crafted from technical ripstop fabric 
and printed with the Thaminas Blooming Monogram motif. 
Features a full-length zip, elasticated cuffs, and two front pockets.`,
    details: [
      { heading: 'Product Care',     content: 'Machine wash cold on gentle cycle. Do not tumble dry. Iron on low heat.' },
      { heading: 'In-store Service', content: 'Complimentary monogramming available at all Thaminas boutiques.' },
      { heading: 'Gifting',          content: 'All orders are delivered in our signature Thaminas box.' },
      { heading: 'Shipping & Returns', content: 'Complimentary shipping on all orders. Returns within 30 days.' },
    ],
    category: 'men',
    tags: ['new', 'men', 'clothing'],
  },

];

// ── Helper: get product by slug ──────────────────────────────
// Used in the product page to find the right product from the URL
export function getProduct(slug) {
  return products.find(p => p.slug === slug) ?? null;
}