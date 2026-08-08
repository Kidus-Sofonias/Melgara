import { Link } from "react-router-dom";
import { COMPANY, ORES } from "../data/ores";
import { useLang } from "../context/LanguageContext";

function Footer() {
  const { t, pick } = useLang();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="nav-logo" style={{ marginBottom: 10 }}>
              <img src="/logo.jpeg" alt={`${COMPANY.name} logo`} />
              <span>
                MEL<span style={{ color: "var(--copper)" }}>GARA</span>
              </span>
            </Link>
            <p>
              {COMPANY.fullName} — {t("footer.brand", { founded: COMPANY.founded })}
            </p>
          </div>

          <div>
            <h4>{t("footer.ores")}</h4>
            {ORES.map((o) => (
              <Link key={o.slug} to={`/ores/${o.slug}`} className="f-link">
                {pick(o).name}
              </Link>
            ))}
          </div>

          <div>
            <h4>{t("footer.company")}</h4>
            <Link to="/about" className="f-link">{t("footer.about")}</Link>
            <Link to="/global-reach" className="f-link">{t("footer.global")}</Link>
            <Link to="/transparency" className="f-link">{t("footer.transparency")}</Link>
            <Link to="/contact" className="f-link">{t("footer.quote")}</Link>
            <a className="f-link" href={COMPANY.socials.facebook} target="_blank" rel="noreferrer">Facebook</a>
            <a className="f-link" href={COMPANY.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a className="f-link" href={COMPANY.socials.twitter} target="_blank" rel="noreferrer">Twitter / X</a>
          </div>

          <div>
            <h4>{t("footer.contact")}</h4>
            <ul className="footer-contact">
              <li>
                <a href={`mailto:${COMPANY.email[0]}`}>{COMPANY.email[0]}</a>
              </li>
              <li>
                <a href={`mailto:${COMPANY.email[1]}`}>{COMPANY.email[1]}</a>
              </li>
              <li>WeChat: {COMPANY.wechat}</li>
              <li>
                <a href={COMPANY.skype} target="_blank" rel="noreferrer">
                  Skype: Melgara
                </a>
              </li>
              <li style={{ marginTop: 10, color: "var(--text-dim)" }}>
                {t("footer.countries")}
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {COMPANY.fullName}. {t("footer.rights")}
          </span>
          <a
            className="dev-credit"
            href="https://kidusstark.vercel.app"
            target="_blank"
            rel="noreferrer"
            title="Visit portfolio"
          >
            Developed by <strong>Kidus Sofonias</strong>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
