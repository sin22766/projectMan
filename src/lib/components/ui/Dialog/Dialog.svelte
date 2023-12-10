<script lang="ts">
	import { createDialog, melt } from '@melt-ui/svelte';
	import { X } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import { fade, fly } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';

	export let open = writable(false);
	export let manualTrigger = false;

	const {
		elements: { trigger, overlay, content, title, description, close, portalled }
	} = createDialog({
		forceVisible: true,
		open: open
	});

	const baseStyles = 'flex h-fit items-center justify-center gap-2 rounded-md bg-amber-300 px-4 py-0.5';
</script>

{#if !manualTrigger}
	<slot name="trigger" trigger={$trigger}>
		<button use:melt={$trigger} class={twMerge(baseStyles, $$props.class)}>
			<slot>Open Dialog</slot>
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
			class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw]
					max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-amber-100
					p-6 shadow-lg"
			transition:fly={{
				duration: 150,
				y: 8
			}}
			use:melt={$content}
		>
			<h2 use:melt={$title} class="m-0 text-lg font-medium text-amber-800">
				<slot name="title">Dialog</slot>
			</h2>
			<p use:melt={$description} class="mb-2 text-sm leading-normal">
				<slot name="description">Dialog description</slot>
			</p>
			<slot name="body" />
			<div class="mt-6 flex justify-end gap-4">
				<slot name="buttonGroup" close={$close}>
					<button
						use:melt={$close}
						class="inline-flex h-8 items-center justify-center rounded-md
									border border-yellow-800 px-4 font-medium leading-none"
					>
						Close
					</button>
				</slot>
			</div>
			<button
				use:melt={$close}
				aria-label="close"
				class="absolute right-4 top-4 inline-flex h-6 w-6 appearance-none
							items-center justify-center rounded-full p-1 text-yellow-800
							hover:bg-yellow-100 focus:shadow-yellow-400"
			>
				<X stroke-width={3} class="h-6 w-6" />
			</button>
		</div>
	{/if}
</div>
