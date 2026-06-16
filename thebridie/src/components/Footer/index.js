import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const LOGO_URL = '/logos/logo2.png?v=2';

const Footer = () => {
  const { t } = useLanguage();
  const [logoFailed, setLogoFailed] = useState(false);

  const footerLinks = [
    { path: '/#bundles',   label: t('nav.bundles') },
    { path: '/#calc',      label: t('nav.buildSquad') },
    { path: '/#shop',      label: t('nav.shop') },
    { path: '/#customize', label: t('nav.customize') },
    { path: '/#tryon',     label: t('nav.tryon') },
  ];

  return (
    <footer style={{ borderTop: '1px solid var(--line)', background: 'rgba(255, 255, 255, 0.7)', position: 'relative', zIndex: 2 }}>
      <div className="foot-inner" style={{ maxWidth: '1140px', margin: '0 auto', padding: '40px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '22px' }}>
        
        {/* Logo */}
        <div className="foot-brand" style={{ display: 'flex', alignItems: 'center' }}>
          {!logoFailed ? (
            <img src={LOGO_URL} alt="The Bridie" style={{ height: '52px', width: 'auto' }} onError={() => setLogoFailed(true)} />
          ) : (
            <span style={{ fontWeight: '800', fontSize: '20px', color: 'var(--rose)' }}>The Bridie</span>
          )}
        </div>

        {/* Links */}
        <div className="navlinks" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          {footerLinks.map(l => (
            <Link
              key={l.path}
              to={l.path}
              style={{ textDecoration: 'none', color: 'var(--ink)', fontSize: '12px', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 500 }}
            >
              {l.label}
            </Link>
          ))}
        </div>

      </div>

      <div className="copy" style={{ width: '100%', textAlign: 'center', fontSize: '12px', color: '#444444', letterSpacing: '.1em', borderTop: '1px solid var(--line)', padding: '18px' }}>
        <p>© {new Date().getFullYear()} <span>{t('nav.brand')}</span> — {t('footer.rights')}</p>
      </div>
    </footer>
  );
};

export default Footer;
