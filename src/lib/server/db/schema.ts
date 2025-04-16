import { pgTable, serial, integer, varchar, boolean } from 'drizzle-orm/pg-core';

export const singleLockers = pgTable('singleLockers', {
	id: serial('id').primaryKey(),
	user_id: integer(),
	name: varchar(),
	grade: integer(),
	student_id: integer(),
	available: boolean()
});

export const partnerLockers = pgTable('partnerLockers', {
	id: serial('id').primaryKey(),
	user_id: integer(),
	primary_name: varchar(),
	primary_grade: integer(),
	primary_student_id: integer(),
	secondary_name: varchar(),
	secondary_grade: integer(),
	secondary_student_id: integer(),
	available: boolean()
});
