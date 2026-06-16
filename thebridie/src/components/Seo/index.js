import { Helmet } from 'react-helmet-async';

const SITE = 'The Bridie';
const DEFAULT_DESC = 'The Bridie — Custom bride & bridesmaid tees and squad gifts for a beautiful wedding day. Soft, custom printed cotton tees for your special day.';
const DEFAULT_KW   = 'bride tees, bridesmaid tees, custom wedding gifts, the bridie kuwait, wedding shirts';

const Seo = ({ title, description, keywords, noIndex = false }) => {
  const fullTitle = title ? `${title} | ${SITE}` : SITE;

  return (
    <Helmet>
      {/* Primary */}
      <html lang="en" dir="ltr" />
      <title>{fullTitle}</title>
      <meta name="description"  content={description || DEFAULT_DESC} />
      <meta name="keywords"     content={keywords    || DEFAULT_KW} />
      <meta name="author"       content="The Bridie" />
      <meta name="robots"       content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      <link rel="canonical"     href={typeof window !== 'undefined' ? window.location.href : '/'} />

      {/* Open Graph */}
      <meta property="og:type"        content="website" />
      <meta property="og:site_name"   content={SITE} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description || DEFAULT_DESC} />
      <meta property="og:locale"      content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card"        content="summary" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description || DEFAULT_DESC} />

      {/* Business Schema (JSON-LD) */}
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "The Bridie",
        "url": "https://thebridie.com",
        "logo": "https://thebridie.com/logos/logo2.png?v=2",
        "foundingDate": "1998",
        "telephone": "+96523263824",
        "email": "info@thebridie.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Shuaiba",
          "addressCountry": "KW"
        },
        "sameAs": ["https://thebridie.com"]
      })}</script>
    </Helmet>
  );
};

export default Seo;
