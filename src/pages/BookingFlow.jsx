import { useState, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { activities, providers, addOns } from '../data/demoData'
import { X, Mail, Phone, Check, Printer, Send, ChevronLeft, Users, Calendar, Clock, MapPin } from 'lucide-react'

export default function BookingFlow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const bookingState = location.state || {}

  const activity = bookingState.activity || activities.find(a => a.id === id)
  const provider = bookingState.provider || providers.find(p => p.id === activity?.providerId)

  const [step, setStep] = useState(1)
  const [addonQuantities, setAddonQuantities] = useState({})
  const [guestInfo, setGuestInfo] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', ''])
  const [phoneOtp, setPhoneOtp] = useState(['', '', '', '', '', ''])
  const [emailVerified, setEmailVerified] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)

  const emailRefs = useRef([])
  const phoneRefs = useRef([])

  if (!activity) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Activity not found.</div>
  }

  // Calculate totals
  const basePrice = activity.price * Math.max(1, (bookingState.adults || 0) + (bookingState.children || 0) * 0.6)
  const addonsTotal = Object.entries(addonQuantities).reduce((sum, [addonId, qty]) => {
    const addon = addOns.find(a => a.id === addonId)
    return sum + (addon ? addon.price * qty : 0)
  }, 0)
  const totalPrice = basePrice + addonsTotal
  const bookingFee = totalPrice * 0.1
  const payAtProvider = totalPrice - bookingFee

  const handleAddonChange = (addonId, delta) => {
    setAddonQuantities(prev => ({
      ...prev,
      [addonId]: Math.max(0, (prev[addonId] || 0) + delta)
    }))
  }

  const handleOtpChange = (otpState, setOtp, refs, index, value) => {
    if (value.length > 1) value = value.slice(-1)
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otpState]
    newOtp[index] = value
    setOtp(newOtp)
    setOtpError('')
    if (value && index < 5) {
      refs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (refs, index, e) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      refs.current[index - 1]?.focus()
    }
  }

  const handleVerifyEmail = () => {
    const code = emailOtp.join('')
    if (code.length === 6) {
      // Demo: accept any 6-digit code
      setEmailVerified(true)
      if (guestInfo.phone) {
        setStep(4) // Go to phone verification
      } else {
        setStep(5) // Skip to payment
      }
    } else {
      setOtpError('Please enter all 6 digits')
    }
  }

  const handleVerifyPhone = () => {
    const code = phoneOtp.join('')
    if (code.length === 6) {
      setPhoneVerified(true)
      setStep(5)
    } else {
      setOtpError('Wrong OTP Code, please try again')
    }
  }

  const handlePayment = () => {
    if (termsAccepted) {
      setStep(6)
    }
  }

  const bookingId = 'BK' + Date.now().toString().slice(-10)

  const renderStep = () => {
    switch (step) {
      case 1: // Add-ons
        return (
          <div>
            <h3 style={{ marginBottom: 4 }}>Optional Add-ons</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div className="addons-list">
                {addOns.map(addon => (
                  <div key={addon.id} className="addon-item">
                    <img src={addon.image} alt={addon.name} />
                    <div className="addon-info">
                      <div className="addon-name">{addon.name}</div>
                      <div className="addon-desc">{addon.description}</div>
                      <div className="addon-price">{activity.currency}{addon.price.toFixed(2)} each</div>
                    </div>
                    <div className="addon-counter">
                      <button onClick={() => handleAddonChange(addon.id, -1)}>&#8722;</button>
                      <span className="count">{addonQuantities[addon.id] || 0}</span>
                      <button onClick={() => handleAddonChange(addon.id, 1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div className="payment-summary">
                  <h3>Payment Details</h3>
                  <div className="summary-row total">
                    <span className="label">Total Price</span>
                    <span>{activity.currency}{totalPrice.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Pay at Provider</span>
                    <span>{activity.currency}{payAtProvider.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Booking Fee (Pay Now)</span>
                    <span>{activity.currency}{bookingFee.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="continue-btn" onClick={() => setStep(2)}>Continue</button>
            <div className="close-link" onClick={() => navigate(-1)}>
              <X size={14} /> CLOSE
            </div>
          </div>
        )

      case 2: // Guest Information
        return (
          <div className="guest-form">
            <h3 style={{ marginBottom: 20 }}>Guest Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>First Name <span className="required">*</span></label>
                <input
                  value={guestInfo.firstName}
                  onChange={(e) => setGuestInfo({ ...guestInfo, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div className="form-group">
                <label>Last Name <span className="required">*</span></label>
                <input
                  value={guestInfo.lastName}
                  onChange={(e) => setGuestInfo({ ...guestInfo, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address <span className="required">*</span></label>
              <input
                type="email"
                value={guestInfo.email}
                onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                placeholder="john.doe@example.com"
              />
            </div>
            <div className="form-group">
              <label>Phone Number <span className="optional">(optional)</span></label>
              <input
                type="tel"
                value={guestInfo.phone}
                onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                placeholder="+ 357 1234567"
              />
              <div className="hint">Verification via SMS will be required if provided</div>
            </div>
            <button
              className="continue-btn"
              onClick={() => setStep(3)}
              disabled={!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email}
              style={{ opacity: (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email) ? 0.5 : 1 }}
            >
              Continue
            </button>
            <div className="back-link" onClick={() => setStep(1)}>
              <ChevronLeft size={16} /> BACK
            </div>
          </div>
        )

      case 3: // Email Verification
        return (
          <div className="verification-page">
            <div className="icon-circle">
              <Mail size={28} />
            </div>
            <h2>Verify Your E-mail Address</h2>
            <p className="sent-to">
              We&apos;ve sent a 6-digit code to <strong>{guestInfo.email}</strong>
            </p>
            <span className="change-link" onClick={() => setStep(2)}>Change E-mail Address</span>
            <div className="otp-inputs">
              {emailOtp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => emailRefs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(emailOtp, setEmailOtp, emailRefs, i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(emailRefs, i, e)}
                  className={emailVerified ? 'success' : ''}
                />
              ))}
            </div>
            {otpError && <p className="otp-error">{otpError}</p>}
            <button
              className="verify-btn"
              onClick={handleVerifyEmail}
              disabled={emailOtp.some(d => d === '')}
            >
              Verify E-mail Address
            </button>
            <p className="resend-link">Resend Code (00:60)</p>
            <div className="back-link" onClick={() => setStep(2)}>
              <ChevronLeft size={16} /> BACK
            </div>
          </div>
        )

      case 4: // Phone Verification
        return (
          <div className="verification-page">
            <div className="icon-circle">
              <Phone size={28} />
            </div>
            <h2>Verify Your Phone</h2>
            <p className="sent-to">
              We&apos;ve sent a 6-digit code to <strong>{guestInfo.phone}</strong>
            </p>
            <span className="change-link" onClick={() => setStep(2)}>Change Phone Number</span>
            <div className="otp-inputs">
              {phoneOtp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => phoneRefs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(phoneOtp, setPhoneOtp, phoneRefs, i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(phoneRefs, i, e)}
                  className={otpError ? 'error' : phoneVerified ? 'success' : ''}
                />
              ))}
            </div>
            {otpError && <p className="otp-error">{otpError}</p>}
            <button
              className="verify-btn"
              onClick={handleVerifyPhone}
              disabled={phoneOtp.some(d => d === '')}
            >
              Verify Phone Number
            </button>
            <p className="resend-link">Resend Code (00:60)</p>
            <div className="back-link" onClick={() => setStep(3)}>
              <ChevronLeft size={16} /> BACK
            </div>
          </div>
        )

      case 5: // Payment
        return (
          <div className="payment-page">
            <div className="payment-box">
              <h3>Payment Details</h3>
              <div className="summary-row total" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 600, marginBottom: 12 }}>
                <span style={{ color: '#888' }}>Total Price</span>
                <span>{activity.currency}{totalPrice.toFixed(2).replace('.', ',')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#fffde8', margin: '0 -20px', padding: '8px 20px' }}>
                <span>Pay at Provider</span>
                <span>{activity.currency}{payAtProvider.toFixed(2).replace('.', ',')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span>Booking Fee (Pay Now)</span>
                <span>{activity.currency}{bookingFee.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <div className="note-box">
              <div className="note-label">Note:</div>
              <p>You will pay {activity.currency}{bookingFee.toFixed(2).replace('.', ',')} now to secure your booking.<br />
                The remaining {activity.currency}{payAtProvider.toFixed(2).replace('.', ',')} will be paid directly to the service provider.</p>
            </div>

            <div className="card-device">
              Card payment device activated
              <strong>Pay now: {activity.currency}{bookingFee.toFixed(2).replace('.', ',')}</strong>
            </div>

            <div className="terms-checkbox">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <span>
                I have read and agree to all <a href="#">terms and conditions</a>, <a href="#">privacy policy</a>, <a href="#">pricing policy</a> and <a href="#">cancellation/refund policy</a>
              </span>
            </div>

            <button
              className="continue-btn"
              onClick={handlePayment}
              disabled={!termsAccepted}
              style={{ opacity: !termsAccepted ? 0.5 : 1 }}
            >
              Continue
            </button>
            <div className="back-link" onClick={() => setStep(guestInfo.phone ? 4 : 3)}>
              <ChevronLeft size={16} /> BACK
            </div>
          </div>
        )

      case 6: // Confirmation
        return (
          <div className="confirmation-page">
            <div className="confirmation-header">
              <div className="check-icon"><Check size={24} /></div>
              <div>
                <h2>Booking Confirmed!</h2>
                <div className="booking-id">Booking ID<br />{bookingId}</div>
              </div>
            </div>

            <div className="confirmation-grid">
              <div className="confirmation-left">
                <div className="booking-activity">{activity.name}</div>
                <div className="provider-name">{provider?.name || 'Service Provider'}</div>

                <div className="booking-details-grid">
                  <div className="detail-item">
                    <div className="detail-label"><Users size={12} /> Participants</div>
                    <div className="detail-value">{bookingState.participants || '1 person'}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label"><Calendar size={12} /> Date &amp; Time</div>
                    <div className="detail-value">{bookingState.date || 'Feb 3, 2026'} | {bookingState.time || '11:00 AM'}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label"><Clock size={12} /> Duration</div>
                    <div className="detail-value">{bookingState.duration || activity.duration || '1.5 hours'}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label"><MapPin size={12} /> Meeting Point</div>
                    <div className="detail-value">Ayia Napa, 94123</div>
                  </div>
                </div>

                <h4 style={{ marginBottom: 8 }}>Location Map</h4>
                <div className="location-map-placeholder">
                  <MapPin size={20} />
                </div>

                <div className="payment-summary">
                  <h3>Payment Details</h3>
                  <div className="summary-row total">
                    <span className="label">Total Price</span>
                    <span>{activity.currency}{totalPrice.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Pay at Provider</span>
                    <span>{activity.currency}{payAtProvider.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="summary-row">
                    <span>&#10003; Booking Fee (Paid)</span>
                    <span>{activity.currency}{bookingFee.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>

              <div className="confirmation-right">
                <div className="qr-section">
                  <h4>Your Booking QR Code</h4>
                  <div className="qr-placeholder">QR Code</div>
                  <p className="qr-hint">Scan this QR Code to add the booking to your wallet</p>
                </div>
                <button className="action-btn print" onClick={() => window.print()}>
                  <Printer size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} /> Print again
                </button>
                <button className="action-btn email">
                  <Send size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} /> Send Email again
                </button>
                <button className="action-btn close-screen" onClick={() => navigate('/map')}>
                  Close Screen
                </button>
                <p style={{ fontSize: '0.8rem', color: '#888', textAlign: 'center', marginTop: 8 }}>
                  Please make sure you close this screen once you are done
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="booking-flow">
      {step < 6 && (
        <div className="booking-flow-header">
          <h2>Complete your Booking</h2>
          <p>{activity.name}</p>
        </div>
      )}
      <div className="booking-flow-content">
        {renderStep()}
      </div>
    </div>
  )
}
