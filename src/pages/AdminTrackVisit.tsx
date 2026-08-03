import Layout from '../components/layout/Layout';
import TrackVisit from '../components/visitor/TrackVisit';

export default function AdminTrackVisit() {
  return (
    <Layout titleKey="nav.visitors">
      <TrackVisit embedded />
    </Layout>
  );
}
