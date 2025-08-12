<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { singleRequestColumns } from '$lib/components/admin/requests/single/columns.js';
	import DataTable from '$lib/components/admin/requests/data-table.svelte';
	import { partnerRequestColumns } from '$lib/components/admin/requests/partner/columns.js';
	import { User, Users } from 'phosphor-svelte';

	let { data } = $props();
	let isAcceptingRequests = $state(data.acceptingRequestsData.accepting_responses);
</script>

<main class="mt-10 flex flex-col gap-10">
	<BackButton class="ml-10" />
	<div class="flex flex-col items-center">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Manage Requests</h1>
		<div
			class="bg-card text-card-foreground mt-10 mb-5 flex w-[500px] flex-row items-center justify-between rounded-xl border p-4 shadow-sm"
		>
			<h1 class="leading-none font-semibold">Accepting requests</h1>
			<Switch
				checked={isAcceptingRequests}
				onCheckedChange={async () => {
					fetch('/api/admin', {
						method: 'PUT',
						body: JSON.stringify({
							action: 'toggleAcceptingResponses',
							value: isAcceptingRequests
						}),
						headers: {
							'Content-Type': 'application/json'
						}
					});
					isAcceptingRequests = !isAcceptingRequests;
				}}
			/>
		</div>
		<Tabs.Root value="single" class="w-full px-14 lg:px-28">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="single"><User weight="bold" class="mr-2" /> Single</Tabs.Trigger>
				<Tabs.Trigger value="partner"><Users weight="bold" class="mr-2" />Partner</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="single" class="w-full">
				<DataTable
					data={data.requestsData.single}
					columns={singleRequestColumns}
					fileName="singleRequests"
				/>
			</Tabs.Content>
			<Tabs.Content value="partner" class="w-full">
				<DataTable
					data={data.requestsData.partner}
					columns={partnerRequestColumns}
					fileName="partnerRequests"
				/>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</main>
