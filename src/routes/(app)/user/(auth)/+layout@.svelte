<script lang='ts'>
	import Logo from '$lib/components/icons/Logo.svelte';
</script>

<div class='flex w-screen min-h-screen'>
	<div class='basis-1/3 p-8 lg:basis-1/2 bg-amber-200 hidden sm:block'>
		<a href='/'>
			<Logo class='text-2xl' />
		</a>
	</div>
	<div class='basis-1/2 flex flex-col items-center justify-center px-32'>
		<slot />
	</div>
</div>