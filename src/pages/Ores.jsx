import { useState } from "react";
import { Link } from "react-router-dom";
import OreCarousel from "../components/OreCarousel";
import Reveal from "../components/Reveal";
import { ORES } from "../data/ores";
import { useLang } from "../context/LanguageContext";

function Ores() {
  const { t } = useLang();
  const FILTERS = [
    { id: "all", labelKey: "filter.all" },
    { id: "metallic", labelKey: "filter.metallic" },
    { id: "nonmetallic", labelKey: "filter.nonmetallic" },
  ];
  const [filter, setFilter] = useState("all");
  const visible = ORES.filter((o) => {
    if (filter === "all") return true;
    const famId = o.family === "Metallic" ? "metallic" : "nonmetallic";
    return famId === filter;
  });

  return (
    <section className="section" style={{ paddingTop: 150, minHeight: "70vh" }}>
      <div className="container">
        <Reveal>
          <p className="eyebrow">{t("catalog.eyebrow")}</p>
          <h1 className="sec-title">{t("catalog.title")}</h1>
          <p className="sec-sub">{t("catalog.sub")}</p>
        </Reveal>

        <Reveal delay={100}>
          <div className="filter-row" style={{ display: "flex", gap: 12, margin: "40px 0 10px", flexWrap: "wrap" }}>
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className="chip"
                onClick={() => setFilter(f.id)}
                style={{
                  cursor: "pointer",
                  borderColor: filter === f.id ? "var(--copper)" : "var(--line)",
                  color: filter === f.id ? "var(--copper-bright)" : "var(--text-dim)",
                  background: filter === f.id ? "rgba(200,121,62,0.1)" : "transparent",
                }}
              >
                {t(f.labelKey)}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Carousel Section */}
        <div style={{ marginTop: 34 }}>
          <OreCarousel ores={visible} />
        </div>

        <Reveal delay={100}>
          <div className="card ores-cta" style={{ marginTop: 40, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap", borderColor: "rgba(200,121,62,0.3)" }}>
            <div>
              <h3 style={{ fontSize: 22 }}>{t("ores.ctaTitle")}</h3>
              <p style={{ color: "var(--muted)", fontSize: 14.5, marginTop: 6, maxWidth: "52ch" }}>
                {t("ores.ctaSub")}
              </p>
            </div>
            <Link to="/contact" className="btn btn-primary">
              {t("ores.ctaBtn")}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Ores;
