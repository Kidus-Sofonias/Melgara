import { Link } from "react-router-dom";
import OreCanvas3D from "../components/OreCanvas3D";
import OreCarousel from "../components/OreCarousel";
import Reveal from "../components/Reveal";
import GradeCounter from "../components/GradeCounter";
import { ORES, STATS, STATS_AM, COMPANY, TIMELINE, TIMELINE_AM, INDUSTRIES_AM, COUNTRIES_AM } from "../data/ores";
import { useLang } from "../context/LanguageContext";

function Hero() {
  const { t } = useLang();
  return (
    <section className="hero">
      <div className="hero-canvas" aria-hidden="true">
        <OreCanvas3D
          color="#b96a3a"
          veinColor="#f0a35c"
          patina="#3d8d84"
          roughness={0.3}
          metalness={0.85}
          seed={7}
          intensity={1}
          photo="/ores/copper.jpg"
        />
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
    <section className="section-tight" style={{ borderTop: "1px solid var(--line)" }}>
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
    <section className="section" id="ores">
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
  const { t, lang } = useLang();
  const timeline = lang === "am" ? TIMELINE_AM : TIMELINE;
  return (
    <section className="section" style={{ background: "var(--bg-2)" }}>
      <div className="container">
        <div className="grid grid-2 about-teaser" style={{ alignItems: "center", gap: 60 }}>
          <Reveal>
            <div className="about-teaser-img">
              <OreCanvas3D
                color="#7a4e2e"
                veinColor="#b36a3c"
                patina="#3a2a1c"
                roughness={0.72}
                metalness={0.55}
                seed={9}
                intensity={0.7}
                detail={24}
                dpr={1}
                lite
              />
              <span className="about-teaser-label">{t("who.coreSample")}</span>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <p className="eyebrow">{t("who.eyebrow")}</p>
              <h2 className="sec-title">{t("who.title")}</h2>
              <p className="sec-sub">
                {t("who.sub", { founded: COMPANY.founded, langs: COMPANY.languages })}
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div className="timeline" style={{ marginTop: 36 }}>
                {timeline.slice(0, 2).map((tl) => (
                  <div className="tl-item" key={tl.title}>
                    <div className="tl-year">{tl.year}</div>
                    <div className="tl-title">{tl.title}</div>
                    <p>{tl.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={200}>
              <Link to="/about" className="btn btn-ghost" style={{ marginTop: 30 }}>
                {t("who.story")}
              </Link>
            </Reveal>
          </div>
        </div>
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
        <div className="grid ind-grid" style={{ gap: 16, marginTop: 48 }}>
          {industries.map((ind, i) => (
            <Reveal key={ind} delay={(i % 5) * 60}>
              <div className="card ind-card" style={{ padding: "22px 20px", textAlign: "center", fontFamily: "var(--font-display)", fontSize: 15, letterSpacing: "0.06em" }}>
                {ind}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  const { t, lang } = useLang();
  const founder = COMPANY.founder;
  const founderRole = COMPANY.founderRole;
  const quote = COMPANY.quote;
  const team = COMPANY.team;

  return (
    <section className="section" style={{ background: "var(--bg-2)" }}>
      <div className="container">
        <Reveal>
          <p className="eyebrow">{t("about.eyebrow") || "OUR TEAM"}</p>
          <h2 className="sec-title">{t("who.title") || "The People Behind the Minerals"}</h2>
          <p className="sec-sub">{t("who.sub", { founded: COMPANY.founded, langs: COMPANY.languages }) || "Led by experienced professionals across East Africa and beyond."}</p>
        </Reveal>

        {/* Founder spotlight */}
        <Reveal delay={80}>
          <div
            className="card"
            style={{
              marginTop: 48,
              padding: "clamp(28px, 4vw, 48px)",
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "clamp(24px, 3vw, 40px)",
              alignItems: "center",
              borderColor: "rgba(200,121,62,0.3)",
              background: "linear-gradient(135deg, rgba(200,121,62,0.06), var(--panel))",
            }}
          >
            {/* Avatar placeholder */}
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--copper), var(--copper-dim))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 42,
                fontWeight: 700,
                color: "var(--bg)",
                fontFamily: "var(--font-display)",
                flexShrink: 0,
                boxShadow: "0 12px 40px -8px rgba(200,121,62,0.4)",
              }}
            >
              {founder.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 22,
                  color: "var(--copper-bright)",
                }}
              >
                {founder}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  color: "var(--muted)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginTop: 4,
                }}
              >
                {founderRole}
              </div>
              <div
                style={{
                  marginTop: 16,
                  fontFamily: "var(--font-display)",
                  fontSize: 17,
                  fontStyle: "italic",
                  color: "var(--text-dim)",
                  lineHeight: 1.5,
                  position: "relative",
                  paddingLeft: 20,
                  borderLeft: "3px solid var(--copper)",
                }}
              >
                &ldquo;{quote}&rdquo;
              </div>
            </div>
          </div>
        </Reveal>

        {/* Team grid */}
        <div className="grid grid-3" style={{ marginTop: 40 }}>
          {team
            .filter((m) => !m.highlight)
            .map((member, i) => (
              <Reveal key={member.name} delay={i * 80}>
                <div
                  className="card"
                  style={{
                    minHeight: 200,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                  }}
                >
                  <div
                    style={{
                      fontSize: 36,
                      marginBottom: 14,
                      width: 56,
                      height: 56,
                      borderRadius: 12,
                      background: "rgba(200,121,62,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {member.icon || "👤"}
                  </div>
                  <h3 style={{ fontSize: 18, marginBottom: 4 }}>{member.name}</h3>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 12,
                      color: "var(--copper)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: 10,
                    }}
                  >
                    {member.role}
                  </div>
                  <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
                    {member.bio}
                  </p>
                </div>
              </Reveal>
            ))}
        </div>
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
        <div className="grid grid-2 global-teaser" style={{ alignItems: "center", gap: 60 }}>
          <div>
            <Reveal>
              <p className="eyebrow">{t("global.eyebrow")}</p>
              <h2 className="sec-title">{t("global.title")}</h2>
              <p className="sec-sub">{t("global.sub")}</p>
            </Reveal>
            <Reveal delay={140}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 30 }}>
                {countries.map((c) => (
                  <span className="chip" key={c.name}>
                    <span className="dot" /> {c.name}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={220}>
              <Link to="/global-reach" className="btn btn-ghost" style={{ marginTop: 34 }}>
                {t("global.seeMap")}
              </Link>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <div className="global-teaser-img">
              <OreCanvas3D
                color="#b9c0c7"
                veinColor="#f2f6f9"
                patina="#8d979e"
                roughness={0.5}
                metalness={0.2}
                seed={16}
                intensity={0.7}
                detail={24}
                dpr={1}
                lite
              />
            </div>
          </Reveal>
        </div>
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
