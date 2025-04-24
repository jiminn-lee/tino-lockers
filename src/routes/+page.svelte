<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		CirclePlus,
		KeyRound,
		LayoutDashboard,
		LogIn,
		LogOut,
		ShieldUser,
		User
	} from 'lucide-svelte';
	import { authClient } from '$lib/auth/auth-client';
	import { Badge } from '$lib/components/ui/badge';

	const session = authClient.useSession();
</script>

<main class="flex h-lvh select-none flex-col items-center justify-center gap-2">
	{#if $session.data}
		<div class="flex items-center gap-2">
			<p class="text-muted-foreground">
				Logged in as <strong>{$session.data.user.name}</strong>
			</p>
			{#if $session.data?.user.role === 'user'}
				<Badge variant="secondary"><User size={14} class="mr-1" />Student</Badge>
			{:else if $session.data?.user?.role === 'admin'}
				<Badge variant="secondary"><ShieldUser size={14} class="mr-1" />Admin</Badge>
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
				<Button href="/user/request"><CirclePlus /> Request a locker</Button>
				<Button href="/user/my-locker"><KeyRound /> My locker</Button>
			{:else if $session.data.user?.role === 'admin'}
				<Button href="/admin/lockeres"><LayoutDashboard /> Lockers</Button>
				<Button href="/admin/requests"><LayoutDashboard /> Requests</Button>
			{/if}
			<Button
				variant="outline"
				onclick={async () => {
					await authClient.signOut();
				}}><LogOut /> Sign out</Button
			>
		</div>
	{:else}
		<Button
			onclick={async () => {
				await authClient.signIn.social({
					provider: 'google'
				});
			}}><LogIn /> Sign in with Google</Button
		>
	{/if}
</main>
