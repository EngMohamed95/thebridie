import { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../../services/api';
import './index.css';

const TrackOrder = () => {
  const location = useLocation();
  const [trackCode, setTrackCode] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Status mapping
  const statusSteps = [
    { key: 'pending', label: 'Order Placed', desc: "We've received your order and confirmed details." },
    { key: 'printing', label: 'Printing & Prep', desc: "Your custom tees are being printed in our facility." },
    { key: 'ready', label: 'Ready for Courier', desc: "Quality checks passed. Package is packed and sealed." },
    { key: 'shipped', label: 'Out for Delivery', desc: "On its way with our local Egypt courier." },
    { key: 'delivered', label: 'Delivered', desc: "Delivered successfully! Wear it and make memories. 🎀" }
  ];

  // Map order status to progress index
  const getProgressIndex = (status) => {
    switch (status) {
      case 'pending': return 0;
      case 'printing': return 1;
      case 'ready': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const handleSearch = useCallback(async (codeToSearch) => {
    const code = (codeToSearch || trackCode).trim();
    if (!code) return;

    setLoading(true);
    setSearched(true);
    setErrorMsg('');
    setOrder(null);

    // Normalize code by removing '#' or extra whitespaces
    const normalizedCode = code.replace(/#/g, '');

    try {
      const res = await api.findOrder(normalizedCode);
      if (res && res.length > 0) {
        setOrder(res[0]);
      } else {
        // Fallback: try searching with 'ORD-' prefix if not entered
        if (!normalizedCode.toUpperCase().startsWith('ORD-')) {
          const resFallback = await api.findOrder(`ORD-${normalizedCode}`);
          if (resFallback && resFallback.length > 0) {
            setOrder(resFallback[0]);
            setTrackCode(`ORD-${normalizedCode}`);
            setLoading(false);
            return;
          }
        }
        setErrorMsg('No order found with this tracking code. Please verify and try again.');
      }
    } catch (err) {
      setErrorMsg('Could not fetch tracking details. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [trackCode]);

  // Pre-fill query param if it exists
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    if (code) {
      setTrackCode(code);
      handleSearch(code);
    }
  }, [location, handleSearch]);

  const maskPhone = (phone) => {
    if (!phone) return '—';
    const clean = phone.trim();
    if (clean.length < 7) return clean;
    return clean.slice(0, 4) + '***' + clean.slice(-3);
  };

  const currentIdx = order ? getProgressIndex(order.status) : 0;
  const isCancelled = order?.status === 'cancelled';

  return (
    <div className="track-page">
      <div className="track-container">
        
        {/* Header Section */}
        <div className="track-header">
          <Link to="/" className="back-link">
            <i className="fas fa-arrow-left"></i> Back to Shop
          </Link>
          <h1>Track Your Delivery</h1>
          <p className="track-subtitle">Enter your order ID (e.g. ORD-1781591144936) to check real-time shipment status</p>
        </div>

        {/* Search Input Panel */}
        <div className="track-search-panel">
          <div className="track-search-input-group">
            <input
              type="text"
              value={trackCode}
              onChange={(e) => setTrackCode(e.target.value)}
              placeholder="e.g. ORD-1781591144936 or 1781591144936"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn-track" onClick={() => handleSearch()} disabled={loading}>
              {loading ? 'Searching...' : 'Track'}
            </button>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="track-loading">
            <div className="spinner"></div>
            <p>Fetching real-time tracking data...</p>
          </div>
        )}

        {/* Error / Not Found Alert */}
        {searched && !loading && errorMsg && (
          <div className="track-error-card">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Tracking Details */}
        {!loading && order && (
          <div className="track-results animate-fade-in">
            
            {/* Cancelled State warning */}
            {isCancelled && (
              <div className="cancelled-warning-card">
                <i className="fas fa-ban"></i>
                <div>
                  <h3>Order Cancelled</h3>
                  <p>This order has been cancelled. If you believe this is a mistake, please contact customer support.</p>
                </div>
              </div>
            )}

            {/* Stepper Progress Bar */}
            {!isCancelled && (
              <div className="tracker-timeline-card">
                <div className="stepper-progress-line">
                  <div 
                    className="stepper-progress-fill" 
                    style={{ width: `${(currentIdx / 4) * 100}%` }}
                  ></div>
                </div>
                
                <div className="stepper-steps">
                  {statusSteps.map((step, idx) => {
                    const isDone = idx < currentIdx;
                    const isCurrent = idx === currentIdx;
                    let stepClass = 'step-node';
                    if (isDone) stepClass += ' done';
                    if (isCurrent) stepClass += ' current';

                    // Select step icon
                    let stepIcon = 'fa-circle';
                    if (idx === 0) stepIcon = 'fa-clipboard-list';
                    if (idx === 1) stepIcon = 'fa-shirt';
                    if (idx === 2) stepIcon = 'fa-box-open';
                    if (idx === 3) stepIcon = 'fa-truck-fast';
                    if (idx === 4) stepIcon = 'fa-gift';

                    return (
                      <div key={step.key} className={stepClass}>
                        <div className="step-icon-wrapper">
                          <i className={`fas ${stepIcon}`}></i>
                        </div>
                        <div className="step-label-wrapper">
                          <div className="step-label">{step.label}</div>
                          <div className="step-desc">{step.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Grid of details */}
            <div className="track-details-grid">
              
              {/* Order summary info */}
              <div className="details-col-left">
                <div className="summary-card">
                  <h2>Shipping Information</h2>
                  
                  <div className="info-row">
                    <span className="label">Order Ref:</span>
                    <span className="value bold">{order.ref}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Placed Date:</span>
                    <span className="value">{order.date || '—'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Client Name:</span>
                    <span className="value">{order.client || '—'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Phone Number:</span>
                    <span className="value">{maskPhone(order.phone)}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Governorate:</span>
                    <span className="value">{order.governorate || '—'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Address:</span>
                    <span className="value">{order.address || '—'}</span>
                  </div>
                  {order.notes && (
                    <div className="info-row block-notes">
                      <span className="label">Special Instructions:</span>
                      <p className="value notes-p">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order items card */}
              <div className="details-col-right">
                <div className="summary-card">
                  <h2>Order Invoice</h2>
                  
                  <div className="invoice-items-list">
                    {(order.items || []).map((item, idx) => (
                      <div key={idx} className="invoice-item-row">
                        <div className="item-main">
                          <span className="item-name">{item.nameEn || item.name}</span>
                          <span className="item-qty">x{item.qty}</span>
                        </div>
                        <span className="item-price">
                          {((item.price || 0) * (item.qty || 1)).toFixed(2)} EGP
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="invoice-totals">
                    <div className="total-row sub">
                      <span>Subtotal:</span>
                      <span>{(parseFloat(order.total || 0)).toFixed(2)} EGP</span>
                    </div>
                    <div className="total-row sub">
                      <span>Shipping Fee:</span>
                      <span>{(parseFloat(order.deliveryFee || 0)).toFixed(2)} EGP</span>
                    </div>
                    <div className="total-row grand">
                      <span>Total Amount:</span>
                      <span className="grand-val">
                        {(parseFloat(order.grandTotal || order.total || 0)).toFixed(2)} EGP
                      </span>
                    </div>
                    <div className="total-row payment">
                      <span>Payment Method:</span>
                      <span className="pay-method-badge">
                        {order.payment === 'cash' && 'Cash on Delivery'}
                        {order.payment === 'transfer' && 'Bank Transfer'}
                        {order.payment === 'applepay' && 'Apple Pay'}
                        {order.payment === 'instapay' && 'InstaPay'}
                        {!['cash', 'transfer', 'applepay', 'instapay'].includes(order.payment) && (order.payment || '—')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default TrackOrder;
