# Profile Service API - Quick Reference

## Installation & Setup

### 1. Files Created
- `src/lib/profileApi.ts` - Main API client with all type definitions
- `src/hooks/useJobseekerProfile.ts` - Custom hook for profile operations
- `src/context/ProfileContext.tsx` - Context provider for app-wide profile state
- `src/components/ProfileDashboard.tsx` - Example dashboard component
- `src/components/ProfileExamples.tsx` - Example form components
- `PROFILE_API_INTEGRATION.md` - Full documentation

### 2. Environment Setup
Add to `.env.local`:
```env
VITE_PROFILE_API_BASE_URL=http://localhost:8081
```

### 3. App Integration (Already Done)
```tsx
<ProfileProvider>
  {/* Routes */}
</ProfileProvider>
```

## Quick Examples

### Get Profile
```tsx
import { useProfile } from '@/context/ProfileContext';

function MyComponent() {
  const { profile, loading } = useProfile();
  
  if (loading) return <div>Loading...</div>;
  return <div>{profile?.firstName} {profile?.lastName}</div>;
}
```

### Create Profile
```tsx
const { createProfile } = useProfile();

await createProfile({
  firstName: 'John',
  lastName: 'Doe',
  currentLocation: 'Mumbai',
  expectedSalary: 1200000,
});
```

### Add Experience
```tsx
const { addWorkExperience } = useProfile();

await addWorkExperience({
  companyName: 'Tech Corp',
  jobTitle: 'Software Engineer',
  startDate: '2023-01-01',
  salary: 800000,
});
```

### Add Education
```tsx
const { addEducation } = useProfile();

await addEducation({
  degree: 'B.Tech',
  institutionName: 'IIT Mumbai',
  percentageOrCgpa: 8.5,
});
```

### Add Skill
```tsx
const { addSkill } = useProfile();

await addSkill({
  skillId: 1,
  proficiencyLevel: 'ADVANCED',
  yearsOfExperience: 3,
});
```

### Create Company
```tsx
import { CompanyApi } from '@/lib/profileApi';

await CompanyApi.create({
  companyName: 'My Company',
  industry: 'IT',
  size: 'MEDIUM',
});
```

### Submit Review
```tsx
import { CompanyReviewApi } from '@/lib/profileApi';

await CompanyReviewApi.submitReview(companyId, {
  overallRating: 4.5,
  reviewTitle: 'Great company',
  workLifeBalance: 4,
  culture: 5,
});
```

## Available Hooks & APIs

### useProfile() Hook
```tsx
const {
  // State
  profile,                    // JobseekerProfileResponse | null
  workExperience,             // WorkExperienceResponse[]
  education,                  // EducationResponse[]
  skills,                     // JobseekerSkillResponse[]
  loading,                    // boolean
  error,                      // string | null
  
  // Profile operations
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  getProfileCompletion,
  
  // Experience operations
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  
  // Education operations
  addEducation,
  updateEducation,
  deleteEducation,
  
  // Skills operations
  addSkill,
  removeSkill,
  
  // Utilities
  loadAllData,
  refreshProfile,
  clearError,
} = useProfile();
```

### API Classes
```tsx
import {
  JobseekerProfileApi,
  WorkExperienceApi,
  EducationApi,
  SkillsApi,
  CompanyApi,
  CompanyReviewApi,
  EmployerProfileApi,
} from '@/lib/profileApi';
```

## Enum Values

### Gender
- `MALE`, `FEMALE`, `OTHER`

### NoticePeriod
- `IMMEDIATE`, `DAYS_15`, `MONTH_1`, `MONTH_2`, `MONTH_3`

### ProficiencyLevel
- `BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`

### CompanySize (Employer)
- `SIZE_1_10`, `SIZE_11_50`, `SIZE_51_200`, `SIZE_201_500`, `SIZE_500_PLUS`

### CompanySizeEnum (Company)
- `STARTUP`, `SMALL`, `MEDIUM`, `LARGE`, `ENTERPRISE`

## Response Types

