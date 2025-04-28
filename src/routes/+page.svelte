<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { authClient } from '$lib/auth/auth-client';
	import { Badge } from '$lib/components/ui/badge';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	import {
		Lockers,
		SignOut,
		Student,
		FilePlus,
		Key,
		Shield,
		ClipboardText,
		GoogleLogo
	} from 'phosphor-svelte';

	const session = authClient.useSession();
</script>

<svelte:head>
	<title>Tino Lockers</title>
</svelte:head>

<main class="flex h-lvh select-none flex-col items-center justify-center gap-2">
	{#if $session.data}
		<div class="flex items-center gap-2">
			<p class="text-muted-foreground">
				Logged in as <strong>{$session.data.user.name}</strong>
			</p>
			{#if $session.data?.user.role === 'user'}
				<Badge variant="secondary"><Student size={14} class="mr-1" />Student</Badge>
			{:else if $session.data?.user?.role === 'admin'}
				<Badge variant="secondary"><Shield weight="bold" class="mr-1" />Admin</Badge>
			{/if}
		</div>
	{/if}

	<h1 class="scroll-m-20 text-5xl font-extrabold tracking-tight">Tino Lockers</h1>

	<p class="mb-4 leading-7">
		{#if $session.data?.user?.role === 'admin'}
			One simple place to manage your lockers!
		{:else}
			One simple place to request a new locker!
		{/if}
	</p>

	{#if $session.data}
		<div class="flex gap-2">
			{#if $session.data.user?.role === 'user'}
				<Button href="/user/request"><FilePlus weight="bold" /> Request a locker</Button>
				<Button href="/user/my-locker"><Key weight="bold" /> My locker</Button>
			{:else if $session.data.user?.role === 'admin'}
				<Button href="/admin/lockers"><Lockers weight="bold" /> Lockers</Button>
				<Button href="/admin/requests"><ClipboardText weight="bold" /> Requests</Button>
			{/if}
			<Button
				variant="outline"
				onclick={async () => {
					await authClient.signOut();
				}}><SignOut weight="bold" /> Sign out</Button
			>
		</div>
	{:else}
		<Button
			onclick={async () => {
				await authClient.signIn.social({
					provider: 'google'
				});
			}}><GoogleLogo weight="bold" /> Sign in with Google</Button
		>
	{/if}
</main>
