<script lang="ts">
	import { enhance } from '$app/forms';
	import { getUser } from '$lib/auth.svelte';

	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as RadioGroup from '$lib/components/ui/radio-group/index';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index';
	import { Button } from './ui/button/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Label } from '$lib/components/ui/label/index';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index';

	let isOpen = $state(false);

	let grade: string | undefined = $state();
	let lockerType: string | undefined = $state('single');
	let partnerName: string | undefined = $state();
	let partnerEmail: string | undefined = $state();
	let partnerGrade: string | undefined = $state();
	let lockerNumber: string | undefined = $state();

	let { data } = $props();
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger><Button>Request a locker</Button></Dialog.Trigger>
	<Dialog.Content interactOutsideBehavior="ignore">
		<Dialog.Header>
			<Dialog.Title>Request a locker</Dialog.Title>
			<Dialog.Description
				>Request a locker by filling out the following information. A school administrator will then
				approve or deny your request.</Dialog.Description
			>
		</Dialog.Header>
		<form class="grid gap-4 py-4" method="POST" use:enhance>
			<input type="hidden" name="name" value={getUser()?.user_metadata.full_name} />
			<input type="hidden" name="email" value={getUser()?.email} />
			<input type="hidden" name="grade" value={grade} />
			<input type="hidden" name="lockerType" value={lockerType} />
			<input type="hidden" name="partnerName" value={partnerName} />
			<input type="hidden" name="partnerEmail" value={partnerEmail} />
			<input type="hidden" name="partnerGrade" value={partnerGrade} />
			<input type="hidden" name="lockerNumber" value={lockerNumber} />

			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Name</Label>
				<Input id="name" class="col-span-3" disabled value={getUser()?.user_metadata.full_name} />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="email" class="text-right">Email</Label>
				<Input id="email" class="col-span-3" disabled value={getUser()?.email} />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="grade" class="text-right">Grade</Label>
				<ToggleGroup.Root
					type="single"
					class="col-span-3 flex w-full"
					variant="outline"
					bind:value={grade}
				>
					<ToggleGroup.Item value="9" aria-label="Toggle 9th grade" class="flex-1"
						>9</ToggleGroup.Item
					>
					<ToggleGroup.Item value="10" aria-label="Toggle 10th grade" class="flex-1"
						>10</ToggleGroup.Item
					>
					<ToggleGroup.Item value="11" aria-label="Toggle 11th grade" class="flex-1"
						>11</ToggleGroup.Item
					>
					<ToggleGroup.Item value="12" aria-label="Toggle 12th grade" class="flex-1"
						>12</ToggleGroup.Item
					>
				</ToggleGroup.Root>
			</div>

			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="email" class="text-right">Locker Type</Label>
				<RadioGroup.Root class="flex gap-4" bind:value={lockerType}>
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value="single" id="single" />
						<Label for="single">Single</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value="partner" id="partner" />
						<Label for="partner">Partner</Label>
					</div>
				</RadioGroup.Root>
			</div>
			{#if lockerType == 'partner'}
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="partner-name" class="text-right">Partner Name</Label>
					<Input id="name" class="col-span-3" bind:value={partnerName} />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="partner-email" class="text-right">Partner Email</Label>
					<Input id="email" class="col-span-3" bind:value={partnerEmail} />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="partner-grade" class="text-right">Partner Grade</Label>
					<ToggleGroup.Root
						type="single"
						class="col-span-3 flex w-full"
						variant="outline"
						bind:value={partnerGrade}
					>
						<ToggleGroup.Item value="9" aria-label="Toggle 9th grade" class="flex-1"
							>9</ToggleGroup.Item
						>
						<ToggleGroup.Item value="10" aria-label="Toggle 10th grade" class="flex-1"
							>10</ToggleGroup.Item
						>
						<ToggleGroup.Item value="11" aria-label="Toggle 11th grade" class="flex-1"
							>11</ToggleGroup.Item
						>
						<ToggleGroup.Item value="12" aria-label="Toggle 12th grade" class="flex-1"
							>12</ToggleGroup.Item
						>
					</ToggleGroup.Root>
				</div>
			{/if}
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="email" class="text-right">Locker #</Label>
				<ScrollArea class="col-span-3 h-[200px] rounded-md border p-4">
					<ToggleGroup.Root
						type="single"
						variant="outline"
						bind:value={lockerNumber}
						class="flex flex-wrap"
					>
						{#each data.lockers as locker}
							{#if locker.unavailable == true}
								<ToggleGroup.Item value={locker.id} aria-label="Toggle bold" disabled
									>{locker.id}</ToggleGroup.Item
								>
							{:else}
								<ToggleGroup.Item value={locker.id} aria-label="Toggle bold"
									>{locker.id}</ToggleGroup.Item
								>
							{/if}
						{/each}
					</ToggleGroup.Root>
				</ScrollArea>
			</div>
			<Dialog.Footer>
				{#if grade == '' || lockerNumber == '' || (lockerType == 'partner' && (partnerEmail == '' || partnerName == '' || partnerGrade == ''))}
					<Button disabled>Submit</Button>
				{:else}
					<Button
						type="submit"
						onclick={() => {
							isOpen = false;
						}}>Submit</Button
					>
				{/if}
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
