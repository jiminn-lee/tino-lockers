import { createAuthClient } from 'better-auth/svelte';
import { adminClient } from 'better-auth/client/plugins';
export const authClient = createAuthClient({});

export const { signIn, signUp, useSession } = createAuthClient({
	plugins: [adminClient()]
});
