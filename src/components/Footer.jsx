import { Link } from "react-router-dom";
import { COMPANY } from "../data/ores";
import { useLang } from "../context/LanguageContext";

function Footer() {
  const { t } = useLang();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-bar">
          <Link to="/" className="nav-logo footer-logo">
            <img src="/logo.png" alt={`${COMPANY.name} logo`} />
            <span>
              MEL<span style={{ color: "var(--copper)" }}>GARA</span>
            </span>
          </Link>

          <nav className="footer-nav" aria-label="Footer">
            <Link to="/about">{t("footer.about")}</Link>
            <Link to="/ores">{t("footer.ores")}</Link>
            <Link to="/global-reach">{t("footer.global")}</Link>
            <Link to="/transparency">{t("footer.transparency")}</Link>
            <Link to="/contact">{t("footer.quote")}</Link>
          </nav>

          <div className="footer-contact">
            <a href={`mailto:${COMPANY.email[0]}`}>{COMPANY.email[0]}</a>
            <span>WeChat: {COMPANY.wechat}</span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {COMPANY.fullName}.{" "}
            {t("footer.rights")}
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
