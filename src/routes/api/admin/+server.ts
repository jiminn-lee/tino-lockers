import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import {
	singleLockers,
	partnerLockers,
	singleLockersRequests,
	partnerLockersRequests,
	settings
} from '$lib/server/db/schema/lockers';
import { eq, and, isNotNull, desc } from 'drizzle-orm';
import { auth } from '$lib/auth/auth';

const isAdmin = async (request: Request) => {
	const session = await auth.api.getSession({ headers: request.headers });
	return session && session.user && session.user.role === 'admin';
};

export async function GET({ request }: RequestEvent) {
	try {
		if (!(await isAdmin(request))) {
			return json({ error: 'Unauthorized access' }, { status: 403 });
		}

		const singleRequests = await db
			.select()
			.from(singleLockersRequests)
			.orderBy((singleLockersRequests) => desc(singleLockersRequests.date_modified));

		const partnerRequests = await db
			.select()
			.from(partnerLockersRequests)
			.orderBy((partnerLockersRequests) => desc(partnerLockersRequests.date_modified));

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
		if (!(await isAdmin(request))) {
			return json({ error: 'Unauthorized access' }, { status: 403 });
		}

		const data = await request.json();
		const { id, type, status, comments, action, lockerId, value } = data;

		const table =
			type === 'single' ? singleLockers :
			type === 'partner' ? partnerLockers : null;

		/* admin actions */

		if (action) {
			if (!table && action !== 'toggleAcceptingResponses') {
				return json({ error: 'Invalid locker type' }, { status: 400 });
			}


			if (action === 'toggleAcceptingResponses') {
				await db.update(settings).set({ accepting_responses: value === true });
				return json({ success: true, message: `Accepting responses set to ${value}` });
			}

			if (action === 'clearLocker') {
				if (!lockerId) return json({ error: 'Missing lockerId' }, { status: 400 });

				if (type === 'single') {
					await db.update(singleLockers)
						.set({ user_id: null, name: null, grade: null, student_id: null, available: true })
						.where(eq(singleLockers.id, lockerId));
				} else {
					await db.update(partnerLockers)
						.set({
							user_id: null,
							primary_name: null,
							primary_grade: null,
							primary_student_id: null,
							secondary_name: null,
							secondary_grade: null,
							secondary_student_id: null,
							available: true
						})
						.where(eq(partnerLockers.id, lockerId));
				}

				return json({ success: true, message: `Locker ${lockerId} cleared` });
			}

			if (action === 'markUnavailable') {
				if (!lockerId) return json({ error: 'Missing lockerId' }, { status: 400 });

				if (!table) {
					return json({ error: 'Invalid locker type' }, { status: 400 });
				}

				const [locker] = await db.select().from(table!).where(eq(table!.id, lockerId));
				if (!locker) return json({ error: 'Locker not found' }, { status: 404 });

				let hasStudent: boolean;

				if (type === 'single') {
					hasStudent = locker.user_id !== null;
				} else if (type === 'partner') {
					hasStudent = (locker as { primary_name: string | null; secondary_name: string | null }).primary_name !== null 
						|| (locker as { primary_name: string | null; secondary_name: string | null }).secondary_name !== null;
				} else {
					return json({ error: 'Invalid locker type' }, { status: 400 });
				}


				if (hasStudent) {
					return json({ error: 'Locker is occupied, cannot mark unavailable' }, { status: 400 });
				}

				if (type === 'single') {
					await db.update(singleLockers)
						.set({ available: false, name: 'N/A' })
						.where(eq(singleLockers.id, lockerId));
				} else {
					await db.update(partnerLockers)
						.set({ available: false, primary_name: 'N/A', secondary_name: 'N/A' })
						.where(eq(partnerLockers.id, lockerId));
				}

				return json({ success: true, message: `Locker ${lockerId} marked unavailable` });
			}

			if (action === 'markAvailable') {
				if (!lockerId) return json({ error: 'Missing lockerId' }, { status: 400 });

				if (type === 'single') {
					await db.update(singleLockers)
						.set({ available: true, name: null })
						.where(eq(singleLockers.id, lockerId));
				} else {
					await db.update(partnerLockers)
						.set({ available: true, primary_name: null, secondary_name: null })
						.where(eq(partnerLockers.id, lockerId));
				}

				return json({ success: true, message: `Locker ${lockerId} marked available` });
			}

			return json({ error: 'Invalid admin action' }, { status: 400 });
		}

		if (!id || !type || !status) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		const updateData = {
			status,
			comments: comments || null
		};

		if (type === 'single') {
			const [requestData] = await db
				.select()
				.from(singleLockersRequests)
				.where(
					and(
						eq(singleLockersRequests.id, id),
						isNotNull(singleLockersRequests.requested_locker_id)
					)
				);

			if (!requestData || !requestData.requested_locker_id) {
				return json({ error: 'Request not found or no locker specified' }, { status: 404 });
			}

			await db
				.update(singleLockersRequests)
				.set(updateData)
				.where(eq(singleLockersRequests.id, id));

			if (status === 'approved') {
				await db
					.update(singleLockers)
					.set({
						user_id: requestData.user_id,
						name: requestData.name,
						grade: requestData.grade,
						student_id: requestData.student_id,
						available: false
					})
					.where(eq(singleLockers.id, requestData.requested_locker_id));
			} else if (status === 'denied') {
				await db
					.update(singleLockers)
					.set({ available: true })
					.where(eq(singleLockers.id, requestData.requested_locker_id));
			}
		} else if (type === 'partner') {
			const [requestData] = await db
				.select()
				.from(partnerLockersRequests)
				.where(
					and(
						eq(partnerLockersRequests.id, id),
						isNotNull(partnerLockersRequests.requested_locker_id)
					)
				);

			if (!requestData || !requestData.requested_locker_id) {
				return json({ error: 'Request not found or no locker specified' }, { status: 404 });
			}

			await db
				.update(partnerLockersRequests)
				.set(updateData)
				.where(eq(partnerLockersRequests.id, id));

			if (status === 'approved') {
				await db
					.update(partnerLockers)
					.set({
						user_id: requestData.user_id,
						primary_name: requestData.primary_name,
						primary_grade: requestData.primary_grade,
						primary_student_id: requestData.primary_student_id,
						secondary_name: requestData.secondary_name,
						secondary_grade: requestData.secondary_grade,
						secondary_student_id: requestData.secondary_student_id,
						available: false
					})
					.where(eq(partnerLockers.id, requestData.requested_locker_id));
			} else if (status === 'denied') {
				await db
					.update(partnerLockers)
					.set({ available: true })
					.where(eq(partnerLockers.id, requestData.requested_locker_id));
			}
		} else {
			return json({ error: 'Invalid locker type' }, { status: 400 });
		}

		return json({ success: true, message: `Locker request ${status}` });

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
