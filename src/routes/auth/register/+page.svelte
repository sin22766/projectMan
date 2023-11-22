<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<svelte:head>
	<title>Register - Try NimbleSquad</title>
</svelte:head>

<div class="flex w-full flex-col gap-4 p-2">
	<h1 class="text-2xl font-bold text-amber-800">Create your account</h1>
	<form id="login" class="flex flex-col gap-2" method="post">
		<label class="flex flex-col gap-1">
			<span class="font-bold">Your name*</span>
			<input
				class="h-8 rounded-md border border-amber-600 bg-amber-100 p-1 outline-amber-800"
				name="name"
				type="text"
				required
			/>
		</label>
		<label class="flex flex-col gap-1">
			<span class="font-bold">Email*</span>
			<input
				class="h-8 rounded-md border border-amber-600 bg-amber-100 p-1 outline-amber-800"
				name="email"
				type="email"
				required
			/>
		</label>
		<label class="flex flex-col gap-1">
			<span class="font-bold">Password*</span>
			<input
				class="h-8 rounded-md border border-amber-600 bg-amber-100 p-1 outline-amber-800"
				name="password"
				type="password"
				required
			/>
			{#if form?.error}
				<span class="text-sm text-red-700">{form.error}</span>
			{/if}
		</label>
	</form>
	<button form="login" class="rounded-md bg-amber-600 p-2 font-bold text-amber-50">
		Create Account
	</button>
	<p class="text-sm font-light">
		Already have an account? <a class="font-bold text-yellow-800" href="/auth/login">Login</a>
	</p>
</div>
