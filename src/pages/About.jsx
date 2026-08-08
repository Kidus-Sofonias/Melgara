import { Link } from "react-router-dom";
import OreCanvas3D from "../components/OreCanvas3D";
import Reveal from "../components/Reveal";
import { COMPANY, TIMELINE, TIMELINE_AM, VALUES, VALUES_AM } from "../data/ores";
import { useLang } from "../context/LanguageContext";

function Pillars() {
  const { t } = useLang();
  const pillars = [
    { icon: "⛏", title: t("about.pillar1Title"), text: t("about.pillar1Text") },
    { icon: "⚙️", title: t("about.pillar2Title"), text: t("about.pillar2Text") },
    { icon: "🚢", title: t("about.pillar3Title"), text: t("about.pillar3Text") },
  ];

  return (
    <div className="grid grid-3" style={{ marginTop: 46 }}>
      {pillars.map((p, i) => (
        <Reveal key={p.title} delay={i * 90}>
          <div className="card" style={{ minHeight: 230 }}>
            <div style={{ fontSize: 40, marginBottom: 18 }}>{p.icon}</div>
            <h3 style={{ fontSize: 21, marginBottom: 10 }}>{p.title}</h3>
            <p style={{ color: "var(--muted)", fontSize: 14.5 }}>{p.text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export default function About() {
  const { t, pick, lang } = useLang();
  const timeline = lang === "am" ? TIMELINE_AM : TIMELINE;
  const values = lang === "am" ? VALUES_AM : VALUES;
  const company = pick(COMPANY);

  return (
    <>
      <section
        className="hero"
        style={{ minHeight: "78vh", background: "radial-gradient(ellipse at 70% 40%, rgba(201,162,39,0.1), var(--bg) 60%)" }}
      >
        <div className="hero-canvas" aria-hidden="true">
          <OreCanvas3D
            color="#7a4e2e"
            veinColor="#b36a3c"
            patina="#3a2a1c"
            roughness={0.72}
            metalness={0.55}
            seed={9}
            intensity={0.9}
            photo="/ores/iron.jpg"
          />
        </div>
        <div className="container hero-content">
          <p className="hero-kicker">{t("about.kicker")}</p>
          <h1 className="hero-title" style={{ fontSize: "clamp(40px, 6vw, 80px)" }}>
            {t("about.title")}
          </h1>
          <p className="hero-sub">{t("about.sub")}</p>
          <div className="hero-ctas">
            <Link to="/ores" className="btn btn-primary">
              {t("about.ores")}
            </Link>
            <Link to="/contact" className="btn btn-ghost">
              {t("about.workWithUs")}
            </Link>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <Reveal>
            <div className="card" style={{ padding: "clamp(28px, 5vw, 56px)" }}>
              <p className="eyebrow">{t("about.standard")}</p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(20px, 2.6vw, 30px)",
                  lineHeight: 1.45,
                  color: "var(--text)",
                  maxWidth: "70ch",
                }}
              >
                {company.since}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <p className="eyebrow">{t("about.since", { year: COMPANY.founded })}</p>
            <h2 className="sec-title">{t("about.quarter")}</h2>
          </Reveal>
          <div className="grid grid-2" style={{ marginTop: 44, gap: 60 }}>
            <Reveal>
              <div className="timeline">
                {timeline.map((tl) => (
                  <div className="tl-item" key={tl.title}>
                    <div className="tl-year">{tl.year}</div>
                    <div className="tl-title">{tl.title}</div>
                    <p>{tl.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <div>
              <Reveal delay={120}>
                <div
                  style={{
                    borderRadius: 18,
                    border: "1px solid var(--line)",
                    overflow: "hidden",
                    background: "radial-gradient(circle at 50% 40%, rgba(200,121,62,0.12), transparent 70%)",
                    aspectRatio: "4/3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <OreCanvas3D
                    color="#3f3f44"
                    veinColor="#8f9096"
                    patina={null}
                    roughness={0.95}
                    metalness={0.3}
                    seed={12}
                    intensity={0.8}
                  />
                </div>
              </Reveal>
              <Reveal delay={200}>
                <p className="sec-sub" style={{ marginTop: 26 }}>
                  {t("about.staff", { langs: COMPANY.languages })}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-2)" }}>
        <div className="container">
          <Reveal>
            <p className="eyebrow">{t("about.whatEyebrow")}</p>
            <h2 className="sec-title">{t("about.whatTitle")}</h2>
          </Reveal>
          <Pillars />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <p className="eyebrow">{t("about.valuesEyebrow")}</p>
            <h2 className="sec-title">{t("about.valuesTitle")}</h2>
          </Reveal>
          <div className="grid grid-4" style={{ marginTop: 44 }}>
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="card" style={{ minHeight: 210 }}>
                  <div style={{ fontSize: 36, marginBottom: 16 }}>{v.icon}</div>
                  <h3 style={{ fontSize: 18, marginBottom: 8 }}>{v.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: 14 }}>{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Quote */}
      <section className="section" style={{ background: "var(--bg-2)" }}>
        <div className="container" style={{ maxWidth: 800, textAlign: "center" }}>
          <Reveal>
            <div style={{ fontSize: 56, color: "var(--copper)", lineHeight: 1, marginBottom: 16 }}>
              &ldquo;
            </div>
            <blockquote
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(20px, 2.4vw, 28px)",
                lineHeight: 1.5,
                color: "var(--text)",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              {COMPANY.quote}
            </blockquote>
            <div style={{ marginTop: 28 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "var(--copper-bright)",
                }}
              >
                {COMPANY.founder}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  color: "var(--muted)",
                  letterSpacing: "0.06em",
                  marginTop: 4,
                }}
              >
                {COMPANY.founderRole}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ textAlign: "center", paddingTop: 30 }}>
        <div className="container">
          <Reveal>
            <h2 className="sec-title" style={{ marginInline: "auto" }}>
              {t("about.partner")}
            </h2>
            <p className="sec-sub" style={{ marginInline: "auto" }}>
              {t("about.partnerSub")}
            </p>
            <Link to="/contact" className="btn btn-primary" style={{ marginTop: 30 }}>
              {t("about.getInTouch")}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
