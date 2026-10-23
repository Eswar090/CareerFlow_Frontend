import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

import StudentLayout from '../layouts/StudentLayout';
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentProfile from '../pages/student/StudentProfile';
import StudentSkills from '../pages/student/StudentSkills';
import StudentJobs from '../pages/student/StudentJobs';
import JobDetails from '../pages/student/JobDetails';
import Applications from '../pages/student/Applications';
import Interviews from '../pages/student/Interviews';
import Notifications from '../pages/student/Notifications';
import StudentProjects from '../pages/student/StudentProjects';
import StudentCertifications from '../pages/student/StudentCertifications';
import StudentResume from '../pages/student/StudentResume';
import StudentPlacementDrives from '../pages/student/StudentPlacementDrives';
import StudentPlacementDriveDetails from '../pages/student/StudentPlacementDriveDetails';
import StudentCalendar from '../pages/student/StudentCalendar';
import StudentDsaTracker from '../pages/student/StudentDsaTracker';
import StudentMockInterviews from '../pages/student/StudentMockInterviews';

import CareerPathDashboard from '../pages/student/careerpath/CareerPathDashboard';
import CareerPathCompanies from '../pages/student/careerpath/CareerPathCompanies';
import CareerPathCompanyDetails from '../pages/student/careerpath/CareerPathCompanyDetails';
import CareerPathCompanyTypes from '../pages/student/careerpath/CareerPathCompanyTypes';
import CareerPathRoles from '../pages/student/careerpath/CareerPathRoles';
import CareerPathRoadmap from '../pages/student/careerpath/CareerPathRoadmap';
import CareerPathReadiness from '../pages/student/careerpath/CareerPathReadiness';
import CareerPathCompare from '../pages/student/careerpath/CareerPathCompare';

import RecruiterLayout from '../layouts/RecruiterLayout';
import RecruiterDashboard from '../pages/recruiter/RecruiterDashboard';
import RecruiterProfile from '../pages/recruiter/RecruiterProfile';
import CompanyProfile from '../pages/recruiter/CompanyProfile';
import RecruiterJobs from '../pages/recruiter/RecruiterJobs';
import CreateJob from '../pages/recruiter/CreateJob';
import RecruiterJobApplicants from '../pages/recruiter/RecruiterJobApplicants';
import RecruiterInterviews from '../pages/recruiter/Interviews';
import RecruiterNotifications from '../pages/recruiter/Notifications';
import RecruiterPlacementDrives from '../pages/recruiter/RecruiterPlacementDrives';
import RecruiterCreatePlacementDrive from '../pages/recruiter/RecruiterCreatePlacementDrive';
import RecruiterDriveCandidates from '../pages/recruiter/RecruiterDriveCandidates';

import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminCompanies from '../pages/admin/AdminCompanies';
import AdminJobs from '../pages/admin/AdminJobs';
import AdminApplications from '../pages/admin/AdminApplications';
import AdminInterviews from '../pages/admin/AdminInterviews';
import AdminPlacementDrives from '../pages/admin/AdminPlacementDrives';
import AdminDriveRegistrations from '../pages/admin/AdminDriveRegistrations';

import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student Routes */}
      <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'ROLE_STUDENT']} />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="skills" element={<StudentSkills />} />
          <Route path="projects" element={<StudentProjects />} />
          <Route path="certifications" element={<StudentCertifications />} />
          <Route path="resume" element={<StudentResume />} />
          <Route path="jobs" element={<StudentJobs />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="placement-drives" element={<StudentPlacementDrives />} />
          <Route path="placement-drives/:id" element={<StudentPlacementDriveDetails />} />
          <Route path="career-path" element={<CareerPathDashboard />} />
          <Route path="career-path/companies" element={<CareerPathCompanies />} />
          <Route path="career-path/companies/:id" element={<CareerPathCompanyDetails />} />
          <Route path="career-path/guide" element={<CareerPathCompanyTypes />} />
          <Route path="career-path/roles" element={<CareerPathRoles />} />
          <Route path="career-path/roadmaps" element={<CareerPathRoadmap />} />
          <Route path="career-path/readiness" element={<CareerPathReadiness />} />
          <Route path="career-path/compare" element={<CareerPathCompare />} />
          <Route path="applications" element={<Applications />} />
          <Route path="interviews" element={<Interviews />} />
          <Route path="calendar" element={<StudentCalendar />} />
          <Route path="dsa-tracker" element={<StudentDsaTracker />} />
          <Route path="mock-interviews" element={<StudentMockInterviews />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Route>

      {/* Recruiter Routes */}
      <Route element={<ProtectedRoute allowedRoles={['RECRUITER', 'ROLE_RECRUITER']} />}>
        <Route path="/recruiter" element={<RecruiterLayout />}>
          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="profile" element={<RecruiterProfile />} />
          <Route path="company" element={<CompanyProfile />} />
          <Route path="jobs" element={<RecruiterJobs />} />
          <Route path="jobs/create" element={<CreateJob />} />
          <Route path="jobs/:id/edit" element={<CreateJob />} />
          <Route path="jobs/:id/applicants" element={<RecruiterJobApplicants />} />
          <Route path="applicants" element={<RecruiterJobApplicants />} />
          <Route path="placement-drives" element={<RecruiterPlacementDrives />} />
          <Route path="placement-drives/create" element={<RecruiterCreatePlacementDrive />} />
          <Route path="placement-drives/:id/edit" element={<RecruiterCreatePlacementDrive />} />
          <Route path="placement-drives/:id/candidates" element={<RecruiterDriveCandidates />} />
          <Route path="interviews" element={<RecruiterInterviews />} />
          <Route path="notifications" element={<RecruiterNotifications />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'ROLE_ADMIN']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="companies" element={<AdminCompanies />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="placement-drives" element={<AdminPlacementDrives />} />
          <Route path="placement-drives/:id/registrations" element={<AdminDriveRegistrations />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="interviews" element={<AdminInterviews />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
