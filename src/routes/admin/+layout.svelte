<script lang="ts">
	let { children } = $props();
	import { authClient } from '$lib/auth/auth-client';
	import { CircleArrowLeft } from 'lucide-svelte';

	const session = authClient.useSession();
</script>

{#if $session.data}
	{@render children()}
{:else}
	<main class="flex h-lvh select-none flex-col items-center justify-center gap-4">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
			Gotta login buddy.
		</h1>
		<a href="/">
			<p class="flex items-center gap-2 text-muted-foreground hover:underline">
				<CircleArrowLeft size={20} />Back
			</p>
		</a>
	</main>
{/if}
