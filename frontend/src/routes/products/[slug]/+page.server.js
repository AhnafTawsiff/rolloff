// Location: src/routes/products/[slug]/+page.server.js
import { getProduct } from '$lib/data/products.js';
import { error } from '@sveltejs/kit';

export function load({ params }) {
  const product = getProduct(params.slug);
  if (!product) throw error(404, 'Product not found');
  return { product };
}