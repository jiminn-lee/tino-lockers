<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import BackButton from '$lib/components/BackButton.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Check, Eraser, User, Users, X } from 'phosphor-svelte';
	import { cn } from '$lib/utils.js';

	let { data } = $props();
	let selectedTab = $state('single');

	$inspect(data);
</script>

<main class="mt-10 flex flex-col gap-10">
	<BackButton class="ml-10" />
	<div class="flex flex-col items-center">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Manage Lockers</h1>
		<div class="mt-10 flex gap-2">
			<Button
				class="rounded-full"
				variant={selectedTab === 'single' ? 'default' : 'outline'}
				onclick={() => {
					selectedTab = 'single';
				}}><User weight="bold" /> Single</Button
			>
			<Button
				class="rounded-full"
				variant={selectedTab === 'partner' ? 'default' : 'outline'}
				onclick={() => {
					selectedTab = 'partner';
				}}><Users weight="bold" />Partner</Button
			>
		</div>
		<div class="sticky top-0 flex gap-8 rounded-b-3xl bg-zinc-950 p-5">
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
				{#each data.lockersData.singleLockers as locker}
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
								<Dialog.Root>
									<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}
										><X weight="bold" /></Dialog.Trigger
									>
									<Dialog.Content>
										<Dialog.Header>
											<Dialog.Title>Mark locker as unavailable?</Dialog.Title>
											<Dialog.Description>This action cannot be undone.</Dialog.Description>
										</Dialog.Header>
										<Dialog.Footer>
											<Button>Confirm</Button>
											<Button variant="secondary">Cancel</Button>
										</Dialog.Footer>
									</Dialog.Content>
								</Dialog.Root>
							{:else if !locker.available && locker.name && locker.student_id}
								<Dialog.Root>
									<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}
										><Eraser weight="bold" /></Dialog.Trigger
									>
									<Dialog.Content>
										<Dialog.Header>
											<Dialog.Title>Clear locker?</Dialog.Title>
											<Dialog.Description>This action cannot be undone.</Dialog.Description>
										</Dialog.Header>
										<Dialog.Footer>
											<Button>Confirm</Button>
											<Button variant="secondary">Cancel</Button>
										</Dialog.Footer>
									</Dialog.Content>
								</Dialog.Root>
							{:else if !locker.available && locker.name === 'N/A' && !locker.student_id}
								<Dialog.Root>
									<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}
										><Check weight="bold" /></Dialog.Trigger
									>
									<Dialog.Content>
										<Dialog.Header>
											<Dialog.Title>Mark locker as available?</Dialog.Title>
											<Dialog.Description>This action cannot be undone.</Dialog.Description>
										</Dialog.Header>
										<Dialog.Footer>
											<Button>Confirm</Button>
											<Button variant="secondary">Cancel</Button>
										</Dialog.Footer>
									</Dialog.Content>
								</Dialog.Root>
							{/if}
						</Card.Header>
						<Card.Content class="text-xs">
							<p class="text-muted-foreground wrap-anywhere">
								Name: <span class="text-white">{locker.name} </span>
							</p>
							<p class="text-muted-foreground">
								Student ID: <span class="text-white">{locker.student_id}</span>
							</p>
							<p class="text-muted-foreground">
								Grade: <span class="text-white">{locker.grade}</span>
							</p>
						</Card.Content>
					</Card.Root>
				{/each}
			{:else if selectedTab === 'partner'}
				{#each data.lockersData.partnerLockers as locker}
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
								<Dialog.Root>
									<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}
										><X weight="bold" /></Dialog.Trigger
									>
									<Dialog.Content>
										<Dialog.Header>
											<Dialog.Title>Mark locker as unavailable?</Dialog.Title>
											<Dialog.Description>This action cannot be undone.</Dialog.Description>
										</Dialog.Header>
										<Dialog.Footer>
											<Button>Confirm</Button>
											<Button variant="secondary">Cancel</Button>
										</Dialog.Footer>
									</Dialog.Content>
								</Dialog.Root>
							{:else if !locker.available && locker.primary_name && locker.primary_student_id}
								<Dialog.Root>
									<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}
										><Eraser weight="bold" /></Dialog.Trigger
									>
									<Dialog.Content>
										<Dialog.Header>
											<Dialog.Title>Clear locker?</Dialog.Title>
											<Dialog.Description>This action cannot be undone.</Dialog.Description>
										</Dialog.Header>
										<Dialog.Footer>
											<Button>Confirm</Button>
											<Button variant="secondary">Cancel</Button>
										</Dialog.Footer>
									</Dialog.Content>
								</Dialog.Root>
							{:else if !locker.available && locker.primary_name === 'N/A' && !locker.primary_student_id}
								<Dialog.Root>
									<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}
										><Check weight="bold" /></Dialog.Trigger
									>
									<Dialog.Content>
										<Dialog.Header>
											<Dialog.Title>Mark locker as available?</Dialog.Title>
											<Dialog.Description>This action cannot be undone.</Dialog.Description>
										</Dialog.Header>
										<Dialog.Footer>
											<Button>Confirm</Button>
											<Button variant="secondary">Cancel</Button>
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
