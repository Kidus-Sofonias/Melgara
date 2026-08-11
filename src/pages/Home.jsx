import { Link } from "react-router-dom";
import MiniOreField from "../components/MiniOreField";
import OreCarousel from "../components/OreCarousel";
import GlobeReach from "../components/GlobeReach";
import IndustryStrip from "../components/IndustryStrip";
import Reveal from "../components/Reveal";
import GradeCounter from "../components/GradeCounter";
import {
  ORES,
  STATS,
  STATS_AM,
  COMPANY,
  TIMELINE,
  TIMELINE_AM,
  INDUSTRIES_AM,
  COUNTRIES_AM,
} from "../data/ores";
import { useLang } from "../context/LanguageContext";

function Hero() {
  const { t } = useLang();
  return (
    <section className="hero">
      <div className="hero-canvas" aria-hidden="true">
        <div className="hero-photo" aria-hidden="true">
          <img
            src="/images/hero-mining-excavator-pexels-1.jpg"
            alt=""
            fetchpriority="high"
          />
        </div>
        <div className="hero-ambient" aria-hidden="true">
          <MiniOreField />
        </div>
      </div>
      <div className="container hero-content">
        <p className="hero-kicker">
          {t("home.kicker", { year: COMPANY.founded })}
        </p>
        <h1 className="hero-title">
          {t("home.title1")} <span className="accent">{t("home.title2")}</span>{" "}
          {t("home.title3")}
        </h1>
        <p className="hero-sub">{t("home.sub")}</p>
        <div className="hero-ctas">
          <Link to="/ores" className="btn btn-primary">
            {t("home.explore")}
          </Link>
          <Link to="/contact" className="btn btn-ghost">
            {t("home.quote")}
          </Link>
        </div>
      </div>
      <div className="scroll-cue">
        <span>{t("home.scroll")}</span>
        <div className="line" />
      </div>
    </section>
  );
}

