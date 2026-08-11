/* ================================================================
   ORE IMAGE — real specimen photography in a framed tile
   Shows the actual ore photo (public/ores/*.jpg) with a soft
   color-matched glow, subtle vignette and hover zoom.
   ================================================================ */
export default function OreImage({
  src,
  alt = "",
  color = "#c0561f",
  className = "",
  style,
  eager = false,
}) {
  return (
    <div
      className={`ore-image ${className}`}
      style={{ ...style, "--ore-glow": `${color}44` }}
    >
      <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} />
    </div>
  );
}
