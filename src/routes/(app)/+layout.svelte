<script lang="ts">
	import Logo from '$lib/components/icons/Logo.svelte';

	import { page } from '$app/stores';

	const pathList = [
		{
			label: 'Project',
			path: '/project'
		},
		{
			label: 'Your Task',
			path: '/user/task'
		}
	];

	export let data;

	const getFirstLetters = (str: string) => {
		return str
			.split(' ')
			.map((word) => word.charAt(0))
			.join('');
	};
</script>

<div class="flex h-screen w-screen flex-col">
	<div class="flex justify-between px-4 py-2 text-xl font-light">
		<div class="flex w-full items-center">
			<a href="/">
				<Logo />
			</a>
		</div>
		{#if data.session}
			<div class="flex w-full justify-center gap-9">
				{#each pathList as path}
					<a href={path.path} class={$page.url.pathname.startsWith(path.path) ? 'font-medium' : ''}
						>{path.label}</a
					>
				{/each}
			</div>
		{/if}
		<div class="flex w-full justify-end gap-2">
			{#if data.session}
				<button
					class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 text-amber-50"
				>
					{getFirstLetters(data.session.user.user_metadata.name)}
				</button>
			{:else}
				<a href="/auth/login" class="text-xl font-bold">Login</a>
				<a
					href="/auth/register"
					class="rounded-md bg-amber-600 px-4 py-0.5 text-xl font-bold text-amber-50"
				>
					Get Start !
				</a>
			{/if}
		</div>
	</div>
	<slot />
</div>
