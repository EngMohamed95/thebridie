import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import './index.css';

const LOGO_URL = '/logos/thebridie-logo.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const { auth, logout, cart, cartTotal, cartTotalQty, updateCartQty, removeFromCart } = useApp();
  const { lang, setLang, t } = useLanguage();
  const cartRef = useRef(null);

  const navLinks = [
    { path: '/#bundles',   label: t('nav.bundles') },
    { path: '/#calc',      label: t('nav.buildSquad') },
    { path: '/#shop',      label: t('nav.shop') },
    { path: '/#customize', label: t('nav.customize') },
    { path: '/#tryon',     label: t('nav.tryon') },
    { path: '/#countdown', label: t('nav.countdown') },
    { path: '/#sizes',     label: t('nav.sizes') },
    { path: '/#faq',       label: t('nav.faq') },
    { path: '/#track',     label: t('nav.trackOrder') },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (p) => {
    const [path, hash] = p.split('#');
    if (hash) {
      return location.pathname === path && location.hash === `#${hash}`;
    }
    return location.pathname === p;
  };

  // Close cart dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setIsCartOpen(false);
      }
    };
    if (isCartOpen) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isCartOpen]);

  const handleCartCheckout = () => {
    setIsCartOpen(false);
    const orderSection = document.getElementById('order');
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#order');
    }
  };

  const currency = t('products.currency') || 'د.ك';

  return (
    <nav className="navbar" role="navigation" aria-label="القائمة الرئيسية">
      {/* Top slate banner bar */}
      <div className="nav-topbar">
        <div className="nav-topbar-content">
          <span>{lang === 'ar' ? 'شحن سريع لجميع مناطق الكويت 🎀' : 'Fast delivery to all Kuwait areas 🎀'}</span>
          <button
            className="nav-lang-btn"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            aria-label="تغيير اللغة"
          >
            {lang === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>
      </div>

      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo" aria-label="ذا برايدي — الصفحة الرئيسية">
          {!logoFailed ? (
            <img src={LOGO_URL} alt="ذا برايدي" className="nav-logo-img" onError={() => setLogoFailed(true)} />
          ) : (
            <span className="nav-logo-text">ذا برايدي</span>
          )}
        </Link>

        {/* Desktop links */}
        <div className="nav-links" role="menubar">
          {navLinks.map(l => (
            <Link
              key={l.path}
              to={l.path}
              role="menuitem"
              className={`nav-link${isActive(l.path) ? ' active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right controls */}
        <div className="nav-controls">
          {/* Cart dropdown container */}
          <div className="cart-wrap" ref={cartRef}>
            <button
              id="cartBtn"
              className="cart-pill-btn"
              onClick={() => setIsCartOpen(!isCartOpen)}
              aria-label="عربة التسوق"
            >
              {lang === 'ar' ? 'السلة' : 'CART'}
              <span className="cart-count-badge">{cartTotalQty}</span>
            </button>

            {/* Cart Dropdown List */}
            <div className={`cart-dd${isCartOpen ? ' open' : ''}`} id="cartDD">
              <h4>{t('cart.title')}</h4>
              <div className="cart-items" id="cartItems">
                {cart.length === 0 ? (
                  <div className="cart-empty">
                    {lang === 'ar' ? 'سلتكِ فارغة حالياً — أضيفي بعض المنتجات للبدء! 🎀' : 'Your cart is empty — add a tee to get started! 🎀'}
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item._cartKey || item.id} className="ci">
                      <div className="ci-info">
                        <div className="ci-name">{item.name}</div>
                        <div className="ci-meta">
                          {item.price ? `${item.price.toFixed(3)} ${currency}` : ''}
                        </div>
                      </div>
                      <div className="ci-qty">
                        <button
                          type="button"
                          onClick={() => updateCartQty(item._cartKey, item.qty - 1)}
                        >
                          −
                        </button>
                        <span>{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQty(item._cartKey, item.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                      <div className="ci-price">
                        {item.price ? `${(item.qty * item.price).toFixed(3)} ${currency}` : '—'}
                      </div>
                      <button
                        type="button"
                        className="ci-rm"
                        onClick={() => removeFromCart(item._cartKey)}
                        aria-label="remove"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
              {cart.length > 0 && (
                <div className="cart-foot" id="cartFoot">
                  <div className="cart-total">
                    <span className="l">{t('cart.total')}</span>
                    <span className="v">{cartTotal.toFixed(3)} {currency}</span>
                  </div>
                  <button
                    type="button"
                    className="btn-bridie btn-primary-bridie"
                    id="checkoutBtn"
                    onClick={handleCartCheckout}
                  >
                    {t('cart.checkout')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Auth links */}
          <div className="nav-auth">
            {auth ? (
              <div className="nav-user-group">
                {auth.role === 'customer' ? (
                  <Link to="/my-account" className={`nav-link-auth${isActive('/my-account') ? ' active' : ''}`} title={lang === 'ar' ? 'حسابي' : 'My Account'}>
                    <i className="fas fa-user" aria-hidden="true"></i>
                  </Link>
                ) : (
                  <Link to="/dashboard" className={`nav-link-auth${isActive('/dashboard') ? ' active' : ''}`} title={t('nav.dashboard')}>
                    <i className="fas fa-chart-pie" aria-hidden="true"></i>
                  </Link>
                )}
                <button className="nav-logout-auth-btn" onClick={handleLogout} title={t('nav.logout')}>
                  <i className="fas fa-right-from-bracket" aria-hidden="true"></i>
                </button>
              </div>
            ) : (
              <Link to="/login" className="nav-link-auth" title={t('nav.login')}>
                <i className="fas fa-right-to-bracket" aria-hidden="true"></i>
              </Link>
            )}
          </div>

          {/* Hamburger (Mobile Toggle) */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="فتح القائمة"
          >
            <i className={`fas fa-${menuOpen ? 'xmark' : 'bars'}`} aria-hidden="true"></i>
          </button>
        </div>
      </div>

      {/* Mobile drawer overlay */}
      {menuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}

      {/* Mobile side drawer */}
      <div className={`mobile-nav${menuOpen ? ' open' : ''}`} role="menu" aria-hidden={!menuOpen}>
        <div className="mobile-nav-header">
          {!logoFailed ? (
            <img src={LOGO_URL} alt="ذا برايدي" style={{ height: '30px' }} onError={() => setLogoFailed(true)} />
          ) : (
            <span style={{ fontWeight: '800', fontSize: '20px', color: '#fff' }}>ذا برايدي</span>
          )}
          <button className="mobile-nav-close" onClick={() => setMenuOpen(false)} aria-label="إغلاق القائمة">
            <i className="fas fa-xmark"></i>
          </button>
        </div>

        <div className="mobile-nav-body">
          {navLinks.map(l => (
            <Link
              key={l.path}
              to={l.path}
              role="menuitem"
              className={`mobile-nav-link${isActive(l.path) ? ' active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}

          <div className="mobile-nav-divider" />

          {/* Auth in Mobile Drawer */}
          {auth ? (
            <>
              {auth.role === 'customer' ? (
                <Link
                  to="/my-account"
                  className={`mobile-nav-link${isActive('/my-account') ? ' active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <i className="fas fa-user" aria-hidden="true" style={{ marginInlineEnd: '10px' }}></i>
                  {lang === 'ar' ? 'حسابي' : 'My Account'}
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className={`mobile-nav-link${isActive('/dashboard') ? ' active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <i className="fas fa-chart-pie" aria-hidden="true" style={{ marginInlineEnd: '10px' }}></i>
                  {t('nav.dashboard')}
                </Link>
              )}
              <button className="mobile-logout-btn" onClick={handleLogout}>
                <i className="fas fa-right-from-bracket" aria-hidden="true" style={{ marginInlineEnd: '10px' }}></i>
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <Link to="/login" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
              <i className="fas fa-right-to-bracket" aria-hidden="true" style={{ marginInlineEnd: '10px' }}></i>
              {t('nav.login')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
