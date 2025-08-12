import { json2csv } from 'json-2-csv';

export function downloadCSV(data: object[], filename: string) {
	const csv = json2csv(data);
	const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);

	const today = new Date()
		.toLocaleString('en-US', {
			timeZone: 'America/Los_Angeles'
		})
		.replaceAll('/', '-')
		.replace(', ', ' at ')
		.replaceAll(':', '-');

	const a = document.createElement('a');
	a.href = url;
	a.download = filename + ' ' + today + '.csv';
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}
