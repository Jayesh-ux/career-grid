/**
 * Zod validation schemas for API request bodies.
 * Use with react-hook-form for form validation.
 */

import { z } from 'zod';

/**
 * Jobseeker Profile Schemas
 */
export const CreateJobseekerProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  currentLocation: z.string().optional(),
  preferredLocation: z.string().optional(),
  bio: z.string().max(1000).optional(),
  totalExperienceMonths: z.number().int().min(0).optional(),
  currentSalary: z.number().positive().optional(),
  expectedSalary: z.number().positive().optional(),
  noticePeriod: z
    .enum(['IMMEDIATE', 'DAYS_15', 'MONTH_1', 'MONTH_2', 'MONTH_3'])
    .optional(),
});

export type CreateJobseekerProfileFormData = z.infer<
  typeof CreateJobseekerProfileSchema
>;

export const UpdateJobseekerProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  currentLocation: z.string().optional(),
  preferredLocation: z.string().optional(),
  bio: z.string().max(1000).optional(),
  totalExperienceMonths: z.number().int().min(0).optional(),
  currentSalary: z.number().positive().optional(),
  expectedSalary: z.number().positive().optional(),
  noticePeriod: z
    .enum(['IMMEDIATE', 'DAYS_15', 'MONTH_1', 'MONTH_2', 'MONTH_3'])
    .optional(),
});

export type UpdateJobseekerProfileFormData = z.infer<
  typeof UpdateJobseekerProfileSchema
>;

/**
 * Company Schemas
 */
export const CreateCompanySchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  website: z.string().url('Invalid URL').optional(),
  description: z.string().max(2000).optional(),
  industry: z.string().optional(),
  size: z.enum(['STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE']).optional(),
  headquarters: z.string().optional(),
  foundedYear: z.number().int().min(1800).optional(),
  employeeCount: z.number().int().min(1).optional(),
});

export type CreateCompanyFormData = z.infer<typeof CreateCompanySchema>;

export const UpdateCompanySchema = z.object({
  companyName: z.string().min(1).optional(),
  website: z.string().url().optional(),
  description: z.string().max(2000).optional(),
  industry: z.string().optional(),
  size: z.enum(['STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE']).optional(),
  headquarters: z.string().optional(),
  foundedYear: z.number().int().min(1800).optional(),
  employeeCount: z.number().int().min(1).optional(),
});

export type UpdateCompanyFormData = z.infer<typeof UpdateCompanySchema>;

/**
 * Review Schemas
 */
export const CreateCompanyReviewSchema = z.object({
  overallRating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  workLifeBalanceRating: z.number().min(1).max(5, 'Must be between 1-5'),
  managementRating: z.number().min(1).max(5, 'Must be between 1-5'),
  benefitsRating: z.number().min(1).max(5, 'Must be between 1-5'),
  jobSecurityRating: z.number().min(1).max(5, 'Must be between 1-5'),
  pros: z.string().min(10, 'Pros must be at least 10 characters').max(1000, 'Max 1000 characters'),
  cons: z.string().min(10, 'Cons must be at least 10 characters').max(1000, 'Max 1000 characters'),
  jobTitle: z.string().min(1, 'Job title is required'),
  employmentStatus: z.enum(['CURRENT', 'FORMER'], { errorMap: () => ({ message: 'Must select employment status' }) }),
  anonymous: z.boolean().optional().default(false),
});

export type CreateCompanyReviewFormData = z.infer<typeof CreateCompanyReviewSchema>;

/**
 * Skill Schemas
 */
export const AddSkillSchema = z.object({
  skillId: z.number().int().min(1, 'Skill is required'),
  proficiencyLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
  yearsOfExperience: z.number().int().min(0).optional(),
});

export type AddSkillFormData = z.infer<typeof AddSkillSchema>;

/**
 * Work Experience Schemas
 */
export const AddWorkExperienceSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  employmentType: z.string().optional(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date').optional(),
  isCurrent: z.boolean().optional(),
  jobDescription: z.string().max(2000).optional(),
  location: z.string().optional(),
  salary: z.number().positive().optional(),
});

export type AddWorkExperienceFormData = z.infer<typeof AddWorkExperienceSchema>;

/**
 * Education Schemas
 */
export const AddEducationSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().optional(),
  institutionName: z.string().min(1, 'Institution name is required'),
  university: z.string().optional(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date').optional(),
  percentageOrCgpa: z.number().min(0).max(10).optional(),
  description: z.string().max(1000).optional(),
  isCurrent: z.boolean().optional(),
});

export type AddEducationFormData = z.infer<typeof AddEducationSchema>;

/**
 * Employer Profile Schemas
 */
export const CreateEmployerProfileSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyWebsite: z.string().url().optional(),
  companyDescription: z.string().max(2000).optional(),
  industry: z.string().optional(),
  companySize: z
    .enum(['SIZE_1_10', 'SIZE_11_50', 'SIZE_51_200', 'SIZE_201_500', 'SIZE_500_PLUS'])
    .optional(),
  headquartersLocation: z.string().optional(),
  contactPersonName: z.string().optional(),
  contactPersonDesignation: z.string().optional(),
});

export type CreateEmployerProfileFormData = z.infer<
  typeof CreateEmployerProfileSchema
>;

export const UpdateEmployerProfileSchema = z.object({
  companyId: z.number().int().optional(),
  companyName: z.string().min(1).optional(),
  companyWebsite: z.string().url().optional(),
  companyDescription: z.string().max(2000).optional(),
  industry: z.string().optional(),
  companySize: z
    .enum(['SIZE_1_10', 'SIZE_11_50', 'SIZE_51_200', 'SIZE_201_500', 'SIZE_500_PLUS'])
    .optional(),
  headquartersLocation: z.string().optional(),
  contactPersonName: z.string().optional(),
  contactPersonDesignation: z.string().optional(),
});

export type UpdateEmployerProfileFormData = z.infer<
  typeof UpdateEmployerProfileSchema
>;
