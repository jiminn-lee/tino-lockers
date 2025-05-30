import { pgTable, integer, varchar, boolean, timestamp, text, serial } from 'drizzle-orm/pg-core';

export const singleLockers = pgTable('singleLockers', {
	id: varchar().primaryKey(),
	user_id: varchar(),
	name: varchar(),
	grade: integer(),
	student_id: integer(),
	available: boolean()
});

export const partnerLockers = pgTable('partnerLockers', {
	id: varchar().primaryKey(),
	user_id: varchar(),
	primary_name: varchar(),
	primary_grade: integer(),
	primary_student_id: integer(),
	secondary_name: varchar(),
	secondary_grade: integer(),
	secondary_student_id: integer(),
	available: boolean()
});

export const singleLockersRequests = pgTable('singleLockersRequests', {
	id: serial('id').primaryKey(),
	user_id: varchar(),
	name: varchar(),
	grade: integer(),
	student_id: integer(),
	requested_locker_id: varchar(),
	status: varchar().default('pending'),
	date_modified: timestamp().defaultNow(),
	comments: text()
});

export const partnerLockersRequests = pgTable('partnerLockersRequests', {
	id: serial('id').primaryKey(),
	user_id: varchar(),
	primary_name: varchar(),
	primary_grade: integer(),
	primary_student_id: integer(),
	secondary_name: varchar(),
	secondary_grade: integer(),
	secondary_student_id: integer(),
	requested_locker_id: varchar(),
	status: varchar().default('pending'),
	date_modified: timestamp().defaultNow(),
	comments: text()
});
