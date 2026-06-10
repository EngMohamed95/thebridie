import { Helmet } from 'react-helmet-async';

const SITE = 'ذا برايدي للمناديل الورقية';
const DEFAULT_DESC = 'شركة ذا برايدي للمناديل الورقية — منتجات ورقية عالية الجودة من الكويت منذ 1998. مناديل وجه، رولات، مناشف، محارم جيب.';
const DEFAULT_KW   = 'مناديل ورقية الكويت، ذا برايدي للمناديل، مناديل وجه، رولات مطبخ، مناشف ورق، tissue paper Kuwait';

const Seo = ({ title, description, keywords, noIndex = false }) => {
  const fullTitle = title ? `${title} | ${SITE}` : SITE;

  return (
    <Helmet>
      {/* Primary */}
      <html lang="ar" dir="rtl" />
      <title>{fullTitle}</title>
      <meta name="description"  content={description || DEFAULT_DESC} />
      <meta name="keywords"     content={keywords    || DEFAULT_KW} />
      <meta name="author"       content="شركة ذا برايدي للمناديل الورقية" />
      <meta name="robots"       content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      <link rel="canonical"     href={typeof window !== 'undefined' ? window.location.href : '/'} />

      {/* Open Graph */}
      <meta property="og:type"        content="website" />
      <meta property="og:site_name"   content={SITE} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description || DEFAULT_DESC} />
      <meta property="og:locale"      content="ar_KW" />

      {/* Twitter */}
      <meta name="twitter:card"        content="summary" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description || DEFAULT_DESC} />

      {/* Business Schema (JSON-LD) */}
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "شركة ذا برايدي للمناديل الورقية",
        "url": "https://thebridie.com",
        "logo": "https://thebridie.com/logos/thebridie-logo.png",
        "foundingDate": "1998",
        "telephone": "+96523263824",
        "email": "info@thebridie.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "الشعيبة",
          "addressCountry": "KW"
        },
        "sameAs": ["https://thebridie.com"]
      })}</script>
    </Helmet>
  );
};

export default Seo;
