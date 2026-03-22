<!-- Location: src/routes/products/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { fetchProducts } from '$lib/data/products.js';

  let products = $state([]);
  let filtered  = $state([]);
  let loading   = $state(true);
  let active    = $state('all'); // active category filter

  const categories = [
    { key: 'all',      label: 'All' },
    { key: 'handbags', label: 'Handbags' },
    { key: 'women',    label: 'Women' },
    { key: 'men',      label: 'Men' },
    { key: 'clothing', label: 'Clothing' },
  ];

  onMount(async () => {
    products = await fetchProducts();
    filtered  = products;
    loading   = false;
  });

  function filter(key) {
    active   = key;
    filtered = key === 'all'
      ? products
      : products.filter(p => p.category === key || p.tags?.includes(key));
  }

  function fmt(n) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 0,
    }).format(n);
  }
</script>

<svelte:head>
  <title>All Products — Thaminas</title>
</svelte:head>

<div class="page">

  <!-- Page heading -->
  <div class="page-head">
    <h1 class="page-title">All Products</h1>
    <p class="page-count">{filtered.length} items</p>
  </div>

  <!-- Category filter strip -->
  <div class="filters">
    {#each categories as cat}
      <button
        class="filter-btn"
        class:active={active === cat.key}
        onclick={() => filter(cat.key)}
      >
        {cat.label}
      </button>
    {/each}
  </div>

  <!-- Grid -->
  {#if loading}
    <!-- Skeleton placeholders while loading -->
    <div class="grid">
      {#each Array(6) as _}
        <div class="skeleton"></div>
      {/each}
    </div>
  {:else if filtered.length === 0}
    <div class="empty">
      <p>No products found in this category.</p>
    </div>
  {:else}
    <div class="grid">
      {#each filtered as p, i}
        <a href="/products/{p.slug}" class="card" style="--i:{i}">
          <div class="card-img" style="background-image:url('{p.images?.[0] ?? ''}')">
            <div class="card-hover">
              <span class="card-cta">View Product</span>
            </div>
          </div>
          <div class="card-info">
            <p class="card-name">{p.name}</p>
            <p class="card-price">{fmt(p.price)}</p>
          </div>
        </a>
      {/each}
    </div>
  {/if}

</div>

<style>
  .page {
    background: #000;
    min-height: 100vh;
    padding: clamp(32px, 5vw, 72px) clamp(16px, 4vw, 64px);
  }

  /* ── Heading ────────────────────────────────────────────── */
  .page-head {
    display: flex; align-items: baseline;
    justify-content: space-between;
    margin-bottom: clamp(24px, 3vw, 40px);
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .page-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(24px, 3.5vw, 40px);
    font-weight: 300; letter-spacing: 0.06em;
    color: #fff; margin: 0;
  }
  .page-count {
    font-family: 'Jost', sans-serif; font-size: 11px;
    font-weight: 300; letter-spacing: 0.15em;
    color: rgba(255,255,255,0.35); margin: 0;
  }

  /* ── Filters ────────────────────────────────────────────── */
  .filters {
    display: flex; flex-wrap: wrap; gap: 8px;
    margin-bottom: clamp(24px, 4vw, 48px);
  }
  .filter-btn {
    background: none;
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.45);
    font-family: 'Jost', sans-serif; font-size: 10.5px;
    font-weight: 300; letter-spacing: 0.18em; text-transform: uppercase;
    padding: 8px 18px; cursor: pointer;
    transition: border-color 200ms, color 200ms, background 200ms;
  }
  .filter-btn:hover { color: #fff; border-color: rgba(255,255,255,0.4); }
  .filter-btn.active {
    background: #fff; color: #000;
    border-color: #fff;
  }

  /* ── Product grid ───────────────────────────────────────── */
  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: clamp(12px, 1.5vw, 24px);
  }
  @media (max-width: 1100px) { .grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 760px)  { .grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 400px)  { .grid { grid-template-columns: 1fr; } }

  /* ── Card ───────────────────────────────────────────────── */
  .card {
    text-decoration: none;
    opacity: 0;
    animation: fadeIn 400ms ease calc(var(--i) * 50ms + 50ms) forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: none; }
  }
  .card-img {
    position: relative;
    width: 100%; aspect-ratio: 3 / 4;
    background-size: cover; background-position: center top;
    background-color: #111; overflow: hidden;
    transition: transform 400ms cubic-bezier(0.16,1,0.3,1);
  }
  .card:hover .card-img { transform: scale(1.03); }

  .card-hover {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.25);
    display: flex; align-items: flex-end; justify-content: center;
    padding-bottom: 20px; opacity: 0;
    transition: opacity 250ms;
    pointer-events: none;
  }
  .card:hover .card-hover { opacity: 1; }
  .card-cta {
    font-family: 'Jost', sans-serif; font-size: 10px;
    font-weight: 300; letter-spacing: 0.22em; text-transform: uppercase;
    color: #fff; border: 1px solid rgba(255,255,255,0.7);
    padding: 8px 18px;
  }

  .card-info { padding: 12px 0 0; display: flex; flex-direction: column; gap: 4px; }
  .card-name {
    font-family: 'Jost', sans-serif;
    font-size: clamp(11px, 1vw, 13px); font-weight: 300; letter-spacing: 0.06em;
    color: #fff; margin: 0;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .card-price {
    font-family: 'Jost', sans-serif;
    font-size: clamp(10px, 0.9vw, 12px); font-weight: 300; letter-spacing: 0.06em;
    color: rgba(255,255,255,0.5); margin: 0;
  }

  /* ── Skeleton ───────────────────────────────────────────── */
  .skeleton {
    aspect-ratio: 3 / 4;
    background: linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer {
    from { background-position: 200% 0; }
    to   { background-position: -200% 0; }
  }

  /* ── Empty ──────────────────────────────────────────────── */
  .empty {
    text-align: center; padding: 80px 0;
    font-family: 'Jost', sans-serif; font-size: 13px;
    font-weight: 300; color: rgba(255,255,255,0.3);
    letter-spacing: 0.1em;
  }
</style>