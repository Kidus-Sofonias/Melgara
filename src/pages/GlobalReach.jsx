import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import GlobeReach from "../components/GlobeReach";
import { COMPANY, COUNTRIES_AM } from "../data/ores";
import { useLang } from "../context/LanguageContext";

export default function GlobalReach() {
  const { t, lang } = useLang();
  const countries = lang === "am" ? COUNTRIES_AM : COMPANY.countries;
  const logistics = [
    ["🛣", t("reach.land"), t("reach.landText")],
    ["🚢", t("reach.sea"), t("reach.seaText")],
    ["🚆", t("reach.rail"), t("reach.railText")],
    ["✈️", t("reach.air"), t("reach.airText")],
  ];

  return (
    <>
      <section className="section" style={{ paddingTop: 150 }}>
        <div className="container">
          <Reveal>
            <p className="eyebrow">{t("global.eyebrow")}</p>
            <h1 className="sec-title">{t("reach.title")}</h1>
            <p className="sec-sub">{t("reach.sub")}</p>
          </Reveal>
          <Reveal delay={120}>
            <div style={{ marginTop: 44 }}>
              <GlobeReach />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <Reveal>
            <p className="eyebrow">{t("reach.footprint")}</p>
            <h2 className="sec-title" style={{ fontSize: "clamp(22px, 2.6vw, 34px)" }}>
              {t("reach.footprintTitle")}
            </h2>
          </Reveal>
          <div className="grid grid-4" style={{ marginTop: 40 }}>
            {countries.map((c, i) => (
              <Reveal key={c.name} delay={(i % 4) * 70}>
                <div className="card" style={{ textAlign: "center", minHeight: 130 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>
                    {c.name}
                  </div>
                  <div style={{ color: "var(--copper-bright)", fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", margin: "6px 0 8px" }}>
                    {c.region}
                  </div>
                  <p style={{ color: "var(--muted)", fontSize: 13 }}>{c.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-2)" }}>
        <div className="container">
          <Reveal>
            <p className="eyebrow">{t("reach.logistics")}</p>
            <h2 className="sec-title" style={{ fontSize: "clamp(22px, 2.6vw, 34px)" }}>
              {t("reach.logisticsTitle")}
            </h2>
          </Reveal>
          <div className="grid grid-4" style={{ marginTop: 40 }}>
            {logistics.map(([icon, title, text], i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="card" style={{ textAlign: "center", minHeight: 145 }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
                  <h3 style={{ fontSize: 16, marginBottom: 6 }}>{title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: 13 }}>{text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="card" style={{ marginTop: 40, textAlign: "center", borderColor: "rgba(200,121,62,0.3)" }}>
              <h3 style={{ fontSize: 20 }}>
                {t("reach.hqLine", { hq: COMPANY.hq, hub: COMPANY.hub })}
              </h3>
              <p className="sec-sub" style={{ marginInline: "auto" }}>
                {t("reach.fromHq", { hq: COMPANY.hq, email: COMPANY.email[0] })}
              </p>
              <Link to="/contact" className="btn btn-primary" style={{ marginTop: 22 }}>
                {t("reach.startShipping")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
