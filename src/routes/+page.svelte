<script lang="ts">
	import type { PageProps } from './$types';
	import { Button } from '$lib/components/ui/button/index';
	import { signIn, getUser, signOut } from '$lib/auth.svelte';
	import RequestLockerDialog from '$lib/components/RequestLockerDialog.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	let { data }: PageProps = $props();
</script>

<main class="flex h-lvh flex-col items-center justify-center gap-2">
	{#if getUser()}
		<p class="leading-7">
			Signed in as <Badge variant="secondary">{getUser()?.user_metadata.full_name}</Badge>
		</p>
	{/if}
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Tino Lockers</h1>
	<p class="leading-7">One simple place to request a new locker!</p>
	{#if getUser()}
		<div class="mt-4 flex gap-4">
			<RequestLockerDialog {data} />
			<Button variant="secondary" onclick={() => signOut()}>Log Out</Button>
		</div>
	{:else}
		<Button class="mt-4" onclick={() => signIn()}>Sign in with Google</Button>
	{/if}
</main>
