<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import BackButton from '$lib/components/BackButton.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Check, DownloadSimple, Eraser, User, Users, X } from 'phosphor-svelte';
	import { invalidateAll } from '$app/navigation';
	import { downloadCSV } from '$lib/csv';

	let { data } = $props();
	let selectedTab = $state('single');
	let isSingleLockerDialogOpen: boolean[] = $state(data.lockersData.singleLockers.map(() => false));
	let isPartnerLockerDialogOpen: boolean[] = $state(
		data.lockersData.partnerLockers.map(() => false)
	);
</script>

<main class="mt-10 flex flex-col gap-10">
	<BackButton class="ml-10" />
	<div class="flex flex-col items-center">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Manage Lockers</h1>
		<div class="mt-10 flex gap-6">
			<div class="flex gap-1">
				<Button
					class="rounded-full"
					variant={selectedTab === 'single' ? 'default' : 'outline'}
					onclick={() => {
						selectedTab = 'single';
					}}
					><User weight="bold" /> Single
				</Button>
				<Button
					size="icon"
					variant="secondary"
					class="rounded-full"
					onclick={() => {
						downloadCSV(data.lockersData.singleLockers, 'singleLockers');
					}}><DownloadSimple weight="bold" /></Button
				>
			</div>
			<div class="flex gap-1">
				<Button
					class="rounded-full"
					variant={selectedTab === 'partner' ? 'default' : 'outline'}
					onclick={() => {
						selectedTab = 'partner';
					}}><Users weight="bold" />Partner</Button
				>
				<Button
					size="icon"
					variant="secondary"
					class="rounded-full"
					onclick={() => {
						downloadCSV(data.lockersData.partnerLockers, 'partnerLockers');
					}}><DownloadSimple weight="bold" /></Button
				>
			</div>
		</div>
		<div
			class="sticky top-0 flex flex-wrap justify-center gap-x-8 gap-y-4 rounded-b-3xl dark:bg-zinc-950 p-5"
		>
			<div class="text-muted-foreground flex items-center text-sm">
				<div class="mr-2 size-4 rounded-full bg-green-900"></div>
				Vacant
			</div>
			<div class="text-muted-foreground flex items-center text-sm">
				<div class="mr-2 size-4 rounded-full bg-yellow-900"></div>
				Pending
			</div>
			<div class="text-muted-foreground flex items-center text-sm">
				<div class="mr-2 size-4 rounded-full bg-red-900"></div>
				Occupied
			</div>
			<div class="text-muted-foreground flex items-center text-sm">
				<div class="bg-grey-900 mr-2 size-4 rounded-full outline-1"></div>
				Unavailable/Broken
			</div>
		</div>
		<div class="mb-5 flex flex-wrap justify-center gap-4">
			{#if selectedTab === 'single'}
				{#each data.lockersData.singleLockers as locker, index}
					<Card.Root
						class={locker.available
							? 'aspect-square size-[180px] border-green-900'
							: !locker.available && !locker.name && !locker.student_id
								? 'aspect-square size-[180px] border-yellow-900'
								: !locker.available && locker.name === 'N/A' && !locker.student_id
									? 'aspect-square size-[180px] bg-zinc-950'
									: !locker.available
										? 'aspect-square size-[180px] border-red-900'
										: ''}
					>
						<Card.Header class="flex justify-between">
							<Card.Title class="text-3xl">{locker.id}</Card.Title>
							{#if locker.available}
								<Dialog.Root bind:open={isSingleLockerDialogOpen[index]}>
									<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}
										><X weight="bold" /></Dialog.Trigger
									>
									<Dialog.Content>
										<Dialog.Header>
											<Dialog.Title>Mark locker as unavailable/broken?</Dialog.Title>
										</Dialog.Header>
										<Dialog.Footer>
											<Button
												onclick={async () => {
													fetch('/api/admin', {
														method: 'PUT',
														body: JSON.stringify({
															action: 'markUnavailable',
															lockerId: locker.id,
															type: 'single'
														}),
														headers: {
															'Content-Type': 'application/json'
														}
													});
													isSingleLockerDialogOpen[index] = false;
													invalidateAll();
												}}>Confirm</Button
											>
											<Button
												variant="secondary"
												onclick={() => {
													isSingleLockerDialogOpen[index] = false;
												}}>Cancel</Button
											>
										</Dialog.Footer>
									</Dialog.Content>
								</Dialog.Root>
							{:else if !locker.available && locker.name && locker.student_id}
								<Dialog.Root bind:open={isSingleLockerDialogOpen[index]}>
									<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}
										><Eraser weight="bold" /></Dialog.Trigger
									>
									<Dialog.Content>
										<Dialog.Header>
											<Dialog.Title>Clear locker?</Dialog.Title>
											<Dialog.Description
												>This action cannot be undone. This will clear all student data and mark the
												locker as vacant.</Dialog.Description
											>
										</Dialog.Header>
										<Dialog.Footer>
											<Button
												onclick={async () => {
													fetch('/api/admin', {
														method: 'PUT',
														body: JSON.stringify({
															action: 'clearLocker',
															lockerId: locker.id,
															type: 'single'
														}),
														headers: {
															'Content-Type': 'application/json'
														}
													});
													isSingleLockerDialogOpen[index] = false;
													invalidateAll();
												}}>Confirm</Button
											>
											<Button
												variant="secondary"
												onclick={() => {
													isSingleLockerDialogOpen[index] = false;
												}}>Cancel</Button
											>
										</Dialog.Footer>
									</Dialog.Content>
								</Dialog.Root>
							{:else if !locker.available && locker.name === 'N/A' && !locker.student_id}
								<Dialog.Root bind:open={isSingleLockerDialogOpen[index]}>
									<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}
										><Check weight="bold" /></Dialog.Trigger
									>
									<Dialog.Content>
										<Dialog.Header>
											<Dialog.Title>Mark locker as available?</Dialog.Title>
										</Dialog.Header>
										<Dialog.Footer>
											<Button
												onclick={async () => {
													fetch('/api/admin', {
														method: 'PUT',
														body: JSON.stringify({
															action: 'markAvailable',
															lockerId: locker.id,
															type: 'single'
														}),
														headers: {
															'Content-Type': 'application/json'
														}
													});
													isSingleLockerDialogOpen[index] = false;
													invalidateAll();
												}}>Confirm</Button
											>
											<Button
												variant="secondary"
												onclick={() => {
													isSingleLockerDialogOpen[index] = false;
												}}>Cancel</Button
											>
										</Dialog.Footer>
									</Dialog.Content>
								</Dialog.Root>
							{/if}
						</Card.Header>
						<Card.Content class="text-xs">
							<p class="text-muted-foreground wrap-anywhere">
								Name: <span class="text-black dark:text-white">{locker.name} </span>
							</p>
							<p class="text-muted-foreground">
								Student ID: <span class="text-black dark:text-white">{locker.student_id}</span>
							</p>
							<p class="text-muted-foreground">
								Grade: <span class="text-black dark:text-white">{locker.grade}</span>
							</p>
						</Card.Content>
					</Card.Root>
				{/each}
			{:else if selectedTab === 'partner'}
				{#each data.lockersData.partnerLockers as locker, index}
					<Card.Root
						class={locker.available
							? 'h-[280px] w-[180px] border-green-900'
							: !locker.available && !locker.primary_name && !locker.primary_student_id
								? 'h-[280px] w-[180px] border-yellow-900'
								: !locker.available && locker.primary_name === 'N/A' && !locker.primary_student_id
									? 'h-[280px] w-[180px] bg-zinc-950'
									: !locker.available
										? 'h-[280px] w-[180px] border-red-900'
										: ''}
					>
						<Card.Header class="flex justify-between">
							<Card.Title class="text-3xl">{locker.id}</Card.Title>
							{#if locker.available}
								<Dialog.Root bind:open={isPartnerLockerDialogOpen[index]}>
									<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}
										><X weight="bold" /></Dialog.Trigger
									>
									<Dialog.Content>
										<Dialog.Header>
											<Dialog.Title>Mark locker as unavailable/broken?</Dialog.Title>
										</Dialog.Header>
										<Dialog.Footer>
											<Button
												onclick={async () => {
													fetch('/api/admin', {
														method: 'PUT',
														body: JSON.stringify({
															action: 'markUnavailable',
															lockerId: locker.id,
															type: 'partner'
														}),
														headers: {
															'Content-Type': 'application/json'
														}
													});
													isPartnerLockerDialogOpen[index] = false;
													invalidateAll();
												}}>Confirm</Button
											>
											<Button
												variant="secondary"
												onclick={() => {
													isPartnerLockerDialogOpen[index] = false;
												}}>Cancel</Button
											>
										</Dialog.Footer>
									</Dialog.Content>
								</Dialog.Root>
							{:else if !locker.available && locker.primary_name && locker.primary_student_id}
								<Dialog.Root bind:open={isPartnerLockerDialogOpen[index]}>
									<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}
										><Eraser weight="bold" /></Dialog.Trigger
									>
									<Dialog.Content>
										<Dialog.Header>
											<Dialog.Title>Clear locker?</Dialog.Title>
											<Dialog.Description
												>This action cannot be undone. This will clear all student data and mark the
												locker as vacant.</Dialog.Description
											>
										</Dialog.Header>
										<Dialog.Footer>
											<Button
												onclick={async () => {
													fetch('/api/admin', {
														method: 'PUT',
														body: JSON.stringify({
															action: 'clearLocker',
															lockerId: locker.id,
															type: 'partner'
														}),
														headers: {
															'Content-Type': 'application/json'
														}
													});
													isPartnerLockerDialogOpen[index] = false;
													invalidateAll();
												}}>Confirm</Button
											>
											<Button
												variant="secondary"
												onclick={() => {
													isPartnerLockerDialogOpen[index] = false;
												}}>Cancel</Button
											>
										</Dialog.Footer>
									</Dialog.Content>
								</Dialog.Root>
							{:else if !locker.available && locker.primary_name === 'N/A' && !locker.primary_student_id}
								<Dialog.Root bind:open={isPartnerLockerDialogOpen[index]}>
									<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}
										><Check weight="bold" /></Dialog.Trigger
									>
									<Dialog.Content>
										<Dialog.Header>
											<Dialog.Title>Mark locker as available?</Dialog.Title>
										</Dialog.Header>
										<Dialog.Footer>
											<Button
												onclick={async () => {
													fetch('/api/admin', {
														method: 'PUT',
														body: JSON.stringify({
															action: 'markAvailable',
															lockerId: locker.id,
															type: 'partner'
														}),
														headers: {
															'Content-Type': 'application/json'
														}
													});
													isPartnerLockerDialogOpen[index] = false;
													invalidateAll();
												}}>Confirm</Button
											>
											<Button
												variant="secondary"
												onclick={() => {
													isPartnerLockerDialogOpen[index] = false;
												}}>Cancel</Button
											>
										</Dialog.Footer>
									</Dialog.Content>
								</Dialog.Root>
							{/if}
						</Card.Header>
						<Card.Content class="text-xs">
							<p class="text-muted-foreground wrap-anywhere">
								Name: <span class="text-white">{locker.primary_name}</span>
							</p>
							<p class="text-muted-foreground">
								Student ID: <span class="text-white">{locker.primary_student_id}</span>
							</p>
							<p class="text-muted-foreground">
								Grade: <span class="text-white">{locker.primary_grade}</span>
							</p>
							<br />
							<p class="text-muted-foreground wrap-anywhere">
								Name: <span class="text-white">{locker.secondary_name}</span>
							</p>
							<p class="text-muted-foreground">
								Student ID: <span class="text-white">{locker.secondary_student_id}</span>
							</p>
							<p class="text-muted-foreground">
								Grade: <span class="text-white">{locker.secondary_grade}</span>
							</p>
						</Card.Content>
					</Card.Root>
				{/each}
			{/if}
		</div>
	</div>
</main>
