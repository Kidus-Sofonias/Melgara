import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import GrainOverlay from "./components/GrainOverlay";
import PageTransition from "./components/PageTransition";
import Home from "./pages/Home";
import Ores from "./pages/Ores";
import OreDetail from "./pages/OreDetail";
import About from "./pages/About";
import GlobalReach from "./pages/GlobalReach";
import Transparency from "./pages/Transparency";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

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
      <Navbar />
      <PageTransition key={location.pathname}>
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
      </PageTransition>
      <Footer />
    </>
  );
}

export default App;