function Stats() {
  const { lang } = useLang();
  const stats = lang === "am" ? STATS_AM : STATS;
  return (
    <section
      className="section-tight"
      style={{ borderTop: "1px solid var(--line)" }}
    >
      <div className="container">
        <div className="grid grid-4">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="stat-num">
                <GradeCounter value={s.value} suffix={s.suffix} />
              </div>
              <div className="stat-label">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function OresPreview() {
  const { t } = useLang();
  return (
    <section className="hero">
      <div className="container">
        <Reveal>
          <p className="eyebrow">{t("ores.eyebrow")}</p>
          <h2 className="sec-title">{t("ores.title")}</h2>
          <p className="sec-sub">{t("ores.sub")}</p>
        </Reveal>
        <div style={{ marginTop: 34 }}>
          <OreCarousel ores={ORES} />
        </div>
        <Reveal delay={100}>
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <Link to="/ores" className="btn btn-ghost">
              {t("ores.learnMore")} →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function AboutTeaser() {
  const { t } = useLang();
  return (
    <section className="section" style={{ background: "var(--bg-2)" }}>
      <div className="container">
        <Reveal>
          <p className="eyebrow">{t("who.eyebrow")}</p>
          <h2 className="sec-title">{t("who.title")}</h2>
          <p className="sec-sub">
            {t("who.sub", {
              founded: COMPANY.founded,
              langs: COMPANY.languages,
            })}
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div
            className="card"
            style={{
              marginTop: 38,
              padding: "32px 30px",
              background: "rgba(255,255,255,0.72)",
              border: "1px solid var(--line)",
              maxWidth: 860,
            }}
          >
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: 15,
                lineHeight: 1.75,
              }}
            >
              {t("who.callout")}
            </p>
            <div
              style={{
                marginTop: 24,
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <Link
                to="/about"
                className="btn btn-primary"
                style={{ minWidth: 170 }}
              >
                {t("who.learnMore")}
              </Link>
              <Link
                to="/ores"
                className="btn btn-ghost"
                style={{ minWidth: 170 }}
              >
                {t("ores.explore")}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Industries() {
  const { t, lang } = useLang();
  const industries = lang === "am" ? INDUSTRIES_AM : COMPANY.industries;
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <p className="eyebrow">{t("ind.eyebrow")}</p>
          <h2 className="sec-title">{t("ind.title")}</h2>
          <p className="sec-sub">{t("ind.sub")}</p>
        </Reveal>
        <Reveal delay={120}>
          <IndustryStrip items={industries} />
        </Reveal>
      </div>
    </section>
  );
}

function TeamSection() {
  const { t } = useLang();
  const highlight = COMPANY.team.find((member) => member.highlight);
  return (
    <section
      className="section"
      style={{ background: "var(--bg-2)", paddingTop: 52, paddingBottom: 52 }}
    >
      <div className="container">
        <Reveal>
          <p className="eyebrow">{t("about.eyebrow") || "OUR TEAM"}</p>
          <h2 className="sec-title">
            {t("who.title") || "The People Behind the Minerals"}
          </h2>
        </Reveal>
        {highlight && (
          <Reveal delay={80}>
            <div
              className="card"
              style={{
                marginTop: 30,
                padding: "32px 28px",
                maxWidth: 880,
                background: "rgba(255,255,255,0.72)",
                border: "1px solid var(--line)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 24,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 22,
                    background:
                      "linear-gradient(135deg, var(--copper-bright), var(--copper-dim))",
                    display: "grid",
                    placeItems: "center",
                    color: "#fff",
                    fontSize: 36,
                    fontWeight: 700,
                  }}
                >
                  {highlight.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 20,
                      color: "var(--copper-bright)",
                    }}
                  >
                    {highlight.name}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      color: "var(--muted)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontSize: 12,
                    }}
                  >
                    {highlight.role}
                  </div>
                </div>
              </div>
              <p
                style={{
                  marginTop: 24,
                  color: "var(--text-dim)",
                  lineHeight: 1.7,
                  fontSize: 15,
                }}
              >
                {highlight.bio}
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function GlobalTeaser() {
  const { t, lang } = useLang();
  const countries = lang === "am" ? COUNTRIES_AM : COMPANY.countries;
  return (
    <section className="section" style={{ background: "var(--bg-2)" }}>
      <div className="container">
        <Reveal>
          <p className="eyebrow">{t("global.eyebrow")}</p>
          <h2 className="sec-title">{t("global.title")}</h2>
          <p className="sec-sub">{t("global.sub")}</p>
        </Reveal>
        <Reveal delay={140}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 30,
            }}
          >
            {countries.map((c) => (
              <span className="chip" key={c.name}>
                <span className="dot" /> {c.name}
              </span>
            ))}
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div style={{ marginTop: 44 }}>
            <GlobeReach />
          </div>
        </Reveal>
        <Reveal delay={280}>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link to="/global-reach" className="btn btn-ghost">
              {t("global.seeMap")} →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCta() {
  const { t } = useLang();
  return (
    <section className="section" style={{ textAlign: "center", overflow: "hidden" }}>
      <div className="container">
        <Reveal>
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            {t("cta.eyebrow")}
          </p>
          <h2 className="sec-title" style={{ marginInline: "auto" }}>
            {t("cta.title")}
          </h2>
          <p className="sec-sub" style={{ marginInline: "auto" }}>
            {t("cta.sub")}
          </p>
        </Reveal>
        <Reveal delay={140}>
          <div className="hero-ctas" style={{ justifyContent: "center" }}>
            <Link to="/contact" className="btn btn-primary">
              {t("home.quote")}
            </Link>
            <a className="btn btn-ghost" href={`mailto:${COMPANY.email[0]}`}>
              {COMPANY.email[0]}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <OresPreview />
      <AboutTeaser />
      <Industries />
      <TeamSection />
      <GlobalTeaser />
      <FinalCta />
    </>
  );
}
