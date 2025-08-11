import { auth } from '$lib/auth/auth';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, fetch }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});
	if (session && session.user.role === 'admin') {
		let requestsData = null;
		const requestsRes = await fetch('/api/admin');
		if (requestsRes.status === 200) {
			requestsData = requestsRes.json();
		} else {
			error(requestsRes.status, requestsRes.statusText);
		}

		let acceptingRequestsData = null;
		const acceptingRequestsRes = await fetch('/api/user?accepting=true');
		if (acceptingRequestsRes.status === 200) {
			acceptingRequestsData = acceptingRequestsRes.json();
		} else {
			error(acceptingRequestsRes.status, acceptingRequestsRes.statusText);
		}
		return {
			requestsData: await requestsData,
			acceptingRequestsData: await acceptingRequestsData
		};
	}
};
