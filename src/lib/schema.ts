import { z } from 'zod';

export const singleLockerRequestFormSchema = z.object({
	name: z.string().min(1).max(50),
	grade: z.enum(['9', '10', '11', '12']),
	student_id: z.number().min(7).max(7),
	requested_locker_id: z.number().min(1)
});
export type SingleLockerRequestFormSchema = typeof singleLockerRequestFormSchema;

export const partnerLockerRequestFormSchema = z.object({
	primary_name: z.string().min(1).max(50),
	primary_grade: z.enum(['9', '10', '11', '12']),
	primary_student_id: z.number().min(7).max(7),
	secondary_name: z.string().min(1).max(50),
	secondary_grade: z.enum(['9', '10', '11', '12']),
	secondary_student_id: z.number().min(7).max(7),
	requested_locker_id: z.number().min(1)
});
export type PartnerLockerRequestFormSchema = typeof partnerLockerRequestFormSchema;
