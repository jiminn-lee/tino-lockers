<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';

	let { id } = $props();

	let isApproveDialogOpen = $state(false);
	let isDenyDialogOpen = $state(false);

	let denyMessage = $state('');

	const approveRequest = async () => {
		const approveRequestRes = await fetch('/api/admin', {
			method: 'PUT',
			body: JSON.stringify({ id: id, type: 'single', status: 'approved' }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (approveRequestRes.status === 200) {
			isApproveDialogOpen = false;
			toast.success('Request successfully approved!');
			invalidateAll();
		}
	};
</script>

<div class="flex gap-1">
	<Dialog.Root bind:open={isApproveDialogOpen}>
		<Dialog.Trigger class={buttonVariants()}>Approve</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Approve locker request?</Dialog.Title>
				<Dialog.Description>This action cannot be undone.</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer>
				<Button onclick={approveRequest}>Confirm</Button>
				<Button
					variant="outline"
					onclick={() => {
						isApproveDialogOpen = false;
					}}>Cancel</Button
				>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
	<Dialog.Root bind:open={isDenyDialogOpen}>
		<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Deny</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Deny locker request?</Dialog.Title>
				<Dialog.Description>This action cannot be undone.</Dialog.Description>
			</Dialog.Header>
			<div class="flex w-full flex-col gap-1.5">
				<Label>Comments</Label>
				<Input bind:value={denyMessage} />
			</div>
			<Dialog.Footer>
				<Button>Confirm</Button>
				<Button
					variant="outline"
					onclick={() => {
						isDenyDialogOpen = false;
						denyMessage = '';
					}}>Cancel</Button
				>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</div>
