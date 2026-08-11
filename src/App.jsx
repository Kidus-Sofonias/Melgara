import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import GrainOverlay from "./components/GrainOverlay";
import BackToTop from "./components/BackToTop";
import PageTransition from "./components/PageTransition";
import PageLoader from "./components/PageLoader";

/* Route-level code splitting — each page becomes its own JS chunk so
   the entry bundle stays small and only the visited page loads. */
const Home = lazy(() => import("./pages/Home"));
const Ores = lazy(() => import("./pages/Ores"));
const OreDetail = lazy(() => import("./pages/OreDetail"));
const About = lazy(() => import("./pages/About"));
const GlobalReach = lazy(() => import("./pages/GlobalReach"));
const Transparency = lazy(() => import("./pages/Transparency"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const location = useLocation();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    window.__lenis = lenis;
    return () => {
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
  }, [location.pathname]);

  return (
    <>
      <ScrollProgress />
      <GrainOverlay />
      <BackToTop />
      <Navbar />
      <PageTransition key={location.pathname}>
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/ores" element={<Ores />} />
            <Route path="/ores/:slug" element={<OreDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/global-reach" element={<GlobalReach />} />
            <Route path="/transparency" element={<Transparency />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageTransition>
      <Footer />
    </>
  );
}

export default App;
