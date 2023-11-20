<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="flex w-full flex-col gap-4 p-2">
	<h1 class="text-2xl font-bold text-amber-800">Log in</h1>
	<form id="login" class="flex flex-col gap-2" method="post" use:enhance>
		<label class="flex flex-col gap-1">
			<span class="font-bold text-amber-600">Email*</span>
			<input
				class="h-8 rounded-md border border-amber-600 bg-amber-100 p-1 outline-amber-800"
				name="email"
				type="email"
				required
			/>
		</label>
		<label class="flex flex-col gap-1">
			<span class="font-bold text-amber-600">Password*</span>
			<input
				class="h-8 rounded-md border border-amber-600 bg-amber-100 p-1 outline-amber-800"
				name="password"
				type="password"
				required
			/>
		</label>
	</form>
	<button form="login" class="bg-amber-600 p-2 font-bold text-amber-50">Log in</button>
	<p>
		Don’t have an account? <a href="/user/register">Register</a>
	</p>
</div>
