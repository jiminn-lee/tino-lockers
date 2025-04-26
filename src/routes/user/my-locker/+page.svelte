<script>
	import { Button } from '$lib/components/ui/button';
	import { CircleArrowLeft, CircleHelp, CirclePlus } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	let { data } = $props();
</script>

<main class="mt-10 flex flex-col gap-10">
	<a href="/" class="ml-10">
		<p class="flex items-center gap-2 text-muted-foreground hover:underline">
			<CircleArrowLeft size={20} />Back
		</p>
	</a>
	<div class="flex flex-col items-center">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">My Locker</h1>
		<Card.Root class="mt-10 flex aspect-square w-[400px] items-center justify-center">
			<Card.Content class="flex h-full w-fit flex-col items-center justify-between">
				<div class="flex items-center gap-2">
					<div class="size-4 rounded-full bg-orange-500"></div>
					<p>Pending</p>
					<Tooltip.Provider>
						<Tooltip.Root>
							<Tooltip.Trigger
								><CircleHelp class="text-muted-foreground" size={16} /></Tooltip.Trigger
							>
							<Tooltip.Content>
								<p>Your locker request is awaiting review from a school administrator!</p>
							</Tooltip.Content>
						</Tooltip.Root>
					</Tooltip.Provider>
				</div>
				<div>
					<h2 class="text-8xl font-semibold">#514</h2>
					<div class="grid grid-cols-2 gap-x-4 text-muted-foreground">
						<p class="text-right">Full Name:</p>
						<p>Jimin Lee</p>
						<p class="text-right">Grade:</p>
						<p>11</p>
						<p class="text-right">Student ID:</p>
						<p>5221132</p>
					</div>
				</div>
				<div></div>
			</Card.Content>
		</Card.Root>
	</div>
</main>
