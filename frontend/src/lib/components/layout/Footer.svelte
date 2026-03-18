<!-- ============================================================
  Footer.svelte
  Location: src/lib/components/layout/Footer.svelte

  SECTIONS IN THIS FILE:
    1. SCRIPT  — state + nav data (edit links/columns here)
    2. HTML    — logo, nav grid, bottom bar
    3. STYLE   — all colors, fonts, sizes, layout, toggle
============================================================ -->

<script>
  // ── State ─────────────────────────────────────────────────
  // Controls the high contrast mode toggle.
  // true = white background, false = black background (default)
  let hc = $state(false);

  // ── Navigation columns ────────────────────────────────────
  // Each object is one footer column.
  // Format: { h: 'Column Heading', links: [['Link Label', '/url'], ...] }
  //
  // TO ADD A LINK    → add a new ['Label', '/url'] row inside links: []
  // TO REMOVE A LINK → delete the row
  // TO RENAME        → change the first string in the array
  // TO ADD A COLUMN  → copy one of the objects below and add it to the array
  const cols = [

    // ── Column 1 ──────────────────────────────────────────
    { h: 'Explore Our Store', links: [
      ['New Arrivals',          '/new'],
      ['Women',                 '/women'],
      ['Men',                   '/men'],
      ['Handbags',              '/handbags'],
      ['Jewellery & Watches',   '/jewellery'],
      ['Fragrances & Makeup',   '/beauty'],
      ['Décor & Lifestyle',     '/lifestyle'],
      ['Gifts',                 '/gifts'],
      ['Sitemap',               '/sitemap'],
    ]},

    // ── Column 2 ──────────────────────────────────────────
    { h: 'Online Services', links: [
      ['Payment Methods',  '/payment'],
      ['Shipping Options', '/shipping'],
      ['My Account',       '/account'],
      ['Returns',          '/returns'],
      ['FAQ',              '/faq'],
      ['Care & Services',  '/care'],
      ['E-Gift Card',      '/gift-card'],
    ]},

    // ── Column 3 ──────────────────────────────────────────
    { h: 'Boutique Services', links: [
      ['Store Locator',        '/stores'],
      ['Book an Appointment',  '/appointment'],
    ]},

    // ── Column 4 ──────────────────────────────────────────
    { h: 'The House', links: [
      ['Careers',               '/careers'],
      ['Legal',                 '/legal'],
      ['Privacy',               '/privacy'],
      ['Sustainability',        '/sustainability'],
      ['Accessibility',         '/accessibility'],
      ['Contact Us',            '/contact'],
      ['Fighting Counterfeits', '/counterfeits'],
      ['Transparency',          '/transparency'],
      ['Cookie Settings',       '/cookies'],
    ]},

  ];
</script>


<!-- ============================================================
  HTML
============================================================ -->

<!--
  footer gets the class "hc" when high contrast is on.
  All .hc overrides in the CSS below flip colors automatically.
