import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import DataTableActions from '$lib/components/admin/requests/single/data-table-actions.svelte';
import { createRawSnippet } from 'svelte';

export type Request = {
	id: number;
	name: string;
	grade: number;
	student_id: number;
	date_modified: string;
	requested_locker_id: number;
	status: string;
};

export const singleRequestColumns: ColumnDef<Request>[] = [
	{
		accessorKey: 'id',
		header: 'ID'
	},
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'grade',
		header: 'Grade'
	},
	{
		accessorKey: 'student_id',
		header: 'Student ID'
	},
	{
		accessorKey: 'date_modified',
		header: 'Date, Time',
		cell: ({ row }) => {
			const formatter = new Intl.DateTimeFormat('en-US', {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				timeZone: 'America/Los_Angeles',
				hour: 'numeric',
				minute: '2-digit',
				hour12: true
			});

			const dateCellSnippet = createRawSnippet<[string]>((getDate) => {
				const date = getDate();
				return {
					render: () => `<div>${date}</div>`
				};
			});

			return renderSnippet(
				dateCellSnippet,
				formatter.format(new Date(row.getValue('date_modified')))
			);
		}
	},
	{
		accessorKey: 'requested_locker_id',
		header: 'Requested Locker #'
	},
	{
		header: 'Status',
		id: 'actions',
		cell: ({ row }) => {
			const approvedCellSnippet = createRawSnippet<[string]>(() => {
				return {
					render: () => `<div class="text-green-500">Approved</div>`
				};
			});

			const deniedCellSnippet = createRawSnippet<[string]>(() => {
				return {
					render: () => `<div class="text-red-500">Denied</div>`
				};
			});

			if (row.original.status === 'approved') {
				return renderSnippet(approvedCellSnippet, '');
			} else if (row.original.status === 'denied') {
				return renderSnippet(deniedCellSnippet, '');
			} else {
				return renderComponent(DataTableActions, { id: row.original.id });
			}
		}
	}
];