All responses automatically include proper TypeScript types from `@/lib/profileApi`.

### Common Response Fields
- `...Id` - Numeric ID
- `userId` - Associated user ID
- `createdAt` - ISO datetime
- `updatedAt` - ISO datetime

## Error Handling

```tsx
import { ProfileApiError } from '@/lib/profileApi';

try {
  await createProfile({ /* ... */ });
} catch (error) {
  if (error instanceof ProfileApiError) {
    console.log(`Error ${error.status}: ${error.message}`);
  }
}
```

## Component Examples

### Copy from `ProfileExamples.tsx`:
- `CreateProfileForm` - Full profile creation
- `AddWorkExperienceForm` - Add work experience
- `SkillsManager` - Manage skills
- `CompanyReviewForm` - Submit company review
- `ProfileProgressIndicator` - Show completion %

## Common Patterns

### Load & Display
```tsx
useEffect(() => {
  useProfile().refreshProfile();
}, []);
```

### Form Submission
```tsx
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await createProfile(formData);
    // Success feedback
  } catch (err) {
    // Error feedback
  }
};
```

### Delete with Confirmation
```tsx
const handleDelete = async (id) => {
  if (confirm('Are you sure?')) {
    await deleteWorkExperience(id);
  }
};
```

## Pagination

```tsx
// Get skills with pagination
const response = await SkillsApi.getCatalog({ 
  page: 0,     // Zero-based
  size: 20     // Items per page
});

const skills = response._embedded?.skills || [];
```

## Full API Endpoints

```
GET    /api/v1/profiles/jobseeker/me
POST   /api/v1/profiles/jobseeker
PUT    /api/v1/profiles/jobseeker/me
DELETE /api/v1/profiles/jobseeker/me

GET    /api/v1/profiles/jobseeker/experience
POST   /api/v1/profiles/jobseeker/experience
PUT    /api/v1/profiles/jobseeker/experience/{id}
DELETE /api/v1/profiles/jobseeker/experience/{id}

GET    /api/v1/profiles/jobseeker/education
POST   /api/v1/profiles/jobseeker/education
PUT    /api/v1/profiles/jobseeker/education/{id}
DELETE /api/v1/profiles/jobseeker/education/{id}

GET    /api/v1/profiles/jobseeker/skills
POST   /api/v1/profiles/jobseeker/skills
DELETE /api/v1/profiles/jobseeker/skills/{id}

GET    /api/v1/companies
POST   /api/v1/companies
GET    /api/v1/companies/{id}
PUT    /api/v1/companies/{id}
DELETE /api/v1/companies/{id}

GET    /api/v1/companies/search?name={name}
GET    /api/v1/companies/my-companies

GET    /api/v1/companies/{companyId}/reviews
POST   /api/v1/companies/{companyId}/reviews
GET    /api/v1/companies/reviews/my-reviews
PUT    /api/v1/companies/reviews/{id}
DELETE /api/v1/companies/reviews/{id}

GET    /api/v1/profiles/employer/me
POST   /api/v1/profiles/employer
PUT    /api/v1/profiles/employer/me
DELETE /api/v1/profiles/employer/me
```

## Troubleshooting

### Token Not Being Sent
- Check localStorage has `auth_token` from login
- Token is automatically attached to all requests

### 401 Unauthorized
- User not logged in
- Token expired
- Check AuthContext is providing valid token

### 404 Profile Not Found
- User hasn't created a profile yet
- Check with `JobseekerProfileApi.exists()`

### CORS Issues
- Ensure backend is running on `http://localhost:8081`
- Check `VITE_PROFILE_API_BASE_URL` is correct

## Best Practices

1. **Always wrap in try-catch** when calling API functions
2. **Use useProfile hook** for most operations - handles state automatically
3. **Clear errors** after displaying to user
4. **Use ProfileProvider** for app-wide state management
5. **Type your components** with response types from `@/lib/profileApi`
6. **Validate form data** before submission
7. **Show loading state** during API calls
8. **Handle 404s gracefully** - profile may not exist yet
