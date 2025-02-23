import { supabase } from '$lib/supabaseClient';

let user = $state(await supabase.auth.getUser());

export function getUser() {
	return user.data.user;
}

export async function signIn() {
	await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: {
			queryParams: 'hd=fuhsd.org'
		}
	});
}

export async function signOut() {
	supabase.auth.signOut();
	user = await supabase.auth.getUser();
}
