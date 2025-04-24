import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { partnerLockerRequestFormSchema, singleLockerRequestFormSchema } from '$lib/form-schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		singleForm: await superValidate(zod(singleLockerRequestFormSchema)),
		partnerForm: await superValidate(zod(partnerLockerRequestFormSchema))
	};
};
