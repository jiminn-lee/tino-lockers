import { json, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { partnerLockers, singleLockers } from '$lib/server/db/schema/lockers';
import { auth } from '$lib/auth/auth';

export async function GET({ request }: RequestEvent) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const singleLockersResult = await db
      .select()
      .from(singleLockers)
      .orderBy(singleLockers.id);

    const partnerLockersResult = await db
      .select()
      .from(partnerLockers)
      .orderBy(partnerLockers.id);

    return json({
      singleLockers: singleLockersResult,
      partnerLockers: partnerLockersResult
    });
  } catch (error) {
    console.error('Error fetching user locker requests:', error);
    return json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}
