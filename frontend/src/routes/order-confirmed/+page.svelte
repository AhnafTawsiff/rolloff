<script>
  // ── Order Confirmed ───────────────────────────────────────────────────────
  // src/routes/order-confirmed/+page.svelte
  // Simple thank you page shown after a COD order is placed.
  // ──────────────────────────────────────────────────────────────────────────
</script>

<svelte:head>
  <title>Order Confirmed — Thaminas</title>
</svelte:head>

<div class="confirmed">
  <div class="inner">

    <!-- Animated checkmark -->
    <div class="check-wrap">
      <svg class="check-svg" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle class="check-circle" cx="26" cy="26" r="25" stroke="#111" stroke-width="1.5"/>
        <path class="check-tick" d="M14 26l9 9 15-16" stroke="#111" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <p class="sub">Thank you for your order</p>
    <h1 class="title">ORDER CONFIRMED</h1>

    <p class="body">
      We've received your order and will contact you shortly to confirm delivery details.
      Payment is due upon delivery — please have the exact amount ready.
    </p>

    <div class="divider"></div>

    <div class="info-row">
      <div class="info-item">
        <span class="info-label">PAYMENT</span>
        <span class="info-val">Cash on Delivery</span>
      </div>
      <div class="info-item">
        <span class="info-label">DELIVERY</span>
        <span class="info-val">7–14 Business Days</span>
      </div>
      <div class="info-item">
        <span class="info-label">SHIPPING</span>
        <span class="info-val">Free Express</span>
      </div>
    </div>

    <div class="divider"></div>

    <p class="note">
      A confirmation will be sent to your email. If you have any questions, contact us at
      <a href="mailto:clientservice@thaminas.com">clientservice@thaminas.com</a>
    </p>

    <a href="/" class="cta">CONTINUE SHOPPING</a>

  </div>
</div>

<style>
  .confirmed {
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(40px, 8vw, 100px) clamp(24px, 5vw, 48px);
    font-family: 'Jost', sans-serif;
    background: #fff;
  }

  .inner {
    max-width: 560px;
    width: 100%;
    text-align: center;
  }

  /* Animated checkmark */
  .check-wrap {
    margin: 0 auto 32px;
    width: 72px; height: 72px;
  }
  .check-svg { width: 100%; height: 100%; }

  .check-circle {
    stroke-dasharray: 157;
    stroke-dashoffset: 157;
    animation: draw-circle 0.6s ease forwards;
  }
  .check-tick {
    stroke-dasharray: 40;
    stroke-dashoffset: 40;
    animation: draw-tick 0.4s ease 0.55s forwards;
  }
  @keyframes draw-circle {
    to { stroke-dashoffset: 0; }
  }
  @keyframes draw-tick {
    to { stroke-dashoffset: 0; }
  }

  .sub {
    font-size: 11px;
    letter-spacing: 0.18em;
    color: #aaa;
    text-transform: uppercase;
    margin-bottom: 10px;
    animation: fade-up 0.5s ease 0.8s both;
  }

  .title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(22px, 4vw, 34px);
    font-weight: 400;
    letter-spacing: 0.14em;
    color: #111;
    margin-bottom: 24px;
    animation: fade-up 0.5s ease 0.9s both;
  }

  .body {
    font-size: 13.5px;
    color: #666;
    line-height: 1.85;
    margin-bottom: 32px;
    animation: fade-up 0.5s ease 1s both;
  }

  .divider {
    height: 1px;
    background: #ebebeb;
    margin: 32px 0;
    animation: fade-up 0.5s ease 1.05s both;
  }

  .info-row {
    display: flex;
    justify-content: center;
    gap: clamp(24px, 6vw, 56px);
    animation: fade-up 0.5s ease 1.1s both;
  }
  .info-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
  }
  .info-label {
    font-size: 9.5px;
    letter-spacing: 0.16em;
    color: #bbb;
  }
  .info-val {
    font-size: 12.5px;
    color: #333;
    letter-spacing: 0.04em;
  }

  .note {
    font-size: 12px;
    color: #aaa;
    line-height: 1.8;
    margin-bottom: 36px;
    animation: fade-up 0.5s ease 1.15s both;
  }
  .note a {
    color: #555;
    text-decoration: underline;
  }
  .note a:hover { color: #111; }

  .cta {
    display: inline-block;
    border: 1px solid #111;
    padding: 14px 48px;
    font-family: 'Jost', sans-serif;
    font-size: 11px;
    letter-spacing: 0.18em;
    color: #111;
    text-decoration: none;
    transition: background 0.2s, color 0.2s;
    animation: fade-up 0.5s ease 1.2s both;
  }
  .cta:hover { background: #111; color: #fff; }

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: none; }
  }

  @media (max-width: 480px) {
    .info-row { flex-direction: column; gap: 20px; align-items: center; }
  }
</style>