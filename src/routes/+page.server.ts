import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async () => {
	const { data } = await supabase.from('lockers').select();
	return {
		lockers: data ?? []
	};
};

export const actions = {
	default: async ({ request }) => {
		// const data = await request.formData();
		// console.log(data);
		// if (data.get('lockerType') == 'single') {
		// 	const res = await supabase.from('requests').insert({
		// 		name_primary: data.get('name'),
		// 		email_primary: data.get('email'),
		// 		grade_primary: data.get('grade'),
		// 		locker_number: data.get('lockerNumber'),
		// 		locker_type: data.get('lockerType')
		// 	});
		// } else {
		// 	const res = await supabase.from('requests').insert({
		// 		name_primary: data.get('name'),
		// 		email_primary: data.get('email'),
		// 		grade_primary: data.get('grade'),
		// 		name_secondary: data.get('partnerName'),
		// 		email_secondary: data.get('partnerEmail'),
		// 		grade_secondary: data.get('partnerGrade'),
		// 		locker_number: data.get('lockerNumber'),
		// 		locker_type: data.get('lockerType')
		// 	});
		// }
	}
} satisfies Actions;
