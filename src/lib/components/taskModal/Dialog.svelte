<script lang='ts'>
	import { twMerge } from "tailwind-merge";


	let dialog: HTMLDialogElement;

    export function showModal()
    {
        dialog.showModal()
    }

    export function closeModal()
    {
        dialog.close()
    }

    const {class: propClasses, ...rest} = $$restProps
    let dialogClasses = twMerge(propClasses)
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
    class={dialogClasses}
	bind:this={dialog}
	on:click|self={() => dialog.close()}
    {...rest}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		<slot />
	</div>
</dialog>


<style>
    dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
   @keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	} 
</style>