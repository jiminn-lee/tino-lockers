import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { auth } from '$lib/auth/auth';

export const load: LayoutServerLoad = async ({ request, fetch }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});
	if (session) {
		let lockersData = null;
		const lockersRes = await fetch('/api/lockers');
		if (lockersRes.status === 200) {
			lockersData = lockersRes.json();
			return {
				lockersData: await lockersData
			};
		} else {
			error(lockersRes.status, lockersRes.statusText);
		}
	}
};
