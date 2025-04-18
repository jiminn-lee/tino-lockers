import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { singleLockersRequests, partnerLockersRequests } from '$lib/server/db/schema/lockers';
import { eq } from 'drizzle-orm';
import { auth } from '$lib/auth/auth';

const isAdmin = async (request: Request) => {
    const session = await auth.api.getSession({ headers: request.headers });
    return session && session.user && session.user.role === 'admin';
};

export async function GET({ request }: RequestEvent) {
    try {
        if (!await isAdmin(request)) {
            return json({ error: 'Unauthorized access' }, { status: 403 });
        }

        const singleRequests = await db
            .select()
            .from(singleLockersRequests);

        const partnerRequests = await db
            .select()
            .from(partnerLockersRequests);

        return json({
            single: singleRequests,
            partner: partnerRequests
        });
    } catch (error) {
        console.error('Error fetching admin locker requests:', error);
        return json({ error: 'Failed to fetch requests' }, { status: 500 });
    }
}

export async function PUT({ request }: RequestEvent) {
    try {
        if (!await isAdmin(request)) {
            return json({ error: 'Unauthorized access' }, { status: 403 });
        }

        const data = await request.json();
        const { id, type, status, comments } = data;

        if (!id || !type || !status) {
            return json({ error: 'Missing required fields' }, { status: 400 });
        }

        const updateData = {
            status,
            comments: comments || null,
            date_modified: new Date()
        };

        if (type === 'single') {
            await db
                .update(singleLockersRequests)
                .set(updateData)
                .where(eq(singleLockersRequests.id, id));
        } else if (type === 'partner') {
            await db
                .update(partnerLockersRequests)
                .set(updateData)
                .where(eq(partnerLockersRequests.id, id));
        } else {
            return json({ error: 'Invalid locker type' }, { status: 400 });
        }

        return json({
            success: true,
            message: `Locker request ${status}`
        });
    } catch (error) {
        console.error('Error updating locker request:', error);
        return json({ error: 'Failed to process request' }, { status: 500 });
    }
}

/*

do we need delete?

export async function DELETE({ request }: RequestEvent) {
	try {
		if (!await isAdmin(request)) {
			return json({ error: 'Unauthorized access' }, { status: 403 });
		}

		const data = await request.json();
		const { id, type } = data;

		if (!id || !type) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		if (type === 'single') {
			await db.delete(singleLockers).where(eq(singleLockers.id, id));
		} else if (type === 'partner') {
			await db.delete(partnerLockers).where(eq(partnerLockers.id, id));
		} else {
			return json({ error: 'Invalid locker type' }, { status: 400 });
		}

		return json({
			success: true,
			message: 'Locker request deleted'
		});
	} catch (error) {
		console.error('Error deleting locker request:', error);
		return json({ error: 'Failed to delete request' }, { status: 500 });
	}
}

*/