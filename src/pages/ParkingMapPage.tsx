import Layout from '../components/layout/Layout';
import ParkingMap from '../components/parking/ParkingMap';
import { zones } from '../data/mockData';

export default function ParkingMapPage() {
  return (
    <Layout
      titleAr="خريطة المواقف"
      titleEn="Parking Map"
      subtitle="عرض تفاعلي لحالة جميع المواقف"
    >
      <ParkingMap zones={zones} />
    </Layout>
  );
}
