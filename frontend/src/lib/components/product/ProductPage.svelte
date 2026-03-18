<!-- ============================================================
  ProductPage.svelte
  Location: src/lib/components/product/ProductPage.svelte

  The full product page layout.
  Left  = scrollable image gallery
  Right = sticky panel (price, sizes, buttons, accordions)

  PROPS:
    product — one product object from src/lib/data/products.js
============================================================ -->
<script>
  import { addToCart } from '$lib/stores/cart.js';
  let { product } = $props();

  // ── State ──────────────────────────────────────────────────
  let selectedSize   = $state(null);      // which size is selected
  let openAccordion  = $state(null);      // which accordion is open
  let descExpanded   = $state(false);     // read more / less
  let addedToCart    = $state(false);     // button feedback state
  let wishlisted     = $state(false);     // heart toggle

  // Format price e.g. 1250 → "$1,250"
  // $derived = recalculates if product prop ever changes
  const price = $derived(new Intl.NumberFormat('en-US', {
    style: 'currency', currency: product.currency ?? 'USD',
    minimumFractionDigits: 0,
  }).format(product.price));

  // Toggle accordion open/close
  function toggleAccordion(i) {
    openAccordion = openAccordion === i ? null : i;
  }

  // Add to cart — adds item to store and opens drawer
  function handleAddToCart() {
    if (product.sizes.length > 0 && !selectedSize) return;
    addToCart(product, selectedSize);
    addedToCart = true;
    setTimeout(() => (addedToCart = false), 2000);
  }

  // Truncate description — $derived so it updates if product changes
  const shortDesc = $derived(product.description.split('\n').slice(0, 2).join('\n'));
  const hasMore   = $derived(product.description.split('\n').length > 2);
</script>

