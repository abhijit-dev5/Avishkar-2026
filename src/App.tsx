import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import type { Role } from '@/types/models';

// Public pages
import { Landing } from '@/pages/Landing';
import { Register } from '@/pages/Register';
import { Login } from '@/pages/Login';

// Citizen pages
import { CitizenDashboard } from '@/pages/citizen/CitizenDashboard';
import { ReportEmergency } from '@/pages/citizen/ReportEmergency';
import { AiAnalysis } from '@/pages/citizen/AiAnalysis';
import { EmergencyTracking } from '@/pages/citizen/EmergencyTracking';
import { EmergencyHistory } from '@/pages/citizen/EmergencyHistory';
import { Notifications } from '@/pages/citizen/Notifications';
import { Feedback } from '@/pages/citizen/Feedback';

// Admin pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminEmergencies } from '@/pages/admin/AdminEmergencies';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AdminDepartments } from '@/pages/admin/AdminDepartments';
import { AdminVehicles } from '@/pages/admin/AdminVehicles';
import { AdminFeedback } from '@/pages/admin/AdminFeedback';

// Department pages
import { DepartmentDashboard } from '@/pages/department/DepartmentDashboard';
import { DepartmentEmergencies } from '@/pages/department/DepartmentEmergencies';
import { DepartmentResponders } from '@/pages/department/DepartmentResponders';
import { DepartmentVehicles } from '@/pages/department/DepartmentVehicles';

// Responder pages
import { ResponderDashboard } from '@/pages/responder/ResponderDashboard';
import { ResponderEmergencies } from '@/pages/responder/ResponderEmergencies';

function ProtectedRoute({ children, roles }: { children: ReactNode; roles?: Role[] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Citizen */}
            <Route path="/citizen" element={<ProtectedRoute roles={['CITIZEN']}><CitizenDashboard /></ProtectedRoute>} />
            <Route path="/citizen/report" element={<ProtectedRoute roles={['CITIZEN']}><ReportEmergency /></ProtectedRoute>} />
            <Route path="/citizen/ai-analysis" element={<ProtectedRoute roles={['CITIZEN']}><AiAnalysis /></ProtectedRoute>} />
            <Route path="/citizen/track" element={<ProtectedRoute roles={['CITIZEN']}><EmergencyTracking /></ProtectedRoute>} />
            <Route path="/citizen/history" element={<ProtectedRoute roles={['CITIZEN']}><EmergencyHistory /></ProtectedRoute>} />
            <Route path="/citizen/notifications" element={<ProtectedRoute roles={['CITIZEN']}><Notifications /></ProtectedRoute>} />
            <Route path="/citizen/feedback" element={<ProtectedRoute roles={['CITIZEN']}><Feedback /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/emergencies" element={<ProtectedRoute roles={['ADMIN']}><AdminEmergencies /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute roles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/departments" element={<ProtectedRoute roles={['ADMIN']}><AdminDepartments /></ProtectedRoute>} />
            <Route path="/admin/vehicles" element={<ProtectedRoute roles={['ADMIN']}><AdminVehicles /></ProtectedRoute>} />
            <Route path="/admin/feedback" element={<ProtectedRoute roles={['ADMIN']}><AdminFeedback /></ProtectedRoute>} />

            {/* Department */}
            <Route path="/department" element={<ProtectedRoute roles={['DEPARTMENT', 'ADMIN']}><DepartmentDashboard /></ProtectedRoute>} />
            <Route path="/department/emergencies" element={<ProtectedRoute roles={['DEPARTMENT', 'ADMIN']}><DepartmentEmergencies /></ProtectedRoute>} />
            <Route path="/department/responders" element={<ProtectedRoute roles={['DEPARTMENT', 'ADMIN']}><DepartmentResponders /></ProtectedRoute>} />
            <Route path="/department/vehicles" element={<ProtectedRoute roles={['DEPARTMENT', 'ADMIN']}><DepartmentVehicles /></ProtectedRoute>} />

            {/* Responder */}
            <Route path="/responder" element={<ProtectedRoute roles={['RESPONDER', 'ADMIN']}><ResponderDashboard /></ProtectedRoute>} />
            <Route path="/responder/emergencies" element={<ProtectedRoute roles={['RESPONDER', 'ADMIN']}><ResponderEmergencies /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
