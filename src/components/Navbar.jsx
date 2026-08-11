import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ORES, COMPANY } from "../data/ores";
import { useLang } from "../context/LanguageContext";

function Navbar() {
  const { lang, setLang, t, pick } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkCls = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;
  const toggleLang = () => setLang(lang === "en" ? "am" : "en");

  return (
    <>
      <header className={`nav ${scrolled || open ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <Link to="/" className="nav-logo">
            <img src="/logo.png" alt={`${COMPANY.name} logo`} />
            <span>
              MEL<span style={{ color: "var(--copper)" }}>GARA</span>
            </span>
          </Link>

          <ul className="nav-links">
            <li className="nav-drop">
              <NavLink to="/ores" className={linkCls}>
                {t("nav.ores")}
              </NavLink>
              <ul className="drop-menu">
                {ORES.map((o) => (
                  <li key={o.slug}>
                    <Link to={`/ores/${o.slug}`}>{pick(o).name}</Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <NavLink to="/about" className={linkCls}>
                {t("nav.about")}
              </NavLink>
            </li>
            <li>
              <NavLink to="/global-reach" className={linkCls}>
                {t("nav.global")}
              </NavLink>
            </li>
            <li>
              <NavLink to="/transparency" className={linkCls}>
                {t("nav.transparency")}
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={linkCls}>
                {t("nav.contact")}
              </NavLink>
            </li>
          </ul>

          <div className="nav-right">
            <button
              className="lang-toggle"
              onClick={toggleLang}
              aria-label="Switch language / ቋንቋ ይቀይሩ"
              title={lang === "en" ? "ቋንቋውን ወደ አማርኛ ይቀይሩ" : "Switch to English"}
            >
              {lang === "en" ? "EN · አማርኛ" : "አማርኛ · EN"}
            </button>
            <Link to="/contact" className="btn btn-primary btn-sm">
              {t("nav.quote")}
            </Link>
            <button
              className="burger"
              aria-label="Toggle menu"
              onClick={() => setOpen(!open)}
              style={open ? { borderColor: "var(--copper)" } : undefined}
            >
              <span style={open ? { transform: "translateY(4px) rotate(45deg)" } : undefined} />
              <span style={open ? { opacity: 0 } : undefined} />
              <span style={open ? { transform: "translateY(-4px) rotate(-45deg)" } : undefined} />
            </button>
          </div>
        </div>
      </header>

      <nav className={`mobile-menu ${open ? "open" : ""}`} aria-hidden={!open}>
        <Link to="/">{t("nav.home")}</Link>
        <div className="mm-ores">
          <Link to="/ores" className="mm-ores-head">
            {t("nav.ores")}
          </Link>
          <div className="mm-ores-list">
            {ORES.map((o) => (
              <Link key={o.slug} to={`/ores/${o.slug}`} className="mm-ore">
                {pick(o).name}
              </Link>
            ))}
          </div>
        </div>
        <Link to="/about">{t("nav.about")}</Link>
        <Link to="/global-reach">{t("nav.global")}</Link>
        <Link to="/transparency">{t("nav.transparency")}</Link>
        <Link to="/contact">{t("nav.contact")}</Link>
        <Link to="/contact" style={{ color: "var(--copper-bright)" }}>
          {t("nav.quote")}
        </Link>
        <button className="lang-toggle mm-lang" onClick={toggleLang}>
          {lang === "en" ? "አማርኛ" : "English"}
        </button>
      </nav>
    </>
  );
}

export default Navbar;
