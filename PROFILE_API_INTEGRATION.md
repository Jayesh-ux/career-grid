# Career Grid Profile Service Integration Guide

## Overview

This guide explains how to use the integrated Profile Service API in your Career Grid React application.

## Setup

### 1. Environment Configuration

Add the following to your `.env.local` file:

```env
VITE_PROFILE_API_BASE_URL=http://localhost:8081
VITE_API_BASE_URL=http://localhost:8080
```

### 2. Provider Setup

The `ProfileProvider` is already integrated in `App.tsx`. It automatically loads profile data when a user is authenticated:

```tsx
<AuthProvider>
  <ProfileProvider>
    {/* Your routes */}
  </ProfileProvider>
</AuthProvider>
```

## Usage

### Using the Profile Hook

```tsx
import { useProfile } from '@/context/ProfileContext';

function MyComponent() {
  const {
    profile,
    workExperience,
    education,
    skills,
    loading,
    error,
    createProfile,
    updateProfile,
    addWorkExperience,
    // ... other methods
  } = useProfile();

  // Use the data and methods
}
```

### Available Operations

#### **Jobseeker Profile**

```tsx
// Create profile
await createProfile({
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1995-05-15',
  gender: 'MALE',
  currentLocation: 'Mumbai',
  preferredLocation: 'Bangalore',
  bio: 'Experienced software developer',
  totalExperienceMonths: 36,
  currentSalary: 800000,
  expectedSalary: 1200000,
  noticePeriod: 'MONTH_1'
});

// Get profile
await getProfile();

// Update profile
await updateProfile({
  bio: 'Updated bio',
  expectedSalary: 1500000
});

// Delete profile
await deleteProfile();

// Get completion percentage
await getProfileCompletion(); // Returns { completionPercentage: 85 }
```

#### **Work Experience**

```tsx
// Add work experience
await addWorkExperience({
  companyName: 'Tech Corp',
  jobTitle: 'Senior Software Engineer',
  employmentType: 'Full-time',
  startDate: '2020-01-15',
  endDate: '2023-06-30',
  isCurrent: false,
  jobDescription: 'Led development of microservices',
  location: 'Mumbai',
  salary: 1200000
});

// Update work experience
await updateWorkExperience(experienceId, {
  jobTitle: 'Lead Software Engineer',
  salary: 1500000
});

// Delete work experience
await deleteWorkExperience(experienceId);
```

#### **Education**

```tsx
// Add education
await addEducation({
  degree: 'Bachelor of Technology',
  fieldOfStudy: 'Computer Science',
  institutionName: 'IIT Mumbai',
  university: 'Indian Institute of Technology',
  startDate: '2015-07-01',
  endDate: '2019-06-30',
  percentageOrCgpa: 8.5,
  description: 'Major in Software Engineering'
});

// Update education
await updateEducation(educationId, {
  percentageOrCgpa: 8.8,
  description: 'Updated description'
});

// Delete education
await deleteEducation(educationId);
```

#### **Skills**

```tsx
// Add skill
await addSkill({
  skillId: 1,
  proficiencyLevel: 'ADVANCED', // BEGINNER | INTERMEDIATE | ADVANCED | EXPERT
  yearsOfExperience: 3
});

// Remove skill
await removeSkill(skillId);

// Get all available skills
const skillsCatalog = await SkillsApi.getCatalog({ page: 0, size: 20 });
```

#### **Companies**

```tsx
// Get all companies
await CompanyApi.getAll({ page: 0, size: 10 });

// Create company
await CompanyApi.create({
  companyName: 'Tech Innovations Pvt Ltd',
  website: 'https://techinnovations.com',
  description: 'Leading software development company',
  industry: 'Information Technology',
  size: 'MEDIUM', // STARTUP | SMALL | MEDIUM | LARGE | ENTERPRISE
  headquarters: 'Bangalore',
  foundedYear: 2015,
  employeeCount: 150
});

// Get company
await CompanyApi.getById(companyId);

// Update company
await CompanyApi.update(companyId, { website: '...' });

// Search companies
await CompanyApi.search('Tech');

// Get my companies
await CompanyApi.getMyCompanies();
```

#### **Company Reviews**

```tsx
// Get company reviews
await CompanyReviewApi.getCompanyReviews(companyId, true); // true = only approved

// Submit review
await CompanyReviewApi.submitReview(companyId, {
  overallRating: 4.5,
  reviewTitle: 'Great place to work',
  workLifeBalance: 4,
  salaryBenefits: 4.5,
  careerGrowth: 4,
  management: 3.5,
  culture: 5,
  pros: 'Good work culture, flexible hours',
  cons: 'Limited career growth for some',
  jobTitle: 'Software Engineer',
  isCurrentEmployee: true
});

// Get my reviews
await CompanyReviewApi.getMyReviews();

// Update review
await CompanyReviewApi.update(reviewId, { /* updated data */ });

// Delete review
await CompanyReviewApi.delete(reviewId);

// Approve review (admin)
await CompanyReviewApi.approve(reviewId);

// Reject review (admin)
await CompanyReviewApi.reject(reviewId);
```

#### **Employer Profile**

