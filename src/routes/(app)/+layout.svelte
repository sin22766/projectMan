<script lang="ts">
	import UserDropdown from '$lib/components/Dropdowns/UserDropdown.svelte';
	import Logo from '$lib/components/Icons/Logo.svelte';

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
</script>

<div class="flex h-screen w-screen flex-col">
	<div class="flex justify-between px-4 py-2 text-xl font-light">
		<div class="flex w-full items-center">
			<a href="/">
				<Logo />
			</a>
		</div>
		{#if data.session}
			<div class="hidden w-full justify-center gap-9 sm:flex">
				{#each pathList as path}
					<a href={path.path} class={$page.url.pathname.startsWith(path.path) ? 'font-medium' : ''}>
						{path.label}
					</a>
				{/each}
			</div>
		{/if}
		<div class="flex w-full justify-end gap-2">
			{#if data.session}
				<UserDropdown name={data.session.user.user_metadata.name} />
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
