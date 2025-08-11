import type { PageServerLoad } from './$types';
import { superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { partnerLockerRequestFormSchema, singleLockerRequestFormSchema } from '$lib/form-schema';
import { error } from 'console';
import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/auth/auth';

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

		let myLockerData = null;
		const myLockerRes = await fetch('/api/user');
		if (myLockerRes.status === 200) {
			myLockerData = myLockerRes.json();
		} else {
			error(myLockerRes.status, myLockerRes.statusText);
		}

		let acceptingRequestsData = null;
		const acceptingRequestsRes = await fetch('/api/user?accepting=true');
		if (acceptingRequestsRes.status === 200) {
			acceptingRequestsData = acceptingRequestsRes.json();
		} else {
			error(acceptingRequestsRes.status, acceptingRequestsRes.statusText);
		}

		return {
			lockersData: await lockersData,
			myLockerData: await myLockerData,
			singleForm: await superValidate(zod(singleLockerRequestFormSchema)),
			partnerForm: await superValidate(zod(partnerLockerRequestFormSchema)),
			acceptingRequestsData: await acceptingRequestsData
		};
	}
};

export const actions = {
	requestSingleLocker: async ({ fetch, request }) => {
		const form = await superValidate(request, zod(singleLockerRequestFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const requestSingleLockerRes = await fetch('/api/user', {
			method: 'POST',
			body: JSON.stringify({
				type: 'single',
				name: form.data!.name,
				grade: form.data!.grade,
				student_id: form.data!.student_id,
				requested_locker_id: form.data!.requested_locker_id
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (requestSingleLockerRes.status === 200) {
			redirect(307, '/user/my-locker');
		} else {
			return error(requestSingleLockerRes.status, requestSingleLockerRes.statusText);
		}
	},
	requestPartnerLocker: async ({ fetch, request }) => {
		const form = await superValidate(request, zod(partnerLockerRequestFormSchema));

		if (!form.valid) {
			console.log(form);
			return fail(400, { form });
		}

		const requestPartnerLockerRes = await fetch('/api/user', {
			method: 'POST',
			body: JSON.stringify({
				type: 'partner',
				primary_name: form.data!.primary_name,
				primary_grade: form.data!.primary_grade,
				primary_student_id: form.data!.primary_student_id,
				secondary_name: form.data!.secondary_name,
				secondary_grade: form.data!.secondary_grade,
				secondary_student_id: form.data!.secondary_student_id,
				requested_locker_id: form.data!.requested_locker_id
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (requestPartnerLockerRes.status === 200) {
			redirect(307, '/user/my-locker');
		} else {
			return error(requestPartnerLockerRes.status, requestPartnerLockerRes.statusText);
		}
	}
};
