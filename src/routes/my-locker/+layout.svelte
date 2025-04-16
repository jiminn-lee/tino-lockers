<script lang="ts">
	let { children } = $props();
	import { authClient } from '$lib/auth/auth-client';

	const session = authClient.useSession();
</script>

{#if $session.data}
	{@render children()}
{:else}
	<main class="flex h-lvh select-none flex-col items-center justify-center gap-2">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
			You must be logged in!
		</h1>
	</main>
{/if}
