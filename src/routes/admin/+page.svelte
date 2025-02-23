<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
</script>

<main class="flex h-lvh flex-col items-center justify-center">
	<h1 class="mb-10 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
		<a href="/">Tino Lockers</a>
	</h1>
	<Tabs.Root value="requests" class="w-[400px]">
		<Tabs.List class="grid w-full grid-cols-2">
			<Tabs.Trigger value="requests">Requests</Tabs.Trigger>
			<Tabs.Trigger value="lockers">Lockers</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="requests">
			<Carousel.Root class="ml-auto mr-auto w-full max-w-xs">
				<Carousel.Content>
					{#each Array(5) as _, i (i)}
						<Carousel.Item>
							<div class="p-1">
								<Card.Root>
									<Card.Header><Card.Title>Request #1</Card.Title></Card.Header>
									<Card.Content class="grid gap-2 py-4">
										<div class="grid grid-cols-4 items-center gap-4">
											<Label class="text-right">Name</Label>
											<Input class="col-span-3" disabled value="First Last" />
										</div>
										<div class="grid grid-cols-4 items-center gap-4">
											<Label class="text-right">Email</Label>
											<Input class="col-span-3" disabled value="name@student.fuhsd.org" />
										</div>
										<div class="grid grid-cols-4 items-center gap-4">
											<Label class="text-right">Grade</Label>
											<Input class="col-span-3" disabled value="10" />
										</div>
									</Card.Content>
									<Card.Footer class="flex w-full gap-4">
										<Button class="flex-1">Approve</Button>
										<Button class="flex-1" variant="secondary">Deny</Button>
									</Card.Footer>
								</Card.Root>
							</div>
						</Carousel.Item>
					{/each}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
			</Carousel.Root>
		</Tabs.Content>
		<Tabs.Content value="lockers">
			<Card.Root>
				<Card.Content></Card.Content>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</main>
