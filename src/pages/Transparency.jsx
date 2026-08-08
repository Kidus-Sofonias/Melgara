import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import { PROCESS, PROCESS_AM, ORES } from "../data/ores";
import { useLang } from "../context/LanguageContext";

function SpecLibrary() {
  const { t, pick } = useLang();
  const specs = ORES.flatMap((o) => {
    const oo = pick(o);
    return o.varieties
      .map((v, i) => ({ ...v, ...(oo.varieties[i] || {}) }))
      .filter((v) => v.specPdf)
      .map((v) => ({ ore: oo.name, variety: v.name, grade: v.grade, pdf: v.specPdf }));
  });

  return (
    <div className="grid grid-2" style={{ marginTop: 40 }}>
      {specs.map((s, i) => (
        <Reveal key={s.variety} delay={(i % 2) * 90}>
          <a
            href={s.pdf}
            download
            target="_blank"
            rel="noreferrer"
            className="card spec-lib-card"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18 }}
          >
            <div>
              <div style={{ color: "var(--muted)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                {s.ore}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18, marginTop: 5 }}>
                {s.variety}
              </div>
              <div style={{ color: "var(--copper-bright)", fontFamily: "var(--font-display)", fontSize: 12.5, letterSpacing: "0.06em", marginTop: 4 }}>
                {s.grade}
              </div>
            </div>
            <span className="btn btn-primary btn-sm">{t("trans.pdf")}</span>
          </a>
        </Reveal>
      ))}
    </div>
  );
}

export default function Transparency() {
  const { t, lang } = useLang();
  const process = lang === "am" ? PROCESS_AM : PROCESS;
  const qc = [
    ["🔬", t("trans.qc1Title"), t("trans.qc1Text")],
    ["📊", t("trans.qc2Title"), t("trans.qc2Text")],
    ["🧾", t("trans.qc3Title"), t("trans.qc3Text")],
  ];

  return (
    <>
      <section className="section" style={{ paddingTop: 150 }}>
        <div className="container">
          <Reveal>
            <p className="eyebrow">{t("nav.transparency")}</p>
            <h1 className="sec-title">{t("trans.title")}</h1>
            <p className="sec-sub">{t("trans.sub")}</p>
          </Reveal>
        </div>
      </section>

      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid grid-4" style={{ gap: 20 }}>
            {process.map((p, i) => (
              <Reveal key={p.step} delay={i * 90}>
                <div className="card" style={{ minHeight: 210 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 44, color: "rgba(200,121,62,0.35)" }}>
                    {p.step}
                  </div>
                  <h3 style={{ fontSize: 19, margin: "12px 0 8px" }}>{p.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: 14 }}>{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-2)" }}>
        <div className="container">
          <Reveal>
            <p className="eyebrow">{t("trans.qualityEyebrow")}</p>
            <h2 className="sec-title" style={{ fontSize: "clamp(26px, 3vw, 42px)" }}>
              {t("trans.qualityTitle")}
            </h2>
            <p className="sec-sub">{t("trans.qualitySub")}</p>
          </Reveal>
          <div className="grid grid-3" style={{ marginTop: 42 }}>
            {qc.map(([icon, title, text], i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="card" style={{ minHeight: 190 }}>
                  <div style={{ fontSize: 36, marginBottom: 14 }}>{icon}</div>
                  <h3 style={{ fontSize: 18, marginBottom: 8 }}>{title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: 14 }}>{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <p className="eyebrow">{t("trans.libEyebrow")}</p>
            <h2 className="sec-title" style={{ fontSize: "clamp(26px, 3vw, 42px)" }}>
              {t("trans.libTitle")}
            </h2>
            <p className="sec-sub">{t("trans.libSub")}</p>
          </Reveal>
          <SpecLibrary />
        </div>
      </section>

      <section className="section" style={{ textAlign: "center", paddingTop: 20 }}>
        <div className="container">
          <Reveal>
            <h2 className="sec-title" style={{ marginInline: "auto" }}>
              {t("trans.ask")}
            </h2>
            <Link to="/contact" className="btn btn-primary" style={{ marginTop: 26 }}>
              {t("trans.askCta")}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