-->
<footer class:hc>
  <div class="wrap">

    <!-- LOGO ─────────────────────────────────────────────────
      Change the text between the tags to update the brand name.
      Change href="/" to point somewhere else if needed.
    -->
    <a href="/" class="logo" aria-label="Go to homepage">THAMINAS</a>

    <!-- NAV GRID ─────────────────────────────────────────────
      Loops through the `cols` array above and renders each column.
      You don't need to touch this — edit the `cols` data above instead.
    -->
    <nav aria-label="Footer navigation">
      {#each cols as col}
        <div>
          <h3>{col.h}</h3>
          <ul>
            {#each col.links as [label, href]}
              <li><a {href}>{label}</a></li>
            {/each}
          </ul>
        </div>
      {/each}
    </nav>

    <!-- BOTTOM BAR ───────────────────────────────────────────
      Left side:  high contrast toggle
      Right side: copyright text (year auto-updates every year)
    -->
    <div class="bottom">

      <!-- High contrast toggle -->
      <label>
        <span>Enable high contrast</span>
        <span class="pill">
          <!-- bind:checked links this checkbox to the `hc` variable above -->
          <input type="checkbox" bind:checked={hc} aria-label="Enable high contrast" />
          <span class="track"></span>
        </span>
      </label>

      <!-- Copyright — year auto-updates, just change the brand name -->
      <p>© {new Date().getFullYear()} THAMINAS. All rights reserved.</p>

    </div>

  </div>
</footer>


<!-- ============================================================
  STYLE
  All colors are marked with ← CHANGE THIS comments
  All sizes use clamp(min, fluid, max):
    - first value  = size on mobile
    - middle value = scales with screen width (vw)
    - third value  = size on large desktop
============================================================ -->
<style>

  /* ── FOOTER BACKGROUND & TEXT COLOR ──────────────────────
     Default mode: black background, white text
     High contrast: flips to white background, black text     */
  footer {
    background: #000;                              /* ← BACKGROUND COLOR (dark mode) */
    color: #fff;                                   /* ← TEXT COLOR (dark mode) */
    border-top: 1px solid rgba(255,255,255,0.08);  /* ← TOP BORDER COLOR */
    transition: background 300ms, color 300ms;     /* smooth high contrast switch */
  }
  footer.hc {
    background: #fff;                              /* ← BACKGROUND COLOR (high contrast) */
    color: #000;                                   /* ← TEXT COLOR (high contrast) */
  }

  /* ── OUTER WRAPPER ────────────────────────────────────────
     Full width. Padding controls the breathing room.
     clamp(mobile, fluid, desktop)                            */
  .wrap {
    width: 100%;
    padding:
      clamp(40px, 6vw, 88px)   /* ← TOP padding */
      clamp(24px, 5vw, 80px)   /* ← LEFT/RIGHT padding */
      clamp(28px, 4vw, 52px);  /* ← BOTTOM padding */
  }

  /* ── LOGO ─────────────────────────────────────────────────
     Serif font, centered, wide letter spacing (luxury feel)  */
  .logo {
    display: block;
    text-align: center;
    font-family: 'Cormorant Garamond', Georgia, serif; /* ← LOGO FONT */
    font-size: clamp(20px, 2.8vw, 34px);               /* ← LOGO SIZE */
    font-weight: 300;
    letter-spacing: 0.45em;                            /* ← LOGO LETTER SPACING */
    color: inherit;
    text-decoration: none;
    margin-bottom: clamp(36px, 5vw, 68px);             /* ← SPACE BELOW LOGO */
    transition: opacity 300ms;
  }
  .logo:hover { opacity: 0.5; } /* ← LOGO HOVER OPACITY (0 = invisible, 1 = full) */

  /* ── NAV GRID ─────────────────────────────────────────────
     4 equal columns on desktop, 2 on tablet, 1 on mobile    */
  nav {
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* ← NUMBER OF COLUMNS on desktop */
    gap: clamp(20px, 3.5vw, 48px);         /* ← GAP between columns */
    margin-bottom: clamp(36px, 5vw, 60px); /* ← SPACE BELOW the grid */
  }
  /* Tablet: 2 columns */
  @media (max-width: 860px) { nav { grid-template-columns: repeat(2, 1fr); } } /* ← TABLET BREAKPOINT */
  /* Mobile: 1 column */
  @media (max-width: 460px) { nav { grid-template-columns: 1fr; } }             /* ← MOBILE BREAKPOINT */

  /* ── COLUMN HEADINGS ──────────────────────────────────────
     The bold uppercase titles above each link list           */
  h3 {
    font-family: 'Jost', sans-serif;     /* ← HEADING FONT */
    font-size: clamp(9px, 0.85vw, 11px); /* ← HEADING SIZE */
    font-weight: 400;
    letter-spacing: 0.22em;              /* ← HEADING LETTER SPACING */
    text-transform: uppercase;
    color: inherit;
    margin: 0 0 clamp(12px, 1.5vw, 20px); /* ← SPACE BELOW HEADING */
  }

  /* ── LINK LIST ────────────────────────────────────────────  */
  ul {
    list-style: none;
    padding: 0; margin: 0;
    display: flex; flex-direction: column;
    gap: 9px; /* ← SPACE BETWEEN LINKS */
  }

  /* ── LINKS ────────────────────────────────────────────────
     Applies to all <a> tags inside footer                    */
  a {
    font-family: 'Jost', sans-serif;          /* ← LINK FONT */
    font-size: clamp(11.5px, 1vw, 13.5px);    /* ← LINK SIZE */
    font-weight: 300;
    letter-spacing: 0.03em;
    color: rgba(255,255,255,0.6);             /* ← LINK COLOR (0.6 = 60% opacity white) */
    text-decoration: none;
    line-height: 1.4;
    transition: color 180ms;
  }
  a:hover { color: #fff; }                    /* ← LINK HOVER COLOR */
  footer.hc a { color: rgba(0,0,0,0.75); }    /* ← LINK COLOR in high contrast */
  footer.hc a:hover { color: #000; }          /* ← LINK HOVER COLOR in high contrast */

  /* ── BOTTOM BAR ───────────────────────────────────────────
     The thin line + toggle + copyright at the very bottom   */
  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between; /* toggle on left, copyright on right */
    flex-wrap: wrap;
    gap: 14px;
    padding-top: clamp(20px, 3vw, 36px);           /* ← SPACE ABOVE bottom bar */
    border-top: 1px solid rgba(255,255,255,0.08);  /* ← DIVIDER LINE COLOR */
  }
  footer.hc .bottom { border-top-color: rgba(0,0,0,0.1); } /* ← DIVIDER in high contrast */

  /* ── TOGGLE LABEL ("Enable high contrast") ───────────────  */
  label {
    display: flex; align-items: center;
    gap: 10px; cursor: pointer;
    font-family: 'Jost', sans-serif;
    font-size: clamp(9.5px, 0.8vw, 11px);  /* ← TOGGLE LABEL SIZE */
    font-weight: 300;
    letter-spacing: 0.15em;
    color: rgba(255,255,255,0.55);          /* ← TOGGLE LABEL COLOR */
    transition: color 200ms;
  }
  footer.hc label { color: rgba(0,0,0,0.75); } /* ← TOGGLE LABEL in high contrast */

  /* ── TOGGLE PILL SWITCH ───────────────────────────────────
     The actual sliding toggle control.
     pill  = the outer container (sets width/height)
     input = invisible checkbox (the real click target)
     track = the visible pill shape
     track::after = the sliding knob                         */
  .pill {
    position: relative;
    display: inline-block;
    width: 38px; height: 21px; /* ← TOGGLE SIZE */
    flex-shrink: 0;
  }
  /* invisible checkbox sits on top as the click target */
  .pill input {
    position: absolute; inset: 0;
    opacity: 0; width: 100%; height: 100%;
    margin: 0; cursor: pointer; z-index: 1;
  }
  /* the pill track (background of toggle) */
  .track {
    position: absolute; inset: 0;
    border-radius: 11px;
    background: rgba(255,255,255,0.12);    /* ← TOGGLE OFF background */
    border: 1px solid rgba(255,255,255,0.22); /* ← TOGGLE OFF border */
    transition: background 280ms, border-color 280ms;
    pointer-events: none;
  }
  /* the sliding knob inside the track */
  .track::after {
    content: '';
    position: absolute;
    top: 3px; left: 3px;
    width: 13px; height: 13px;             /* ← KNOB SIZE */
    border-radius: 50%;
    background: rgba(255,255,255,0.5);     /* ← KNOB COLOR when off */
    transition: transform 260ms cubic-bezier(0.76,0,0.24,1), background 200ms;
  }
  /* ON state — when checkbox is checked */
  .pill input:checked ~ .track {
    background: #fff;                      /* ← TOGGLE ON background */
    border-color: #fff;
  }
  .pill input:checked ~ .track::after {
    transform: translateX(17px);           /* ← how far knob slides (match to pill width) */
    background: #000;                      /* ← KNOB COLOR when on */
  }
  /* high contrast overrides for the toggle itself */
  footer.hc .track {
    background: rgba(0,0,0,0.12);
    border-color: rgba(0,0,0,0.25);
  }
  footer.hc .track::after { background: rgba(0,0,0,0.4); }
  footer.hc .pill input:checked ~ .track { background: #000; border-color: #000; }
  footer.hc .pill input:checked ~ .track::after { background: #fff; }

  /* ── COPYRIGHT TEXT ──────────────────────────────────────  */
  p {
    font-family: 'Jost', sans-serif;
    font-size: clamp(9px, 0.75vw, 10.5px); /* ← COPYRIGHT SIZE */
    font-weight: 300;
    letter-spacing: 0.12em;
    color: rgba(255,255,255,0.28);          /* ← COPYRIGHT COLOR */
    margin: 0;
    transition: color 200ms;
  }
  footer.hc p { color: rgba(0,0,0,0.75); } /* ← COPYRIGHT in high contrast */

</style>