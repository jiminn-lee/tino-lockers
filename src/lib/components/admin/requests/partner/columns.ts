import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import DataTableActions from '$lib/components/admin/requests/partner/data-table-actions.svelte';

export type Request = {
	id: number;
	primary_name: string;
	primary_grade: number;
	primary_student_id: number;
	secondary_name: string;
	secondary_grade: number;
	secondary_student_id: number;
	date_modified: string;
	requested_locker_id: number;
};

export const partnerRequestColumns: ColumnDef<Request>[] = [
	{
		accessorKey: 'id',
		header: 'ID'
	},
	{
		accessorKey: 'primary_name',
		header: 'Primary Name'
	},
	{
		accessorKey: 'primary_grade',
		header: 'Primary Grade'
	},
	{
		accessorKey: 'primary_student_id',
		header: 'Primary Student ID'
	},
	{
		accessorKey: 'secondary_name',
		header: 'Secondary Name'
	},
	{
		accessorKey: 'secondary_grade',
		header: 'Secondary Grade'
	},
	{
		accessorKey: 'secondary_student_id',
		header: 'Secondary Student ID'
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
		id: 'actions',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { id: row.original.id });
		}
	}
];
