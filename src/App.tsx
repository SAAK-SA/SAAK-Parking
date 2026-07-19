import { Routes, Route } from 'react-router-dom';

// Public
import Landing from './pages/Landing';
import BuildingSelect from './pages/BuildingSelect';
import EmployeePortal from './pages/EmployeePortal';
import VisitorPortal from './pages/VisitorPortal';

// Admin auth
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Admin (protected)
import Dashboard from './pages/Dashboard';
import ParkingMapPage from './pages/ParkingMapPage';
import Placeholder from './pages/Placeholder';

export default function App() {
  return (
    <Routes>
      {/* ── Public routes (no sidebar) ─────────────────────── */}
      <Route path="/" element={<Landing />} />
      <Route path="/building/:buildingId" element={<BuildingSelect />} />
      <Route path="/employee/:buildingId" element={<EmployeePortal />} />
      <Route path="/visitor/:buildingId" element={<VisitorPortal />} />

      {/* ── Admin login ────────────────────────────────────── */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ── Admin routes (protected + sidebar) ─────────────── */}
      <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/map" element={<ProtectedRoute><ParkingMapPage /></ProtectedRoute>} />
      <Route path="/admin/vehicles" element={<ProtectedRoute><Placeholder titleAr="المركبات" titleEn="Vehicles" /></ProtectedRoute>} />
      <Route path="/admin/employees" element={<ProtectedRoute><Placeholder titleAr="الموظفون" titleEn="Employees" /></ProtectedRoute>} />
      <Route path="/admin/visitors" element={<ProtectedRoute><Placeholder titleAr="الزوار" titleEn="Visitors" /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute><Placeholder titleAr="التقارير" titleEn="Reports" /></ProtectedRoute>} />
      <Route path="/admin/notifications" element={<ProtectedRoute><Placeholder titleAr="الإشعارات" titleEn="Notifications" /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute><Placeholder titleAr="الإعدادات" titleEn="Settings" /></ProtectedRoute>} />
    </Routes>
  );
}
