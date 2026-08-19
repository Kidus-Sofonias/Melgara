import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";

export default function NotFound() {
  const { t } = useLang();
  return (
    <section
      className="hero"
      style={{
        minHeight: "100vh",
        textAlign: "center",
        background: "radial-gradient(ellipse at 50% 45%, rgba(200,121,62,0.12), var(--bg) 65%)",
      }}
    >
      <div className="hero-canvas" aria-hidden="true">
        <img
          src="/images/mining-machinery-2.jpg"
          alt="Mining site"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.4,
          }}
        />
      </div>
      <div className="container hero-content">
        <p className="hero-kicker" style={{ justifyContent: "center" }}>
          {t("nf.kicker")}
        </p>
        <h1 className="hero-title" style={{ marginInline: "auto" }}>
          {t("nf.title")}
        </h1>
        <p className="sec-sub" style={{ marginInline: "auto" }}>
          {t("nf.sub")}
        </p>
        <div className="hero-ctas" style={{ justifyContent: "center" }}>
          <Link to="/" className="btn btn-primary">
            {t("nf.backHome")}
          </Link>
          <Link to="/ores" className="btn btn-ghost">
            {t("nf.explore")}
          </Link>
        </div>
      </div>
    </section>
  );
}
