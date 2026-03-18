<!-- src/lib/components/home/ServicesBanner.svelte -->
<script>
  const services = [
    { icon: '✦', title: 'Complimentary Shipping', desc: 'Free shipping on all orders with no minimum purchase.', href: '/shipping' },
    { icon: '◈', title: 'Gift Wrapping',           desc: 'Every order arrives in our signature Thaminas packaging.', href: '/gift-services' },
    { icon: '↺', title: 'Easy Returns',            desc: 'Hassle-free returns within 30 days of delivery.', href: '/returns' },
  ];
</script>

<section class="services">
  <h2 class="heading">Services</h2>
  <div class="grid">
    {#each services as s, i}
      <a href={s.href} class="tile" style="--i:{i}">
        <span class="icon">{s.icon}</span>
        <h3 class="stitle">{s.title}</h3>
        <p class="desc">{s.desc}</p>
      </a>
    {/each}
  </div>
</section>

<style>
  .services {
    background: #000; border-top: 1px solid rgba(255,255,255,0.08);
    padding: clamp(48px,7vw,96px) clamp(16px,5vw,80px);
  }
  .heading {
    font-family: 'Jost', sans-serif;
    font-size: clamp(18px, 2.5vw, 32px); font-weight: 200;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: #fff; text-align: center;
    margin: 0 0 clamp(36px,5vw,64px);
  }
  .grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: clamp(24px,3vw,48px);
  }
  @media (max-width: 640px) { .grid { grid-template-columns: 1fr; gap: 32px; } }
  .tile {
    display: flex; flex-direction: column; align-items: center;
    text-align: center; gap: 14px; text-decoration: none;
    padding: clamp(24px,3vw,40px); border: 1px solid rgba(255,255,255,0.07);
    transition: border-color 300ms, background 300ms;
    opacity: 0; animation: svcIn 500ms ease calc(var(--i) * 100ms + 100ms) forwards;
  }
  .tile:hover { border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.03); }
  @keyframes svcIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: none; }
  }
  .icon  { font-size: 22px; color: rgba(255,255,255,0.5); line-height: 1; }
  .stitle {
    font-family: 'Jost', sans-serif; font-size: clamp(10px,0.9vw,12px);
    font-weight: 300; letter-spacing: 0.22em; text-transform: uppercase;
    color: #fff; margin: 0;
  }
  .desc {
    font-family: 'Jost', sans-serif; font-size: clamp(11px,0.95vw,13px);
    font-weight: 300; letter-spacing: 0.04em; line-height: 1.6;
    color: rgba(255,255,255,0.45); margin: 0;
  }
</style>