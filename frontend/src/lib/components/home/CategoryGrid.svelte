<!-- src/lib/components/home/CategoryGrid.svelte -->
<script>
  // ── Edit tiles here — images go in frontend/static/images/
  const tiles = [
    { image: '/images/cat-women.jpg', label: 'Women',    href: '/women' },
    { image: '/images/cat-men.jpg',   label: 'Men',      href: '/men' },
    { image: '/images/cat-bags.jpg',  label: 'Handbags', href: '/handbags' },
    { image: '/images/cat-new.jpg',   label: 'New In',   href: '/new' },
  ];
</script>

<section class="grid-section">
  <div class="grid">
    {#each tiles as tile, i}
      <a href={tile.href} class="tile" style="--i:{i}">
        <div class="tile-img" style="background-image:url('{tile.image}')"></div>
        <span class="tile-label">{tile.label}</span>
      </a>
    {/each}
  </div>
</section>

<style>
  .grid-section { background: #000; padding: clamp(40px,5vw,80px) clamp(16px,3vw,48px); }
  .grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: clamp(8px, 1.2vw, 20px);
  }
  @media (max-width: 860px) { .grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px) { .grid { grid-template-columns: repeat(2, 1fr); gap: 8px; } }
  .tile {
    position: relative; display: block; aspect-ratio: 3 / 4;
    overflow: hidden; text-decoration: none; background: #1a1a1a;
    opacity: 0; animation: tileIn 600ms ease calc(var(--i) * 80ms + 100ms) forwards;
  }
  @keyframes tileIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: none; }
  }
  .tile-img {
    position: absolute; inset: 0; background-size: cover;
    background-position: center top;
    transition: transform 500ms cubic-bezier(0.16,1,0.3,1);
  }
  .tile:hover .tile-img { transform: scale(1.04); }
  .tile-img::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 45%);
  }
  .tile-label {
    position: absolute; bottom: clamp(16px,2.5vw,28px);
    left: 50%; transform: translateX(-50%);
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(16px, 2vw, 24px); font-weight: 300;
    letter-spacing: 0.1em; color: #fff; white-space: nowrap; z-index: 2;
    transition: letter-spacing 300ms cubic-bezier(0.76,0,0.24,1);
  }
  .tile:hover .tile-label { letter-spacing: 0.18em; }
</style>