```tsx
// Create employer profile
await EmployerProfileApi.create({
  companyName: 'Tech Solutions Inc',
  companyWebsite: 'https://techsolutions.com',
  companyDescription: 'Leading IT consulting firm',
  industry: 'Information Technology',
  companySize: 'SIZE_51_200',
  headquartersLocation: 'Mumbai',
  contactPersonName: 'Jane Smith',
  contactPersonDesignation: 'HR Manager'
});

// Get my employer profile
await EmployerProfileApi.getMe();

// Update employer profile
await EmployerProfileApi.updateMe({ /* updated data */ });

// Delete employer profile
await EmployerProfileApi.deleteMe();
```

## Direct API Usage

For more control, you can use the API classes directly:

```tsx
import {
  JobseekerProfileApi,
  WorkExperienceApi,
  EducationApi,
  SkillsApi,
  CompanyApi,
  CompanyReviewApi,
  EmployerProfileApi,
  ProfileApiError,
} from '@/lib/profileApi';

// Example: Get all skills with pagination
try {
  const response = await SkillsApi.getCatalog({ page: 0, size: 50 });
  const skills = response._embedded?.skills || [];
} catch (error) {
  if (error instanceof ProfileApiError) {
    console.error(`API Error ${error.status}: ${error.message}`);
  }
}
```

## Error Handling

All API calls throw `ProfileApiError` on failure:

```tsx
import { ProfileApiError } from '@/lib/profileApi';

try {
  await createProfile({ /* ... */ });
} catch (error) {
  if (error instanceof ProfileApiError) {
    console.error(`Status: ${error.status}, Message: ${error.message}`);
    console.error('Response:', error.payload);
  }
}
```

## Authentication

All API calls automatically include the Bearer token from localStorage. The token is obtained from the AuthContext during login.

## Type Definitions

All types are exported from `@/lib/profileApi`:

```tsx
import {
  JobseekerProfileResponse,
  WorkExperienceResponse,
  EducationResponse,
  SkillResponse,
  CompanyResponse,
  CompanyReviewResponse,
  EmployerProfileResponse,
  Gender,
  NoticePeriod,
  ProficiencyLevel,
  CompanySize,
} from '@/lib/profileApi';
```

## Example Component

See `ProfileDashboard.tsx` for a complete example of using the Profile API.

## API Endpoints Summary

### Jobseeker Profile
- `GET /api/v1/profiles/jobseeker/me` - Get my profile
- `POST /api/v1/profiles/jobseeker` - Create profile
- `PUT /api/v1/profiles/jobseeker/me` - Update profile
- `DELETE /api/v1/profiles/jobseeker/me` - Delete profile
- `GET /api/v1/profiles/jobseeker/{profileId}` - Get profile by ID
- `GET /api/v1/profiles/jobseeker/me/completion` - Get completion percentage

### Work Experience
- `GET /api/v1/profiles/jobseeker/experience` - Get all
- `POST /api/v1/profiles/jobseeker/experience` - Add
- `PUT /api/v1/profiles/jobseeker/experience/{experienceId}` - Update
- `DELETE /api/v1/profiles/jobseeker/experience/{experienceId}` - Delete

### Education
- `GET /api/v1/profiles/jobseeker/education` - Get all
- `POST /api/v1/profiles/jobseeker/education` - Add
- `PUT /api/v1/profiles/jobseeker/education/{educationId}` - Update
- `DELETE /api/v1/profiles/jobseeker/education/{educationId}` - Delete

### Skills
- `GET /api/v1/profiles/jobseeker/skills` - Get my skills
- `POST /api/v1/profiles/jobseeker/skills` - Add skill
- `DELETE /api/v1/profiles/jobseeker/skills/{skillId}` - Remove skill
- `GET /api/v1/profiles/jobseeker/skills/catalog` - Get all skills
- `GET /api/v1/profiles/jobseeker/skills/catalog/{skillId}` - Get skill

### Companies
- `GET /api/v1/companies` - Get all
- `POST /api/v1/companies` - Create
- `GET /api/v1/companies/{companyId}` - Get by ID
- `PUT /api/v1/companies/{companyId}` - Update
- `DELETE /api/v1/companies/{companyId}` - Delete
- `GET /api/v1/companies/search` - Search
- `GET /api/v1/companies/my-companies` - Get my companies

### Company Reviews
- `GET /api/v1/companies/{companyId}/reviews` - Get reviews
- `POST /api/v1/companies/{companyId}/reviews` - Submit review
- `GET /api/v1/companies/reviews/my-reviews` - Get my reviews
- `PUT /api/v1/companies/reviews/{reviewId}` - Update
- `DELETE /api/v1/companies/reviews/{reviewId}` - Delete
- `PATCH /api/v1/companies/reviews/{reviewId}/approve` - Approve
- `PATCH /api/v1/companies/reviews/{reviewId}/reject` - Reject

### Employer Profile
- `GET /api/v1/profiles/employer/me` - Get my profile
- `POST /api/v1/profiles/employer` - Create
- `PUT /api/v1/profiles/employer/me` - Update
- `DELETE /api/v1/profiles/employer/me` - Delete
- `GET /api/v1/profiles/employer/{employerId}` - Get by ID
- `GET /api/v1/profiles/employer/exists` - Check exists
