<!-- src/lib/components/home/ProductRow.svelte -->
<script>
  let { heading = 'New Arrivals', products = [] } = $props();
</script>

<section class="row-section">
  <div class="row-header">
    <h2 class="row-heading">{heading}</h2>
    <a href="/new" class="row-all">View All</a>
  </div>
  <div class="track">
    {#each products as p, i}
      <a href={p.href} class="card" style="--i:{i}">
        <div class="card-img" style="background-image:url('{p.image}')">
          <div class="card-overlay"><span class="card-cta">Quick View</span></div>
        </div>
        <div class="card-info">
          <p class="card-name">{p.name}</p>
          <p class="card-price">{p.price}</p>
        </div>
      </a>
    {/each}
  </div>
</section>

<style>
  .row-section { background: #000; padding: clamp(40px,5vw,80px) 0; }
  .row-header {
    display: flex; align-items: baseline; justify-content: space-between;
    padding: 0 clamp(16px,3vw,48px); margin-bottom: clamp(24px,3vw,40px);
  }
  .row-heading {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(22px,3vw,36px); font-weight: 300;
    letter-spacing: 0.06em; color: #fff; margin: 0;
  }
  .row-all {
    font-family: 'Jost', sans-serif; font-size: 10.5px; font-weight: 300;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(255,255,255,0.5); text-decoration: none; transition: color 200ms;
  }
  .row-all:hover { color: #fff; }
  .track {
    display: flex; gap: clamp(12px,1.5vw,24px);
    overflow-x: auto; scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding: 0 clamp(16px,3vw,48px) 16px;
    scrollbar-width: none;
  }
  .track::-webkit-scrollbar { display: none; }
  .card {
    flex: 0 0 clamp(200px,22vw,320px); scroll-snap-align: start;
    text-decoration: none; opacity: 0;
    animation: cardIn 500ms ease calc(var(--i) * 60ms + 200ms) forwards;
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: none; }
  }
  .card-img {
    position: relative; width: 100%; aspect-ratio: 3 / 4;
    background-size: cover; background-position: center top;
    background-color: #1a1a1a; overflow: hidden;
    transition: transform 400ms cubic-bezier(0.16,1,0.3,1);
  }
  .card:hover .card-img { transform: scale(1.03); }
  .card-overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,0.3);
    display: flex; align-items: flex-end; justify-content: center;
    padding-bottom: 20px; opacity: 0; transition: opacity 280ms;
  }
  .card:hover .card-overlay { opacity: 1; }
  .card-cta {
    font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 300;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: #fff; border: 1px solid rgba(255,255,255,0.7); padding: 8px 18px;
  }
  .card-info { padding: 12px 0 0; display: flex; flex-direction: column; gap: 4px; }
  .card-name {
    font-family: 'Jost', sans-serif; font-size: clamp(11px,1vw,13px);
    font-weight: 300; letter-spacing: 0.06em; color: #fff; margin: 0;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .card-price {
    font-family: 'Jost', sans-serif; font-size: clamp(10px,0.9vw,12px);
    font-weight: 300; letter-spacing: 0.06em;
    color: rgba(255,255,255,0.5); margin: 0;
  }
</style>