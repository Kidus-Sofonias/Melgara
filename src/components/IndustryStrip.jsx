import { useEffect, useRef, useState } from "react";

/* ================================================================
   INDUSTRY STRIP — compact interactive chip scroller
   Keeps long lists (industries, applications) short: one swipeable
   row with arrow controls, styled like the ore carousel controls.
   ================================================================ */
export default function IndustryStrip({ items }) {
  const ref = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    const t = setTimeout(update, 350);
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      clearTimeout(t);
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  const nudge = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(220, el.clientWidth * 0.72), behavior: "smooth" });
  };

  const Arrow = ({ dir }) => (
    <button
      type="button"
      className="industry-strip-arrow"
      onClick={() => nudge(dir)}
      disabled={dir < 0 ? !canLeft : !canRight}
      aria-label={dir < 0 ? "Scroll list left" : "Scroll list right"}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points={dir < 0 ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
      </svg>
    </button>
  );

  return (
    <div className="industry-strip">
      <Arrow dir={-1} />
      <div className="industry-strip-viewport" ref={ref} tabIndex={0} role="list">
        {items.map((item) => (
          <span className="chip industry-strip-chip" key={item} role="listitem">
            <span className="dot" /> {item}
          </span>
        ))}
      </div>
      <Arrow dir={1} />
    </div>
  );
}
