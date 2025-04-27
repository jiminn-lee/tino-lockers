<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { singleRequestColumns } from '$lib/components/admin/requests/single/columns.js';
	import DataTable from '$lib/components/admin/requests/single/data-table.svelte';

	let { data } = $props();
	$inspect(data);
</script>

<main class="mt-10 flex flex-col gap-10">
	<BackButton class="ml-10" />
	<div class="flex flex-col items-center">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Requests</h1>
		<Tabs.Root value="single" class="mt-10 w-[800px]">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="single">Single</Tabs.Trigger>
				<Tabs.Trigger value="partner">Partner</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="single"
				><DataTable data={data.single} columns={singleRequestColumns} /></Tabs.Content
			>
			<Tabs.Content value="partner">Change your password here.</Tabs.Content>
		</Tabs.Root>
	</div>
</main>
