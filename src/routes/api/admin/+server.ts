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

import { user as usersTable } from '$lib/server/db/schema/auth';
import { eq, and, isNotNull, desc, inArray, ne } from 'drizzle-orm';
import { auth } from '$lib/auth/auth';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_PASS
	}
});

async function sendEmail(to: string, subject: string, text: string, html?: string) {
	const mailOptions = {
		from: `Tino Lockers <${process.env.GMAIL_USER}>`,
		to,
		subject,
		text,
		html
	};
	return transporter.sendMail(mailOptions);
}

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
		const { id, type, status, comments, action, lockerId: adminLockerId, value } = data;

		const table = type === 'single' ? singleLockers : type === 'partner' ? partnerLockers : null;

		/* admin actions */

		if (action) {
			if (!table && action !== 'toggleAcceptingResponses') {
				return json({ error: 'Invalid locker type' }, { status: 400 });
			}

			if (action === 'toggleAcceptingResponses') {
				await db.update(settings).set({ accepting_responses: !value });
				return json({ success: true, message: `Accepting responses set to ${value}` });
			}

			if (action === 'clearLocker') {
				if (!adminLockerId) return json({ error: 'Missing lockerId' }, { status: 400 });

				await db.transaction(async (tx) => {
					if (type === 'single') {
						await tx
							.update(singleLockers)
							.set({ user_id: null, name: null, grade: null, student_id: null, available: true })
							.where(eq(singleLockers.id, adminLockerId));
						await tx
							.delete(singleLockersRequests)
							.where(
								and(
									eq(singleLockersRequests.requested_locker_id, adminLockerId),
									eq(singleLockersRequests.status, 'approved')
								)
							);
					} else {
						await tx
							.update(partnerLockers)
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
							.where(eq(partnerLockers.id, adminLockerId));
						await tx
							.delete(partnerLockersRequests)
							.where(
								and(
									eq(partnerLockersRequests.requested_locker_id, adminLockerId),
									eq(partnerLockersRequests.status, 'approved')
								)
							);
					}
				});

				return json({ success: true, message: `Locker ${adminLockerId} cleared` });
			}

			if (action === 'markUnavailable') {
				if (!adminLockerId) return json({ error: 'Missing lockerId' }, { status: 400 });

				if (!table) {
					return json({ error: 'Invalid locker type' }, { status: 400 });
				}

				const [locker] = await db.select().from(table!).where(eq(table!.id, adminLockerId));
				if (!locker) return json({ error: 'Locker not found' }, { status: 404 });

				let hasStudent: boolean;

				if (type === 'single') {
					hasStudent = locker.user_id !== null;
				} else if (type === 'partner') {
					hasStudent =
						(locker as { primary_name: string | null; secondary_name: string | null })
							.primary_name !== null ||
						(locker as { primary_name: string | null; secondary_name: string | null })
							.secondary_name !== null;
				} else {
					return json({ error: 'Invalid locker type' }, { status: 400 });
				}

				if (hasStudent) {
					return json({ error: 'Locker is occupied, cannot mark unavailable' }, { status: 400 });
				}

				if (type === 'single') {
					await db
						.update(singleLockers)
						.set({ available: false, name: 'N/A' })
						.where(eq(singleLockers.id, adminLockerId));
				} else {
					await db
						.update(partnerLockers)
						.set({ available: false, primary_name: 'N/A', secondary_name: 'N/A' })
						.where(eq(partnerLockers.id, adminLockerId));
				}

				return json({ success: true, message: `Locker ${adminLockerId} marked unavailable` });
			}

			if (action === 'markAvailable') {
				if (!adminLockerId) return json({ error: 'Missing lockerId' }, { status: 400 });

				if (type === 'single') {
					await db
						.update(singleLockers)
						.set({ available: true, name: null })
						.where(eq(singleLockers.id, adminLockerId));
				} else {
					await db
						.update(partnerLockers)
						.set({ available: true, primary_name: null, secondary_name: null })
						.where(eq(partnerLockers.id, adminLockerId));
				}

				return json({ success: true, message: `Locker ${adminLockerId} marked available` });
			}

			return json({ error: 'Invalid admin action' }, { status: 400 });
		}

		if (!id || !type || !status) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		
		await db.transaction(async (tx) => {
			const updateData = {
				status,
				comments: comments || null
			};

			let requestData;
			let userEmail;

			if (type === 'single') {
				[requestData] = await tx
					.select()
					.from(singleLockersRequests)
					.where(
						and(
							eq(singleLockersRequests.id, id),
							isNotNull(singleLockersRequests.requested_locker_id)
						)
					);

				if (!requestData || !requestData.requested_locker_id) {
					throw new Error('Request not found or no locker specified');
				}

				const lockerId = requestData.requested_locker_id;

			
				await tx
					.update(singleLockersRequests)
					.set(updateData)
					.where(eq(singleLockersRequests.id, id));

				if (status === 'approved') {
					await tx
						.update(singleLockers)
						.set({
							user_id: requestData.user_id,
							name: requestData.name,
							grade: requestData.grade,
							student_id: requestData.student_id,
							available: false
						})
						.where(eq(singleLockers.id, lockerId));
				} else if (status === 'denied') {
					
					const otherApprovedRequests = await tx
						.select()
						.from(singleLockersRequests)
						.where(
							and(
								eq(singleLockersRequests.requested_locker_id, lockerId),
								eq(singleLockersRequests.status, 'approved'),
								ne(singleLockersRequests.id, id) 
							)
						);

					
					if (otherApprovedRequests.length === 0) {
						await tx
							.update(singleLockers)
							.set({ available: true })
							.where(eq(singleLockers.id, lockerId));
					}
				}

				if (requestData.user_id) {
					const [userRecord] = await tx
						.select()
						.from(usersTable)
						.where(requestData.user_id ? eq(usersTable.id, requestData.user_id) : undefined);
					userEmail = userRecord?.email;
				}
			} else if (type === 'partner') {
				[requestData] = await tx
					.select()
					.from(partnerLockersRequests)
					.where(
						and(
							eq(partnerLockersRequests.id, id),
							isNotNull(partnerLockersRequests.requested_locker_id)
						)
					);

				if (!requestData || !requestData.requested_locker_id) {
					throw new Error('Request not found or no locker specified');
				}

				const lockerId = requestData.requested_locker_id;

				
				await tx
					.update(partnerLockersRequests)
					.set(updateData)
					.where(eq(partnerLockersRequests.id, id));

				if (status === 'approved') {
					await tx
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
						.where(eq(partnerLockers.id, lockerId));
				} else if (status === 'denied') {
				
					const otherApprovedRequests = await tx
						.select()
						.from(partnerLockersRequests)
						.where(
							and(
								eq(partnerLockersRequests.requested_locker_id, lockerId),
								eq(partnerLockersRequests.status, 'approved'),
								ne(partnerLockersRequests.id, id) // Exclude current request
							)
						);

				
					if (otherApprovedRequests.length === 0) {
						await tx
							.update(partnerLockers)
							.set({ available: true })
							.where(eq(partnerLockers.id, lockerId));
					}
				}

				const [userRecord] = requestData.user_id ? await tx
					.select()
					.from(usersTable)
					.where(eq(usersTable.id, requestData.user_id)) : [];
				userEmail = userRecord?.email;
			} else {
				throw new Error('Invalid locker type');
			}

			
			if (userEmail) {
				const subject = `Locker Request ${status.charAt(0).toUpperCase() + status.slice(1)}`;
				const message = `Hello,

This is an automatically generated email.
Your locker request has been ${status}.

${comments ? `Comments from admin: ${comments}` : ''}


Thank you,
Tino Lockers`;

				await sendEmail(userEmail, subject, message);
			}
		});

		return json({ success: true, message: `Locker request ${status}` });
	} catch (error) {
		console.error('Error updating locker request:', error);
		const errorMessage = error instanceof Error ? error.message : 'Failed to process request';
		return json({ error: errorMessage }, { status: 500 });
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