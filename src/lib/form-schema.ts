import { z } from 'zod';

export const singleLockerRequestFormSchema = z.object({
	name: z.string().min(1, { message: 'Full name is required' }).max(50),
	grade: z.enum(['9', '10', '11', '12']),
	student_id: z
		.number({ invalid_type_error: 'Student ID must be a number' })
		.min(1000000, { message: 'Student ID must be 7 digits' })
		.max(9999999, { message: 'Student ID must be 7 digits' }),
	requested_locker_id: z.number().min(1)
});
export type SingleLockerRequestFormSchema = typeof singleLockerRequestFormSchema;

export const partnerLockerRequestFormSchema = z.object({
	primary_name: z.string().min(1, { message: 'Your full name is required' }).max(50),
	primary_grade: z.enum(['9', '10', '11', '12']),
	primary_student_id: z
		.number({ invalid_type_error: 'Student ID must be a number' })
		.min(1000000, { message: 'Student ID must be 7 digits' })
		.max(9999999, { message: 'Student ID must be 7 digits' }),
	secondary_name: z.string().min(1, { message: 'Partner full name is required' }).max(50),
	secondary_grade: z.enum(['9', '10', '11', '12']),
	secondary_student_id: z
		.number({ invalid_type_error: 'Student ID must be a number' })
		.min(1000000, { message: 'Student ID must be 7 digits' })
		.max(9999999, { message: 'Student ID must be 7 digits' }),
	requested_locker_id: z.number().min(1)
});
export type PartnerLockerRequestFormSchema = typeof partnerLockerRequestFormSchema;
