import { auth } from '$lib/auth/auth';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, fetch }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});
	if (session) {
		let lockersData = null;
		const lockersRes = await fetch('/api/lockers');
		if (lockersRes.status === 200) {
			lockersData = lockersRes.json();
		} else {
			error(lockersRes.status, lockersRes.statusText);
		}

		return {
			lockersData: await lockersData
		};
	}
};
