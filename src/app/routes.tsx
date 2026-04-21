import React from "react";
import { createBrowserRouter } from "react-router";
import RootLayout from "./components/RootLayout";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import RegistrationPage from "./components/RegistrationPage";
import ForgotPasswordFlow from "./components/ForgotPasswordFlow";
import SignOut from "./components/SignOut";
import PatientDashboard from "./components/PatientDashboard";
import CarePartnerDashboard from "./components/CarePartnerDashboard";
import ClinicianDashboard from "./components/ClinicianDashboard";
import ModulesOverview from "./components/ModulesOverview";
import SleepModulePage from "./components/SleepModulePage";
import ProgressiveMuscleRelaxationPage from "./components/ProgressiveMuscleRelaxationPage";
import PatientMessagesCenter from "./components/patient/MessagesCenter";
import MyProgress from "./components/patient/MyProgress";
import SleepAnalytics from "./components/patient/SleepAnalytics";
import RemindersCenter from "./components/patient/RemindersCenter";
import SettingsPage from "./components/patient/SettingsPage";
import SleepTips from "./components/patient/SleepTips";
import CarePartnerMessagesCenter from "./components/care-partner/CarePartnerMessagesCenter";
import ClinicianMessagesCenter from "./components/clinician/ClinicianMessagesCenter";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

/**
 * Application routing configuration
 * Includes both protected routes (require auth) and preview routes (no auth for development)
 */
export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: LandingPage,
      },
      {
        path: "signin",
        Component: AuthPage,
      },
      {
        path: "register",
        Component: RegistrationPage,
      },
      {
        path: "forgot-password",
        Component: ForgotPasswordFlow,
      },
      {
        path: "signout",
        Component: SignOut,
      },
      // Patient Routes
      {
        path: "patient/dashboard",
        element: (
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "patient/messages",
        element: (
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientMessagesCenter />
          </ProtectedRoute>
        ),
      },
      {
        path: "patient/progress",
        element: (
          <ProtectedRoute allowedRoles={['patient']}>
            <MyProgress />
          </ProtectedRoute>
        ),
      },
      {
        path: "patient/sleep-analytics",
        element: (
          <ProtectedRoute allowedRoles={['patient']}>
            <SleepAnalytics />
          </ProtectedRoute>
        ),
      },
      {
        path: "patient/reminders",
        element: (
          <ProtectedRoute allowedRoles={['patient']}>
            <RemindersCenter />
          </ProtectedRoute>
        ),
      },
      {
        path: "patient/settings",
        element: (
          <ProtectedRoute allowedRoles={['patient']}>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "patient/sleep-tips",
        element: (
          <ProtectedRoute allowedRoles={['patient']}>
            <SleepTips />
          </ProtectedRoute>
        ),
      },
      // Care Partner Routes
      {
        path: "care-partner/dashboard",
        element: (
          <ProtectedRoute allowedRoles={['care_partner']}>
            <CarePartnerDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "care-partner/sleep-logs",
        element: (
          <ProtectedRoute allowedRoles={['care_partner']}>
            <CarePartnerDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "care-partner/send-message",
        element: (
          <ProtectedRoute allowedRoles={['care_partner']}>
            <CarePartnerDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "care-partner/resources",
        element: (
          <ProtectedRoute allowedRoles={['care_partner']}>
            <CarePartnerDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "care-partner/messages",
        element: (
          <ProtectedRoute allowedRoles={['care_partner']}>
            <CarePartnerMessagesCenter />
          </ProtectedRoute>
        ),
      },
      // Clinician Routes
      {
        path: "clinician/dashboard",
        element: (
          <ProtectedRoute allowedRoles={['clinician']}>
            <ClinicianDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "clinician/analytics",
        element: (
          <ProtectedRoute allowedRoles={['clinician']}>
            <ClinicianDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "clinician/patient/:patientId",
        element: (
          <ProtectedRoute allowedRoles={['clinician']}>
            <ClinicianDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "clinician/messages",
        element: (
          <ProtectedRoute allowedRoles={['clinician']}>
            <ClinicianMessagesCenter />
          </ProtectedRoute>
        ),
      },
      // Module Routes
      {
        path: "modules",
        element: (
          <ProtectedRoute allowedRoles={['patient']}>
            <ModulesOverview />
          </ProtectedRoute>
        ),
      },
      {
        path: "sleep-modules",
        element: (
          <ProtectedRoute allowedRoles={['patient']}>
            <ModulesOverview />
          </ProtectedRoute>
        ),
      },
      {
        path: "modules/:moduleId",
        element: (
          <ProtectedRoute allowedRoles={['patient']}>
            <SleepModulePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "modules/resources/progressive-muscle-relaxation",
        element: (
          <ProtectedRoute allowedRoles={['patient']}>
            <ProgressiveMuscleRelaxationPage />
          </ProtectedRoute>
        ),
      },
      // Development Preview Routes (bypass auth for page selector)
      {
        path: "preview/patient-dashboard",
        Component: PatientDashboard,
      },
      {
        path: "preview/patient-messages",
        Component: PatientMessagesCenter,
      },
      {
        path: "preview/patient-progress",
        Component: MyProgress,
      },
      {
        path: "preview/patient-sleep-analytics",
        Component: SleepAnalytics,
      },
      {
        path: "preview/patient-reminders",
        Component: RemindersCenter,
      },
      {
        path: "preview/patient-settings",
        Component: SettingsPage,
      },
      {
        path: "preview/patient-sleep-tips",
        Component: SleepTips,
      },
      {
        path: "preview/care-partner-dashboard",
        Component: CarePartnerDashboard,
      },
      {
        path: "preview/care-partner-messages",
        Component: CarePartnerMessagesCenter,
      },
      {
        path: "preview/clinician-dashboard",
        Component: ClinicianDashboard,
      },
      {
        path: "preview/clinician-messages",
        Component: ClinicianMessagesCenter,
      },
      {
        path: "preview/modules",
        Component: ModulesOverview,
      },
      {
        path: "preview/module-week-1",
        Component: SleepModulePage,
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);