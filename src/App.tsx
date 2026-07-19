import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ParkingMapPage from './pages/ParkingMapPage';
import Placeholder from './pages/Placeholder';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/map" element={<ParkingMapPage />} />
      <Route path="/vehicles" element={<Placeholder titleAr="المركبات" titleEn="Vehicles" />} />
      <Route path="/employees" element={<Placeholder titleAr="الموظفون" titleEn="Employees" />} />
      <Route path="/reports" element={<Placeholder titleAr="التقارير" titleEn="Reports" />} />
      <Route path="/notifications" element={<Placeholder titleAr="الإشعارات" titleEn="Notifications" />} />
      <Route path="/settings" element={<Placeholder titleAr="الإعدادات" titleEn="Settings" />} />
    </Routes>
  );
}
