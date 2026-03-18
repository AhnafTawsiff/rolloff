<script>
  import Hero           from '$lib/components/home/Hero.svelte';
  import EditorialSlide from '$lib/components/home/EditorialSlide.svelte';
  import CategoryGrid   from '$lib/components/home/CategoryGrid.svelte';
  import ProductRow     from '$lib/components/home/ProductRow.svelte';
  import ServicesBanner from '$lib/components/home/ServicesBanner.svelte';
</script>

<Hero
  image="/images/hero-main.jpg"
  title="The New Collection"
  href="/new"
  label="Discover Now"
/>

<EditorialSlide
  image="/images/editorial-1.jpg"
  sub="See Now, Buy Now"
  title="Thaminas Giglio"
  href="/collections/giglio"
  label="Shop the Collection"
/>

<CategoryGrid />

<ProductRow
  heading="New Arrivals"
  products={[
    { id:1, name:'The Thaminas Tote',     price:'$1,250', image:'/images/p1.jpg', href:'/products/tote' },
    { id:2, name:'Monogram Shoulder Bag', price:'$980',   image:'/images/p2.jpg', href:'/products/shoulder' },
    { id:3, name:'Classic Chain Wallet',  price:'$450',   image:'/images/p3.jpg', href:'/products/wallet' },
    { id:4, name:'Heritage Leather Belt', price:'$320',   image:'/images/p4.jpg', href:'/products/belt' },
    { id:5, name:'Signature Scarf',       price:'$280',   image:'/images/p5.jpg', href:'/products/scarf' },
  ]}
/>

<EditorialSlide
  image="/images/editorial-2.jpg"
  sub="Men's Collection"
  title="Refined Essentials"
  href="/men"
  label="Explore Men's"
  reverse={true}
/>

<ProductRow
  heading="Best Sellers"
  products={[
    { id:6,  name:'Bamboo Top Handle',   price:'$1,850', image:'/images/p6.jpg',  href:'/products/bamboo' },
    { id:7,  name:'Horsebit Loafer',     price:'$720',   image:'/images/p7.jpg',  href:'/products/loafer' },
    { id:8,  name:'Web Stripe Belt',     price:'$290',   image:'/images/p8.jpg',  href:'/products/web-belt' },
    { id:9,  name:'Interlocking Brooch', price:'$380',   image:'/images/p9.jpg',  href:'/products/brooch' },
    { id:10, name:'Ophidia Mini Bag',    price:'$1,100', image:'/images/p10.jpg', href:'/products/ophidia' },
  ]}
/>

<EditorialSlide
  image="/images/editorial-3.jpg"
  sub="Fine Jewellery"
  title="Adorned in Thaminas"
  href="/jewellery"
  label="View Jewellery"
/>

<ServicesBanner />