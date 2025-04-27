<script>
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import BackButton from '$lib/components/BackButton.svelte';
	import { Question } from 'phosphor-svelte';
	let { data } = $props();

	$inspect(data);
</script>

<main class="mt-10 flex flex-col gap-10">
	<BackButton class="ml-10" />
	<div class="flex flex-col items-center">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">My Locker</h1>
		<Carousel.Root class="w-[400px]">
			<Carousel.Content>
				{#each data.myLockerData.requests as request}
					<Carousel.Item>
						<Card.Root class="mt-10 flex h-[600px] w-[400px] items-center justify-center">
							<Card.Content class="flex h-full w-fit flex-col items-center justify-between">
								<div class="flex items-center gap-2">
									{#if request.status === 'pending'}
										<div class="size-4 rounded-full bg-orange-500"></div>
										<p>Pending</p>
									{:else if request.status === 'denied'}
										<div class="size-4 rounded-full bg-red-500"></div>
										<p>Denied</p>
									{:else}
										<div class="size-4 rounded-full bg-green-500"></div>
										<p>Approved</p>
									{/if}
									<Tooltip.Provider>
										<Tooltip.Root>
											<Tooltip.Trigger
												><Question
													class="text-muted-foreground"
													size={16}
													weight="bold"
												/></Tooltip.Trigger
											>
											<Tooltip.Content class="w-[300px]">
												{#if request.status === 'pending'}
													<p>Your locker request is pending review from a school administrator!</p>
												{:else if request.status === 'denied'}
													<p>Your locker request has been denied!</p>
												{:else}
													<p>Your locker request has been approved!</p>
												{/if}
											</Tooltip.Content>
										</Tooltip.Root>
									</Tooltip.Provider>
								</div>
								<div>
									<h2 class="text-8xl font-semibold">#{request.requested_locker_id}</h2>
									<div class="grid grid-cols-2 gap-x-4 text-muted-foreground">
										<p class="text-right">Full Name:</p>
										<p>{request.name}</p>
										<p class="text-right">Grade:</p>
										<p>{request.grade}</p>
										<p class="text-right">Student ID:</p>
										<p>{request.student_id}</p>
									</div>
								</div>
								<div></div>
							</Card.Content>
						</Card.Root>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>
	</div>
</main>
