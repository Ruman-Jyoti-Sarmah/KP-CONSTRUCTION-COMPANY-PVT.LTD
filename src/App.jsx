import { useEffect } from "react";
import { initSmoothScroll, destroySmoothScroll } from "./animations/smoothScroll.js";
import { attachReveals, ScrollTrigger } from "./animations/gsap.js";
import { writeJourneyState, applyMobileJourney } from "./three/journeyState.js";
import JourneyScene from "./three/JourneyScene.jsx";
import Cursor from "./components/Cursor.jsx";
import Navigation from "./components/Navigation.jsx";
import Intro3D from "./sections/Intro3D.jsx";
import Marquee from "./components/Marquee.jsx";
import Projects from "./sections/Projects.jsx";
import Services from "./sections/Services.jsx";
import About from "./sections/About.jsx";
import DarkAccent from "./sections/DarkAccent.jsx";
import Process from "./sections/Process.jsx";
import Blueprint from "./sections/Blueprint.jsx";
import Materials from "./sections/Materials.jsx";
import FinalCta from "./sections/FinalCta.jsx";
import Footer from "./sections/Footer.jsx";
import { marquee } from "./data/content.js";

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("lenis");
    const lenis = initSmoothScroll();

    // Global reveal observer for [data-reveal] elements.
    const killReveals = attachReveals(document.getElementById("main"));
    const t = setTimeout(() => ScrollTrigger.refresh(), 1600);

    return () => {
      clearTimeout(t);
      if (killReveals) killReveals();
      destroySmoothScroll();
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  // Drive the 3D journey from real page scroll progress. Exactly one
  // journey scene is mounted (mobile variant), driven here via the
  // global progress of the whole document — no fake pinning containers.
  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    applyMobileJourney(isMobile);
    let ticking = false;

    const compute = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      writeJourneyState(p);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        compute();
        ScrollTrigger.update();
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    compute();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Fixed 3D journey background layer — sits behind all HTML content.
  const journeyLayer = <JourneyScene />;

  return (
    <div id="top" className="grain text-charcoal">
      <a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>
      <Cursor />
      <Navigation />

      {/* Fixed 3D architectural environment for the whole page */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        {journeyLayer}
      </div>

      <main id="main" className="relative z-10" aria-label="Main content">
        <Intro3D />
        <Marquee items={marquee} className="section-pad-sm" duration={30} size="text-3xl sm:text-4xl" />
        <Projects />
        <Services />
        <About />
        <Process />
        <Blueprint />
        <DarkAccent />
        <Materials />
        <FinalCta />
      </main>

      <Footer />
    </div>
  );
}