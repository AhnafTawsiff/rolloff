<script>
  // ── COD Checkout ──────────────────────────────────────────────────────────
  // src/routes/checkout/+page.svelte
  // ──────────────────────────────────────────────────────────────────────────
  import { cartItems, cartTotal, clearCart } from '$lib/stores/cart.js';

  let step      = $state(1);
  let firstName = $state('');
  let lastName  = $state('');
  let email     = $state('');
  let phone     = $state('');
  let address1  = $state('');
  let address2  = $state('');
  let city      = $state('');
  let district  = $state('');
  let division  = $state('');
  let postcode  = $state('');
  let notes     = $state('');
  let errors    = $state({});

  const DIVISIONS = ['Dhaka','Chittagong','Rajshahi','Khulna','Barishal','Sylhet','Rangpur','Mymensingh'];
  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  function validate() {
    const e = {};
    if (!firstName.trim())       e.firstName = 'Required';
    if (!lastName.trim())        e.lastName  = 'Required';
    if (!email.trim())           e.email     = 'Required';
    else if (!validEmail(email)) e.email     = 'Invalid email';
    if (!phone.trim())           e.phone     = 'Required';
    if (!address1.trim())        e.address1  = 'Required';
    if (!city.trim())            e.city      = 'Required';
    if (!district.trim())        e.district  = 'Required';
    if (!division)               e.division  = 'Required';
    if (!postcode.trim())        e.postcode  = 'Required';
    errors = e;
    return Object.keys(e).length === 0;
  }

  function submitShipping() { if (validate()) step = 2; }
  function placeOrder()     { clearCart(); window.location.href = '/order-confirmed'; }

  const subtotal = $derived($cartTotal);
  const fmt = (n) => '৳ ' + n.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
</script>

<svelte:head><title>Checkout — Thaminas</title></svelte:head>

