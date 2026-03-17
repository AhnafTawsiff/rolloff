<script>
  import Header from '$lib/components/layout/Header.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import '../app.css';
</script>
 
<Header />
<slot />
<Footer />