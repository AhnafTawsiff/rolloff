<!-- Location: src/routes/[category]/+page.svelte -->
<script>
  let { data } = $props();

  function fmt(n) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 0,
    }).format(n);
  }
</script>

<svelte:head>
  <title>{data.title} — Thaminas</title>
</svelte:head>

<div class="page">

  <div class="cat-head" style="background-image:url('{data.image}')">
    <div class="cat-head-inner">
      <p class="cat-sub">{data.subtitle ?? 'Collection'}</p>
      <h1 class="cat-title">{data.title}</h1>
    </div>
  </div>

  <div class="bar">
    <p class="count">{data.products.length} items</p>
  </div>

  {#if data.products.length === 0}
    <div class="empty">
      <p>New pieces coming soon.</p>
      <a href="/products" class="empty-link">View All Products</a>
    </div>
  {:else}
    <div class="grid">
      {#each data.products as p, i}
        <a href="/products/{p.slug}" class="card" style="--i:{i}">
          <div class="card-img" style="background-image:url('{p.images?.[0] ?? ''}')">
            {#if p.images?.[1]}
              <div class="card-img-hover" style="background-image:url('{p.images[1]}')"></div>
            {/if}
            <div class="card-overlay">
              <span class="card-cta">Quick View</span>
            </div>
          </div>
          <div class="card-info">
            {#if p.subtitle}<p class="card-tag">{p.subtitle}</p>{/if}
            <p class="card-name">{p.name}</p>
            <p class="card-price">{fmt(p.price)}</p>
          </div>
        </a>
      {/each}
    </div>
  {/if}

</div>

<style>
  .page { background: #000; min-height: 100vh; }

  .cat-head {
    position: relative; width: 100%;
    height: clamp(220px, 35vw, 420px);
    background-size: cover; background-position: center;
    background-color: #111;
    display: flex; align-items: flex-end;
  }
  .cat-head::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%);
  }
  .cat-head-inner {
    position: relative; z-index: 2;
    padding: clamp(24px,4vw,56px) clamp(16px,4vw,64px);
    display: flex; flex-direction: column; gap: 6px;
  }
  .cat-sub {
    font-family: 'Jost', sans-serif; font-size: 10px;
    font-weight: 300; letter-spacing: 0.3em; text-transform: uppercase;
    color: rgba(255,255,255,0.55); margin: 0;
  }
  .cat-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(28px,4.5vw,56px); font-weight: 300;
    letter-spacing: 0.04em; color: #fff; margin: 0;
  }

  .bar {
    display: flex; align-items: center;
    padding: 18px clamp(16px,4vw,64px);
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .count {
    font-family: 'Jost', sans-serif; font-size: 11px;
    font-weight: 300; letter-spacing: 0.15em;
    color: rgba(255,255,255,0.3); margin: 0;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
  }
  @media (max-width: 900px) { .grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px) { .grid { grid-template-columns: repeat(2, 1fr); } }

  .card {
    text-decoration: none;
    border-right: 1px solid rgba(255,255,255,0.05);
    border-bottom: 1px solid rgba(255,255,255,0.05);
    opacity: 0;
    animation: fadeIn 400ms ease calc(var(--i) * 40ms + 50ms) forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: none; }
  }

  .card-img {
    position: relative; width: 100%; aspect-ratio: 3 / 4;
    background-size: cover; background-position: center top;
    background-color: #111; overflow: hidden;
  }
  .card-img-hover {
    position: absolute; inset: 0;
    background-size: cover; background-position: center top;
    opacity: 0;
    transition: opacity 500ms cubic-bezier(0.16,1,0.3,1);
  }
  .card:hover .card-img-hover { opacity: 1; }
  .card-overlay {
    position: absolute; inset: 0;
    display: flex; align-items: flex-end; justify-content: center;
    padding-bottom: 20px; opacity: 0;
    transition: opacity 250ms; pointer-events: none;
    background: rgba(0,0,0,0.12);
  }
  .card:hover .card-overlay { opacity: 1; }
  .card-cta {
    font-family: 'Jost', sans-serif; font-size: 10px;
    font-weight: 300; letter-spacing: 0.22em; text-transform: uppercase;
    color: #fff; border: 1px solid rgba(255,255,255,0.6);
    padding: 8px 18px; background: rgba(0,0,0,0.2);
  }

  .card-info {
    padding: clamp(12px,2vw,20px);
    display: flex; flex-direction: column; gap: 4px;
  }
  .card-tag {
    font-family: 'Jost', sans-serif; font-size: 9.5px;
    font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(255,255,255,0.35); margin: 0;
  }
  .card-name {
    font-family: 'Jost', sans-serif;
    font-size: clamp(11px,1vw,13px); font-weight: 300;
    letter-spacing: 0.05em; color: #fff; margin: 0; line-height: 1.4;
  }
  .card-price {
    font-family: 'Jost', sans-serif;
    font-size: clamp(10px,0.9vw,12px); font-weight: 300;
    letter-spacing: 0.06em; color: rgba(255,255,255,0.45); margin: 0;
  }

  .empty {
    display: flex; flex-direction: column; align-items: center;
    gap: 20px; padding: 96px 24px; text-align: center;
  }
  .empty p {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 22px; font-weight: 300;
    color: rgba(255,255,255,0.3); margin: 0;
  }
  .empty-link {
    font-family: 'Jost', sans-serif; font-size: 10.5px;
    font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(255,255,255,0.45); text-decoration: none;
    border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 2px;
    transition: color 200ms, border-color 200ms;
  }
  .empty-link:hover { color: #fff; border-color: #fff; }
</style>