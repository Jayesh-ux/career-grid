# Integration Checklist

## ✅ Completed Setup

### Core Files Created
- [x] `src/lib/profileApi.ts` - Complete API client with types
- [x] `src/hooks/useJobseekerProfile.ts` - Custom hook
- [x] `src/context/ProfileContext.tsx` - Context provider
- [x] `src/components/ProfileDashboard.tsx` - Example dashboard
- [x] `src/components/ProfileExamples.tsx` - Example components
- [x] `src/App.tsx` - Updated with ProfileProvider

### Documentation
- [x] `PROFILE_API_INTEGRATION.md` - Full documentation
- [x] `QUICK_REFERENCE.md` - Quick reference guide

## 📋 Next Steps

### 1. Environment Setup
- [ ] Add to `.env.local`:
  ```env
  VITE_PROFILE_API_BASE_URL=http://localhost:8081
  ```

### 2. Verify Backend Connection
- [ ] Ensure Profile Service is running on `http://localhost:8081`
- [ ] Test with: `curl http://localhost:8081/api/v1/profiles/jobseeker/me`
- [ ] Should return 401 (unauthorized) if no token

### 3. Test with Existing Auth
- [ ] User should be able to log in
- [ ] Check localStorage for `auth_token`
- [ ] Profile should auto-load on dashboard

### 4. Implement Profile Features

#### Phase 1: Profile Management
- [ ] Create profile page/form (use `CreateProfileForm` from examples)
- [ ] Edit profile page (use `useProfile().updateProfile`)
- [ ] View profile dashboard (use `ProfileDashboard` component)
- [ ] Show profile completion percentage

#### Phase 2: Experience & Education
- [ ] Add work experience form (use `AddWorkExperienceForm`)
- [ ] List/edit/delete work experiences
- [ ] Add education form
- [ ] List/edit/delete education records

#### Phase 3: Skills
- [ ] Skills selector with catalog
- [ ] Add skills (use `SkillsManager`)
- [ ] Remove skills
- [ ] Show proficiency levels

#### Phase 4: Companies
- [ ] Browse companies page
- [ ] Company search
- [ ] Company detail page
- [ ] Write company review (use `CompanyReviewForm` pattern)
- [ ] View company reviews

#### Phase 5: Employer Features
- [ ] Create employer profile
- [ ] Create/manage companies
- [ ] Approve/reject reviews (admin)
- [ ] Manage company information

## 🧪 Testing Checklist

### Authentication
- [ ] Login works and sets token
- [ ] Profile requests include Authorization header
- [ ] 401 response handled correctly

### Profile Operations
- [ ] Create profile successful
- [ ] Update profile works
- [ ] Get profile returns correct data
- [ ] Delete profile clears data
- [ ] Profile completion calculated correctly

### Experience Operations
- [ ] Add experience works
- [ ] List experiences shows all records
- [ ] Update experience works
- [ ] Delete experience removes from list
- [ ] Current job flag handled correctly

### Education Operations
- [ ] Add education works
- [ ] CGPA/percentage validation
- [ ] Update education works
- [ ] Delete education works

### Skills Operations
- [ ] Get skills catalog works
- [ ] Add skill works
- [ ] Remove skill works
- [ ] Proficiency levels saved correctly

### Company Operations
- [ ] Get companies pagination works
- [ ] Search companies works
- [ ] Create company works (admin)
- [ ] Update company works (admin)
- [ ] Get my companies works

### Review Operations
- [ ] Submit review works
- [ ] Get company reviews works
- [ ] Rating validation (1-5)
- [ ] Approve/reject review works (admin)
- [ ] Anonymous reviews handled

### Error Handling
- [ ] API errors show user-friendly messages
- [ ] Network errors handled
- [ ] Validation errors caught
- [ ] 404 for missing resources
- [ ] 403 for unauthorized actions

## 📱 Component Integration

### Pages to Create/Update

