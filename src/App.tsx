import { Routes, Route } from 'react-router-dom';

// Public
import Landing from './pages/Landing';
import BuildingSelect from './pages/BuildingSelect';
import EmployeePortal from './pages/EmployeePortal';
import VisitorPortal from './pages/VisitorPortal';

// Admin
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

      {/* ── Admin routes (with sidebar via Layout) ─────────── */}
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/map" element={<ParkingMapPage />} />
      <Route path="/admin/vehicles" element={<Placeholder titleAr="المركبات" titleEn="Vehicles" />} />
      <Route path="/admin/employees" element={<Placeholder titleAr="الموظفون" titleEn="Employees" />} />
      <Route path="/admin/visitors" element={<Placeholder titleAr="الزوار" titleEn="Visitors" />} />
      <Route path="/admin/reports" element={<Placeholder titleAr="التقارير" titleEn="Reports" />} />
      <Route path="/admin/notifications" element={<Placeholder titleAr="الإشعارات" titleEn="Notifications" />} />
      <Route path="/admin/settings" element={<Placeholder titleAr="الإعدادات" titleEn="Settings" />} />
    </Routes>
  );
}
