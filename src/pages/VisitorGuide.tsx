import { useLenis } from '../guide/useLenis';
import ScrollProgress from '../guide/ScrollProgress';
import CustomCursor from '../guide/CustomCursor';
import Hero from '../guide/sections/Hero';
import Welcome from '../guide/sections/Welcome';
import BeforeEntering from '../guide/sections/BeforeEntering';
import Journey from '../guide/sections/Journey';
import SafetyRules from '../guide/sections/SafetyRules';
import Restricted from '../guide/sections/Restricted';
import Facilities from '../guide/sections/Facilities';
import Emergency from '../guide/sections/Emergency';
import FAQ from '../guide/sections/FAQ';
import ThankYou from '../guide/sections/ThankYou';
import GuideFooter from '../guide/sections/GuideFooter';

export default function VisitorGuide() {
  useLenis();
  return (
    <div className="bg-white text-[#0B1B33] overflow-x-hidden [scrollbar-gutter:stable]">
      <ScrollProgress />
      <CustomCursor />
      <main>
        <Hero />
        <Welcome />
        <BeforeEntering />
        <Journey />
        <SafetyRules />
        <Restricted />
        <Facilities />
        <Emergency />
        <FAQ />
        <ThankYou />
      </main>
      <GuideFooter />
    </div>
  );
}
