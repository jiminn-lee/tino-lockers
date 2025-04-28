<script>
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import BackButton from '$lib/components/BackButton.svelte';
	import { FilePlus, Question, User, Users } from 'phosphor-svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	let { data } = $props();
</script>

<main class="mt-10 flex flex-col gap-10">
	<BackButton class="ml-10" />
	<div class="flex flex-col items-center">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">My Locker</h1>
		{#if data.myLockerData.requests.length === 0}
			<div class="mb-5 mt-20 text-3xl font-semibold">You haven't requested any locker yet!</div>
			<Button href="/user/request"><FilePlus weight="bold" /> Request a locker</Button>
		{:else}
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
														<p>
															Your locker request is pending review from a school administrator!
														</p>
													{:else if request.status === 'denied'}
														<p>Your locker request has been denied, please request again!</p>
													{:else}
														<p>Your locker request has been approved, this locker is now yours!</p>
													{/if}
												</Tooltip.Content>
											</Tooltip.Root>
										</Tooltip.Provider>
									</div>
									<div class="flex flex-col items-center">
										{#if request.type === 'single'}
											<h2 class="flex items-center gap-2"><User weight="bold" /> Single</h2>
											<h1 class="text-8xl font-semibold">#{request.requested_locker_id}</h1>
											<Separator />
											<div class="mt-5 grid grid-cols-2 gap-x-4 text-muted-foreground">
												<p class="text-right">Full Name:</p>
												<p>{request.name}</p>
												<p class="text-right">Grade:</p>
												<p>{request.grade}</p>
												<p class="text-right">Student ID:</p>
												<p>{request.student_id}</p>
											</div>
										{:else if request.type === 'partner'}
											<h2 class="flex items-center gap-2"><Users weight="bold" /> Partner</h2>
											<h1 class="text-8xl font-semibold">#{request.requested_locker_id}</h1>
											<Separator />
											<div class="mt-5 grid grid-cols-2 gap-x-4 text-muted-foreground">
												<p class="text-right">Your Name:</p>
												<p>{request.primary_name}</p>
												<p class="text-right">Your Grade:</p>
												<p>{request.primary_grade}</p>
												<p class="text-right">Your Student ID:</p>
												<p>{request.primary_student_id}</p>
												<p class="text-right">Partner Name:</p>
												<p>{request.secondary_name}</p>
												<p class="text-right">Partner Grade:</p>
												<p>{request.secondary_grade}</p>
												<p class="text-right">Partner Student ID:</p>
												<p>{request.secondary_student_id}</p>
											</div>
										{/if}
									</div>
									<div>
										{#if request.status === 'denied'}
											<Button href="/user/request"
												><FilePlus weight="bold" /> Request a locker</Button
											>
										{/if}
									</div>
								</Card.Content>
							</Card.Root>
						</Carousel.Item>
					{/each}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
			</Carousel.Root>
		{/if}
	</div>
</main>
