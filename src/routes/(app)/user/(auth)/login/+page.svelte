<svelte:head>
	<title>Login</title>
</svelte:head>

<div class='flex flex-col gap-4 p-2 w-full'>
	<h1 class='text-2xl font-bold text-amber-800'>Log in</h1>
	<form id='login' class='flex flex-col gap-2' method='post'>
		<label class='flex flex-col gap-1'>
			<span class='font-bold text-amber-600'>Email*</span>
			<input class='h-8 p-1 border-amber-600 bg-amber-100 border rounded-md outline-amber-800' name='email' type='email'
						 required>
		</label>
		<label class='flex flex-col gap-1'>
			<span class='font-bold text-amber-600'>Password*</span>
			<input class='h-8 p-1 border-amber-600 bg-amber-100 border rounded-md outline-amber-800' name='password'
						 type='password' required>
		</label>
	</form>
	<button form='login' class='p-2 font-bold text-amber-50 bg-amber-600'>Log in</button>
	<p>Don’t have an account? <a href='/user/register'>Register</a></p>
</div>