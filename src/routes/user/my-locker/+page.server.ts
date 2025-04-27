import { auth } from '$lib/auth/auth';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../../$types';

export const load: LayoutServerLoad = async ({ request, fetch }) => {
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
