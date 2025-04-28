import { json, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { partnerLockers, singleLockers } from '$lib/server/db/schema/lockers';
import { auth } from '$lib/auth/auth';
import { sql } from 'drizzle-orm';

export async function GET({ request }: RequestEvent) {
    try {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const singleLockersResult = await db
            .select()
            .from(singleLockers)
            .orderBy(sql`LPAD(regexp_replace(${singleLockers.id}, '[^0-9]', '', 'g'), 4, '0'), ${singleLockers.id}`);

        const partnerLockersResult = await db
            .select()
            .from(partnerLockers)
            .orderBy(sql`LPAD(regexp_replace(${partnerLockers.id}, '[^0-9]', '', 'g'), 4, '0'), ${partnerLockers.id}`);

        return json({
            singleLockers: singleLockersResult,
            partnerLockers: partnerLockersResult
        });
    } catch (error) {
        console.error('Error fetching user locker requests:', error);
        return json({ error: 'Failed to fetch requests' }, { status: 500 });
    }
}
