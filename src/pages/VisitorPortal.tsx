import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import VisitorHeader from '../components/visitor/VisitorHeader';
import HeroSection from '../components/visitor/HeroSection';
import FeatureCards from '../components/visitor/FeatureCards';
import VisitorFooter from '../components/visitor/VisitorFooter';
import BookingWizard from '../components/visitor/BookingWizard';
import TrackVisit from '../components/visitor/TrackVisit';

type View = 'home' | 'book' | 'track';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export default function VisitorPortal() {
  const [view, setView] = useState<View>('home');

  return (
    <div className="min-h-screen bg-white">
      <VisitorHeader
        view={view}
        onHome={() => setView('home')}
        onNewVisit={() => setView('book')}
        onTrackVisit={() => setView('track')}
      />

      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <HeroSection
              onNewVisit={() => setView('book')}
              onTrackVisit={() => setView('track')}
            />
            <FeatureCards />
            <VisitorFooter />
          </motion.div>
        )}

        {view === 'book' && (
          <motion.div key="book" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <BookingWizard onBack={() => setView('home')} />
          </motion.div>
        )}

        {view === 'track' && (
          <motion.div key="track" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <TrackVisit onBack={() => setView('home')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
