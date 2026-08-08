import "./Skeleton.css";

/**
 * Reusable skeleton loading component with shimmer animation.
 * Supports: text, circle, rect, card, and custom shapes.
 */
export function Skeleton({
  width,
  height = 16,
  borderRadius = 6,
  className = "",
  style,
  variant = "rect", // rect | text | circle | card
}) {
  const baseClass = `sk sk-${variant} ${className}`;
  const inlineStyle = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...(borderRadius ? { borderRadius } : {}),
    ...style,
  };

  return <div className={baseClass} style={inlineStyle} aria-hidden="true" />;
}

/**
 * Skeleton for ore cards in the carousel or grid.
 */
export function OreCardSkeleton({ compact = false }) {
  return (
    <div className={`sk-card ${compact ? "sk-card--compact" : ""}`}>
      <Skeleton
        variant="rect"
        height={compact ? 140 : 200}
        borderRadius={10}
        className="sk-card-canvas"
      />
      <div className="sk-card-body">
        <Skeleton variant="text" width={80} height={10} borderRadius={12} />
        <Skeleton variant="text" width="70%" height={22} />
        <Skeleton variant="text" width={100} height={14} />
        {!compact && <Skeleton variant="text" width="90%" height={13} />}
        <Skeleton variant="rect" width={110} height={32} borderRadius={4} />
      </div>
    </div>
  );
}

/**
 * Skeleton for the globe section.
 */
export function GlobeSkeleton() {
  return (
    <div className="sk-globe-wrap">
      <div className="sk-globe">
        <Skeleton variant="circle" width="100%" height={0} borderRadius="50%" style={{ paddingBottom: "100%" }} />
        <div className="sk-globe-pulse" />
      </div>
      <div className="sk-globe-legend">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="sk-globe-legend-item">
            <Skeleton variant="circle" width={10} height={10} borderRadius="50%" />
            <div className="sk-globe-legend-text">
              <Skeleton variant="text" width={120} height={14} />
              <Skeleton variant="text" width={160} height={11} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for stat counters.
 */
export function StatSkeleton() {
  return (
    <div className="sk-stat">
      <Skeleton variant="text" width={80} height={42} />
      <Skeleton variant="text" width={140} height={12} />
    </div>
  );
}

/**
 * Full-page skeleton for the ore detail hero.
 */
export function OreHeroSkeleton() {
  return (
    <div className="sk-ore-hero">
      <div className="sk-ore-hero-content">
        <Skeleton variant="text" width={100} height={12} />
        <Skeleton variant="text" width="60%" height={48} />
        <Skeleton variant="text" width="40%" height={18} />
        <div className="sk-ore-hero-ctas">
          <Skeleton variant="rect" width={140} height={44} borderRadius={4} />
          <Skeleton variant="rect" width={120} height={44} borderRadius={4} />
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
