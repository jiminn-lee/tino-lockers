import { auth } from '$lib/auth/auth';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, fetch }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});
	if (session) {
		let myLockerData = null;
		const myLockerRes = await fetch('/api/user');
		if (myLockerRes.status === 200) {
			myLockerData = myLockerRes.json();
			return {
				myLockerData: await myLockerData
			};
		} else {
			error(myLockerRes.status, myLockerRes.statusText);
		}
	}
};
