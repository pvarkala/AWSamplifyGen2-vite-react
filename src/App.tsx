import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Layout Components
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import AuthLayout from './components/layout/AuthLayout'

// Public Pages
import Homepage from './features/home/pages/Homepage'
import PublicProfile from './features/profile/pages/PublicProfile'

// Auth Pages
import LoginPage from './features/auth/pages/LoginPage'
import SignupPage from './features/auth/pages/SignupPage'

// App Pages
import DashboardPage from './features/dashboard/pages/DashboardPage'
import ProjectsPage from './features/projects/pages/ProjectsPage'
import KanbanBoardPage from './features/kanban/pages/KanbanBoardPage'
import TasksPage from './features/tasks/pages/TasksPage'
import TimeTrackingPage from './features/time-tracking/pages/TimeTrackingPage'
import AnalyticsPage from './features/analytics/pages/AnalyticsPage'
import TeamChatPage from './features/chat/pages/TeamChatPage'
import ProfilePage from './features/profile/pages/ProfilePage'
import SettingsPage from './features/settings/pages/SettingsPage'

// Error Pages
import NotFoundPage from './features/error/pages/NotFoundPage'
import UnauthorizedPage from './features/error/pages/UnauthorizedPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/s/:username" element={<PublicProfile />} />
          
          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
          </Route>
          
          {/* Protected App Routes */}
          <Route path="/app" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id/kanban" element={<KanbanBoardPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="time-tracking" element={<TimeTrackingPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="chat" element={<TeamChatPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="" element={<Navigate to="dashboard" replace />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AppLayout />
            </ProtectedRoute>
          }>
            {/* Admin-specific routes can go here */}
          </Route>
          
          {/* Error Routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
          
          {/* Legacy redirects */}
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/todos" element={<Navigate to="/app/tasks" replace />} />
          <Route path="/profile" element={<Navigate to="/app/profile" replace />} />
        </Routes>
        
        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
