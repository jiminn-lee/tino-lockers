<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { singleRequestColumns } from '$lib/components/admin/requests/single/columns.js';
	import DataTable from '$lib/components/admin/requests/data-table.svelte';
	import { partnerRequestColumns } from '$lib/components/admin/requests/partner/columns.js';
	import { User, Users } from 'phosphor-svelte';

	let { data } = $props();
</script>

<main class="mt-10 flex flex-col gap-10">
	<BackButton class="ml-10" />
	<div class="flex flex-col items-center">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Manage Requests</h1>
		<Tabs.Root value="single" class="mt-10">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="single"><User weight="bold" class="mr-2" /> Single</Tabs.Trigger>
				<Tabs.Trigger value="partner"><Users weight="bold" class="mr-2" />Partner</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="single">
				<DataTable data={data.requestsData.single} columns={singleRequestColumns} />
			</Tabs.Content>
			<Tabs.Content value="partner">
				<DataTable data={data.requestsData.partner} columns={partnerRequestColumns} />
			</Tabs.Content>
		</Tabs.Root>
	</div>
</main>
