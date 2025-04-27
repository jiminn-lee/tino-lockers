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
		let myLockerData = null;
		const myLockerRes = await fetch('/api/user');
		if (myLockerRes.status === 200) {
			myLockerData = myLockerRes.json();
			return {
				myLockerData: await myLockerData,
				singleForm: await superValidate(zod(singleLockerRequestFormSchema)),
				partnerForm: await superValidate(zod(partnerLockerRequestFormSchema))
			};
		} else {
			error(myLockerRes.status, myLockerRes.statusText);
		}
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
	}
};
