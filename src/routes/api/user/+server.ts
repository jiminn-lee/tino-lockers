import { json, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { singleLockers, partnerLockers } from '$lib/server/db/schema/lockers';
import { eq } from 'drizzle-orm';
import { singleLockerRequestFormSchema, partnerLockerRequestFormSchema } from '$lib/schema';

declare global {
	namespace App {
		interface Locals {
			session: {
				user: {
					id: string;
				};
			} | null;
		}
	}
}

export async function POST({ request, locals }: RequestEvent) {
	try {
		const session = locals.session;
		if (!session) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const userId = session.user.id;
		const data = await request.json();

		if (data.type === 'single') {
			const validationResult = singleLockerRequestFormSchema.safeParse(data);
			if (!validationResult.success) {
				return json(
					{ error: 'Invalid form data', issues: validationResult.error.issues },
					{ status: 400 }
				);
			}

			await db.insert(singleLockers).values({
				id: data.student_id.toString(),
				user_id: parseInt(userId),
				name: data.name,
				grade: parseInt(data.grade),
				student_id: data.student_id,
				available: false
			});

			return json({ success: true, message: 'Single locker request submitted' });
		} else if (data.type === 'partner') {
			const validationResult = partnerLockerRequestFormSchema.safeParse(data);
			if (!validationResult.success) {
				return json(
					{ error: 'Invalid form data', issues: validationResult.error.issues },
					{ status: 400 }
				);
			}

			await db.insert(partnerLockers).values({
				id: data.primary_student_id.toString(),
				user_id: parseInt(userId),
				primary_name: data.primary_name,
				primary_grade: parseInt(data.primary_grade),
				primary_student_id: data.primary_student_id,
				secondary_name: data.secondary_name,
				secondary_grade: parseInt(data.secondary_grade),
				secondary_student_id: data.secondary_student_id,
				available: false
			});

			return json({ success: true, message: 'Partner locker request submitted' });
		}

		return json({ error: 'Invalid request type' }, { status: 400 });
	} catch (error) {
		console.error('Error processing locker request:', error);
		return json({ error: 'Failed to process request' }, { status: 500 });
	}
}

export async function GET({ locals }: RequestEvent) {
	try {
		const session = locals.session;
		if (!session) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const userId = parseInt(session.user.id);

		const singleLockerRequests = await db
			.select()
			.from(singleLockers)
			.where(eq(singleLockers.user_id, userId));

		const partnerLockerRequests = await db
			.select()
			.from(partnerLockers)
			.where(eq(partnerLockers.user_id, userId));

		return json({
			single: singleLockerRequests,
			partner: partnerLockerRequests
		});
	} catch (error) {
		console.error('Error fetching user locker requests:', error);
		return json({ error: 'Failed to fetch requests' }, { status: 500 });
	}
}
