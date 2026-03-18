<!-- ============================================================
  +page.svelte
  Location: src/routes/products/[slug]/+page.svelte

  The product page. Gets product data from the server file
  above and passes it straight to the ProductPage component.
  You never need to edit this file.
  All product content lives in src/lib/data/products.js
============================================================ -->
<script>
  import ProductPage from '$lib/components/product/ProductPage.svelte';
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.product.name} — Thaminas</title>
  <meta name="description" content={data.product.description.slice(0, 160)} />
</svelte:head>

<ProductPage product={data.product} />