<script lang="ts">
	import { createDialog, melt } from '@melt-ui/svelte';
	import { X } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import { fade, fly } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';

	export let manualTrigger = false;
	export let disableTitle = false;
	export let open = writable(false);

	const {
		elements: { trigger, overlay, content, title, description, close, portalled }
	} = createDialog({
		forceVisible: true,
		open: open
	});

	const baseStyles = 'flex items-center justify-center gap-2 rounded-md bg-amber-300 px-4 py-0.5';
</script>

{#if !manualTrigger}
	<slot name="trigger" trigger={$trigger}>
		<button use:melt={$trigger} class={twMerge(baseStyles, $$props.class)}>
			<slot>Open Drawer</slot>
		</button>
	</slot>
{/if}

<div use:melt={$portalled}>
	{#if $open}
		<div
			use:melt={$overlay}
			class="fixed inset-0 z-50 bg-black/50"
			transition:fade={{ duration: 150 }}
		/>
		<div
			use:melt={$content}
			class="fixed right-0 top-0 z-50 h-screen w-full max-w-[640px] bg-white p-8
            shadow-lg focus:outline-none"
			transition:fly={{
				x: 640,
				duration: 300,
				opacity: 1
			}}
		>
			<button
				use:melt={$close}
				aria-label="Close"
				class="absolute left-[10px] top-[10px] inline-flex h-6 w-6
                appearance-none items-center justify-center rounded-full text-amber-800
                hover:bg-amber-100 focus:shadow-amber-400 focus:outline-none focus:ring-2
                focus:ring-amber-400"
			>
				<X class="square-4" />
			</button>
			{#if !disableTitle}
				<h2 use:melt={$title} class="mb-0 text-lg font-medium text-black">
					<slot name="title">Drawer</slot>
				</h2>
				<p use:melt={$description} class="mb-5 mt-2 leading-normal text-zinc-600">
					<slot name="description">Drawer description</slot>
				</p>
			{/if}
			<slot name="body" />
		</div>
	{/if}
</div>
