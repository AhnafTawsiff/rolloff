<script>
  import { Search, ShoppingBag, User, X } from 'lucide-svelte';

  let menuOpen = $state(false);
  let searchOpen = $state(false);
  let searchQuery = $state('');

  const close = () => { menuOpen = false; searchOpen = false; };

  $effect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  });

  const nav = [
    { label: 'See Now, Buy Now', href: '/see-now' },
    { label: 'New In',           href: '/new' },
    { label: 'Handbags',         href: '/handbags' },
    { label: 'Women',            href: '/women' },
    { label: 'Men',              href: '/men' },
    { label: 'Children',         href: '/children' },
    { label: 'Travel',           href: '/travel' },
    { label: 'Jewellery & Watches', href: '/jewellery' },
    { label: 'Fragrances and Makeup', href: '/beauty' },
    { label: 'Décor & Lifestyle', href: '/lifestyle' },
    { label: 'Gifts',            href: '/gifts' },
    { label: 'THAMINAS Services',   href: '/services' },
  ];

  const utils = [
    { label: 'Find a Store', href: '/stores' },
    { label: 'My Account',   href: '/account' },
    { label: 'Contact Us',   href: '/contact' },
    { label: 'Sustainability', href: '/sustainability' },
  ];
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && close()} />

<header class="h">
  <div class="h-inner">
    <div class="h-left">
      <a href="/contact" class="util-btn">
        <span aria-hidden="true">+</span>
        <span class="sm-show">Contact Us</span>
      </a>
    </div>

    <a href="/" class="logo" aria-label="Go to homepage">THAMINAS</a>

    <div class="h-right">
      <button
        class="icon-btn sm-hide"
        aria-label="Search"
        onclick={() => { searchOpen = !searchOpen; menuOpen = false; }}
      >
        {#if searchOpen}<X size={18} strokeWidth={1.2} />{:else}<Search size={18} strokeWidth={1.2} />{/if}
      </button>

      <a href="/account" class="icon-btn" aria-label="My account">
        <User size={18} strokeWidth={1.2} />
      </a>

      <a href="/cart" class="icon-btn bag" aria-label="Shopping bag">
        <ShoppingBag size={18} strokeWidth={1.2} />
        <span class="badge">0</span>
      </a>

      <button
        class="util-btn"
        onclick={() => { menuOpen = !menuOpen; searchOpen = false; }}
        aria-expanded={menuOpen}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      >
        <span class="bars" aria-hidden="true">
          <span class="b1" class:x={menuOpen}></span>
          <span class="b2" class:x={menuOpen}></span>
          <span class="b3" class:x={menuOpen}></span>
        </span>
        <span class="sm-show">{menuOpen ? 'Close' : 'Menu'}</span>
      </button>
    </div>
  </div>

  <div class="search-bar" class:open={searchOpen} role="search">
    <input
      type="search"
      bind:value={searchQuery}
      placeholder="Search products, collections…"
      class="search-input"
      tabindex={searchOpen ? 0 : -1}
    />
    <button class="icon-btn" aria-label="Submit" tabindex={searchOpen ? 0 : -1}>
      <Search size={15} strokeWidth={1.5} />
    </button>
  </div>
</header>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="overlay" class:show={menuOpen} onclick={() => (menuOpen = false)} aria-hidden="true"></div>

<nav class="drawer" class:open={menuOpen} aria-label="Main navigation" aria-hidden={!menuOpen}>
  <button class="close-btn" onclick={() => (menuOpen = false)} aria-label="Close menu">
    <X size={18} strokeWidth={1.5} />
  </button>

  <ul class="nav-list">
    {#each nav as link, i}
      <li style="--i:{i}">
        <a href={link.href} onclick={() => (menuOpen = false)} tabindex={menuOpen ? 0 : -1}>
          {link.label}
        </a>
      </li>
    {/each}
  </ul>

  <div class="util-links">
    {#each utils as link}
      <a href={link.href} onclick={() => (menuOpen = false)} tabindex={menuOpen ? 0 : -1}>
        {link.label}
      </a>
    {/each}
  </div>
</nav>

<div class="spacer"></div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Jost:wght@200;300;400&display=swap');

  :global(:root) {
    --hh: 56px;
    --drawer-w: 580px;
    --ease: cubic-bezier(0.76, 0, 0.24, 1);
    --dur: 420ms;
  }

  /* ── Header ── */
  .h {
    position: fixed; inset: 0 0 auto;
    z-index: 200; background: #000;
  }
  .h-inner {
    display: grid; grid-template-columns: 1fr auto 1fr;
    align-items: center; height: var(--hh);
    padding: 0 clamp(16px, 3vw, 40px);
    max-width: 1800px; margin: 0 auto;
  }
  .h-left  { display: flex; align-items: center; }
  .h-right { display: flex; align-items: center; justify-content: flex-end; gap: clamp(10px, 1.8vw, 22px); }

  /* ── Shared button/link resets ── */
  .util-btn, .icon-btn {
    display: flex; align-items: center; gap: 7px;
    background: none; border: none; cursor: pointer;
    color: #fff; text-decoration: none; padding: 6px;
    font-family: 'Jost', sans-serif; font-size: 10.5px;
    font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase;
    transition: opacity 300ms;
  }
  .util-btn:hover, .icon-btn:hover { opacity: 0.45; }
  .util-btn { padding: 6px 0; }

  /* ── Logo ── */
  .logo {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(17px, 2.2vw, 22px); font-weight: 300;
    letter-spacing: 0.45em; color: #fff; text-decoration: none;
    user-select: none; white-space: nowrap; transition: opacity 300ms;
    justify-self: center;
  }
  .logo:hover { opacity: 0.45; }

  /* ── Bag badge ── */
  .bag { position: relative; }
  .badge {
    position: absolute; top: 1px; right: 1px;
    width: 14px; height: 14px;
    min-width: 14px; min-height: 14px;
    aspect-ratio: 1 / 1; flex-shrink: 0;
    border-radius: 50%; box-sizing: border-box; padding: 0;
    background: #fff; color: #000;
    font-family: 'Jost', sans-serif; font-size: 7.5px; font-weight: 500;
    line-height: 1;
    display: flex; align-items: center; justify-content: center;
    transform: translate(35%, -35%);
  }

  /* ── Hamburger bars ── */
  .bars { display: flex; flex-direction: column; gap: 4px; width: 20px; }
  .b1, .b2, .b3 {
    display: block; width: 100%; height: 1px; background: #fff;
    transform-origin: center;
    transition: transform 320ms var(--ease), opacity 200ms;
  }
  .b1.x { transform: translateY(5px) rotate(45deg); }
  .b2.x { opacity: 0; transform: scaleX(0); }
  .b3.x { transform: translateY(-5px) rotate(-45deg); }

  /* ── Search bar ── */
  .search-bar {
    display: flex; align-items: center;
    padding: 0 clamp(16px, 3vw, 40px);
    border-top: 1px solid rgba(255,255,255,0.07);
    max-height: 0; opacity: 0; overflow: hidden;
    transition: max-height 320ms var(--ease), opacity 280ms;
  }
  .search-bar.open { max-height: 60px; opacity: 1; }
  .search-input {
    flex: 1; background: none; border: none; outline: none;
    color: #fff; caret-color: #fff;
    font-family: 'Jost', sans-serif; font-size: 13px;
    font-weight: 300; letter-spacing: 0.07em; padding: 16px 0;
  }
  .search-input::placeholder { color: rgba(255,255,255,0.35); }
  .search-input::-webkit-search-cancel-button { display: none; }

  /* ── Overlay ── */
  .overlay {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(0,0,0,0); pointer-events: none;
    transition: background var(--dur);
  }
  .overlay.show { background: rgba(0,0,0,0.45); pointer-events: all; }

  /* ── Drawer ── */
  .drawer {
    position: fixed; inset: 0 0 0 auto;
    width: 100vw; max-width: var(--drawer-w);
    background: #fff; z-index: 400;
    display: flex; flex-direction: column;
    padding: 80px clamp(32px, 6vw, 72px) 48px;
    overflow-y: auto; -webkit-overflow-scrolling: touch;
    transform: translateX(100%);
    transition: transform var(--dur) var(--ease);
  }
  .drawer.open { transform: none; }

  .close-btn {
    position: absolute; top: 16px; right: 16px;
    width: 44px; height: 44px; border-radius: 50%;
    background: #000; border: none; cursor: pointer; color: #fff;
    display: flex; align-items: center; justify-content: center;
    transition: background 200ms, transform 200ms;
  }
  .close-btn:hover { background: #222; transform: rotate(90deg); }

  /* ── Nav list ── */
  .nav-list { list-style: none; padding: 0; margin: 0; flex: 1; }
  .nav-list li {
    border-bottom: 1px solid rgba(0,0,0,0.08);
    opacity: 0; transform: translateX(20px);
    transition:
      opacity 300ms ease calc(var(--i) * 35ms + 80ms),
      transform 300ms var(--ease) calc(var(--i) * 35ms + 80ms);
  }
  .drawer.open .nav-list li { opacity: 1; transform: none; }
  .nav-list a {
    display: block; padding: 17px 0;
    font-family: 'Jost', sans-serif;
    font-size: clamp(20px, 1.5vw, 28px); font-weight: 300;
    letter-spacing: 0.03em; color: #000; text-decoration: none;
    position: relative; transition: letter-spacing 300ms var(--ease), color 200ms;
  }
  .nav-list a::after {
    content: ''; position: absolute; bottom: 16px; left: 0;
    width: 0; height: 1px; background: #000;
    transition: width 300ms var(--ease);
  }
  .nav-list a:hover { letter-spacing: 0.09em; color: #333; }
  .nav-list a:hover::after { width: 32px; }

  /* ── Utility links ── */
  .util-links {
    padding-top: 36px; display: flex; flex-direction: column; gap: 16px;
    opacity: 0; transform: translateY(8px);
    transition: opacity 300ms ease 500ms, transform 300ms ease 500ms;
  }
  .drawer.open .util-links { opacity: 1; transform: none; }
  .util-links a {
    font-family: 'Jost', sans-serif; font-size: 10.5px;
    font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase;
    color: #999; text-decoration: none; transition: color 200ms;
  }
  .util-links a:hover { color: #000; }

  /* ── Helpers ── */
  .spacer { height: var(--hh); }
  .sm-show { display: none; }
  .sm-hide { display: none; }
  @media (min-width: 480px) { .sm-show { display: inline; } }
  @media (min-width: 768px) { .sm-hide { display: flex; } }
</style>