#### `/dashboard`
```tsx
import { useProfile } from '@/context/ProfileContext';
import { ProfileDashboard } from '@/components/ProfileDashboard';

function Dashboard() {
  const { profile, loading } = useProfile();
  
  if (loading) return <Loading />;
  if (!profile) return <CreateProfileForm />;
  
  return <ProfileDashboard />;
}
```

#### `/profile/edit`
```tsx
import { CreateProfileForm, AddWorkExperienceForm } from '@/components/ProfileExamples';

function EditProfile() {
  return (
    <div>
      <CreateProfileForm />
      <AddWorkExperienceForm />
    </div>
  );
}
```

#### `/companies`
```tsx
// Use CompanyApi.getAll() with pagination
// Implement company search with CompanyApi.search()
// Show company details and reviews
```

#### `/profile/skills`
```tsx
import { SkillsManager } from '@/components/ProfileExamples';

function SkillsPage() {
  return <SkillsManager />;
}
```

## 🔄 API Response Examples

### Profile Response
```json
{
  "profileId": 1,
  "userId": 1,
  "firstName": "John",
  "lastName": "Doe",
  "currentLocation": "Mumbai",
  "expectedSalary": 1200000,
  "isProfileComplete": false,
  "createdAt": "2024-01-01T10:00:00Z"
}
```

### Work Experience Response
```json
{
  "experienceId": 1,
  "profileId": 1,
  "companyName": "Tech Corp",
  "jobTitle": "Software Engineer",
  "startDate": "2023-01-01",
  "salary": 800000,
  "isCurrent": true
}
```

### Skill Response
```json
{
  "id": 1,
  "profileId": 1,
  "skillId": 5,
  "skillName": "Java",
  "proficiencyLevel": "ADVANCED",
  "yearsOfExperience": 3
}
```

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check auth_token in localStorage |
| CORS Error | Ensure backend running on correct port |
| Profile not loading | Use ProfileProvider wrapper |
| Types not found | Import from `@/lib/profileApi` |
| State not updating | Use `refreshProfile()` after mutations |
| Pagination not working | Pass { page: 0, size: 20 } to API |

## 📚 File Reference

| File | Purpose |
|------|---------|
| `profileApi.ts` | All API functions and types |
| `useJobseekerProfile.ts` | Hook for profile state management |
| `ProfileContext.tsx` | App-wide state provider |
| `ProfileDashboard.tsx` | Example dashboard view |
| `ProfileExamples.tsx` | Reusable form components |
| `PROFILE_API_INTEGRATION.md` | Full documentation |
| `QUICK_REFERENCE.md` | Quick reference guide |

## 🚀 Deployment Notes

1. **Environment Variables**
   - Set `VITE_PROFILE_API_BASE_URL` to production backend
   - Should point to deployed Profile Service

2. **CORS Configuration**
   - Frontend must be whitelisted in backend CORS config

3. **Authentication**
   - Bearer token from auth service used automatically
   - Ensure token is stored in localStorage

4. **Error Handling**
   - Implement proper error boundaries
   - Show user-friendly error messages
   - Log errors for debugging

## ✨ Performance Tips

1. **Lazy Load Profile Data**
   ```tsx
   // Don't load all data on app start
   // Load only when user navigates to profile section
   ```

2. **Cache Profile Data**
   ```tsx
   // ProfileProvider caches all data
   // Call refreshProfile() when data changes
   ```

3. **Pagination**
   ```tsx
   // Use pagination for large lists
   await CompanyApi.getAll({ page: 0, size: 20 })
   ```

4. **Debounce Search**
   ```tsx
   // Avoid excessive API calls during search
   // Use debounce with 300ms delay
   ```

## 📞 Support

- Check `PROFILE_API_INTEGRATION.md` for detailed docs
- Check `QUICK_REFERENCE.md` for quick examples
- Review `ProfileExamples.tsx` for component patterns
- Check `profileApi.ts` for type definitions
- Review OpenAPI spec comments in code

---

**Status**: ✅ Integration Complete - Ready to Build Components
