import { auth } from '$lib/auth/auth';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../../$types';

export const load: LayoutServerLoad = async ({ request, fetch }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});
	if (session && session.user.role === 'admin') {
		let requestsData = null;
		const requestsRes = await fetch('/api/admin');
		if (requestsRes.status === 200) {
			requestsData = requestsRes.json();
			return requestsData;
		} else {
			error(requestsRes.status, requestsRes.statusText);
		}
	}
};
