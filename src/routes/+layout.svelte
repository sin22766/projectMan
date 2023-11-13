<script lang="ts">
	import '../app.pcss';
    import Navbar from "$lib/components/Navbar/Navbar.svelte";
</script>

<div class="flex flex-col w-screen min-h-screen">
    <Navbar/>
    <slot />
</div>
