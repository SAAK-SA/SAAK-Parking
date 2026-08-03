import BookingWizard from '../components/visitor/BookingWizard';
import VisitorHeader from '../components/visitor/VisitorHeader';

export default function VisitorPortal() {
  return (
    <div className="min-h-screen bg-white">
      <VisitorHeader />
      <BookingWizard onBack={() => { /* no-op — checkout resets in-place */ }} />
    </div>
  );
}
