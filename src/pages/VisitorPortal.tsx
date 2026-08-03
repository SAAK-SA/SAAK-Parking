import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import VisitorHeader from '../components/visitor/VisitorHeader';
import BookingWizard from '../components/visitor/BookingWizard';
import TrackVisit from '../components/visitor/TrackVisit';

type View = 'register' | 'track';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2 } },
};

export default function VisitorPortal() {
  const [view, setView] = useState<View>('register');

  return (
    <div className="min-h-screen bg-white">
      <VisitorHeader
        view={view}
        onRegister={() => setView('register')}
        onTrack={() => setView('track')}
      />

      <AnimatePresence mode="wait">
        {view === 'register' && (
          <motion.div key="register" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <BookingWizard onBack={() => setView('register')} />
          </motion.div>
        )}

        {view === 'track' && (
          <motion.div key="track" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <TrackVisit onBack={() => setView('register')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
