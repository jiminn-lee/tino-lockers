<script lang="ts">
	let { children } = $props();
	import { authClient } from '$lib/auth/auth-client';
	import BackButton from '$lib/components/BackButton.svelte';
	import { CircleArrowLeft } from 'lucide-svelte';

	const session = authClient.useSession();
</script>

{#if $session.data}
	{#if $session.data.user.role === 'admin'}
		{@render children()}
	{:else}
		<main class="flex h-lvh select-none flex-col items-center justify-center gap-4">
			<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				You do not have access to this page!
			</h1>
			<BackButton />
		</main>
	{/if}
{:else}
	<main class="flex h-lvh select-none flex-col items-center justify-center gap-4">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
			Gotta login buddy.
		</h1>
		<BackButton />
	</main>
{/if}
