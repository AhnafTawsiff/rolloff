// ============================================================
//  cart.js
//  Location: src/lib/stores/cart.js
//
//  Global cart state. Import anywhere in your app.
//
//  USAGE:
//    import { cartItems, cartCount, cartTotal, addToCart, removeFromCart, updateQty, clearCart, cartOpen } from '$lib/stores/cart.js';
// ============================================================
import { writable, derived } from 'svelte/store';

// ── Is the cart drawer open? ────────────────────────────────
export const cartOpen = writable(false);

// ── Cart items array ────────────────────────────────────────
// Each item: { id, slug, name, price, image, size, qty }
export const cartItems = writable([]);

// ── Derived: total item count (sum of all qtys) ─────────────
export const cartCount = derived(
  cartItems,
  $items => $items.reduce((n, item) => n + item.qty, 0)
);

// ── Derived: total price ────────────────────────────────────
export const cartTotal = derived(
  cartItems,
  $items => $items.reduce((sum, item) => sum + item.price * item.qty, 0)
);

// ── Add item or increment qty if already in cart ────────────
export function addToCart(product, size = null) {
  cartItems.update(items => {
    const key = `${product.id}-${size}`;
    const existing = items.find(i => i._key === key);
    if (existing) {
      return items.map(i => i._key === key ? { ...i, qty: i.qty + 1 } : i);
    }
    return [...items, {
      _key:  key,
      id:    product.id,
      slug:  product.slug,
      name:  product.name,
      price: product.price,
      image: product.images?.[0] ?? '',
      size,
      qty:   1,
    }];
  });
  cartOpen.set(true); // open drawer on add
}

// ── Update quantity ─────────────────────────────────────────
export function updateQty(key, delta) {
  cartItems.update(items =>
    items
      .map(i => i._key === key ? { ...i, qty: i.qty + delta } : i)
      .filter(i => i.qty > 0) // remove if qty hits 0
  );
}

// ── Remove item ─────────────────────────────────────────────
export function removeFromCart(key) {
  cartItems.update(items => items.filter(i => i._key !== key));
}

// ── Clear everything ────────────────────────────────────────
export function clearCart() {
  cartItems.set([]);
}