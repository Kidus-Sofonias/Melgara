import { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "react-router-dom";
import OreCanvas3D from "./OreCanvas3D";
import { useLang } from "../context/LanguageContext";

export default function OreCarousel({ ores }) {
  const { t, pick } = useLang();
  const total = ores.length;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      containScroll: "trimSnaps",
      skipSnaps: false,
    },
    [
      Autoplay({
        delay: 4500,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      }),
    ]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);

  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );

  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollPrev, scrollNext]);

  // Animated progress bar (fills over the autoplay delay, resets on slide change)
  useEffect(() => {
    if (!emblaApi) return;

    // Reset progress on slide change
    setProgress(0);
    clearInterval(progressInterval.current);

    // Animate progress from 0 to 100 over the autoplay delay
    const duration = 4500; // matches autoplay delay
    const step = 50; // update every 50ms
    let elapsed = 0;

    progressInterval.current = setInterval(() => {
      elapsed += step;
      setProgress(Math.min((elapsed / duration) * 100, 100));
    }, step);

    return () => clearInterval(progressInterval.current);
  }, [selectedIndex, emblaApi]);

  // Pause progress on hover
  const handleMouseEnter = () => clearInterval(progressInterval.current);
  const handleMouseLeave = () => {
    if (!emblaApi) return;
    const duration = 4500;
    const step = 50;
    let elapsed = (progress / 100) * duration;
    progressInterval.current = setInterval(() => {
      elapsed += step;
      setProgress(Math.min((elapsed / duration) * 100, 100));
    }, step);
  };

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div
      className="ore-carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="Ore catalog carousel"
      aria-roledescription="carousel"
    >
      <div className="ore-carousel-viewport" ref={emblaRef}>
        <div className="ore-carousel-track">
          {ores.map((o, i) => {
            const oo = pick(o);
            const isActive = i === selectedIndex;
            return (
              <div
                key={o.slug}
                className={`ore-carousel-slide ${isActive ? "is-active" : ""}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${total}: ${oo.name}`}
              >
                <Link
                  to={`/ores/${o.slug}`}
                  className={`card ore-carousel-card ${isActive ? "ore-carousel-card--active" : ""}`}
                  tabIndex={isActive ? 0 : -1}
                  aria-label={`View ${oo.name} specifications`}
                >
                  <div className="ore-carousel-canvas">
                    <OreCanvas3D
                      color={o.color}
                      veinColor={o.veinColor}
                      patina={o.patina}
                      roughness={o.roughness}
                      metalness={o.metalness}
                      seed={o.seed}
                      intensity={isActive ? 1 : 0.6}
                      detail={isActive ? 48 : 18}
                      dpr={isActive ? 2 : 1}
                      lite={!isActive}
                      photo={o.photo}
                      modelPath={o.modelPath}
                    />
                  </div>
                  <div className="ore-carousel-info">
                    <span
                      className="chip"
                      style={{
                        marginBottom: 12,
                        borderColor: isActive
                          ? "var(--copper)"
                          : "var(--line)",
                        color: isActive
                          ? "var(--copper-bright)"
                          : "var(--muted)",
                      }}
                    >
                      <span className="dot" />
                      {o.family === "Metallic"
                        ? t("filter.metallic")
                        : t("filter.nonmetallic")}
                    </span>
                    <h3
                      style={{
                        fontSize: isActive ? 26 : 20,
                        transition: "font-size 0.4s var(--ease-out)",
                      }}
                    >
                      {oo.name}
                    </h3>
                    <p
                      style={{
                        color: "var(--copper-bright)",
                        fontFamily: "var(--font-display)",
                        fontSize: 14,
                        letterSpacing: "0.06em",
                        margin: "8px 0 10px",
                      }}
                    >
                      {oo.grade}
                    </p>
                    <p
                      className="ore-carousel-blurb"
                      style={{
                        color: "var(--muted)",
                        fontSize: 14,
                        maxHeight: isActive ? 80 : 0,
                        opacity: isActive ? 1 : 0,
                        overflow: "hidden",
                        transition:
                          "max-height 0.5s var(--ease-out), opacity 0.4s var(--ease-out)",
                      }}
                    >
                      {oo.blurb}
                    </p>
                    <span
                      className="btn btn-primary btn-sm"
                      style={{
                        marginTop: 16,
                        opacity: isActive ? 1 : 0.5,
                        transform: isActive ? "none" : "scale(0.9)",
                        transition:
                          "opacity 0.4s var(--ease-out), transform 0.4s var(--ease-out)",
                        pointerEvents: isActive ? "auto" : "none",
                      }}
                    >
                      {t("ores.viewSpecs")}
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress bar — fills as autoplay timer counts down */}
      <div className="ore-carousel-progress-wrap">
        <div
          className="ore-carousel-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Counter + Dots row */}
      <div className="ore-carousel-controls">
        <div className="ore-carousel-counter">
          <span className="ore-carousel-counter-current">
            {String(selectedIndex + 1).padStart(2, "0")}
          </span>
          <span className="ore-carousel-counter-sep">/</span>
          <span className="ore-carousel-counter-total">
            {String(total).padStart(2, "0")}
          </span>
        </div>

        <div className="ore-carousel-dots">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              className={`ore-carousel-dot ${i === selectedIndex ? "is-active" : ""}`}
              onClick={() => scrollTo(i)}
              aria-label={`Go to ore ${i + 1}`}
              aria-current={i === selectedIndex ? "true" : undefined}
            />
          ))}
        </div>

        {/* Arrow controls */}
        <div className="ore-carousel-arrows">
          <button
            className="ore-carousel-arrow"
            onClick={scrollPrev}
            aria-label="Previous ore (or press left arrow)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            className="ore-carousel-arrow"
            onClick={scrollNext}
            aria-label="Next ore (or press right arrow)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
