<script>
  import ProductPage from "$lib/components/product/ProductPage.svelte";
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.product.name} — Thaminas</title>
</svelte:head>

<ProductPage product={data.product} />