<div class="product-page">

  <!-- ══════════════════════════════════════════════════════
    LEFT — scrollable image gallery
    All images stack vertically. You scroll through them.
    Clicking a thumbnail scrolls to that image.
  ═══════════════════════════════════════════════════════ -->
  <div class="gallery">

    <!-- Main images — stack vertically, scroll through them -->
    <div class="main-images">
      {#each product.images as img, i}
        <div class="main-img">
          <img
            src={img}
            alt="{product.name}"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        </div>
      {/each}
    </div>

  </div>

  <!-- ══════════════════════════════════════════════════════
    RIGHT — sticky info panel
    Stays fixed while you scroll the images on the left.
  ═══════════════════════════════════════════════════════ -->
  <div class="panel">
    <div class="panel-inner">

      <!-- SKU + subtitle -->
      <div class="meta">
        <span class="sku">{product.sku}</span>
        <button
          class="wishlist"
          onclick={() => (wishlisted = !wishlisted)}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? '#fff' : 'none'} stroke="currentColor" stroke-width="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {#if product.subtitle}
        <p class="subtitle">{product.subtitle}</p>
      {/if}

      <!-- Product name + price -->
      <h1 class="name">{product.name}</h1>
      <p class="price">{price}</p>

      <!-- Size selector (hidden if no sizes) -->
      {#if product.sizes.length > 0}
        <div class="sizes-section">
          <div class="sizes-header">
            <span class="sizes-label">Select your size</span>
            <a href="/size-guide" class="size-guide">Size guide</a>
          </div>
          <div class="sizes">
            {#each product.sizes as size}
              <button
                class="size-btn"
                class:selected={selectedSize === size}
                onclick={() => selectedSize = size}
              >
                {size}
              </button>
            {/each}
          </div>
          {#if product.sizes.length > 0 && !selectedSize}
            <p class="size-hint">Please select a size</p>
          {/if}
        </div>
      {/if}

      <!-- Action buttons -->
      <div class="actions">
        <button
          class="btn-cart"
          class:added={addedToCart}
          class:disabled={product.sizes.length > 0 && !selectedSize}
          onclick={handleAddToCart}
        >
          {addedToCart ? '✓ Added to Bag' : 'Add to Bag'}
        </button>
        <a href="/contact" class="btn-advisor">Contact an Advisor</a>
      </div>

      <!-- Description -->
      <div class="description">
        <p class="desc-text">
          {descExpanded ? product.description : shortDesc}
        </p>
        {#if hasMore}
          <button class="read-more" onclick={() => (descExpanded = !descExpanded)}>
            {descExpanded ? 'Read less' : 'Read more'}
          </button>
        {/if}
      </div>

      <!-- Accordion sections (Product care, Gifting etc) -->
      <div class="accordions">
        {#each product.details as detail, i}
          <div class="accordion">
            <button
              class="accordion-trigger"
              onclick={() => toggleAccordion(i)}
              aria-expanded={openAccordion === i}
            >
              <span>{detail.heading}</span>
              <span class="accordion-icon" class:open={openAccordion === i}>+</span>
            </button>
            <div class="accordion-body" class:open={openAccordion === i}>
              <p>{detail.content}</p>
            </div>
          </div>
        {/each}
      </div>

    </div>
  </div>

</div>

<style>
  /* ── Page layout ──────────────────────────────────────────
     Left: gallery takes 55% width, right panel takes 45%.
     On mobile they stack vertically.                        */
  .product-page {
    display: grid;
    grid-template-columns: 55fr 45fr;
    min-height: 100vh;
    background: #000;
  }
  @media (max-width: 860px) {
    .product-page { grid-template-columns: 1fr; }
  }

  /* ── LEFT — gallery — no gaps, edge to edge ──────────────  */
  .gallery {
    display: block;
    background: #0a0a0a;
  }

  /* main images — flush together, no gaps */
  .main-images {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .main-img img {
    width: 100%;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    display: block;
    background: #111;
  }

  /* ── RIGHT — sticky panel ─────────────────────────────────
     position:sticky top:0 makes it stay in view as you
     scroll the gallery on the left.                         */
  .panel {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    background: #000;
    border-left: 1px solid rgba(255,255,255,0.07);
    scrollbar-width: none;
  }
  .panel::-webkit-scrollbar { display: none; }
  @media (max-width: 860px) {
    .panel { position: static; height: auto; border-left: none; border-top: 1px solid rgba(255,255,255,0.07); }
  }

  .panel-inner {
    padding: clamp(28px, 4vw, 56px) clamp(24px, 3.5vw, 48px);
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* ── Meta row (SKU + wishlist) ────────────────────────────  */
  .meta {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 8px;
  }
  .sku {
    font-family: 'Jost', sans-serif; font-size: 10px;
    font-weight: 300; letter-spacing: 0.25em; color: rgba(255,255,255,0.35);
    text-transform: uppercase;
  }
  .wishlist {
    background: none; border: none; cursor: pointer;
    color: rgba(255,255,255,0.5); padding: 4px;
    transition: color 200ms; line-height: 1;
  }
  .wishlist:hover { color: #fff; }

  /* ── Subtitle ─────────────────────────────────────────────  */
  .subtitle {
    font-family: 'Jost', sans-serif; font-size: 10.5px;
    font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(255,255,255,0.45); margin: 0 0 10px;
  }

  /* ── Name + Price ─────────────────────────────────────────  */
  .name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(22px, 2.5vw, 32px); font-weight: 300;
    letter-spacing: 0.02em; color: #fff; margin: 0 0 10px; line-height: 1.2;
  }
  .price {
    font-family: 'Jost', sans-serif; font-size: clamp(14px, 1.2vw, 17px);
    font-weight: 300; letter-spacing: 0.08em;
    color: rgba(255,255,255,0.7); margin: 0 0 28px;
  }

  /* ── Sizes ────────────────────────────────────────────────  */
  .sizes-section { margin-bottom: 28px; }
  .sizes-header {
    display: flex; align-items: center; justify-content: space-between;
    padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.08);
    margin-bottom: 14px;
  }
  .sizes-label {
    font-family: 'Jost', sans-serif; font-size: 12px;
    font-weight: 300; letter-spacing: 0.12em; color: rgba(255,255,255,0.7);
  }
  .size-guide {
    font-family: 'Jost', sans-serif; font-size: 11px;
    font-weight: 300; letter-spacing: 0.1em;
    color: rgba(255,255,255,0.45); text-decoration: underline;
    text-underline-offset: 3px; transition: color 200ms;
  }
  .size-guide:hover { color: #fff; }

  .sizes { display: flex; flex-wrap: wrap; gap: 8px; }
  .size-btn {
    min-width: 48px; height: 40px; padding: 0 12px;
    background: none; border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.6); cursor: pointer;
    font-family: 'Jost', sans-serif; font-size: 11px;
    font-weight: 300; letter-spacing: 0.1em;
    transition: border-color 200ms, color 200ms, background 200ms;
  }
  .size-btn:hover { border-color: rgba(255,255,255,0.5); color: #fff; }
  .size-btn.selected { background: #fff; color: #000; border-color: #fff; }
  .size-hint {
    font-family: 'Jost', sans-serif; font-size: 10.5px;
    color: rgba(255,255,255,0.3); margin: 8px 0 0; letter-spacing: 0.08em;
  }

  /* ── Action buttons ───────────────────────────────────────  */
  .actions { display: flex; flex-direction: column; gap: 10px; margin-bottom: 32px; }

  .btn-cart {
    width: 100%; padding: 16px;
    background: #fff; color: #000; border: 1px solid #fff;
    font-family: 'Jost', sans-serif; font-size: 11px;
    font-weight: 400; letter-spacing: 0.22em; text-transform: uppercase;
    cursor: pointer; transition: background 280ms, color 280ms, opacity 280ms;
  }
  .btn-cart:hover { background: transparent; color: #fff; }
  .btn-cart.added { background: #1a1a1a; color: rgba(255,255,255,0.7); border-color: rgba(255,255,255,0.2); }
  .btn-cart.disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-cart.disabled:hover { background: #fff; color: #000; }

  .btn-advisor {
    width: 100%; padding: 16px; text-align: center;
    background: none; color: rgba(255,255,255,0.6);
    border: 1px solid rgba(255,255,255,0.15);
    font-family: 'Jost', sans-serif; font-size: 11px;
    font-weight: 300; letter-spacing: 0.22em; text-transform: uppercase;
    text-decoration: none; transition: border-color 280ms, color 280ms;
    display: block;
  }
  .btn-advisor:hover { border-color: rgba(255,255,255,0.5); color: #fff; }

  /* ── Description ──────────────────────────────────────────  */
  .description { margin-bottom: 32px; }
  .desc-text {
    font-family: 'Jost', sans-serif; font-size: clamp(12px, 1vw, 13.5px);
    font-weight: 300; letter-spacing: 0.03em; line-height: 1.75;
    color: rgba(255,255,255,0.55); margin: 0 0 8px; white-space: pre-line;
  }
  .read-more {
    background: none; border: none; padding: 0; cursor: pointer;
    font-family: 'Jost', sans-serif; font-size: 12px;
    font-weight: 300; letter-spacing: 0.1em;
    color: rgba(255,255,255,0.6); text-decoration: underline;
    text-underline-offset: 3px; transition: color 200ms;
  }
  .read-more:hover { color: #fff; }

  /* ── Accordions ───────────────────────────────────────────  */
  .accordions { border-top: 1px solid rgba(255,255,255,0.08); }
  .accordion { border-bottom: 1px solid rgba(255,255,255,0.08); }

  .accordion-trigger {
    width: 100%; display: flex; align-items: center;
    justify-content: space-between; padding: 18px 0;
    background: none; border: none; cursor: pointer;
    font-family: 'Jost', sans-serif; font-size: 12px;
    font-weight: 300; letter-spacing: 0.12em;
    color: rgba(255,255,255,0.7); text-align: left;
    transition: color 200ms;
  }
  .accordion-trigger:hover { color: #fff; }

  .accordion-icon {
    font-size: 18px; font-weight: 200; color: rgba(255,255,255,0.4);
    transition: transform 280ms cubic-bezier(0.76,0,0.24,1), color 200ms;
    line-height: 1; flex-shrink: 0;
  }
  .accordion-icon.open { transform: rotate(45deg); color: #fff; }

  .accordion-body {
    max-height: 0; overflow: hidden;
    transition: max-height 320ms cubic-bezier(0.76,0,0.24,1), opacity 280ms;
    opacity: 0;
  }
  .accordion-body.open { max-height: 300px; opacity: 1; }
  .accordion-body p {
    font-family: 'Jost', sans-serif; font-size: clamp(11.5px, 1vw, 13px);
    font-weight: 300; letter-spacing: 0.03em; line-height: 1.75;
    color: rgba(255,255,255,0.45); padding-bottom: 18px; margin: 0;
  }
</style>