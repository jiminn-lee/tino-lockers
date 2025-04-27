import { json, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import {
	singleLockersRequests,
	partnerLockersRequests,
	singleLockers,
	partnerLockers
} from '$lib/server/db/schema/lockers';
import { eq, or, desc } from 'drizzle-orm';
import { singleLockerRequestFormSchema, partnerLockerRequestFormSchema } from '$lib/form-schema';
import { auth } from '$lib/auth/auth';

interface BaseRequest {
	id: number;
	user_id: string;
	status: 'pending' | 'approved' | 'denied';
	date_modified: Date;
	requested_locker_id: string | null;
	comments: string | null;
}

interface SingleLockerRequest extends BaseRequest {
	type: 'single';
	name: string;
	grade: number;
	student_id: string;
}

interface PartnerLockerRequest extends BaseRequest {
	type: 'partner';
	primary_name: string;
	primary_grade: number;
	primary_student_id: string;
	secondary_name: string;
	secondary_grade: number;
	secondary_student_id: string;
}

export async function POST({ request }: RequestEvent) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers
		});
		if (!session) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const data = await request.json();

		if (data.type === 'single') {
			const validationResult = singleLockerRequestFormSchema.safeParse(data);
			if (!validationResult.success) {
				return json(
					{ error: 'Invalid form data', issues: validationResult.error.issues },
					{ status: 400 }
				);
			}

			if (data.requested_locker_id) {
				await db.transaction(async (tx) => {
					await tx.insert(singleLockersRequests).values({
						user_id: session.user.id,
						name: data.name,
						grade: parseInt(data.grade),
						student_id: data.student_id,
						requested_locker_id: data.requested_locker_id,
						status: 'pending',
						date_modified: new Date(),
						comments: null
					});

					await tx
						.update(singleLockers)
						.set({ available: false })
						.where(eq(singleLockers.id, data.requested_locker_id));
				});
			} else {
				await db.insert(singleLockersRequests).values({
					user_id: session.user.id,
					name: data.name,
					grade: parseInt(data.grade),
					student_id: data.student_id,
					requested_locker_id: data.requested_locker_id || null,
					status: 'pending',
					date_modified: new Date(),
					comments: null
				});
			}

			return json({ success: true, message: 'Single locker request submitted' });
		} else if (data.type === 'partner') {
			const validationResult = partnerLockerRequestFormSchema.safeParse(data);
			if (!validationResult.success) {
				return json(
					{ error: 'Invalid form data', issues: validationResult.error.issues },
					{ status: 400 }
				);
			}

			if (data.requested_locker_id) {
				await db.transaction(async (tx) => {
					await tx.insert(partnerLockersRequests).values({
						user_id: session.user.id,
						primary_name: data.primary_name,
						primary_grade: parseInt(data.primary_grade),
						primary_student_id: data.primary_student_id,
						secondary_name: data.secondary_name,
						secondary_grade: parseInt(data.secondary_grade),
						secondary_student_id: data.secondary_student_id,
						requested_locker_id: data.requested_locker_id,
						status: 'pending',
						date_modified: new Date(),
						comments: null
					});

					await tx
						.update(partnerLockers)
						.set({ available: false })
						.where(eq(partnerLockers.id, data.requested_locker_id));
				});
			} else {
				await db.insert(partnerLockersRequests).values({
					user_id: session.user.id,
					primary_name: data.primary_name,
					primary_grade: parseInt(data.primary_grade),
					primary_student_id: data.primary_student_id,
					secondary_name: data.secondary_name,
					secondary_grade: parseInt(data.secondary_grade),
					secondary_student_id: data.secondary_student_id,
					requested_locker_id: data.requested_locker_id || null,
					status: 'pending',
					date_modified: new Date(),
					comments: null
				});
			}

			return json({ success: true, message: 'Partner locker request submitted' });
		}

		return json({ error: 'Invalid request type' }, { status: 400 });
	} catch (error) {
		console.error('Error processing locker request:', error);
		return json({ error: 'Failed to process request' }, { status: 500 });
	}
}

export async function GET({ request }: RequestEvent) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers
		});
		if (!session) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const singleLockerRequests = await db
			.select()
			.from(singleLockersRequests)
			.where(eq(singleLockersRequests.user_id, session.user.id));

		const partnerLockerRequests = await db
			.select()
			.from(partnerLockersRequests)
			.where(eq(partnerLockersRequests.user_id, session.user.id));

		const allRequests = [
			...singleLockerRequests.map((req) => ({ ...req, type: 'single' })),
			...partnerLockerRequests.map((req) => ({ ...req, type: 'partner' }))
		].sort((a, b) => {
			return (
				new Date(b.date_modified ?? new Date()).getTime() -
				new Date(a.date_modified ?? new Date()).getTime()
			);
		});

		const userId = session.user.id;
		const singleLocker = await db
			.select()
			.from(singleLockers)
			.where(eq(singleLockers.user_id, userId));

		const partnerLocker = await db
			.select()
			.from(partnerLockers)
			.where(eq(partnerLockers.user_id, userId));

		return json({
			requests: allRequests,
			lockers: {
				single: singleLocker[0] || null,
				partner: partnerLocker[0] || null
			}
		});
	} catch (error) {
		console.error('Error fetching user data:', error);
		return json({ error: 'Failed to fetch data' }, { status: 500 });
	}
}
