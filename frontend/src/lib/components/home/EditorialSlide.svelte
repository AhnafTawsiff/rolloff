<!-- src/lib/components/home/EditorialSlide.svelte -->
<script>
  let {
    image   = '/images/editorial-1.jpg',
    title   = 'New Collection',
    sub     = '',
    href    = '/collections',
    label   = 'Discover More',
    reverse = false,
    dark    = false,
  } = $props();
</script>

<section class="slide" class:reverse class:dark>
  <div class="img" style="background-image:url('{image}')"></div>
  <div class="panel">
    {#if sub}<p class="sub">{sub}</p>{/if}
    <h2 class="title">{title}</h2>
    <a {href} class="btn">{label}</a>
  </div>
</section>

<style>
  .slide {
    position: relative; width: 100%; height: 100svh;
    display: flex; align-items: flex-end; justify-content: flex-end;
    overflow: hidden; background: #111;
  }
  .slide.reverse { justify-content: flex-start; }
  .img {
    position: absolute; inset: 0;
    background-size: cover; background-position: center;
    transition: transform 600ms cubic-bezier(0.16,1,0.3,1);
  }
  .slide:hover .img { transform: scale(1.025); }
  .img::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to left, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 50%, transparent 70%);
  }
  .slide.reverse .img::after {
    background: linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 50%, transparent 70%);
  }
  .panel {
    position: relative; z-index: 2;
    display: flex; flex-direction: column; align-items: flex-start; gap: 18px;
    padding: clamp(32px, 5vw, 72px);
    max-width: min(480px, 90vw);
    margin-bottom: clamp(40px, 6vh, 80px);
  }
  .sub {
    font-family: 'Jost', sans-serif;
    font-size: clamp(9px, 0.85vw, 11px); font-weight: 300;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: rgba(255,255,255,0.7); margin: 0;
  }
  .title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(32px, 4.5vw, 60px); font-weight: 300;
    letter-spacing: 0.03em; line-height: 1.1; color: #fff; margin: 0;
  }
  .btn {
    display: inline-flex; align-items: center; padding: 13px 28px;
    border: 1px solid #fff; color: #fff; background: transparent;
    font-family: 'Jost', sans-serif; font-size: 10.5px;
    font-weight: 300; letter-spacing: 0.22em; text-transform: uppercase;
    text-decoration: none; transition: background 280ms, color 280ms;
  }
  .btn:hover { background: #fff; color: #000; }
  .dark .sub   { color: rgba(0,0,0,0.6); }
  .dark .title { color: #000; }
  .dark .btn   { border-color: #000; color: #000; }
  .dark .btn:hover { background: #000; color: #fff; }
  .dark :global(.img)::after {
    background: linear-gradient(to left, rgba(255,255,255,0.55) 0%, transparent 60%);
  }
  @media (max-width: 640px) {
    .slide, .slide.reverse { justify-content: center; align-items: flex-end; }
    .panel { max-width: 100%; padding: 28px 24px 40px; }
    .img::after, .slide.reverse .img::after {
      background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%);
    }
  }
</style>