<div class="checkout">

  <!-- ── LEFT ──────────────────────────────────────────────────────────── -->
  <div class="left">

    <!-- Progress -->
    <div class="progress">
      <div class="prog-step" class:active={step===1} class:done={step>1}>
        <span class="prog-num">{step > 1 ? '✓' : '1'}</span>
        <span>SHIPPING</span>
      </div>
      <div class="prog-line"></div>
      <div class="prog-step" class:active={step===2} class:locked={step<2}>
        <span class="prog-num">2</span>
        <span>CONFIRM ORDER</span>
      </div>
    </div>

    <!-- ── STEP 1 ─────────────────────────────────────────────────────── -->
    {#if step === 1}
    <div class="form-section">
      <h2 class="form-heading">DELIVERY INFORMATION</h2>

      <!-- Name row -->
      <div class="row two">
        <div class="field" class:err={errors.firstName}>
          <label for="firstName">FIRST NAME <span class="req">*</span></label>
          <input id="firstName" type="text" bind:value={firstName} oninput={() => errors.firstName = ''} />
          {#if errors.firstName}<span class="err-msg">{errors.firstName}</span>{/if}
        </div>
        <div class="field" class:err={errors.lastName}>
          <label for="lastName">LAST NAME <span class="req">*</span></label>
          <input id="lastName" type="text" bind:value={lastName} oninput={() => errors.lastName = ''} />
          {#if errors.lastName}<span class="err-msg">{errors.lastName}</span>{/if}
        </div>
      </div>

      <!-- Contact row -->
      <div class="row two">
        <div class="field" class:err={errors.email}>
          <label for="email">EMAIL ADDRESS <span class="req">*</span></label>
          <input id="email" type="email" bind:value={email} oninput={() => errors.email = ''} placeholder="you@example.com" />
          {#if errors.email}<span class="err-msg">{errors.email}</span>{/if}
        </div>
        <div class="field" class:err={errors.phone}>
          <label for="phone">PHONE NUMBER <span class="req">*</span></label>
          <input id="phone" type="tel" bind:value={phone} oninput={() => errors.phone = ''} placeholder="+880 1X XXXX XXXX" />
          {#if errors.phone}<span class="err-msg">{errors.phone}</span>{/if}
        </div>
      </div>

      <!-- Address -->
      <div class="field" class:err={errors.address1}>
        <label for="address1">ADDRESS LINE 1 <span class="req">*</span></label>
        <input id="address1" type="text" bind:value={address1} oninput={() => errors.address1 = ''} placeholder="House / Road / Block" />
        {#if errors.address1}<span class="err-msg">{errors.address1}</span>{/if}
      </div>
      <div class="field">
        <label for="address2">ADDRESS LINE 2 <span class="opt">(optional)</span></label>
        <input id="address2" type="text" bind:value={address2} placeholder="Apartment, area, landmark" />
      </div>

      <!-- City / Postcode -->
      <div class="row two">
        <div class="field" class:err={errors.city}>
          <label for="city">CITY <span class="req">*</span></label>
          <input id="city" type="text" bind:value={city} oninput={() => errors.city = ''} placeholder="e.g. Dhaka" />
          {#if errors.city}<span class="err-msg">{errors.city}</span>{/if}
        </div>
        <div class="field" class:err={errors.postcode}>
          <label for="postcode">POSTAL CODE <span class="req">*</span></label>
          <input id="postcode" type="text" bind:value={postcode} oninput={() => errors.postcode = ''} placeholder="e.g. 1207" maxlength="6" />
          {#if errors.postcode}<span class="err-msg">{errors.postcode}</span>{/if}
        </div>
      </div>

      <!-- District / Division -->
      <div class="row two">
        <div class="field" class:err={errors.district}>
          <label for="district">DISTRICT <span class="req">*</span></label>
          <input id="district" type="text" bind:value={district} oninput={() => errors.district = ''} placeholder="e.g. Dhaka" />
          {#if errors.district}<span class="err-msg">{errors.district}</span>{/if}
        </div>
        <div class="field" class:err={errors.division}>
          <label for="division">DIVISION <span class="req">*</span></label>
          <select id="division" bind:value={division} onchange={() => errors.division = ''}>
            <option value="">Select division</option>
            {#each DIVISIONS as d}<option value={d}>{d}</option>{/each}
          </select>
          {#if errors.division}<span class="err-msg">{errors.division}</span>{/if}
        </div>
      </div>

      <!-- Notes -->
      <div class="field">
        <label for="notes">ORDER NOTES <span class="opt">(optional)</span></label>
        <textarea id="notes" bind:value={notes} rows="3" placeholder="Special instructions, delivery notes..."></textarea>
      </div>

      <!-- COD notice -->
      <div class="cod-notice">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <span>Payment method: <strong>Cash on Delivery</strong>. Pay when your order arrives.</span>
      </div>

      <button class="cta" onclick={submitShipping}>REVIEW ORDER</button>
    </div>
    {/if}

    <!-- ── STEP 2 ─────────────────────────────────────────────────────── -->
    {#if step === 2}
    <div class="form-section">
      <h2 class="form-heading">CONFIRM YOUR ORDER</h2>

      <div class="confirm-block">
        <div class="confirm-label">DELIVERING TO</div>
        <div class="confirm-val">
          <strong>{firstName} {lastName}</strong><br />
          {address1}{address2 ? ', ' + address2 : ''}<br />
          {city}, {district}, {division} — {postcode}<br />
          {phone}<br />{email}
        </div>
        <button class="edit-btn" onclick={() => step = 1}>Edit</button>
      </div>

      {#if notes.trim()}
      <div class="confirm-block">
        <div class="confirm-label">ORDER NOTES</div>
        <div class="confirm-val">{notes}</div>
      </div>
      {/if}

      <div class="confirm-block">
        <div class="confirm-label">PAYMENT METHOD</div>
        <div class="confirm-val"><strong>Cash on Delivery</strong></div>
      </div>

      <div class="confirm-block">
        <div class="confirm-label">ITEMS ({$cartItems.length})</div>
        {#each $cartItems as item}
        <div class="confirm-item">
          <span class="ci-name">{item.name}</span>
          {#if item.size}<span class="ci-size">Size: {item.size}</span>{/if}
          <span class="ci-qty">× {item.qty}</span>
          <span class="ci-price">{fmt(item.price * item.qty)}</span>
        </div>
        {/each}
        <div class="confirm-total"><span>Total</span><span>{fmt(subtotal)}</span></div>
      </div>

      <p class="cod-disclaimer">
        By placing this order you agree to pay <strong>{fmt(subtotal)}</strong> in cash upon delivery.
        Our team will contact you at <strong>{phone}</strong> to confirm.
      </p>

      <div class="confirm-actions">
        <button class="back-btn" onclick={() => step = 1}>← Back</button>
        <button class="cta" onclick={placeOrder}>PLACE ORDER</button>
      </div>
    </div>
    {/if}

  </div>

  <!-- ── RIGHT: summary ────────────────────────────────────────────────── -->
  <aside class="summary">
    <div class="sum-inner">
      <h2 class="sum-title">ORDER SUMMARY</h2>
      <p class="sum-count">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        {$cartItems.length} {$cartItems.length === 1 ? 'ITEM' : 'ITEMS'}
      </p>

      <div class="sum-items">
        {#each $cartItems as item}
        <div class="sum-item">
          <div class="sum-img">
            {#if item.image}<img src={item.image} alt={item.name} />{:else}<div class="sum-img-ph"></div>{/if}
          </div>
          <div class="sum-detail">
            <p class="sum-name">{item.name}</p>
            {#if item.size}<p class="sum-meta">Size: {item.size}</p>{/if}
            <p class="sum-meta">QTY: {item.qty}</p>
          </div>
          <div class="sum-price">{fmt(item.price * item.qty)}</div>
        </div>
        {/each}
        {#if $cartItems.length === 0}
        <p class="empty">Your cart is empty.</p>
        {/if}
      </div>

      <div class="sum-totals">
        <div class="sum-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
        <div class="sum-row"><span>Shipping</span><span class="free">Free</span></div>
        <div class="sum-row"><span>Payment</span><span>Cash on Delivery</span></div>
        <div class="sum-row total"><span>TOTAL</span><span>{fmt(subtotal)}</span></div>
      </div>
    </div>
  </aside>

</div>

<style>
  .checkout {
    display: grid;
    grid-template-columns: 1fr 360px;
    align-items: start;
    min-height: 80vh;
    font-family: 'Jost', sans-serif;
    background: #fff;
    color: #111;
  }

  /* Left */
  .left {
    padding: clamp(32px, 5vw, 72px) clamp(24px, 5vw, 80px);
    border-right: 1px solid #ebebeb;
  }

  /* Progress */
  .progress { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; }
  .prog-step { display: flex; align-items: center; gap: 10px; font-size: 11px; letter-spacing: 0.12em; color: #aaa; }
  .prog-step.active, .prog-step.done { color: #111; }
  .prog-num {
    width: 24px; height: 24px; border: 1px solid currentColor; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif; font-size: 12px; flex-shrink: 0;
  }
  .prog-step.done .prog-num { background: #111; color: #fff; border-color: #111; }
  .prog-line { flex: 1; height: 1px; background: #ddd; }

  /* Heading */
  .form-heading {
    font-size: clamp(12px, 1.1vw, 14px); font-weight: 400;
    letter-spacing: 0.18em; color: #111;
    margin-bottom: 32px; padding-bottom: 16px; border-bottom: 1px solid #ebebeb;
  }

  /* Fields */
  .row { display: grid; gap: 20px; }
  .row.two { grid-template-columns: 1fr 1fr; }

  .field { display: flex; flex-direction: column; gap: 7px; margin-bottom: 20px; }
  .field label { font-size: 10px; letter-spacing: 0.13em; color: #666; }
  .req { color: #b00; }
  .opt { color: #aaa; font-size: 9px; }

  .field input,
  .field select,
  .field textarea {
    border: none; border-bottom: 1px solid #d0d0d0;
    padding: 10px 0; font-size: 13.5px;
    font-family: 'Jost', sans-serif; color: #111;
    background: transparent; outline: none;
    transition: border-color 0.2s; width: 100%; resize: none;
  }
  .field input:focus,
  .field select:focus,
  .field textarea:focus { border-bottom-color: #111; }
  .field textarea { padding-top: 12px; line-height: 1.6; }
  .field.err input,
  .field.err select { border-bottom-color: #c00; }
  .err-msg { font-size: 10.5px; color: #c00; }

  /* COD notice */
  .cod-notice {
    display: flex; align-items: center; gap: 10px;
    background: #f7f7f5; border-left: 2px solid #111;
    padding: 14px 18px; font-size: 12.5px; color: #444;
    margin: 8px 0 32px;
  }
  .cod-notice svg { flex-shrink: 0; }

  /* CTA */
  .cta {
    background: #111; color: #fff; border: none;
    padding: 16px 48px; font-family: 'Jost', sans-serif;
    font-size: 11.5px; letter-spacing: 0.16em; cursor: pointer;
    transition: background 0.2s; display: block; width: 100%;
  }
  .cta:hover { background: #333; }

  /* Confirm step */
  .confirm-block { position: relative; border: 1px solid #ebebeb; padding: 20px; margin-bottom: 16px; }
  .confirm-label { font-size: 9.5px; letter-spacing: 0.16em; color: #aaa; margin-bottom: 10px; }
  .confirm-val { font-size: 13px; color: #333; line-height: 1.8; }
  .edit-btn {
    position: absolute; top: 18px; right: 18px;
    background: none; border: none; font-family: 'Jost', sans-serif;
    font-size: 11px; letter-spacing: 0.08em; color: #888;
    text-decoration: underline; cursor: pointer;
  }
  .edit-btn:hover { color: #111; }

  .confirm-item {
    display: grid; grid-template-columns: 1fr auto auto auto;
    gap: 12px; align-items: center; padding: 8px 0;
    border-top: 1px solid #f0f0f0; font-size: 12.5px;
  }
  .ci-name  { color: #222; }
  .ci-size  { color: #999; font-size: 11.5px; }
  .ci-qty   { color: #888; }
  .ci-price { color: #111; }

  .confirm-total {
    display: flex; justify-content: space-between;
    padding: 12px 0 0; font-size: 13px;
    border-top: 1px solid #e0e0e0; margin-top: 4px; color: #111;
  }
  .cod-disclaimer { font-size: 12px; color: #777; line-height: 1.8; margin-bottom: 28px; padding: 16px 0; border-top: 1px solid #f0f0f0; }
  .confirm-actions { display: flex; align-items: center; gap: 20px; }
  .back-btn {
    background: none; border: none; font-family: 'Jost', sans-serif;
    font-size: 12px; letter-spacing: 0.08em; color: #888;
    cursor: pointer; text-decoration: underline; white-space: nowrap;
  }
  .back-btn:hover { color: #111; }

  /* Summary */
  .summary {
    background: #0a0a0a; color: #e8e8e8;
    min-height: 100vh; position: sticky; top: 0;
    align-self: start; max-height: 100vh; overflow-y: auto;
  }
  .sum-inner { padding: clamp(28px, 4vw, 56px) clamp(20px, 3vw, 36px); }
  .sum-title { font-size: 10.5px; letter-spacing: 0.2em; font-weight: 400; color: #fff; text-align: center; margin-bottom: 8px; }
  .sum-count { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 10.5px; letter-spacing: 0.14em; color: #666; margin-bottom: 28px; }

  .sum-items { margin-bottom: 20px; }
  .sum-item { display: grid; grid-template-columns: 56px 1fr auto; gap: 12px; padding: 14px 0; border-bottom: 1px solid #1a1a1a; }
  .sum-img img { width: 56px; height: 70px; object-fit: cover; display: block; }
  .sum-img-ph  { width: 56px; height: 70px; background: #1a1a1a; }
  .sum-name  { font-size: 11.5px; letter-spacing: 0.05em; color: #ccc; margin-bottom: 4px; }
  .sum-meta  { font-size: 11px; color: #555; line-height: 1.6; }
  .sum-price { font-size: 12px; color: #ccc; white-space: nowrap; padding-top: 2px; }
  .empty     { font-size: 12px; color: #444; text-align: center; padding: 24px 0; }

  .sum-totals { border-top: 1px solid #1a1a1a; padding-top: 14px; }
  .sum-row { display: flex; justify-content: space-between; font-size: 11.5px; color: #666; padding: 5px 0; letter-spacing: 0.04em; }
  .sum-row.total { color: #fff; font-size: 13px; letter-spacing: 0.1em; border-top: 1px solid #222; margin-top: 6px; padding-top: 12px; }
  .free { color: #7a9e7a; }

  /* Responsive */
  @media (max-width: 860px) {
    .checkout { grid-template-columns: 1fr; }
    .summary  { position: static; min-height: auto; max-height: none; order: -1; }
    .left     { border-right: none; }
  }
  @media (max-width: 520px) {
    .row.two { grid-template-columns: 1fr; }
    .confirm-item { grid-template-columns: 1fr auto auto; }
    .ci-size { display: none; }
  }
</style>