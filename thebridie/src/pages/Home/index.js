import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import translations from '../../translations';
import Seo from '../../components/Seo';
import './index.css';

const STAR_SVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c.6 5.4 2.4 7.2 7.8 7.8C14.4 8.4 12.6 10.2 12 15.6c-.6-5.4-2.4-7.2-7.8-7.8C9.6 7.2 11.4 5.4 12 0z" transform="translate(0 4.2)"/></svg>`;

const DECORATION_STICKERS = [
  { className: 's s1', svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M30 34 C27 42 23 49 19 56 C22.5 54.5 26 52 29 47 C30 43 30.5 38 31 34 Z" fill="#F3AEC1" stroke="#E2849B" stroke-width="1.3" stroke-linejoin="round"/><path d="M34 34 C37 42 41 49 45 56 C41.5 54.5 38 52 35 47 C34 43 33.5 38 33 34 Z" fill="#F3AEC1" stroke="#E2849B" stroke-width="1.3" stroke-linejoin="round"/><path d="M32 32 C26 22 15 19 9.5 24.5 C5 29 6.5 36 13 37.5 C20 39 28 37 32 32 Z" fill="#F9C2D1" stroke="#E2849B" stroke-width="1.5" stroke-linejoin="round"/><path d="M32 32 C38 22 49 19 54.5 24.5 C59 29 57.5 36 51 37.5 C44 39 36 37 32 32 Z" fill="#F9C2D1" stroke="#E2849B" stroke-width="1.5" stroke-linejoin="round"/><path d="M29 33 C23 32 17 32.5 13 35" fill="none" stroke="#E89BB0" stroke-width="1" stroke-linecap="round" opacity=".7"/><path d="M35 33 C41 32 47 32.5 51 35" fill="none" stroke="#E89BB0" stroke-width="1" stroke-linecap="round" opacity=".7"/><path d="M29.5 28.5 C31.5 27.5 32.5 27.5 34.5 28.5 C35.5 31 35.5 33.5 34.5 36 C32.5 37 31.5 37 29.5 36 C28.5 33.5 28.5 31 29.5 28.5 Z" fill="#EE9FB4" stroke="#E2849B" stroke-width="1.5" stroke-linejoin="round"/><path d="M30.5 30 C31.5 29.2 32.5 29.2 33.5 30" stroke="#FCE3EA" stroke-width="1.1" stroke-linecap="round" fill="none"/></svg>` },
  { className: 's s2', svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M33 12 C40 9 47 11 50 16" fill="none" stroke="#8FB97A" stroke-width="2.4" stroke-linecap="round"/><path d="M35 13 C30 24 22 33 17 41" fill="none" stroke="#8FB97A" stroke-width="2.4" stroke-linecap="round"/><path d="M42 14 C47 25 49 35 46 43" fill="none" stroke="#8FB97A" stroke-width="2.4" stroke-linecap="round"/><path d="M44 12 C49 9 54 12 53 17 C53 13 48 12 44 15 Z" fill="#8FB97A"/><circle cx="17" cy="45" r="11" fill="#E0566F" stroke="#C13C5F" stroke-width="1.8"/><circle cx="46" cy="47" r="11" fill="#E0566F" stroke="#C13C5F" stroke-width="1.8"/><ellipse cx="13" cy="41" rx="3" ry="2" fill="#FCE0E8" opacity=".8" transform="rotate(-20 13 41)"/><ellipse cx="42" cy="43" rx="3" ry="2" fill="#FCE0E8" opacity=".8" transform="rotate(-20 42 43)"/></svg>` },
  { className: 's s3', svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 54S8 38 8 22C8 13 16 8 24 12c4 2 6 6 8 9 2-3 4-7 8-9 8-4 16 1 16 10 0 16-24 32-24 32z" fill="#E05C7E" stroke="#C13C5F" stroke-width="2" stroke-linejoin="round"/></svg>` },
  { className: 's s4', svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M30 34 C27 42 23 49 19 56 C22.5 54.5 26 52 29 47 C30 43 30.5 38 31 34 Z" fill="#F3AEC1" stroke="#E2849B" stroke-width="1.3" stroke-linejoin="round"/><path d="M34 34 C37 42 41 49 45 56 C41.5 54.5 38 52 35 47 C34 43 33.5 38 33 34 Z" fill="#F3AEC1" stroke="#E2849B" stroke-width="1.3" stroke-linejoin="round"/><path d="M32 32 C26 22 15 19 9.5 24.5 C5 29 6.5 36 13 37.5 C20 39 28 37 32 32 Z" fill="#F9C2D1" stroke="#E2849B" stroke-width="1.5" stroke-linejoin="round"/><path d="M32 32 C38 22 49 19 54.5 24.5 C59 29 57.5 36 51 37.5 C44 39 36 37 32 32 Z" fill="#F9C2D1" stroke="#E2849B" stroke-width="1.5" stroke-linejoin="round"/><path d="M29 33 C23 32 17 32.5 13 35" fill="none" stroke="#E89BB0" stroke-width="1" stroke-linecap="round" opacity=".7"/><path d="M35 33 C41 32 47 32.5 51 35" fill="none" stroke="#E89BB0" stroke-width="1" stroke-linecap="round" opacity=".7"/><path d="M29.5 28.5 C31.5 27.5 32.5 27.5 34.5 28.5 C35.5 31 35.5 33.5 34.5 36 C32.5 37 31.5 37 29.5 36 C28.5 33.5 28.5 31 29.5 28.5 Z" fill="#EE9FB4" stroke="#E2849B" stroke-width="1.5" stroke-linejoin="round"/><path d="M30.5 30 C31.5 29.2 32.5 29.2 33.5 30" stroke="#FCE3EA" stroke-width="1.1" stroke-linecap="round" fill="none"/></svg>` },
  { className: 's s5', svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M33 12 C40 9 47 11 50 16" fill="none" stroke="#8FB97A" stroke-width="2.4" stroke-linecap="round"/><path d="M35 13 C30 24 22 33 17 41" fill="none" stroke="#8FB97A" stroke-width="2.4" stroke-linecap="round"/><path d="M42 14 C47 25 49 35 46 43" fill="none" stroke="#8FB97A" stroke-width="2.4" stroke-linecap="round"/><path d="M44 12 C49 9 54 12 53 17 C53 13 48 12 44 15 Z" fill="#8FB97A"/><circle cx="17" cy="45" r="11" fill="#E0566F" stroke="#C13C5F" stroke-width="1.8"/><circle cx="46" cy="47" r="11" fill="#E0566F" stroke="#C13C5F" stroke-width="1.8"/><ellipse cx="13" cy="41" rx="3" ry="2" fill="#FCE0E8" opacity=".8" transform="rotate(-20 13 41)"/><ellipse cx="42" cy="43" rx="3" ry="2" fill="#FCE0E8" opacity=".8" transform="rotate(-20 42 43)"/></svg>` },
  { className: 's s6', svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 54S8 38 8 22C8 13 16 8 24 12c4 2 6 6 8 9 2-3 4-7 8-9 8-4 16 1 16 10 0 16-24 32-24 32z" fill="#E05C7E" stroke="#C13C5F" stroke-width="2" stroke-linejoin="round"/></svg>` },
  { className: 's s7', svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M30 34 C27 42 23 49 19 56 C22.5 54.5 26 52 29 47 C30 43 30.5 38 31 34 Z" fill="#F3AEC1" stroke="#E2849B" stroke-width="1.3" stroke-linejoin="round"/><path d="M34 34 C37 42 41 49 45 56 C41.5 54.5 38 52 35 47 C34 43 33.5 38 33 34 Z" fill="#F3AEC1" stroke="#E2849B" stroke-width="1.3" stroke-linejoin="round"/><path d="M32 32 C26 22 15 19 9.5 24.5 C5 29 6.5 36 13 37.5 C20 39 28 37 32 32 Z" fill="#F9C2D1" stroke="#E2849B" stroke-width="1.5" stroke-linejoin="round"/><path d="M32 32 C38 22 49 19 54.5 24.5 C59 29 57.5 36 51 37.5 C44 39 36 37 32 32 Z" fill="#F9C2D1" stroke="#E2849B" stroke-width="1.5" stroke-linejoin="round"/><path d="M29 33 C23 32 17 32.5 13 35" fill="none" stroke="#E89BB0" stroke-width="1" stroke-linecap="round" opacity=".7"/><path d="M35 33 C41 32 47 32.5 51 35" fill="none" stroke="#E89BB0" stroke-width="1" stroke-linecap="round" opacity=".7"/><path d="M29.5 28.5 C31.5 27.5 32.5 27.5 34.5 28.5 C35.5 31 35.5 33.5 34.5 36 C32.5 37 31.5 37 29.5 36 C28.5 33.5 28.5 31 29.5 28.5 Z" fill="#EE9FB4" stroke="#E2849B" stroke-width="1.5" stroke-linejoin="round"/><path d="M30.5 30 C31.5 29.2 32.5 29.2 33.5 30" stroke="#FCE3EA" stroke-width="1.1" stroke-linecap="round" fill="none"/></svg>` },
  { className: 's s8', svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 54S8 38 8 22C8 13 16 8 24 12c4 2 6 6 8 9 2-3 4-7 8-9 8-4 16 1 16 10 0 16-24 32-24 32z" fill="#E05C7E" stroke="#C13C5F" stroke-width="2" stroke-linejoin="round"/></svg>` }
];

const TRYON_DESIGNS = [
  { key: 'sassy', name: 'Sassy Top', date: 'The Bride', labelKey: 'landing.tryon.designs.sassy', descKey: 'landing.tryon.designs.sassyDesc', font: 'Caveat' },
  { key: 'ruby', name: 'Ruby', date: 'Est. 2026', labelKey: 'landing.tryon.designs.ruby', descKey: 'landing.tryon.designs.rubyDesc', font: 'Cormorant Garamond' },
  { key: 'cheetah', name: 'Cheetah Espresso', date: 'Wild & caffeinated', labelKey: 'landing.tryon.designs.cheetah', descKey: 'landing.tryon.designs.cheetahDesc', font: 'Caveat' },
  { key: 'howdy', name: 'Howdy', date: 'Found her cowboy', labelKey: 'landing.tryon.designs.howdy', descKey: 'landing.tryon.designs.howdyDesc', font: 'Cormorant Garamond' }
];

const Home = () => {
  const { products, addToCart, submitOrder, cart, cartTotal, siteContent } = useApp();
  const { t, lang } = useLanguage();

  // Find Tee products from backend state
  const trioProduct = products.find(p => p.id === 1);
  const squadProduct = products.find(p => p.id === 2);
  const brideProduct = products.find(p => p.id === 3);
  const bridesmaidProduct = products.find(p => p.id === 4);
  const motherProduct = products.find(p => p.id === 5);
  const customProduct = products.find(p => p.id === 6);

  // States
  const [sparkles, setSparkles] = useState([]);
  const [addedStatus, setAddedStatus] = useState({});

  // Squad Calculator
  const [calcBride, setCalcBride] = useState(1);
  const [calcMaid, setCalcMaid] = useState(4);

  // Countdown
  const [weddingDate, setWeddingDate] = useState('');
  const [countdown, setCountdown] = useState(null);
  const [countdownMsg, setCountdownMsg] = useState('');

  // Customizer
  const [inName, setInName] = useState('Bride');
  const [inDate, setInDate] = useState('Est. 2026');
  const [inPhotoUrl, setInPhotoUrl] = useState(null);
  const [inPrintPhotoUrl, setInPrintPhotoUrl] = useState(null);

  // Try-on Preview
  const [tryonPane, setTryonPane] = useState('pick');
  const [userPhotoUrl, setUserPhotoUrl] = useState(null);
  const [tryonCat, setTryonCat] = useState('Bride');
  const [selectedDesign, setSelectedDesign] = useState(TRYON_DESIGNS[0]);
  const [tryonSize, setTryonSize] = useState('S/M');
  const [customDesignUrl, setCustomDesignUrl] = useState(null);
  const [customPhotoUrl, setCustomPhotoUrl] = useState(null);
  const [customName, setCustomName] = useState('Bride');
  const [customDate, setCustomDate] = useState('Est. 2026');
  const [designSizeOnTee, setDesignSizeOnTee] = useState(46);

  // Try-on Drag State
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ sX: 0, sY: 0, bL: 50, bT: 56 });
  const [designPosition, setDesignPosition] = useState({ x: 50, y: 56 });

  const stageRef = useRef(null);

  // Tracker State
  const [trackInput, setTrackInput] = useState('');
  const [showTrackSteps, setShowTrackSteps] = useState(false);

  // Checkout Form
  const [orderOk, setOrderOk] = useState(false);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    eventDate: '',
    payment: 'cash',
    governorate: '',
    notes: ''
  });

  // Calculate calculator price
  const bridePrice = brideProduct?.price || 350.0;
  const bridesmaidPrice = bridesmaidProduct?.price || 250.0;
  const calculatedTotal = calcBride * bridePrice + calcMaid * bridesmaidPrice;

  const currency = t('products.currency') || 'ج.م';

  const shippingZones = siteContent?.shippingZones || translations.egyptZones.map(z => ({ ...z, enabled: true }));
  const selectedZone = shippingZones.find(z => z.id === formData.governorate);
  const deliveryFee = selectedZone ? parseFloat(selectedZone.fee) : 0;

  const paymentSettings = siteContent?.paymentSettings || {
    cash: { enabled: true },
    transfer: { enabled: true, bankName: '', iban: '' },
    instapay: { enabled: true, ipa: 'merchant@instapay', phone: '01000000000' },
    applepay: { enabled: true }
  };

  const getCalcBreakdownText = () => {
    const totalTees = calcBride + calcMaid;
    if (lang === 'ar') {
      return `${calcBride} تيشيرت عروس + ${calcMaid} تيشيرت وصيفة · الإجمالي ${totalTees} تيشيرتات`;
    }
    return `${calcBride} bride tee + ${calcMaid} bridesmaid tee${calcMaid === 1 ? '' : 's'} · ${totalTees} tees`;
  };

  // Sparkles Generator
  useEffect(() => {
    const count = window.innerWidth < 700 ? 18 : 32;
    const items = Array.from({ length: count }).map((_, i) => {
      const size = 8 + Math.random() * 14;
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        color: Math.random() < 0.25 ? 'rgba(216,92,124,.55)' : 'rgba(255,255,255,.9)',
        delay: `${(Math.random() * 3.4).toFixed(2)}s`,
        duration: `${(2.6 + Math.random() * 2.4).toFixed(2)}s`
      };
    });
    setSparkles(items);
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (!weddingDate) {
      setCountdown(null);
      setCountdownMsg(t('landing.countdown.msg'));
      return;
    }
    const updateTimer = () => {
      const target = new Date(weddingDate + 'T00:00:00');
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) {
        setCountdown(null);
        setCountdownMsg(t('landing.countdown.passed'));
        return;
      }

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);

      setCountdown({ days, hours, minutes });

      const LEAD_DAYS = 7;
      const orderBy = new Date(target.getTime() - LEAD_DAYS * 86400000);
      const t0 = new Date();
      t0.setHours(0, 0, 0, 0);

      const options = { month: 'short', day: 'numeric' };
      const orderDateStr = orderBy.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', options);

      if (orderBy < t0) {
        setCountdownMsg(t('landing.countdown.closeMsg').replace('{days}', days));
      } else {
        const toOrder = Math.ceil((orderBy - t0) / 86400000);
        setCountdownMsg(
          t('landing.countdown.safeMsg')
            .replace('{days}', days)
            .replace('{orderDate}', orderDateStr)
            .replace('{toOrder}', toOrder)
        );
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 30000);
    return () => clearInterval(interval);
  }, [weddingDate, lang, t]);

  // Flash Added status
  const triggerAddedFlash = (key) => {
    setAddedStatus(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setAddedStatus(prev => ({ ...prev, [key]: false }));
    }, 1200);
  };

  // Add standard product
  const handleAddToCart = (product, key) => {
    if (!product) return;
    addToCart(product);
    triggerAddedFlash(key);
  };

  // Add custom design to cart
  const handleAddCustomToCart = () => {
    if (!customProduct) return;
    const metadata = [];
    if (inName) metadata.push(`"${inName}"`);
    if (inDate) metadata.push(inDate);
    const extraLabel = metadata.length ? ` (${metadata.join(' · ')})` : '';

    const customTee = {
      ...customProduct,
      name: `${lang === 'ar' ? 'تيشيرت مخصص' : 'Custom design tee'}${extraLabel}`,
      nameEn: `${lang === 'ar' ? 'تيشيرت مخصص' : 'Custom design tee'}${extraLabel}`,
      _cartKey: `custom_${Date.now()}`
    };

    addToCart(customTee);
    triggerAddedFlash('custom');
  };

  // File Upload Handlers
  const handleInPhotoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const r = new FileReader();
      r.onload = (ev) => setInPhotoUrl(ev.target.result);
      r.readAsDataURL(file);
    }
  };

  const handleInPrintPhotoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const r = new FileReader();
      r.onload = (ev) => setInPrintPhotoUrl(ev.target.result);
      r.readAsDataURL(file);
    }
  };

  const handleTryPhotoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const r = new FileReader();
      r.onload = (ev) => setUserPhotoUrl(ev.target.result);
      r.readAsDataURL(file);
    }
  };

  const handleCustomDesignChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const r = new FileReader();
      r.onload = (ev) => setCustomDesignUrl(ev.target.result);
      r.readAsDataURL(file);
    }
  };

  const handleCustomPhotoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const r = new FileReader();
      r.onload = (ev) => setCustomPhotoUrl(ev.target.result);
      r.readAsDataURL(file);
    }
  };

  // See It On You Drag & Drop Events
  const getXY = (e) => {
    const touch = e.touches && e.touches[0];
    return { x: touch ? touch.clientX : e.clientX, y: touch ? touch.clientY : e.clientY };
  };

  const handleDragStart = (e) => {
    if (!userPhotoUrl) return;
    const p = getXY(e);
    setDragging(true);
    setDragStart({
      sX: p.x,
      sY: p.y,
      bL: designPosition.x,
      bT: designPosition.y
    });
    e.preventDefault();
  };

  const handleDragMove = useCallback((e) => {
    if (!dragging || !stageRef.current) return;
    const p = getXY(e);
    const stageRect = stageRef.current.getBoundingClientRect();
    const deltaX = ((p.x - dragStart.sX) / stageRect.width) * 100;
    const deltaY = ((p.y - dragStart.sY) / stageRect.height) * 100;

    const newX = Math.max(8, Math.min(92, dragStart.bL + deltaX));
    const newY = Math.max(8, Math.min(92, dragStart.bT + deltaY));

    setDesignPosition({ x: newX, y: newY });
    e.preventDefault();
  }, [dragging, dragStart]);

  const handleDragEnd = useCallback(() => {
    setDragging(false);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleDragMove, { passive: false });
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [dragging, handleDragMove, handleDragEnd]);

  // Save Try-on Image
  const handleSavePreview = () => {
    if (!userPhotoUrl) {
      alert(lang === 'ar' ? 'يرجى تحميل صورتك أولاً، ثم سحب التصميم عليها، ثم حفظ المعاينة! 🎀' : 'Upload your photo first, then drag a design on — then save your preview to share! 🎀');
      return;
    }
    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);

    try {
      const clone = stage.cloneNode(true);
      const ph = clone.querySelector('#stagePh');
      if (ph) ph.remove();

      // Ensure proper sizing styles in SVG
      clone.style.transform = '';
      clone.style.width = `${w}px`;
      clone.style.height = `${h}px`;

      const html = new XMLSerializer().serializeToString(clone);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="width:${w}px;height:${h}px;position:relative;">
            ${html}
          </div>
        </foreignObject>
      </svg>`;

      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        try {
          const url = c.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = url;
          a.download = 'my-bridie-preview.png';
          a.click();
        } catch (err) {
          alert(lang === 'ar' ? 'حدث خطأ أثناء حفظ الصورة تلقائياً — يرجى التقاط لقطة شاشة بدلاً من ذلك! 🎀' : "Couldn't save automatically — try a screenshot to share your look! 🎀");
        }
      };
      img.onerror = () => {
        alert(lang === 'ar' ? 'حدث خطأ أثناء حفظ الصورة تلقائياً — يرجى التقاط لقطة شاشة بدلاً من ذلك! 🎀' : "Couldn't save automatically — try a screenshot to share your look! 🎀");
      };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    } catch (e) {
      alert(lang === 'ar' ? 'حدث خطأ أثناء حفظ الصورة تلقائياً — يرجى التقاط لقطة شاشة بدلاً من ذلك! 🎀' : "Couldn't save automatically — try a screenshot to share your look! 🎀");
    }
  };

  // Order Submission
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert(lang === 'ar' ? 'سلة التسوق فارغة — أضف بعض المنتجات للبدء! 🎀' : 'Your cart is empty — add a tee before placing your order. 🎀');
      return;
    }
    setOrderSubmitting(true);
    try {
      const notesWithDate = `${formData.notes} | Event Date: ${formData.eventDate}`;
      await submitOrder({
        client: formData.name,
        phone: formData.phone,
        address: formData.address,
        notes: notesWithDate,
        payment: formData.payment,
        governorate: selectedZone ? (lang === 'ar' ? selectedZone.ar : selectedZone.en) : '',
        deliveryFee: deliveryFee
      });
      setOrderOk(true);
    } catch (err) {
      alert(lang === 'ar' ? 'حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى.' : 'Something went wrong sending your order. Please try again.');
    } finally {
      setOrderSubmitting(false);
    }
  };

  const handleTrackSubmit = () => {
    if (!trackInput.trim()) return;
    setShowTrackSteps(true);
  };

  const handleTrackDemo = () => {
    setTrackInput('BR-1042');
    setShowTrackSteps(true);
  };

  return (
    <>
      <Seo
        title={lang === 'ar' ? 'الصفحة الرئيسية' : 'Home'}
        description={lang === 'ar'
          ? 'تيشيرتات العروس ووصيفات العروس من ذا برايدي — باقات مميزة وتصاميم مخصصة قطنية 100% لتجهيزات الزفاف.'
          : "Bride & Bridesmaid Tees by The Bridie — Premium matching sets and custom designs for the perfect bachelorette & preparations."}
        keywords="تيشيرتات عروس، تيشيرتات وصيفات، bride tees, bridesmaid tees, matching bachelorette shirts"
      />

      {/* Decorative twinkling sparkles layer */}
      <div className="sparkles" aria-hidden="true">
        {sparkles.map(s => (
          <span
            key={s.id}
            style={{
              left: s.left,
              top: s.top,
              width: s.width,
              height: s.height,
              color: s.color,
              animationDelay: s.delay,
              animationDuration: s.duration,
            }}
            dangerouslySetInnerHTML={{ __html: STAR_SVG }}
          />
        ))}
      </div>

      {/* Floating sticker decorations */}
      <div className="stickers" aria-hidden="true">
        {DECORATION_STICKERS.map((st, i) => (
          <div
            key={i}
            className={st.className}
            dangerouslySetInnerHTML={{ __html: st.svg }}
          />
        ))}
      </div>

      {/* Hero Header Panel */}
      <header className="hero-bridie panel">
        <div className="eyebrow">{t('landing.hero.badge')}</div>
        <h1 dangerouslySetInnerHTML={{ __html: lang === 'ar' ? 'للعروس و<em>كل شلتها</em>' : 'For the bride<br>&amp; <em>all her girls</em>' }} />
        <p>{t('landing.hero.subtitle')}</p>
        <div className="cta-row">
          <a href="#bundles" className="btn-bridie btn-primary-bridie">{t('landing.hero.shopBundles')}</a>
          <a href="#shop" className="btn-bridie btn-ghost-bridie">{t('landing.hero.browseSingles')}</a>
        </div>
      </header>

      {/* Hero Photos Grid */}
      <div className="hero-photos">
        <div className="frame">
          <div className="ph">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span>{t('landing.hero.addPhoto')}</span>
          </div>
        </div>
        <div className="frame">
          <div className="ph">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span>{t('landing.hero.addPhoto')}</span>
          </div>
        </div>
        <div className="frame">
          <div className="ph">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span>{t('landing.hero.addPhoto')}</span>
          </div>
        </div>
      </div>

      {/* Scrolling Marquee */}
      <div className="marquee-wrap" aria-hidden="true">
        <div className="mq">
          {[1, 2, 3, 4, 5, 6].map(loopIdx => 
            translations.landing.marquee.map((item, idx) => (
              <span key={`${loopIdx}_${idx}`}>
                {item[lang] || item.ar}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Bundles Section */}
      <section className="block-bridie" id="bundles">
        <div className="sec-head">
          <div className="eyebrow">{t('landing.bundles.eyebrow')}</div>
          <h2>{lang === 'ar' ? 'الباقات الموفرة للعروس وصديقاتها' : <>Bride <em>+ her girls</em>, bundled</>}</h2>
        </div>
        <div className="bundles">
          <div className="bundle">
            <div className="frame">
              <div className="ph">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span>{t('landing.hero.addPhoto')}</span>
              </div>
            </div>
            <div className="body">
              <h3>{t('landing.bundles.trio')}</h3>
              <p className="desc">{t('landing.bundles.trioDesc')}</p>
              <div className="price">
                {trioProduct ? (trioProduct.price).toFixed(2) : '00.00'} {currency}
              </div>
              <button
                type="button"
                className="btn-bridie btn-primary-bridie"
                onClick={() => handleAddToCart(trioProduct, 'trio')}
              >
                {addedStatus['trio'] ? t('landing.bundles.added') : t('landing.bundles.addToCart')}
              </button>
            </div>
          </div>

          <div className="bundle">
            <span className="ribbon">{t('landing.bundles.mostLoved')}</span>
            <div className="frame">
              <div className="ph">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span>{t('landing.hero.addPhoto')}</span>
              </div>
            </div>
            <div className="body">
              <h3>{t('landing.bundles.squad')}</h3>
              <p className="desc">{t('landing.bundles.squadDesc')}</p>
              <div className="price">
                {squadProduct ? (squadProduct.price).toFixed(2) : '00.00'} {currency}
              </div>
              <button
                type="button"
                className="btn-bridie btn-primary-bridie"
                onClick={() => handleAddToCart(squadProduct, 'squad')}
              >
                {addedStatus['squad'] ? t('landing.bundles.added') : t('landing.bundles.addToCart')}
              </button>
            </div>
          </div>

          <div className="bundle">
            <div className="frame">
              <div className="ph">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span>{t('landing.hero.addPhoto')}</span>
              </div>
            </div>
            <div className="body">
              <h3>{t('landing.bundles.buildOwn')}</h3>
              <p className="desc">{t('landing.bundles.buildOwnDesc')}</p>
              <div className="price">
                {lang === 'ar' ? 'من' : 'From'} {brideProduct ? (brideProduct.price).toFixed(2) : '0.00'} {currency}
              </div>
              <a href="#customize" className="btn-bridie btn-primary-bridie">{t('landing.bundles.customize')}</a>
            </div>
          </div>
        </div>
      </section>

      {/* Squad Calculator */}
      <section className="block-bridie" id="calc" style={{ paddingTop: 0 }}>
        <div className="sec-head">
          <div className="eyebrow">{t('landing.calculator.eyebrow')}</div>
          <h2>{lang === 'ar' ? 'احسبي باقة شلتكِ' : <>Build your <em>squad</em></>}</h2>
        </div>
        <p style={{ textAlign: 'center', maxWidth: '46ch', margin: '-30px auto 18px', color: '#444444', fontSize: '15px' }}>
          {t('landing.calculator.desc')}
        </p>
        <div className="calc panel">
          <div className="calc-rows">
            <div className="calc-line">
              <div className="cl-label">
                <div className="t">{t('landing.calculator.bride')}</div>
                <div className="s">{t('landing.calculator.brideSub')}</div>
              </div>
              <div className="stepper">
                <button type="button" onClick={() => setCalcBride(q => Math.max(0, q - 1))}>−</button>
                <span className="val">{calcBride}</span>
                <button type="button" onClick={() => setCalcBride(q => q + 1)}>+</button>
              </div>
            </div>
            <div className="calc-line">
              <div className="cl-label">
                <div className="t">{t('landing.calculator.maids')}</div>
                <div className="s">{t('landing.calculator.maidsSub')}</div>
              </div>
              <div className="stepper">
                <button type="button" onClick={() => setCalcMaid(q => Math.max(0, q - 1))}>−</button>
                <span className="val">{calcMaid}</span>
                <button type="button" onClick={() => setCalcMaid(q => q + 1)}>+</button>
              </div>
            </div>
          </div>
          <div className="calc-out">
            <div className="tot">{calculatedTotal.toFixed(2)} {currency}</div>
            <div className="brk">{getCalcBreakdownText()}</div>
          </div>
          <p className="calc-note">
            {t('landing.calculator.placeholderNote')}
          </p>
          <div className="btns">
            <a href="#order" className="btn-bridie btn-primary-bridie">{t('landing.calculator.startOrder')}</a>
          </div>
        </div>
      </section>

      {/* Countdown Timer */}
      <section className="block-bridie cd-band" id="countdown" style={{ paddingTop: 0 }}>
        <div className="sec-head">
          <div className="eyebrow">{t('landing.countdown.eyebrow')}</div>
          <h2>{lang === 'ar' ? 'اطلبي قبل فوات الأوان' : <>Order in <em>time</em> for the big day</>}</h2>
        </div>
        <div className="cd-pick">
          <label htmlFor="weddingDate">{t('landing.countdown.label')}</label>
          <input
            type="date"
            id="weddingDate"
            value={weddingDate}
            onChange={(e) => setWeddingDate(e.target.value)}
          />
        </div>
        {countdown && (
          <div className="cd-row">
            <div className="cd-cell"><div className="cd-num">{countdown.days}</div><div className="cd-lbl">{t('landing.countdown.days')}</div></div>
            <div className="cd-cell"><div className="cd-num">{countdown.hours}</div><div className="cd-lbl">{t('landing.countdown.hours')}</div></div>
            <div className="cd-cell"><div className="cd-num">{countdown.minutes}</div><div className="cd-lbl">{t('landing.countdown.minutes')}</div></div>
          </div>
        )}
        <p className="cd-msg" dangerouslySetInnerHTML={{ __html: countdownMsg }} />
      </section>

      {/* Shop Singles */}
      <section className="block-bridie" id="shop" style={{ paddingTop: 0 }}>
        <div className="sec-head">
          <div className="eyebrow">{t('landing.singles.eyebrow')}</div>
          <h2>{lang === 'ar' ? 'احصلي عليها فرادى' : <>Or grab them <em>one by one</em></>}</h2>
        </div>
        <div className="singles">
          <div className="single">
            <div className="frame">
              <div className="ph">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span>{t('landing.hero.addPhoto')}</span>
              </div>
            </div>
            <div className="body">
              <h4>{t('landing.singles.bride')}</h4>
              <div className="price">{brideProduct ? (brideProduct.price).toFixed(2) : '00.00'} {currency}</div>
              <button
                type="button"
                className="btn-bridie btn-primary-bridie"
                onClick={() => handleAddToCart(brideProduct, 'bride')}
              >
                {addedStatus['bride'] ? t('landing.bundles.added') : t('landing.bundles.addToCart')}
              </button>
            </div>
          </div>

          <div className="single">
            <div className="frame">
              <div className="ph">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span>{t('landing.hero.addPhoto')}</span>
              </div>
            </div>
            <div className="body">
              <h4>{t('landing.singles.bridesmaid')}</h4>
              <div className="price">{bridesmaidProduct ? (bridesmaidProduct.price).toFixed(2) : '00.00'} {currency}</div>
              <button
                type="button"
                className="btn-bridie btn-primary-bridie"
                onClick={() => handleAddToCart(bridesmaidProduct, 'bridesmaid')}
              >
                {addedStatus['bridesmaid'] ? t('landing.bundles.added') : t('landing.bundles.addToCart')}
              </button>
            </div>
          </div>

          <div className="single">
            <div className="frame">
              <div className="ph">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span>{t('landing.hero.addPhoto')}</span>
              </div>
            </div>
            <div className="body">
              <h4>{t('landing.singles.mother')}</h4>
              <div className="price">{motherProduct ? (motherProduct.price).toFixed(2) : '00.00'} {currency}</div>
              <button
                type="button"
                className="btn-bridie btn-primary-bridie"
                onClick={() => handleAddToCart(motherProduct, 'mother')}
              >
                {addedStatus['mother'] ? t('landing.bundles.added') : t('landing.bundles.addToCart')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Customize Print Editor */}
      <section className="block-bridie" id="customize">
        <div className="sec-head">
          <div className="eyebrow">{t('landing.customize.eyebrow')}</div>
          <h2>{lang === 'ar' ? 'صممي كتابتكِ المخصصة' : <>Customize your <em>print</em></>}</h2>
        </div>
        <div className="cz-wrap panel">
          <div className="cz-preview">
            <div className="cz-frame">
              {inPrintPhotoUrl && <img className="cz-printphoto has-img" src={inPrintPhotoUrl} alt="print preview" />}
              <div className={`cz-photo${inPhotoUrl ? ' has-img' : ''}`} style={{ backgroundImage: inPhotoUrl ? `url(${inPhotoUrl})` : 'none' }}></div>
              <div className="cz-name">{inName || 'Bride'}</div>
              <div className="cz-date">{inDate || 'Est. 2026'}</div>
            </div>
            <p className="cz-hint">{t('landing.customize.livePreview')}</p>
          </div>
          <div className="cz-controls">
            <label className="cz-field">
              <span>{t('landing.customize.nameLabel')}</span>
              <input
                type="text"
                maxLength="22"
                placeholder={t('landing.customize.namePlaceholder')}
                value={inName}
                onChange={(e) => setInName(e.target.value)}
              />
            </label>
            <label className="cz-field">
              <span>{t('landing.customize.dateLabel')}</span>
              <input
                type="text"
                maxLength="22"
                placeholder={t('landing.customize.datePlaceholder')}
                value={inDate}
                onChange={(e) => setInDate(e.target.value)}
              />
            </label>
            <label className="cz-field">
              <span>{t('landing.customize.photoLabel')}</span>
              <input type="file" accept="image/*" onChange={handleInPhotoChange} />
            </label>
            <label className="cz-field">
              <span>{t('landing.customize.printPhotoLabel')}</span>
              <input type="file" accept="image/*" onChange={handleInPrintPhotoChange} />
            </label>
            <button
              type="button"
              className="btn-bridie btn-primary-bridie"
              onClick={handleAddCustomToCart}
            >
              {addedStatus['custom'] ? t('landing.bundles.added') : t('landing.bundles.addToCart')}
            </button>
            <p className="cz-note">
              {t('landing.customize.note')}
            </p>
          </div>
        </div>
      </section>

      {/* See It On You (Try-On Preview) */}
      <section className="block-bridie" id="tryon">
        <div className="sec-head">
          <div className="eyebrow">{t('landing.tryon.eyebrow')}</div>
          <h2>{lang === 'ar' ? 'تخيليها على صورتكِ' : <>See it <em>on you</em></>}</h2>
        </div>
        <p style={{ textAlign: 'center', maxWidth: '50ch', margin: '-30px auto 18px', color: '#444444', fontSize: '15px' }}>
          {t('landing.tryon.desc')}
        </p>

        <div className="tabs">
          <button
            type="button"
            className={`tab${tryonPane === 'pick' ? ' active' : ''}`}
            onClick={() => setTryonPane('pick')}
          >
            {t('landing.tryon.pickTab')}
          </button>
          <button
            type="button"
            className={`tab${tryonPane === 'custom' ? ' active' : ''}`}
            onClick={() => setTryonPane('custom')}
          >
            {t('landing.tryon.customTab')}
          </button>
        </div>

        <div className="tryon-wrap panel">
          <div
            className="tryon-stage"
            ref={stageRef}
            style={{ position: 'relative' }}
          >
            {!userPhotoUrl && (
              <div className="stage-ph" id="stagePh">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span>{t('landing.tryon.uploadStart')}</span>
              </div>
            )}
            {userPhotoUrl && <img className="userimg" src={userPhotoUrl} alt="User upload" />}
            <div
              className={`tryon-design${userPhotoUrl ? ' show' : ''}`}
              style={{
                left: `${designPosition.x}%`,
                top: `${designPosition.y}%`,
                width: `${designSizeOnTee}%`,
                transform: 'translate(-50%, -50%)',
                cursor: dragging ? 'grabbing' : 'grab'
              }}
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              {tryonPane === 'pick' ? (
                <>
                  <div className="d-name" style={{ fontFamily: selectedDesign.font }}>
                    {selectedDesign.name}
                  </div>
                  <div className="d-date">
                    {tryonCat === 'Bridesmaids' ? (lang === 'ar' ? 'فريق العروس' : 'Team Bride') : selectedDesign.date}
                  </div>
                </>
              ) : (
                <>
                  {customPhotoUrl && (
                    <div className="photo-badge show" style={{ backgroundImage: `url(${customPhotoUrl})` }}></div>
                  )}
                  {customDesignUrl && <img className="dImg show" src={customDesignUrl} alt="Custom artwork" />}
                  <div className="d-name" style={{ fontFamily: 'Caveat' }}>{customName}</div>
                  <div className="d-date">{customDate}</div>
                </>
              )}
            </div>
          </div>

          <div className="tryon-controls">
            <div className="row-try">
              <span><span className="step-num">1</span>{t('landing.tryon.step1')}</span>
              <input type="file" accept="image/*" onChange={handleTryPhotoChange} />
            </div>

            {/* PATH A: Pick design */}
            <div className={`pane${tryonPane === 'pick' ? ' active' : ''}`}>
              <div className="row-try">
                <span><span className="step-num">2</span>{t('landing.tryon.step2')}</span>
                <div className="seg-row">
                  <div className={`seg${tryonCat === 'Bride' ? ' sel' : ''}`} onClick={() => setTryonCat('Bride')}>
                    {t('landing.tryon.designs.sassyDesc') ? (lang === 'ar' ? 'العروس' : 'Bride') : 'Bride'}
                  </div>
                  <div className={`seg${tryonCat === 'Bridesmaids' ? ' sel' : ''}`} onClick={() => setTryonCat('Bridesmaids')}>
                    {lang === 'ar' ? 'وصيفات العروس' : 'Bridesmaids'}
                  </div>
                </div>
              </div>
              <div className="row-try">
                <span><span className="step-num">3</span>{t('landing.tryon.step3')}</span>
                <div className="design-grid">
                  {TRYON_DESIGNS.map(d => (
                    <div
                      key={d.key}
                      className={`design-opt${selectedDesign.key === d.key ? ' sel' : ''}`}
                      onClick={() => setSelectedDesign(d)}
                    >
                      <div className="dl" style={{ fontFamily: d.font }}>{t(d.labelKey)}</div>
                      <div className="ds">{t(d.descKey)}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="row-try">
                <span><span className="step-num">4</span>{t('landing.tryon.step4')}</span>
                <div className="seg-row">
                  <div className={`seg${tryonSize === 'S/M' ? ' sel' : ''}`} onClick={() => setTryonSize('S/M')}>S / M</div>
                  <div className={`seg${tryonSize === 'L/XL' ? ' sel' : ''}`} onClick={() => setTryonSize('L/XL')}>L / XL</div>
                </div>
              </div>
              <p className="tryon-note">
                {t('landing.tryon.dragNote')}<br />
                <strong>
                  {t(selectedDesign.labelKey)} · {tryonCat === 'Bridesmaids' ? (lang === 'ar' ? 'وصيفة' : 'Bridesmaid') : (lang === 'ar' ? 'عروس' : 'Bride')} · {tryonSize}
                </strong>
              </p>
            </div>

            {/* PATH B: Custom design */}
            <div className={`pane${tryonPane === 'custom' ? ' active' : ''}`}>
              <div className="row-try">
                <span><span className="step-num">2</span>{t('landing.tryon.customStep2')}</span>
                <input type="file" accept="image/*" onChange={handleCustomDesignChange} />
              </div>
              <div className="row-try">
                <span><span className="step-num">3</span>{t('landing.tryon.customStep3')}</span>
                <input type="file" accept="image/*" onChange={handleCustomPhotoChange} />
              </div>
              <div className="row-try">
                <span><span className="step-num">4</span>{t('landing.tryon.customStep4')}</span>
                <input
                  type="text"
                  maxLength="18"
                  placeholder="Sara & Omar"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
              </div>
              <div className="row-try">
                <span><span className="step-num">5</span>{t('landing.tryon.customStep5')}</span>
                <input
                  type="text"
                  maxLength="18"
                  placeholder="10.10.2026"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                />
              </div>
              <div className="row-try">
                <span>{t('landing.tryon.customSize')}</span>
                <input
                  type="range"
                  min="20"
                  max="72"
                  value={designSizeOnTee}
                  onChange={(e) => setDesignSizeOnTee(Number(e.target.value))}
                />
              </div>
              <p className="tryon-note">{t('landing.tryon.customNote')}</p>
            </div>

            <div className="tryon-foot">
              <button type="button" className="btn-share" onClick={handleSavePreview}>
                <svg viewBox="0 0 24 24"><path d="M18 16a3 3 0 0 0-2.4 1.2l-6.7-3.4a3 3 0 0 0 0-1.6l6.7-3.4a3 3 0 1 0-.9-1.8L8 10a3 3 0 1 0 0 4l6.7 3.4A3 3 0 1 0 18 16z" /></svg>
                {t('landing.tryon.savePreview')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Size Guide */}
      <section className="block-bridie" id="sizes" style={{ paddingTop: 0 }}>
        <div className="sec-head">
          <div className="eyebrow">{t('landing.sizes.eyebrow')}</div>
          <h2>{t('landing.sizes.title')}</h2>
        </div>
        <div className="sizes panel">
          <table>
            <thead>
              <tr>
                <th>{t('landing.sizes.size')}</th>
                <th>{t('landing.sizes.fits')}</th>
                <th>{t('landing.sizes.chest')}</th>
                <th>{t('landing.sizes.length')}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>S / M</td><td>EU 36–40</td><td>96–104</td><td>66–69</td></tr>
              <tr><td>L / XL</td><td>EU 42–46</td><td>108–116</td><td>71–74</td></tr>
            </tbody>
          </table>
          <p className="sizes-note">
            {t('landing.sizes.note')}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="block-bridie" id="faq">
        <div className="sec-head">
          <div className="eyebrow">{t('landing.faq.eyebrow')}</div>
          <h2>{t('landing.faq.title')}</h2>
        </div>
        <div className="faq panel">
          {lang === 'ar' ? (
            <>
              <details open>
                <summary>ما هي المقاسات المتوفرة؟</summary>
                <p>تأتي جميع التصاميم بمقاسات S/M و L/XL بقصة فضفاضة ومريحة تناسب الجميع. غير متأكدة من المقاس؟ استخدمي قسم "تخيليها على صورتك" لمعاينة التصميم على صورتك الشخصية قبل الاختيار.</p>
              </details>
              <details>
                <summary>كم من الوقت يستغرق الطلب؟</summary>
                <p>نطبع كل تيشيرت طازجاً بناءً على الطلب خصيصاً لمناسبتكم. يستغرق التحضير عادة بضعة أيام، بالإضافة إلى وقت الشحن والتوصيل. نوصي بالطلب قبل أسبوعين على الأقل لضمان وصول كل شيء بهدوء وفي الوقت المناسب.</p>
              </details>
              <details>
                <summary>هل يمكنني طباعة تصميمي الخاص أو صورة شخصية؟</summary>
                <p>نعم بالتأكيد! في قسم "خصص الطباعة بنفسك" يمكنك رفع صورة شخصية — لكِ ولخطيبك، للعروس، أو حتى لحيوانك الأليف — وسنقوم بطباعتها على التيشيرت مباشرة. وفي قسم "تخيليها على صورتك"، يمكنك التبديل لرفع تصميم خاص بالكامل.</p>
              </details>
              <details>
                <summary>هل تقومون بالتوصيل لكافة المحافظات؟</summary>
                <p>نعم، التوصيل متاح لكافة المحافظات. يتم تأكيد تكاليف الشحن ووقت التوصيل أثناء تأكيد الطلب، ونحن نضع مواعيد التوصيل في الاعتبار لضمان وصول الباقة قبل مناسبتكِ دائماً.</p>
              </details>
              <details>
                <summary>هل هناك خصومات للمجموعات الكبيرة؟</summary>
                <p>الباقات هي الأوفر دائماً. كلما زاد عدد الفتيات في باقتك — العروس والوصيفات — حصلتِ على سعر أفضل للتيشيرت الواحد. يمكنك اختيار باقة Trio أو Squad أو بناء باقتك الخاصة.</p>
              </details>
              <details>
                <summary>كيف يمكنني العناية بالتيشيرت المطبوع؟</summary>
                <p>يُغسل التيشيرت مقلوباً على دورة غسيل خفيفة وباردة، ويعلق ليجف بالهواء. تجنبي المجفف الحراري، وقومي بالكي حول منطقة الطباعة وليس عليها مباشرة ليظل التصميم زاهياً وناعماً غسلة بعد غسلة.</p>
              </details>
            </>
          ) : (
            <>
              <details open>
                <summary>What sizes do you offer?</summary>
                <p>Every design comes in S/M and L/XL in a relaxed, flattering fit that suits the whole party. Not sure which to pick? Use the "See it on you" section to preview a design on your own photo before you choose.</p>
              </details>
              <details>
                <summary>How long does an order take?</summary>
                <p>Each tee is printed to order, just for your party. Production usually takes a few days, plus delivery time. Order with at least a couple of weeks before the big day so everything arrives relaxed and on time — message us if your date is close and we'll do our best to rush it.</p>
              </details>
              <details>
                <summary>Can I print my own design or a personal photo?</summary>
                <p>Yes! In "Customize your print" you can add a personal photo — you and your partner, the bride, even a pet — and we'll print it right onto your chosen design. In "See it on you," switch to "Upload my own design" to add your own artwork, a personal photo, name and date. We match the colours to the Bridie look when we print.</p>
              </details>
              <details>
                <summary>Do you deliver across the region?</summary>
                <p>Yes — we deliver across all areas. Shipping cost and timing are confirmed at checkout, and we factor delivery into your order timeline so your set is never late.</p>
              </details>
              <details>
                <summary>Is there a discount for the whole squad?</summary>
                <p>Bundles are the best value. The more girls in your set — bride plus a tee for every bridesmaid — the better the per-tee price. Build your set from the bundles section above.</p>
              </details>
              <details>
                <summary>How do I care for the print?</summary>
                <p>Wash inside-out on a cool, gentle cycle and hang to dry. Skip the tumble dryer and iron around the print, not directly on it — your tees will stay soft and bright wear after wear.</p>
              </details>
            </>
          )}
        </div>
      </section>

      {/* Checkout Order Form */}
      <section className="block-bridie" id="order">
        <div className="sec-head">
          <div className="eyebrow">{t('landing.order.eyebrow')}</div>
          <h2>{t('landing.order.title')}</h2>
        </div>
        <p style={{ textAlign: 'center', maxWidth: '50ch', margin: '-30px auto 8px', color: '#444444', fontSize: '15px' }}>
          {t('landing.order.desc')}
        </p>
        <div className="order panel">
          {!orderOk ? (
            <form onSubmit={handleOrderSubmit}>
              <div className="of-section-label"><span className="n">1</span>{t('landing.order.step1')}</div>
              <div className="of-summary">
                {cart.length === 0 ? (
                  <div className="os-empty">
                    {lang === 'ar' ? (
                      <>السلة فارغة حالياً. <a href="#shop">أضيفي بعض التيشيرتات</a> لتظهر هنا تلقائياً.</>
                    ) : (
                      <>Your cart is empty. <a href="#shop">Add some tees</a> and they'll appear here automatically.</>
                    )}
                  </div>
                ) : (
                  <>
                    {cart.map(item => (
                      <div key={item._cartKey || item.id} className="os-row">
                        <span>{item.name} <span className="q">× {item.qty}</span></span>
                        <span>{(item.price * item.qty).toFixed(2)} {currency}</span>
                      </div>
                    ))}
                    <div className="os-row" style={{ borderTop: '1px dashed #eed6dc', paddingTop: '8px', marginTop: '8px', fontSize: '14px', color: '#666' }}>
                      <span>{t('checkout.subtotal')}</span>
                      <span>{cartTotal.toFixed(2)} {currency}</span>
                    </div>
                    {deliveryFee > 0 && (
                      <div className="os-row" style={{ fontSize: '14px', color: '#666' }}>
                        <span>{t('checkout.deliveryFee')}</span>
                        <span>{deliveryFee.toFixed(2)} {currency}</span>
                      </div>
                    )}
                    <div className="os-total" style={{ borderTop: '1px solid #eed6dc', paddingTop: '8px' }}>
                      <span className="l">{t('cart.total')}</span>
                      <span className="v">{(cartTotal + deliveryFee).toFixed(2)} {currency}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="of-section-label" style={{ marginTop: '24px' }}>
                <span className="n">2</span>{t('landing.order.step2')}
              </div>
              <div className="of-grid">
                <div className="of-field">
                  <label htmlFor="ofName">{t('checkout.name')}</label>
                  <input
                    id="ofName"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="of-field">
                  <label htmlFor="ofPhone">{t('checkout.phone')}</label>
                  <input
                    id="ofPhone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="01x xxxx xxxx"
                    value={formData.phone}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="of-field">
                  <label htmlFor="ofGov">{t('checkout.governorate')}</label>
                  <select
                    id="ofGov"
                    name="governorate"
                    required
                    value={formData.governorate || ''}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1.5px solid #eed6dc',
                      fontSize: '15px',
                      outline: 'none',
                      background: '#fff'
                    }}
                  >
                    <option value="">{t('checkout.selectGov')}</option>
                    {shippingZones.filter(z => z.enabled).map(zone => (
                      <option key={zone.id} value={zone.id}>
                        {lang === 'ar' ? zone.ar : zone.en} (+{(zone.fee).toFixed(2)} {currency})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="of-field full">
                  <label htmlFor="ofAddr">{t('checkout.address')}</label>
                  <textarea
                    id="ofAddr"
                    name="address"
                    required
                    placeholder={lang === 'ar' ? 'الشارع، البناية، المنطقة، المدينة' : 'Street, building, area, city'}
                    value={formData.address}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="of-field full">
                  <label htmlFor="ofDate">{lang === 'ar' ? 'تاريخ الزفاف / المناسبة' : 'Wedding / event date'}</label>
                  <input
                    id="ofDate"
                    name="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="of-section-label" style={{ marginTop: '8px' }}>
                <span className="n">3</span>{t('landing.order.step3')}
              </div>
              <div className="pay-opts" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {paymentSettings.cash?.enabled !== false && (
                  <label className={`pay-opt${formData.payment === 'cash' ? ' sel' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={formData.payment === 'cash'}
                      onChange={handleFormChange}
                    />
                    <span>
                      <span className="po-t">{t('checkout.cash')}</span>
                      <span className="po-s">{lang === 'ar' ? 'الدفع نقداً عند الاستلام.' : 'Pay cash when your order is delivered.'}</span>
                    </span>
                  </label>
                )}
                {paymentSettings.instapay?.enabled !== false && (
                  <label className={`pay-opt${formData.payment === 'instapay' ? ' sel' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="instapay"
                      checked={formData.payment === 'instapay'}
                      onChange={handleFormChange}
                    />
                    <span>
                      <span className="po-t">{t('checkout.instapay')}</span>
                      <span className="po-s">{lang === 'ar' ? 'التحويل الفوري عبر تطبيق إنستاباي.' : 'Transfer instantly using InstaPay app.'}</span>
                    </span>
                  </label>
                )}
                {paymentSettings.transfer?.enabled !== false && (
                  <label className={`pay-opt${formData.payment === 'transfer' ? ' sel' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="transfer"
                      checked={formData.payment === 'transfer'}
                      onChange={handleFormChange}
                    />
                    <span>
                      <span className="po-t">{t('checkout.transfer')}</span>
                      <span className="po-s">{lang === 'ar' ? 'تحويل بنكي مباشر إلى حسابنا.' : 'Direct bank transfer to our account.'}</span>
                    </span>
                  </label>
                )}
                {paymentSettings.applepay?.enabled !== false && (
                  <label className={`pay-opt${formData.payment === 'applepay' ? ' sel' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="applepay"
                      checked={formData.payment === 'applepay'}
                      onChange={handleFormChange}
                    />
                    <span>
                      <span className="po-t">{t('checkout.applepay')}</span>
                      <span className="po-s">{lang === 'ar' ? 'ادفع بأمان وسهولة باستخدام Apple Pay.' : 'Pay securely using Apple Pay.'}</span>
                    </span>
                  </label>
                )}
              </div>

              {formData.payment === 'instapay' && (
                <div className="pay-details-instruction" style={{ marginTop: '12px', padding: '12px 16px', background: 'rgba(253, 234, 240, 0.4)', borderRadius: '8px', fontSize: '14px', border: '1px solid #eed6dc' }}>
                  <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '6px' }}>{lang === 'ar' ? 'بيانات الدفع عبر إنستاباي:' : 'InstaPay Payment Details:'}</strong>
                  <div>
                    {lang === 'ar' ? 'عنوان الدفع (IPA):' : 'InstaPay Address (IPA):'} <code style={{ background: '#fff', border: '1px solid #eed6dc', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{paymentSettings.instapay?.ipa || 'merchant@instapay'}</code>
                  </div>
                  {paymentSettings.instapay?.phone && (
                    <div style={{ marginTop: '6px' }}>
                      {lang === 'ar' ? 'رقم الهاتف المرتبط:' : 'Linked Phone:'} <strong>{paymentSettings.instapay.phone}</strong>
                    </div>
                  )}
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '8px', marginBottom: 0 }}>
                    {lang === 'ar' ? '* يرجى إرسال لقطة شاشة لإيصال التحويل لتأكيد الطلب.' : '* Please send a screenshot of the transfer receipt to confirm your order.'}
                  </p>
                </div>
              )}

              {formData.payment === 'transfer' && (
                <div className="pay-details-instruction" style={{ marginTop: '12px', padding: '12px 16px', background: 'rgba(253, 234, 240, 0.4)', borderRadius: '8px', fontSize: '14px', border: '1px solid #eed6dc' }}>
                  <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '6px' }}>{lang === 'ar' ? 'تفاصيل التحويل البنكي:' : 'Bank Transfer Details:'}</strong>
                  {paymentSettings.transfer?.bankName && (
                    <div>
                      {lang === 'ar' ? 'اسم البنك:' : 'Bank Name:'} <strong>{paymentSettings.transfer.bankName}</strong>
                    </div>
                  )}
                  {paymentSettings.transfer?.iban && (
                    <div style={{ marginTop: '6px' }}>
                      {lang === 'ar' ? 'رقم الآيبان (IBAN):' : 'IBAN:'} <code style={{ background: '#fff', border: '1px solid #eed6dc', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{paymentSettings.transfer.iban}</code>
                    </div>
                  )}
                </div>
              )}

              {formData.payment === 'applepay' && (
                <div className="pay-details-instruction" style={{ marginTop: '12px', padding: '12px 16px', background: 'rgba(253, 234, 240, 0.4)', borderRadius: '8px', fontSize: '14px', border: '1px solid #eed6dc' }}>
                  <p style={{ margin: 0, color: '#666' }}>
                    {lang === 'ar' ? 'سيتواصل معك فريقنا عبر الواتساب لإرسال رابط دفع Apple Pay لتأكيد طلبكِ.' : 'Our team will contact you via WhatsApp to send an Apple Pay payment link to confirm your order.'}
                  </p>
                </div>
              )}

              <div className="of-field full" style={{ marginTop: '16px' }}>
                <label htmlFor="ofNotes">
                  {t('landing.order.notesLabel')}
                </label>
                <textarea
                  id="ofNotes"
                  name="notes"
                  placeholder={t('landing.order.notesPlaceholder')}
                  value={formData.notes}
                  onChange={handleFormChange}
                />
              </div>

              <div className="of-submit">
                <button
                  type="submit"
                  className="btn-bridie btn-primary-bridie"
                  disabled={orderSubmitting}
                >
                  {orderSubmitting ? t('checkout.sending') : t('landing.order.submit')}
                </button>
              </div>
              <p className="of-note">
                {lang === 'ar' ? 'لن يتم خصم أي مبالغ الآن — سنتواصل معكِ هاتفياً لتأكيد الباقة والتوصيل ثم إتمام الدفع بطريقتك المفضلة. 🎀' : "No payment is taken now — we'll message you to confirm your set, total and delivery, then arrange payment your way. 🎀"}
              </p>
            </form>
          ) : (
            <div className="of-ok show">
              <div className="big">{t('landing.order.success')}</div>
              <p>{t('landing.order.successDesc')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Delivery Tracker */}
      <section className="block-bridie" id="track" style={{ paddingTop: 0 }}>
        <div className="sec-head">
          <div className="eyebrow">{t('landing.track.eyebrow')}</div>
          <h2>{t('landing.track.title')}</h2>
        </div>
        <div className="track panel">
          <div className="track-find">
            <input
              type="text"
              placeholder={t('landing.track.inputPlaceholder')}
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
            />
            <button
              type="button"
              className="btn-bridie btn-primary-bridie"
              onClick={handleTrackSubmit}
            >
              {t('landing.track.btn')}
            </button>
          </div>
          <p className="track-demo">
            {lang === 'ar' ? (
              <>ليس لديكِ رقم طلب؟ <a href="#track" onClick={(e) => { e.preventDefault(); handleTrackDemo(); }}>شاهدي مثالاً</a></>
            ) : (
              <>Don't have a number yet? <a href="#track" onClick={(e) => { e.preventDefault(); handleTrackDemo(); }}>See an example</a></>
            )}
          </p>

          <div className={`steps-track${showTrackSteps ? ' show' : ''}`}>
            <div className="st-line done">
              <div className="st-dot">✓</div>
              <div className="st-t">{t('landing.track.steps.placed')}</div>
              <div className="st-s">{t('landing.track.steps.placedDesc')}</div>
            </div>
            <div className="st-line done">
              <div className="st-dot">✓</div>
              <div className="st-t">{t('landing.track.steps.printing')}</div>
              <div className="st-s">{t('landing.track.steps.printingDesc')}</div>
            </div>
            <div className="st-line current">
              <div className="st-dot">●</div>
              <div className="st-t">{t('landing.track.steps.ready')}</div>
              <div className="st-s">{t('landing.track.steps.readyDesc')}</div>
            </div>
            <div className="st-line">
              <div className="st-dot">○</div>
              <div className="st-t">{t('landing.track.steps.out')}</div>
              <div className="st-s">{t('landing.track.steps.outDesc')}</div>
            </div>
            <div className="st-line">
              <div className="st-dot">○</div>
              <div className="st-t">{t('landing.track.steps.delivered')}</div>
              <div className="st-s">{t('landing.track.steps.deliveredDesc')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="block-bridie" id="how">
        <div className="sec-head">
          <div className="eyebrow">{t('landing.how.eyebrow')}</div>
          <h2>{t('landing.how.title')}</h2>
        </div>
        <div className="steps">
          <div className="step">
            <div className="n"></div>
            <h4>{t('landing.how.step1Title')}</h4>
            <p>{t('landing.how.step1Desc')}</p>
          </div>
          <div className="step">
            <div className="n"></div>
            <h4>{t('landing.how.step2Title')}</h4>
            <p>{t('landing.how.step2Desc')}</p>
          </div>
          <div className="step">
            <div className="n"></div>
            <h4>{t('landing.how.step3Title')}</h4>
            <p>{t('landing.how.step3Desc')}</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
