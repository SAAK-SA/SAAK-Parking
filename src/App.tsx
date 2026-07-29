import { Routes, Route } from 'react-router-dom';

// Public
import Landing from './pages/Landing';
import BuildingSelect from './pages/BuildingSelect';
import EmployeePortal from './pages/EmployeePortal';
import VisitorPortal from './pages/VisitorPortal';
import VisitorGuide from './pages/VisitorGuide';

// Admin auth
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Admin (protected)
import Dashboard from './pages/Dashboard';
import ParkingMapPage from './pages/ParkingMapPage';
import DailyReport from './pages/DailyReport';
import EmployeesPage from './pages/EmployeesPage';
import Placeholder from './pages/Placeholder';

export default function App() {
  return (
    <Routes>
      {/* ── Public routes (no sidebar) ─────────────────────── */}
      <Route path="/" element={<Landing />} />
      <Route path="/building/:buildingId" element={<BuildingSelect />} />
      <Route path="/employee/:buildingId" element={<EmployeePortal />} />
      <Route path="/visitor/:buildingId" element={<VisitorPortal />} />
      <Route path="/guide" element={<VisitorGuide />} />

      {/* ── Admin login ────────────────────────────────────── */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ── Admin routes (protected + sidebar) ─────────────── */}
      <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/map" element={<ProtectedRoute><ParkingMapPage /></ProtectedRoute>} />
      <Route path="/admin/vehicles" element={<ProtectedRoute><Placeholder titleKey="nav.vehicles" /></ProtectedRoute>} />
      <Route path="/admin/employees" element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>} />
      <Route path="/admin/visitors" element={<ProtectedRoute><Placeholder titleKey="nav.visitors" /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute><DailyReport /></ProtectedRoute>} />
      <Route path="/admin/notifications" element={<ProtectedRoute><Placeholder titleKey="nav.notifications" /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute><Placeholder titleKey="nav.settings" /></ProtectedRoute>} />
    </Routes>
  );
}
