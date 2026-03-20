<script>
  // ── Login page ────────────────────────────────────────────────────────────
  // Location: src/routes/account/login/+page.svelte
  // ──────────────────────────────────────────────────────────────────────────
  import { goto } from '$app/navigation';
  import { login, isLoggedIn } from '$lib/stores/auth.js';
  import { onMount } from 'svelte';

  // Redirect if already logged in
  onMount(() => {
    if ($isLoggedIn) goto('/account');
  });

  let email    = $state('');
  let password = $state('');
  let showPw   = $state(false);
  let error    = $state('');
  let loading  = $state(false);

  // Rate limiting — max 5 attempts, 30s lockout
  let attempts  = $state(0);
  let lockedOut = $state(false);
  let lockTimer = null;

  function lockout() {
    lockedOut = true;
    lockTimer = setTimeout(() => {
      lockedOut = false;
      attempts  = 0;
    }, 30_000);
  }

  async function handleLogin() {
    if (loading || lockedOut) return;
    error = '';

    // Client-side validation
    if (!email.trim())    { error = 'Please enter your email.';    return; }
    if (!password)        { error = 'Please enter your password.'; return; }

    loading = true;

    // Small artificial delay — prevents timing attacks revealing valid emails
    await new Promise(r => setTimeout(r, 400));

    const result = login({ email, password });

    if (result.ok) {
      // Clear sensitive data from memory immediately
      password = '';
      goto('/account');
    } else {
      attempts += 1;
      error = result.error;
      if (attempts >= 5) lockout();
    }

    loading = false;
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleLogin();
  }
</script>

<svelte:head>
  <title>Sign In — Thaminas</title>
</svelte:head>

<div class="page">
  <div class="card">

    <!-- Logo -->
    <a href="/" class="logo">THAMINAS</a>
    <p class="sub">Sign in to your account</p>

    <!-- Lockout banner -->
    {#if lockedOut}
    <div class="banner error">
      Too many attempts. Please wait 30 seconds before trying again.
    </div>
    {/if}

    <!-- Error -->
    {#if error && !lockedOut}
    <div class="banner error">{error}</div>
    {/if}

    <!-- Form -->
    <div class="form">
      <div class="field">
        <label for="email">EMAIL ADDRESS</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          onkeydown={handleKey}
          oninput={() => error = ''}
          autocomplete="email"
          placeholder="you@example.com"
          disabled={lockedOut}
        />
      </div>

      <div class="field">
        <div class="pw-label-row">
          <label for="password">PASSWORD</label>
          <a href="/account/forgot" class="forgot">Forgot password?</a>
        </div>
        <div class="pw-wrap">
          <input
            id="password"
            type={showPw ? 'text' : 'password'}
            bind:value={password}
            onkeydown={handleKey}
            oninput={() => error = ''}
            autocomplete="current-password"
            placeholder="••••••••"
            disabled={lockedOut}
          />
          <button
            class="toggle-pw"
            type="button"
            onclick={() => showPw = !showPw}
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {#if showPw}
            <!-- Eye off -->
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
            {:else}
            <!-- Eye -->
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            {/if}
          </button>
        </div>
      </div>

      <button
        class="cta"
        onclick={handleLogin}
        disabled={loading || lockedOut}
      >
        {#if loading}
        <span class="spinner"></span>
        {:else}
        SIGN IN
        {/if}
      </button>
    </div>

    <p class="switch">
      Don't have an account?
      <a href="/account/register">Create one</a>
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
    max-width: 420px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  /* Logo */
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

  /* Banners */
  .banner {
    width: 100%;
    padding: 12px 16px;
    font-size: 12px;
    letter-spacing: 0.03em;
    margin-bottom: 20px;
    line-height: 1.6;
  }
  .banner.error {
    background: rgba(180, 0, 0, 0.1);
    border-left: 2px solid #b00;
    color: #ff6b6b;
  }

  /* Form */
  .form { width: 100%; display: flex; flex-direction: column; gap: 0; }

  .field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
  .field label {
    font-size: 10px;
    letter-spacing: 0.14em;
    color: #666;
  }

  .field input {
    background: #111;
    border: 1px solid #222;
    border-radius: 0;
    padding: 14px 16px;
    font-family: 'Jost', sans-serif;
    font-size: 13.5px;
    color: #fff;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
    box-sizing: border-box;
  }
  .field input:focus  { border-color: #555; }
  .field input:disabled { opacity: 0.4; cursor: not-allowed; }
  .field input::placeholder { color: #333; }

  /* Password row */
  .pw-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .forgot {
    font-size: 10px;
    letter-spacing: 0.08em;
    color: #555;
    text-decoration: none;
    transition: color 0.2s;
  }
  .forgot:hover { color: #aaa; }

  .pw-wrap { position: relative; }
  .pw-wrap input { padding-right: 44px; }
  .toggle-pw {
    position: absolute;
    right: 14px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: #444; padding: 0; line-height: 1;
    transition: color 0.2s;
  }
  .toggle-pw:hover { color: #aaa; }

  /* CTA */
  .cta {
    background: #fff;
    color: #000;
    border: none;
    padding: 16px;
    font-family: 'Jost', sans-serif;
    font-size: 11.5px;
    letter-spacing: 0.18em;
    cursor: pointer;
    transition: background 0.2s, opacity 0.2s;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 52px;
    margin-top: 8px;
  }
  .cta:hover:not(:disabled) { background: #ddd; }
  .cta:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Spinner */
  .spinner {
    width: 16px; height: 16px;
    border: 1.5px solid rgba(0,0,0,0.2);
    border-top-color: #000;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Switch */
  .switch {
    margin-top: 28px;
    font-size: 12px;
    color: #444;
    letter-spacing: 0.04em;
  }
  .switch a {
    color: #888;
    text-decoration: underline;
    transition: color 0.2s;
    margin-left: 4px;
  }
  .switch a:hover { color: #fff; }
</style>