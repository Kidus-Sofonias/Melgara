import { useParams, Link, Navigate } from "react-router-dom";
import OreCanvas3D from "../components/OreCanvas3D";
import Reveal from "../components/Reveal";
import { ORES, COMPANY, INDUSTRIES_AM } from "../data/ores";
import { useLang } from "../context/LanguageContext";

function SpecTable({ variety }) {
  const { t } = useLang();
  return (
    <div className="card spec-card" style={{ padding: 0, overflow: "hidden" }}>
      <div
        style={{
          padding: "18px 22px",
          borderBottom: "1px solid var(--line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3 style={{ fontSize: 19 }}>{variety.name}</h3>
          <p style={{ color: "var(--copper-bright)", fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: "0.06em", marginTop: 4 }}>
            {variety.grade}
          </p>
        </div>
        {variety.specPdf ? (
          <a
            className="btn btn-primary btn-sm"
            href={variety.specPdf}
            download
            target="_blank"
            rel="noreferrer"
          >
            {t("detail.specSheet")}
          </a>
        ) : (
          <span className="chip">
            <span className="dot" /> {t("detail.specOnRequest")}
          </span>
        )}
      </div>
      {variety.analysis.length > 0 && (
        <div className="table-wrap">
          <table className="spec-table">
            <thead>
              <tr>
                <th>{t("detail.thComponent")}</th>
                <th>{t("detail.thContent")}</th>
                <th>{t("detail.thUnit")}</th>
              </tr>
            </thead>
            <tbody>
              {variety.analysis.map(([comp, val, unit]) => (
                <tr key={comp}>
                  <td>{comp}</td>
                  <td className="val">{val}</td>
                  <td>{unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function OreDetail() {
  const { slug } = useParams();
  const { t, pick, lang } = useLang();
  const ore = ORES.find((o) => o.slug === slug);
  if (!ore) return <Navigate to="/ores" replace />;

  const oo = pick(ore);
  const varieties = oo.varieties.map((v, i) => ({
    ...v,
    specPdf: ore.varieties[i]?.specPdf,
    analysis: v.analysis || ore.varieties[i]?.analysis || [],
  }));
  const minerals = oo.minerals || null;
  const familyLabel =
    ore.family === "Metallic" ? t("family.metallic") : t("family.nonmetallic");
  const industries = lang === "am" ? INDUSTRIES_AM : COMPANY.industries;

  return (
    <>
      {/* Hero */}
      <section
        className="hero"
        style={{ minHeight: "82vh", background: "radial-gradient(ellipse at 30% 40%, rgba(200,121,62,0.1), var(--bg) 60%)" }}
      >
        <div className="hero-canvas" aria-hidden="true">
          <OreCanvas3D
            color={ore.color}
            veinColor={ore.veinColor}
            patina={ore.patina}
            roughness={ore.roughness}
            metalness={ore.metalness}
            seed={ore.seed}
            intensity={1}
            photo={ore.photo}
            modelPath={ore.modelPath}
          />
        </div>
        <div className="container hero-content">
          <p className="hero-kicker">{familyLabel}</p>
          <h1 className="hero-title" style={{ fontSize: "clamp(38px, 5.5vw, 72px)" }}>
            {oo.name}
          </h1>
          <p className="hero-sub">{oo.heroTagline}</p>
          <div className="hero-ctas">
            <a className="btn btn-primary" href="#analysis">
              {t("detail.viewAnalysis")}
            </a>
            <Link className="btn btn-ghost" to="/contact">
              {t("detail.quote")}
            </Link>
          </div>
        </div>
      </section>

      {/* Blurb + at a glance */}
      <section className="section-tight">
        <div className="container">
          <Reveal>
            <div className="grid grid-2" style={{ gap: 40, alignItems: "start" }}>
              <div>
                <p className="eyebrow">{t("detail.overview")}</p>
                <h2 className="sec-title" style={{ fontSize: "clamp(26px, 3vw, 38px)" }}>
                  {oo.headline}
                </h2>
                <p className="sec-sub">{oo.blurb}</p>
                {ore.photoCredit && (
                  <p style={{ color: "var(--faint)", fontSize: 12, marginTop: 14 }}>
                    📷 {ore.photoCredit}
                  </p>
                )}
                {minerals && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
                    {minerals.map((m) => (
                      <span className="chip" key={m}>
                        <span className="dot" /> {m}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="card grade-card" style={{ textAlign: "center", padding: 36 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)" }}>
                  {t("detail.availableGrade")}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(34px, 4.5vw, 56px)", color: "var(--copper-bright)", margin: "14px 0 4px" }}>
                  {oo.grade}
                </div>
                <div style={{ color: "var(--muted)", fontSize: 14 }}>
                  {t("detail.gradeNote")}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Chemical analysis */}
      <section className="section" id="analysis" style={{ background: "var(--bg-2)" }}>
        <div className="container">
          <Reveal>
            <p className="eyebrow">{t("detail.analysisEyebrow")}</p>
            <h2 className="sec-title" style={{ fontSize: "clamp(26px, 3vw, 42px)" }}>
              {t("detail.analysisTitle")}
            </h2>
            <p className="sec-sub">{t("detail.analysisSub")}</p>
          </Reveal>
          <div className="grid grid-2" style={{ marginTop: 44 }}>
            {varieties.map((v, i) => (
              <Reveal key={v.name} delay={i * 100}>
                <SpecTable variety={v} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="eyebrow">{t("detail.applications")}</p>
            <h2 className="sec-title" style={{ fontSize: "clamp(26px, 3vw, 42px)" }}>
              {t("detail.powers")}
            </h2>
          </Reveal>
          <div className="grid app-grid" style={{ gap: 16, marginTop: 40 }}>
            {industries.slice(0, 6).map((ind, i) => (
              <Reveal key={ind} delay={(i % 3) * 70}>
                <div className="card" style={{ padding: "20px", textAlign: "center", fontFamily: "var(--font-display)", fontSize: 14.5 }}>
                  {ind}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Related ores */}
      <section className="section" style={{ background: "var(--bg-2)" }}>
        <div className="container">
          <Reveal>
            <p className="eyebrow">{t("detail.moreEyebrow")}</p>
            <h2 className="sec-title" style={{ fontSize: "clamp(26px, 3vw, 42px)" }}>
              {t("detail.related")}
            </h2>
          </Reveal>
          <div className="grid grid-4" style={{ marginTop: 40 }}>
            {ORES.filter((o) => o.slug !== ore.slug)
              .slice(0, 4)
              .map((o, i) => {
                const rel = pick(o);
                return (
                  <Reveal key={o.slug} delay={i * 80}>
                    <Link to={`/ores/${o.slug}`} className="card" style={{ display: "block", textAlign: "center", padding: 20 }}>
                      <div style={{ height: 130, borderRadius: 10, overflow: "hidden" }}>
                        <OreCanvas3D
                          color={o.color}
                          veinColor={o.veinColor}
                          patina={o.patina}
                          roughness={o.roughness}
                          metalness={o.metalness}
                          seed={o.seed}
                          intensity={0.7}
                          detail={14}
                          dpr={1}
                          lite
                          photo={o.photo}
                          modelPath={o.modelPath}
                        />
                      </div>
                      <h3 style={{ fontSize: 16, marginTop: 14 }}>{rel.name}</h3>
                      <p style={{ color: "var(--copper-bright)", fontFamily: "var(--font-display)", fontSize: 12, letterSpacing: "0.06em", marginTop: 5 }}>
                        {rel.grade}
                      </p>
                    </Link>
                  </Reveal>
                );
              })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: "center" }}>
        <div className="container">
          <Reveal>
            <h2 className="sec-title" style={{ marginInline: "auto" }}>
              {t("detail.need", { name: oo.name })}
            </h2>
            <p className="sec-sub" style={{ marginInline: "auto" }}>
              {t("detail.needSub")}
            </p>
            <div className="hero-ctas" style={{ justifyContent: "center" }}>
              <Link to="/contact" className="btn btn-primary">
                {t("detail.quote")}
              </Link>
              <a className="btn btn-ghost" href={`mailto:${COMPANY.email[0]}`}>
                {t("detail.emailUs")}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
