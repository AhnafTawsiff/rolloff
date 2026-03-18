<!-- src/lib/components/home/Hero.svelte -->
<script>
  let {
    image = '/images/hero-main.jpg',
    title = 'The New Collection',
    href  = '/new',
    label = 'Discover Now',
  } = $props();
</script>

<section class="hero">
  <div class="hero-img" style="background-image:url('{image}')"></div>
  <div class="hero-label">
    <h1 class="hero-title">{title}</h1>
    <a {href} class="hero-btn">{label}</a>
  </div>
</section>

<style>
  .hero {
    position: relative; width: 100%; height: 100svh;
    background: #000; overflow: hidden;
  }
  .hero-img {
    position: absolute; inset: 0;
    background-size: cover; background-position: center;
    animation: zoomIn 1.6s cubic-bezier(0.16,1,0.3,1) forwards;
    will-change: transform;
  }
  @keyframes zoomIn {
    from { transform: scale(1.06); opacity: 0.75; }
    to   { transform: scale(1); opacity: 1; }
  }
  .hero-img::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.15) 40%, transparent 65%);
  }
  .hero-label {
    position: sticky; bottom: 0; z-index: 10;
    display: flex; flex-direction: column; align-items: center; gap: 20px;
    padding: clamp(32px,5vw,56px) 24px clamp(40px,6vw,72px);
    opacity: 0; transform: translateY(12px);
    animation: fadeUp 800ms cubic-bezier(0.16,1,0.3,1) 600ms forwards;
  }
  @keyframes fadeUp { to { opacity: 1; transform: none; } }
  .hero-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(28px, 5vw, 56px); font-weight: 300;
    letter-spacing: 0.04em; color: #fff; text-align: center; margin: 0;
    text-shadow: 0 2px 24px rgba(0,0,0,0.4);
  }
  .hero-btn {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 160px; padding: 14px 32px;
    background: #fff; color: #000;
    font-family: 'Jost', sans-serif; font-size: 11px;
    font-weight: 400; letter-spacing: 0.22em; text-transform: uppercase;
    text-decoration: none; border: 1px solid #fff;
    transition: background 300ms, color 300ms;
  }
  .hero-btn:hover { background: transparent; color: #fff; }
</style>