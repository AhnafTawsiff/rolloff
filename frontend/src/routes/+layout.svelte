<!-- Location: src/routes/+layout.svelte -->
<script>
  import Header     from '$lib/components/layout/Header.svelte';
  import Footer     from '$lib/components/layout/Footer.svelte';
  import CartDrawer from '$lib/components/cart/CartDrawer.svelte';
  import '../app.css';
</script>

<Header />
<CartDrawer />
<slot />
<Footer />