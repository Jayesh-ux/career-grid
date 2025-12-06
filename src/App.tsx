import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/Toast";
import { queryClient } from "@/lib/react-query";
import { JobProvider } from "./context/JobContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";
import Index from "./pages/Index";
import FindJobs from "./pages/FindJobs";
import JobDetail from "./pages/JobDetail";
import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import JobDiscoveryPage from "./pages/JobDiscoveryPage";
import ApplicationTrackingPage from "./pages/ApplicationTrackingPage";
import { JobseekerProfilePage } from "./pages/profile/jobseeker/me";
import { EmployerProfilePage } from "./pages/profile/employer/me";
import { WorkExperiencePage } from "./pages/profile/jobseeker/experience";
import { SkillsPage } from "./pages/profile/jobseeker/skills";
import { EducationPage } from "./pages/profile/jobseeker/education";
import { CompanyDetailPage } from "./pages/companies/[companyId]";
import { SubmitReviewPage } from "./pages/companies/reviews/new";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token, loading } = useAuth();
  if (loading) return null; // could show a spinner
  return token ? children : <Navigate to="/" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AuthProvider>
        <ProfileProvider autoLoad={false}>
          <JobProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/find-jobs" element={<FindJobs />} />
                <Route path="/jobs" element={<PrivateRoute><JobDiscoveryPage /></PrivateRoute>} />
                <Route path="/job/:id" element={<JobDetail />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/applications" element={<PrivateRoute><ApplicationTrackingPage /></PrivateRoute>} />
                
                {/* Profile Routes */}
                <Route path="/profile/jobseeker/me" element={<PrivateRoute><JobseekerProfilePage /></PrivateRoute>} />
                <Route path="/profile/jobseeker/experience" element={<PrivateRoute><WorkExperiencePage /></PrivateRoute>} />
                <Route path="/profile/jobseeker/skills" element={<PrivateRoute><SkillsPage /></PrivateRoute>} />
                <Route path="/profile/jobseeker/education" element={<PrivateRoute><EducationPage /></PrivateRoute>} />
                <Route path="/profile/employer/me" element={<PrivateRoute><EmployerProfilePage /></PrivateRoute>} />
                
                {/* Company Routes */}
                <Route path="/companies" element={<Companies />} />
                <Route path="/companies/:companyId" element={<CompanyDetailPage />} />
                <Route path="/companies/:companyId/reviews/new" element={<PrivateRoute><SubmitReviewPage /></PrivateRoute>} />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </JobProvider>
        </ProfileProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
