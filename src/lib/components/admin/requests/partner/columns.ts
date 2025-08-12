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
	status: string;
};

export const partnerRequestColumns: ColumnDef<Request>[] = [
	{
		accessorKey: 'id',
		header: 'ID'
	},
	{
		accessorKey: 'primary_name',
		header: () => {
			const snippet = createRawSnippet(() => ({
				render: () => `<div>Primary<br/>Name</div>`
			}));
			return renderSnippet(snippet, '');
		}
	},
	{
		accessorKey: 'primary_grade',
		header: () => {
			const snippet = createRawSnippet(() => ({
				render: () => `<div>Primary<br/>Grade</div>`
			}));
			return renderSnippet(snippet, '');
		}
	},
	{
		accessorKey: 'primary_student_id',
		header: () => {
			const snippet = createRawSnippet(() => ({
				render: () => `<div>Primary<br/>Student ID</div>`
			}));
			return renderSnippet(snippet, '');
		}
	},
	{
		accessorKey: 'secondary_name',
		header: () => {
			const snippet = createRawSnippet(() => ({
				render: () => `<div>Secondary<br/>Name</div>`
			}));
			return renderSnippet(snippet, '');
		}
	},
	{
		accessorKey: 'secondary_grade',
		header: () => {
			const snippet = createRawSnippet(() => ({
				render: () => `<div>Secondary<br/>Grade</div>`
			}));
			return renderSnippet(snippet, '');
		}
	},
	{
		accessorKey: 'secondary_student_id',
		header: () => {
			const snippet = createRawSnippet(() => ({
				render: () => `<div>Secondary<br/>Student ID</div>`
			}));
			return renderSnippet(snippet, '');
		}
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
		header: () => {
			const snippet = createRawSnippet(() => ({
				render: () => `<div>Requested<br/>Locker #</div>`
			}));
			return renderSnippet(snippet, '');
		}
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
