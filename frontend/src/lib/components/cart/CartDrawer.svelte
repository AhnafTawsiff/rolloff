<!-- ============================================================
  CartDrawer.svelte
  Location: src/lib/components/cart/CartDrawer.svelte

  Slides in from the right — same mechanic as the nav drawer.
  Shows all cart items, quantity controls, total, and checkout.
============================================================ -->
<script>
  import { cartOpen, cartItems, cartTotal, cartCount, updateQty, removeFromCart } from '$lib/stores/cart.js';

  // Format currency
  function fmt(n) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 0,
    }).format(n);
  }

  // Close on Escape
  function onKey(e) {
    if (e.key === 'Escape') cartOpen.set(false);
  }
</script>

<svelte:window onkeydown={onKey} />

<!-- Overlay -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="overlay"
  class:show={$cartOpen}
  onclick={() => cartOpen.set(false)}
  aria-hidden="true"
></div>

<!-- Drawer -->
<aside class="drawer" class:open={$cartOpen} aria-label="Shopping cart">

  <!-- Header -->
  <div class="drawer-head">
    <div class="head-left">
      <h2 class="drawer-title">Shopping Bag</h2>
      {#if $cartCount > 0}
        <span class="count">{$cartCount}</span>
      {/if}
    </div>
    <button class="close-btn" onclick={() => cartOpen.set(false)} aria-label="Close cart">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>

  <!-- Items -->
  <div class="items">
    {#if $cartItems.length === 0}
      <!-- Empty state -->
      <div class="empty">
        <p class="empty-msg">Your bag is empty</p>
        <a href="/new" class="empty-link" onclick={() => cartOpen.set(false)}>
          Continue Shopping
        </a>
      </div>
    {:else}
      {#each $cartItems as item (item._key)}
        <div class="item">

          <!-- Product image -->
          <a href="/products/{item.slug}" onclick={() => cartOpen.set(false)} class="item-img-wrap">
            <img src={item.image} alt={item.name} class="item-img" />
          </a>

          <!-- Product info -->
          <div class="item-info">
            <div class="item-top">
              <div>
                <p class="item-name">{item.name}</p>
                {#if item.size}
                  <p class="item-meta">Size: {item.size}</p>
                {/if}
                <p class="item-price">{fmt(item.price)}</p>
              </div>
              <!-- Remove button -->
              <button
                class="remove-btn"
                onclick={() => removeFromCart(item._key)}
                aria-label="Remove {item.name}"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <!-- Quantity controls -->
            <div class="qty-row">
              <div class="qty">
                <button
                  class="qty-btn"
                  onclick={() => updateQty(item._key, -1)}
                  aria-label="Decrease quantity"
                >−</button>
                <span class="qty-num">{item.qty}</span>
                <button
                  class="qty-btn"
                  onclick={() => updateQty(item._key, 1)}
                  aria-label="Increase quantity"
                >+</button>
              </div>
              <p class="item-subtotal">{fmt(item.price * item.qty)}</p>
            </div>
          </div>

        </div>
      {/each}
    {/if}
  </div>

  <!-- Footer — total + checkout (only when items exist) -->
  {#if $cartItems.length > 0}
    <div class="drawer-foot">
      <div class="total-row">
        <span class="total-label">Total</span>
        <span class="total-value">{fmt($cartTotal)}</span>
      </div>
      <p class="tax-note">Taxes and shipping calculated at checkout</p>
      <a href="/checkout" class="checkout-btn" onclick={() => cartOpen.set(false)}>
        Checkout
      </a>
    </div>
  {/if}

</aside>

<style>
  /* ── Overlay ──────────────────────────────────────────────  */
  .overlay {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(0,0,0,0); pointer-events: none;
    transition: background 420ms;
  }
  .overlay.show { background: rgba(0,0,0,0.5); pointer-events: all; }

  /* ── Drawer ───────────────────────────────────────────────
     Slides in from the right, same as nav menu.
     Full width on mobile, capped at 480px on desktop.      */
  .drawer {
    position: fixed; inset: 0 0 0 auto;
    width: 100vw; max-width: 480px;
    background: #000;
    border-left: 1px solid rgba(255,255,255,0.07);
    z-index: 400;
    display: flex; flex-direction: column;
    transform: translateX(100%);
    transition: transform 420ms cubic-bezier(0.76,0,0.24,1);
  }
  .drawer.open { transform: none; }

  /* ── Header ───────────────────────────────────────────────  */
  .drawer-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    flex-shrink: 0;
  }
  .head-left { display: flex; align-items: center; gap: 10px; }
  .drawer-title {
    font-family: 'Jost', sans-serif; font-size: 11px;
    font-weight: 400; letter-spacing: 0.22em; text-transform: uppercase;
    color: #fff; margin: 0;
  }
  .count {
    width: 18px; height: 18px; border-radius: 50%;
    background: #fff; color: #000;
    font-family: 'Jost', sans-serif; font-size: 9px; font-weight: 500;
    display: flex; align-items: center; justify-content: center;
  }
  .close-btn {
    background: none; border: none; cursor: pointer;
    color: rgba(255,255,255,0.5); padding: 4px;
    transition: color 200ms; line-height: 1;
  }
  .close-btn:hover { color: #fff; }

  /* ── Items scroll area ────────────────────────────────────  */
  .items {
    flex: 1; overflow-y: auto; padding: 0 24px;
    scrollbar-width: none;
  }
  .items::-webkit-scrollbar { display: none; }

  /* ── Empty state ──────────────────────────────────────────  */
  .empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 20px; height: 100%;
    padding: 48px 0;
  }
  .empty-msg {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 22px; font-weight: 300; letter-spacing: 0.04em;
    color: rgba(255,255,255,0.4); margin: 0;
  }
  .empty-link {
    font-family: 'Jost', sans-serif; font-size: 10.5px;
    font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(255,255,255,0.5); text-decoration: none;
    border-bottom: 1px solid rgba(255,255,255,0.2);
    padding-bottom: 2px; transition: color 200ms, border-color 200ms;
  }
  .empty-link:hover { color: #fff; border-color: #fff; }

  /* ── Cart item ────────────────────────────────────────────  */
  .item {
    display: flex; gap: 16px;
    padding: 20px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .item-img-wrap {
    flex-shrink: 0; width: 88px; height: 110px;
    background: #111; overflow: hidden; display: block;
  }
  .item-img { width: 100%; height: 100%; object-fit: cover; }

  .item-info { flex: 1; display: flex; flex-direction: column; gap: 10px; min-width: 0; }

  .item-top {
    display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;
  }

  .item-name {
    font-family: 'Jost', sans-serif; font-size: 12.5px;
    font-weight: 300; letter-spacing: 0.04em; color: #fff;
    margin: 0 0 4px; line-height: 1.3;
  }
  .item-meta {
    font-family: 'Jost', sans-serif; font-size: 11px;
    font-weight: 300; letter-spacing: 0.08em;
    color: rgba(255,255,255,0.35); margin: 0 0 6px;
  }
  .item-price {
    font-family: 'Jost', sans-serif; font-size: 12px;
    font-weight: 300; letter-spacing: 0.06em;
    color: rgba(255,255,255,0.6); margin: 0;
  }

  .remove-btn {
    background: none; border: none; cursor: pointer;
    color: rgba(255,255,255,0.25); padding: 2px; flex-shrink: 0;
    transition: color 200ms; line-height: 1;
  }
  .remove-btn:hover { color: #fff; }

  /* ── Quantity controls ────────────────────────────────────  */
  .qty-row {
    display: flex; align-items: center; justify-content: space-between;
  }
  .qty {
    display: flex; align-items: center; gap: 0;
    border: 1px solid rgba(255,255,255,0.12);
  }
  .qty-btn {
    width: 32px; height: 32px; background: none; border: none;
    cursor: pointer; color: rgba(255,255,255,0.6);
    font-family: 'Jost', sans-serif; font-size: 16px; font-weight: 200;
    display: flex; align-items: center; justify-content: center;
    transition: color 200ms, background 200ms;
    flex-shrink: 0;
  }
  .qty-btn:hover { color: #fff; background: rgba(255,255,255,0.05); }
  .qty-num {
    width: 36px; text-align: center;
    font-family: 'Jost', sans-serif; font-size: 12px;
    font-weight: 300; letter-spacing: 0.1em; color: #fff;
    border-left: 1px solid rgba(255,255,255,0.12);
    border-right: 1px solid rgba(255,255,255,0.12);
    line-height: 32px;
  }
  .item-subtotal {
    font-family: 'Jost', sans-serif; font-size: 12px;
    font-weight: 300; letter-spacing: 0.06em;
    color: rgba(255,255,255,0.7); margin: 0;
  }

  /* ── Footer ───────────────────────────────────────────────  */
  .drawer-foot {
    padding: 20px 24px 32px;
    border-top: 1px solid rgba(255,255,255,0.07);
    flex-shrink: 0;
    display: flex; flex-direction: column; gap: 12px;
  }
  .total-row {
    display: flex; justify-content: space-between; align-items: center;
  }
  .total-label {
    font-family: 'Jost', sans-serif; font-size: 11px;
    font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(255,255,255,0.5);
  }
  .total-value {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 22px; font-weight: 300; letter-spacing: 0.04em; color: #fff;
  }
  .tax-note {
    font-family: 'Jost', sans-serif; font-size: 10px;
    font-weight: 300; letter-spacing: 0.06em;
    color: rgba(255,255,255,0.25); margin: 0;
  }
  .checkout-btn {
    display: block; width: 100%; padding: 16px;
    background: #fff; color: #000; text-align: center;
    font-family: 'Jost', sans-serif; font-size: 11px;
    font-weight: 400; letter-spacing: 0.22em; text-transform: uppercase;
    text-decoration: none; border: 1px solid #fff;
    transition: background 280ms, color 280ms;
  }
  .checkout-btn:hover { background: transparent; color: #fff; }
</style>