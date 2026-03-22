<script>
  let form = $state({ name: '', email: '', subject: '', message: '' });
  let sent       = $state(false);
  let submitting = $state(false);
  let error      = $state('');

  async function handleSubmit() {
    error = '';
    if (!form.name || !form.email || !form.message) {
      error = 'Please fill in all required fields.';
      return;
    }
    submitting = true;
    await new Promise(r => setTimeout(r, 800));
    sent = true;
    submitting = false;
  }
</script>

<svelte:head>
  <title>Contact Us — Thaminas</title>
</svelte:head>

<div class="page">
  <div class="inner">

    <div class="info">
      <p class="info-sub">Get in Touch</p>
      <h1 class="info-title">Contact Us</h1>
      <p class="info-body">
        Our client advisors are available to assist you with any enquiries
        regarding products, orders, or styling advice.
      </p>
      <div class="info-items">
        <div class="info-item">
          <p class="info-label">Email</p>
          <a href="mailto:hello@thaminas.com" class="info-val">hello@thaminas.com</a>
        </div>
        <div class="info-item">
          <p class="info-label">Hours</p>
          <p class="info-val">Monday – Saturday, 10am – 7pm</p>
        </div>
        <div class="info-item">
          <p class="info-label">Response Time</p>
          <p class="info-val">Within 24 hours</p>
        </div>
      </div>
    </div>

    <div class="form-wrap">
      {#if sent}
        <div class="success">
          <span class="success-icon">✦</span>
          <h2 class="success-title">Message Sent</h2>
          <p class="success-msg">Thank you for reaching out. We will be in touch within 24 hours.</p>
          <button class="btn-reset" onclick={() => { sent = false; form = { name:'', email:'', subject:'', message:'' }; }}>
            Send Another
          </button>
        </div>
      {:else}
        {#if error}
          <div class="error-msg">{error}</div>
        {/if}
        <div class="form-group">
          <label class="label" for="name">Full Name <span class="req">*</span></label>
          <input id="name" class="input" type="text" bind:value={form.name} placeholder="Your name" />
        </div>
        <div class="form-group">
          <label class="label" for="email">Email Address <span class="req">*</span></label>
          <input id="email" class="input" type="email" bind:value={form.email} placeholder="your@email.com" />
        </div>
        <div class="form-group">
          <label class="label" for="subject">Subject</label>
          <input id="subject" class="input" type="text" bind:value={form.subject} placeholder="Order enquiry, product question…" />
        </div>
        <div class="form-group">
          <label class="label" for="message">Message <span class="req">*</span></label>
          <textarea id="message" class="input textarea" bind:value={form.message} placeholder="How can we help you?" rows="5"></textarea>
        </div>
        <button class="submit-btn" onclick={handleSubmit} disabled={submitting}>
          {submitting ? 'Sending…' : 'Send Message'}
        </button>
      {/if}
    </div>

  </div>
</div>

<style>
  .page {
    background: #000; min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    padding: clamp(48px,7vw,96px) clamp(16px,5vw,80px);
  }
  .inner {
    width: 100%; max-width: 1100px;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: clamp(40px,6vw,96px); align-items: start;
  }
  @media (max-width: 760px) { .inner { grid-template-columns: 1fr; } }

  .info { display: flex; flex-direction: column; gap: 20px; }
  .info-sub {
    font-family: 'Jost', sans-serif; font-size: 10px;
    font-weight: 300; letter-spacing: 0.3em; text-transform: uppercase;
    color: rgba(255,255,255,0.35); margin: 0;
  }
  .info-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(32px,4vw,52px); font-weight: 300;
    letter-spacing: 0.04em; color: #fff; margin: 0;
  }
  .info-body {
    font-family: 'Jost', sans-serif; font-size: 13px;
    font-weight: 300; letter-spacing: 0.04em; line-height: 1.75;
    color: rgba(255,255,255,0.45); margin: 0;
  }
  .info-items { display: flex; flex-direction: column; gap: 20px; margin-top: 8px; }
  .info-item  { display: flex; flex-direction: column; gap: 4px; }
  .info-label {
    font-family: 'Jost', sans-serif; font-size: 9.5px;
    font-weight: 400; letter-spacing: 0.22em; text-transform: uppercase;
    color: rgba(255,255,255,0.25); margin: 0;
  }
  .info-val {
    font-family: 'Jost', sans-serif; font-size: 13px;
    font-weight: 300; letter-spacing: 0.04em;
    color: rgba(255,255,255,0.7); margin: 0; text-decoration: none;
    transition: color 200ms;
  }
  a.info-val:hover { color: #fff; }

  .form-wrap { display: flex; flex-direction: column; gap: 18px; }
  .error-msg {
    background: rgba(255,80,80,0.08); border: 1px solid rgba(255,80,80,0.2);
    color: rgba(255,120,120,0.8); padding: 12px 16px;
    font-family: 'Jost', sans-serif; font-size: 12px; letter-spacing: 0.05em;
  }
  .form-group { display: flex; flex-direction: column; gap: 8px; }
  .label {
    font-family: 'Jost', sans-serif; font-size: 10px;
    font-weight: 300; letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(255,255,255,0.4);
  }
  .req { color: rgba(255,255,255,0.25); }
  .input {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    color: #fff; padding: 13px 16px;
    font-family: 'Jost', sans-serif; font-size: 13px;
    font-weight: 300; letter-spacing: 0.04em;
    outline: none; transition: border-color 200ms;
    width: 100%; box-sizing: border-box;
  }
  .input:focus { border-color: rgba(255,255,255,0.35); }
  .input::placeholder { color: rgba(255,255,255,0.18); }
  .textarea { resize: vertical; min-height: 120px; }
  .submit-btn {
    width: 100%; padding: 16px;
    background: #fff; color: #000; border: 1px solid #fff;
    font-family: 'Jost', sans-serif; font-size: 11px;
    font-weight: 400; letter-spacing: 0.25em; text-transform: uppercase;
    cursor: pointer; transition: background 280ms, color 280ms;
  }
  .submit-btn:hover:not(:disabled) { background: transparent; color: #fff; }
  .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .success {
    display: flex; flex-direction: column; align-items: flex-start;
    gap: 14px; padding: 40px 0;
  }
  .success-icon { font-size: 24px; color: rgba(255,255,255,0.3); }
  .success-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 28px; font-weight: 300; letter-spacing: 0.04em;
    color: #fff; margin: 0;
  }
  .success-msg {
    font-family: 'Jost', sans-serif; font-size: 13px;
    font-weight: 300; letter-spacing: 0.04em; line-height: 1.7;
    color: rgba(255,255,255,0.45); margin: 0;
  }
  .btn-reset {
    background: none; border: none; cursor: pointer;
    font-family: 'Jost', sans-serif; font-size: 10.5px;
    font-weight: 300; letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(255,255,255,0.4); text-decoration: underline;
    text-underline-offset: 3px; transition: color 200ms; padding: 0;
  }
  .btn-reset:hover { color: #fff; }
</style>