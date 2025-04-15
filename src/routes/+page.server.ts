import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { partnerLockerRequestFormSchema, singleLockerRequestFormSchema } from '$lib/schema';

export const load: PageServerLoad = async () => {
	return {
		singleForm: await superValidate(zod(singleLockerRequestFormSchema)),
		partnerForm: await superValidate(zod(partnerLockerRequestFormSchema))
	};
};
