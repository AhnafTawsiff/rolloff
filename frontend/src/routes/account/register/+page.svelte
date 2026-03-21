<script>
  // ── Register page ─────────────────────────────────────────────────────────
  // Location: src/routes/account/register/+page.svelte
  // ──────────────────────────────────────────────────────────────────────────
  import { goto } from '$app/navigation';
  import { register, isLoggedIn } from '$lib/stores/auth.js';
  import { onMount } from 'svelte';

  // Redirect if already logged in
  onMount(() => { if ($isLoggedIn) goto('/account'); });

  let firstName = $state('');
  let lastName  = $state('');
  let email     = $state('');
  let password  = $state('');
  let confirm   = $state('');
  let showPw    = $state(false);
  let showCf    = $state(false);
  let loading   = $state(false);
  let errors    = $state({});
  let banner    = $state('');

  // ── Password strength ─────────────────────────────────────────────────────
  const strength = $derived((() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8)          s++;
    if (/[A-Z]/.test(password))        s++;
    if (/[0-9]/.test(password))        s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s; // 0–4
  })());

  const strengthLabel = $derived(
    ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  );
  const strengthColor = $derived(
    ['', '#c0392b', '#e67e22', '#f1c40f', '#27ae60'][strength]
  );

  // ── Validation ────────────────────────────────────────────────────────────
  function validate() {
    const e = {};
    if (!firstName.trim())  e.firstName = 'Required';
    if (!lastName.trim())   e.lastName  = 'Required';
    if (!email.trim())      e.email     = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
                            e.email     = 'Invalid email address';
    if (!password)          e.password  = 'Required';
    else if (password.length < 8)
                            e.password  = 'Minimum 8 characters';
    else if (!/[A-Z]/.test(password))
                            e.password  = 'Must include an uppercase letter';
    else if (!/[0-9]/.test(password))
                            e.password  = 'Must include a number';
    if (!confirm)           e.confirm   = 'Please confirm your password';
    else if (confirm !== password)
                            e.confirm   = 'Passwords do not match';
    errors = e;
    return Object.keys(e).length === 0;
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleRegister() {
    if (loading) return;
    banner = '';
    if (!validate()) return;

    loading = true;
    await new Promise(r => setTimeout(r, 400)); // consistent timing

    const result = await register({ firstName, lastName, email, password });

    if (result.ok) {
      // Clear sensitive data immediately
      password = '';
      confirm  = '';
      if (result.needsConfirmation) {
        banner = '';
        // Show a success message instead of redirecting
        errors = {};
        alert('Account created! Please check your email to confirm your account before logging in.');
        goto('/account/login');
      } else {
        goto('/account');
      }
    } else {
      banner = result.error;
    }

    loading = false;
  }

  function handleKey(e) { if (e.key === 'Enter') handleRegister(); }
  function clear(field) { errors = { ...errors, [field]: '' }; banner = ''; }
</script>

<svelte:head>
  <title>Create Account — Thaminas</title>
</svelte:head>

<div class="page">
  <div class="card">

    <a href="/" class="logo">THAMINAS</a>
    <p class="sub">Create your account</p>

    {#if banner}
    <div class="banner error">{banner}</div>
    {/if}

    <div class="form">

      <!-- Name row -->
      <div class="row two">
        <div class="field" class:err={errors.firstName}>
          <label for="firstName">FIRST NAME <span class="req">*</span></label>
          <input id="firstName" type="text" bind:value={firstName}
            oninput={() => clear('firstName')} onkeydown={handleKey}
            autocomplete="given-name" />
          {#if errors.firstName}<span class="err-msg">{errors.firstName}</span>{/if}
        </div>
        <div class="field" class:err={errors.lastName}>
          <label for="lastName">LAST NAME <span class="req">*</span></label>
          <input id="lastName" type="text" bind:value={lastName}
            oninput={() => clear('lastName')} onkeydown={handleKey}
            autocomplete="family-name" />
          {#if errors.lastName}<span class="err-msg">{errors.lastName}</span>{/if}
        </div>
      </div>

      <!-- Email -->
      <div class="field" class:err={errors.email}>
        <label for="email">EMAIL ADDRESS <span class="req">*</span></label>
        <input id="email" type="email" bind:value={email}
          oninput={() => clear('email')} onkeydown={handleKey}
          autocomplete="email" placeholder="you@example.com" />
        {#if errors.email}<span class="err-msg">{errors.email}</span>{/if}
      </div>

      <!-- Password -->
      <div class="field" class:err={errors.password}>
        <label for="password">PASSWORD <span class="req">*</span></label>
        <div class="pw-wrap">
          <input id="password" type={showPw ? 'text' : 'password'}
            bind:value={password} oninput={() => clear('password')}
            onkeydown={handleKey} autocomplete="new-password"
            placeholder="Min. 8 chars, 1 uppercase, 1 number" />
          <button class="toggle-pw" type="button"
            onclick={() => showPw = !showPw}
            aria-label={showPw ? 'Hide password' : 'Show password'}>
            {#if showPw}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
            {:else}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            {/if}
          </button>
        </div>
        <!-- Strength meter -->
        {#if password}
        <div class="strength-bar">
          {#each [1,2,3,4] as n}
          <div class="seg" style="background: {n <= strength ? strengthColor : '#222'}"></div>
          {/each}
          <span class="strength-label" style="color: {strengthColor}">{strengthLabel}</span>
        </div>
        {/if}
        {#if errors.password}<span class="err-msg">{errors.password}</span>{/if}
      </div>

      <!-- Confirm password -->
      <div class="field" class:err={errors.confirm}>
        <label for="confirm">CONFIRM PASSWORD <span class="req">*</span></label>
        <div class="pw-wrap">
          <input id="confirm" type={showCf ? 'text' : 'password'}
            bind:value={confirm} oninput={() => clear('confirm')}
            onkeydown={handleKey} autocomplete="new-password"
            placeholder="Re-enter your password" />
          <button class="toggle-pw" type="button"
            onclick={() => showCf = !showCf}
            aria-label={showCf ? 'Hide password' : 'Show password'}>
            {#if showCf}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
            {:else}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            {/if}
          </button>
        </div>
        {#if errors.confirm}<span class="err-msg">{errors.confirm}</span>{/if}
      </div>

      <!-- Requirements hint -->
      <ul class="req-list">
        <li class:met={password.length >= 8}>At least 8 characters</li>
        <li class:met={/[A-Z]/.test(password)}>One uppercase letter</li>
        <li class:met={/[0-9]/.test(password)}>One number</li>
        <li class:met={confirm && confirm === password}>Passwords match</li>
      </ul>

      <button class="cta" onclick={handleRegister} disabled={loading}>
        {#if loading}
        <span class="spinner"></span>
        {:else}
        CREATE ACCOUNT
        {/if}
      </button>

    </div>

    <p class="switch">
      Already have an account?
      <a href="/account/login">Sign in</a>
    </p>

  </div>
</div>

<style>
  .page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #080808;
    padding: 40px 20px;
    font-family: 'Jost', sans-serif;
  }

  .card {
    width: 100%;
    max-width: 460px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .logo {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(22px, 4vw, 30px);
    font-weight: 400;
    letter-spacing: 0.22em;
    color: #fff;
    text-decoration: none;
    margin-bottom: 10px;
    transition: opacity 0.2s;
  }
  .logo:hover { opacity: 0.6; }

  .sub {
    font-size: 11px;
    letter-spacing: 0.14em;
    color: #555;
    margin-bottom: 36px;
    text-transform: uppercase;
  }

  .banner {
    width: 100%;
    padding: 12px 16px;
    font-size: 12px;
    letter-spacing: 0.03em;
    margin-bottom: 20px;
    line-height: 1.6;
  }
  .banner.error {
    background: rgba(180,0,0,0.1);
    border-left: 2px solid #b00;
    color: #ff6b6b;
  }

  .form { width: 100%; }

  .row { display: grid; gap: 16px; }
  .row.two { grid-template-columns: 1fr 1fr; }

  .field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 22px; }
  .field label { font-size: 10px; letter-spacing: 0.14em; color: #666; }
  .req { color: #b00; }

  .field input {
    background: #111;
    border: 1px solid #222;
    padding: 14px 16px;
    font-family: 'Jost', sans-serif;
    font-size: 13.5px;
    color: #fff;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
    box-sizing: border-box;
  }
  .field input:focus { border-color: #555; }
  .field input::placeholder { color: #333; }
  .field.err input { border-color: #b00; }
  .err-msg { font-size: 10.5px; color: #ff6b6b; letter-spacing: 0.03em; }

  /* Password */
  .pw-wrap { position: relative; }
  .pw-wrap input { padding-right: 44px; }
  .toggle-pw {
    position: absolute; right: 14px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: #444; padding: 0; line-height: 1;
    transition: color 0.2s;
  }
  .toggle-pw:hover { color: #aaa; }

  /* Strength meter */
  .strength-bar {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 6px;
  }
  .seg {
    height: 2px;
    flex: 1;
    border-radius: 2px;
    transition: background 0.3s;
  }
  .strength-label {
    font-size: 10px;
    letter-spacing: 0.1em;
    min-width: 40px;
    text-align: right;
    transition: color 0.3s;
  }

  /* Requirements checklist */
  .req-list {
    list-style: none;
    padding: 0; margin: 0 0 24px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px 16px;
  }
  .req-list li {
    font-size: 11px;
    letter-spacing: 0.04em;
    color: #444;
    padding-left: 16px;
    position: relative;
    transition: color 0.2s;
  }
  .req-list li::before {
    content: '○';
    position: absolute; left: 0;
    font-size: 9px;
    transition: content 0.2s;
  }
  .req-list li.met { color: #27ae60; }
  .req-list li.met::before { content: '✓'; }

  /* CTA */
  .cta {
    background: #fff; color: #000; border: none;
    padding: 16px; font-family: 'Jost', sans-serif;
    font-size: 11.5px; letter-spacing: 0.18em; cursor: pointer;
    transition: background 0.2s, opacity 0.2s;
    width: 100%; display: flex; align-items: center;
    justify-content: center; min-height: 52px; margin-top: 8px;
  }
  .cta:hover:not(:disabled) { background: #ddd; }
  .cta:disabled { opacity: 0.5; cursor: not-allowed; }

  .spinner {
    width: 16px; height: 16px;
    border: 1.5px solid rgba(0,0,0,0.2);
    border-top-color: #000;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .switch {
    margin-top: 28px;
    font-size: 12px;
    color: #444;
    letter-spacing: 0.04em;
  }
  .switch a {
    color: #888; text-decoration: underline;
    transition: color 0.2s; margin-left: 4px;
  }
  .switch a:hover { color: #fff; }

  @media (max-width: 480px) {
    .row.two { grid-template-columns: 1fr; }
    .req-list { grid-template-columns: 1fr; }
  }
</style>