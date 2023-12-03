<script lang="ts">
	import Logo from '$lib/components/ui/Icons/Logo.svelte';
</script>

<div class="flex min-h-screen w-screen">
	<div class="hidden basis-1/3 bg-amber-200 p-8 sm:block lg:basis-1/2">
		<a href="/">
			<Logo class="text-2xl" />
		</a>
	</div>
	<div class="flex basis-1/2 flex-col items-center justify-center px-32">
		<slot />
	</div>
</div>
