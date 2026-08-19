import { useState } from "react";

import Reveal from "../components/Reveal";
import { ORES, COMPANY, COUNTRIES_AM } from "../data/ores";
import { useLang } from "../context/LanguageContext";

// Leads are delivered straight to the developer's inbox for now.
const LEAD_EMAIL = "sofoniaskidus@gmail.com";

function QuoteForm() {
  const { t, pick } = useLang();
  const [status, setStatus] = useState("idle"); // idle | sending | sent-form | sent-mail
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    contact: "",
    product: "",
    volume: "",
    destination: "",
    message: "",
    language: "English",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const buildBodyLines = () => [
    `Name: ${form.name}`,
    `Company: ${form.company}`,
    `Email: ${form.email}`,
    `Phone/WeChat/Skype: ${form.contact}`,
    `Product: ${form.product}`,
    `Volume: ${form.volume}`,
    `Destination: ${form.destination}`,
    `Language: ${form.language}`,
    "",
    form.message,
  ];

  const buildMailto = () => {
    const subject = encodeURIComponent(`Quote Request: ${form.product || "General"} — ${form.name}`);
    const body = encodeURIComponent(buildBodyLines().join("\n"));
    return `mailto:${LEAD_EMAIL}?subject=${subject}&body=${body}`;
  };

  // Open the mail client via a real anchor click (more reliable than location.href).
  const openMailto = () => {
    const a = document.createElement("a");
    a.href = buildMailto();
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyMessage = async () => {
    const text = [...buildBodyLines(), "", `Send to: ${LEAD_EMAIL}`].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable — the mailto button still covers it */
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      // No backend needed — FormSubmit forwards the POST straight to the inbox.
      const res = await fetch(`https://formsubmit.co/ajax/${LEAD_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `Quote Request: ${form.product || "General"} — ${form.name}`,
          _template: "table",
          _captcha: "false",
          Name: form.name,
          Company: form.company,
          Email: form.email,
          "Phone/WeChat/Skype": form.contact,
          Product: form.product,
          Volume: form.volume,
          Destination: form.destination,
          Language: form.language,
          Message: form.message,
        }),
      });
      if (res.ok) {
        setStatus("sent-form");
        return;
      }
      throw new Error("form delivery failed");
    } catch {
      // Offline or service unreachable → hand off to the email app instead.
      openMailto();
      setStatus("sent-mail");
    }
  };

  if (status === "sent-form" || status === "sent-mail") {
    return (
      <div className="card" style={{ textAlign: "center", padding: "50px 30px", borderColor: "rgba(200,121,62,0.4)" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>⛏️</div>
        <h3 style={{ fontSize: 26 }}>{t("contact.successTitle")}</h3>
        <p className="sec-sub" style={{ marginInline: "auto" }}>
          {status === "sent-form" ? t("contact.sentText") : t("contact.successText")}
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 20 }}>
          <button className="btn btn-primary btn-sm" onClick={copyMessage}>
            {copied ? t("contact.copied") : t("contact.copy")}
          </button>
          <a className="btn btn-ghost btn-sm" href={buildMailto()}>
            {t("contact.openMail")}
          </a>
        </div>
        <p style={{ color: "var(--faint)", fontSize: 12.5, marginTop: 16 }}>
          {t("contact.deliveredTo", { email: LEAD_EMAIL })}
        </p>
        <p style={{ color: "var(--faint)", fontSize: 12, marginTop: 8, maxWidth: "46ch", marginInline: "auto" }}>
          {t("contact.activateNote", { email: LEAD_EMAIL })}
        </p>
        <div>
          <button className="btn btn-ghost" style={{ marginTop: 18 }} onClick={() => setStatus("idle")}>
            {t("contact.newRequest")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-2 form-grid" style={{ gap: 0, columnGap: 20 }}>
        <div className="form-field">
          <label>{t("contact.name")}</label>
          <input className="form-control" name="name" required value={form.name} onChange={handleChange} placeholder={t("contact.namePh")} />
        </div>
        <div className="form-field">
          <label>{t("contact.company")}</label>
          <input className="form-control" name="company" value={form.company} onChange={handleChange} placeholder={t("contact.companyPh")} />
        </div>
        <div className="form-field">
          <label>{t("contact.email")}</label>
          <input className="form-control" type="email" name="email" required value={form.email} onChange={handleChange} placeholder={t("contact.emailPh")} />
        </div>
        <div className="form-field">
          <label>{t("contact.contact")}</label>
          <input className="form-control" name="contact" value={form.contact} onChange={handleChange} placeholder={t("contact.contactPh")} />
        </div>
        <div className="form-field">
          <label>{t("contact.product")}</label>
          <select className="form-control" name="product" required value={form.product} onChange={handleChange}>
            <option value="">{t("contact.productPh")}</option>
            {ORES.map((o) => (
              <option key={o.slug} value={pick(o).name}>{pick(o).name}</option>
            ))}
            <option value="Other">{t("contact.other")}</option>
          </select>
        </div>
        <div className="form-field">
          <label>{t("contact.volume")}</label>
          <input className="form-control" name="volume" value={form.volume} onChange={handleChange} placeholder={t("contact.volumePh")} />
        </div>
      </div>
      <div className="form-field">
        <label>{t("contact.destination")}</label>
        <input className="form-control" name="destination" value={form.destination} onChange={handleChange} placeholder={t("contact.destinationPh")} />
      </div>
      <div className="form-field">
        <label>{t("contact.language")}</label>
        <select className="form-control" name="language" value={form.language} onChange={handleChange}>
          <option>English</option>
          <option>አማርኛ (Amharic)</option>
          <option>中文 (Chinese)</option>
          <option>العربية (Arabic)</option>
          <option>Français (French)</option>
        </select>
      </div>
      <div className="form-field">
        <label>{t("contact.message")}</label>
        <textarea className="form-control" name="message" rows="4" value={form.message} onChange={handleChange} placeholder={t("contact.messagePh")} />
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={status === "sending"}>
        {status === "sending" ? t("contact.sending") : t("contact.send")}
      </button>
      <p style={{ color: "var(--faint)", fontSize: 12.5, marginTop: 14, textAlign: "center" }}>
        {t("contact.note")}
      </p>
    </form>
  );
}

export default function Contact() {
  const { t, lang } = useLang();
  const countries = lang === "am" ? COUNTRIES_AM : COMPANY.countries;

  return (
    <>
      <section
        className="hero"
        style={{ minHeight: "60vh", background: "radial-gradient(ellipse at 30% 40%, rgba(200,121,62,0.1), var(--bg) 60%)" }}
      >
        <div className="hero-canvas" aria-hidden="true">
          <img
            src="/images/mining-machinery-1.jpg"
            alt="Mining operations"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.5,
            }}
          />
        </div>
        <div className="container hero-content">
          <p className="hero-kicker">{t("contact.kicker")}</p>
          <h1 className="hero-title" style={{ fontSize: "clamp(32px, 5vw, 62px)" }}>
            {t("contact.title")}
          </h1>
          <p className="hero-sub">{t("contact.sub")}</p>
        </div>
      </section>

      <section className="section-tight" style={{ paddingBottom: 90 }}>
        <div className="container">
          <div className="grid grid-2 contact-grid" style={{ gap: 50, alignItems: "start" }}>
            <Reveal>
              <p className="eyebrow">{t("contact.quoteEyebrow")}</p>
              <h2 className="sec-title" style={{ fontSize: "clamp(21px, 2.5vw, 30px)" }}>
                {t("contact.smartTitle")}
              </h2>
              <div style={{ marginTop: 28 }}>
                <QuoteForm />
              </div>
            </Reveal>

            <div>
              <Reveal delay={100}>
                <p className="eyebrow">{t("contact.channels")}</p>
                <div className="card" style={{ marginBottom: 24 }}>
                  <ul className="footer-contact">
                    <li>
                      <span style={{ color: "var(--muted)", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                        {t("contact.emailLabel")}
                      </span>
                      <div>
                        <a href={`mailto:${COMPANY.email[0]}`} style={{ color: "var(--text)" }}>{COMPANY.email[0]}</a>
                      </div>
                      <div>
                        <a href={`mailto:${COMPANY.email[1]}`} style={{ color: "var(--text)" }}>{COMPANY.email[1]}</a>
                      </div>
                    </li>
                    <li style={{ marginTop: 14 }}>
                      <span style={{ color: "var(--muted)", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                        {t("contact.wechatLabel")}
                      </span>
                      <div style={{ color: "var(--text)" }}>{COMPANY.wechat}</div>
                    </li>
                    <li style={{ marginTop: 14 }}>
                      <span style={{ color: "var(--muted)", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                        {t("contact.skypeLabel")}
                      </span>
                      <div>
                        <a href={COMPANY.skype} target="_blank" rel="noreferrer" style={{ color: "var(--text)" }}>
                          {t("contact.skypeLink")}
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={160}>
                <div className="card" style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 18, marginBottom: 12 }}>{t("contact.offices")}</h3>
                  <p style={{ color: "var(--text-dim)", fontSize: 14.5 }}>
                    <strong style={{ color: "var(--text)" }}>{t("contact.hq")}</strong> {COMPANY.hq}
                  </p>
                  <p style={{ color: "var(--text-dim)", fontSize: 14.5 }}>
                    <strong style={{ color: "var(--text)" }}>{t("contact.hub")}</strong> {COMPANY.hub}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                    {countries.map((c) => (
                      <span className="chip" key={c.name} style={{ fontSize: 10.5, padding: "6px 12px" }}>
                        <span className="dot" /> {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={220}>
                <div className="card" style={{ borderColor: "rgba(200,121,62,0.35)" }}>
                  <h3 style={{ fontSize: 18, marginBottom: 12 }}>{t("contact.follow")}</h3>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <a className="chip" href={COMPANY.socials.facebook} target="_blank" rel="noreferrer">Facebook</a>
                    <a className="chip" href={COMPANY.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                    <a className="chip" href={COMPANY.socials.twitter} target="_blank" rel="noreferrer">Twitter / X</a>
                  </div>
                  <p style={{ color: "var(--faint)", fontSize: 13, marginTop: 16 }}>
                    {t("contact.web", { url: COMPANY.website })}
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
