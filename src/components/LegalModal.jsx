import { X } from 'lucide-react'

export default function LegalModal({ title = 'Privacy Policy', onClose, content }) {
  const defaultContent = title === 'Terms & conditions' || title === 'Terms & Conditions' ? (
    <>
      <p className="legal-date">Last updated: January 10, 2026</p>
      <h4>1. Acceptance of Terms</h4>
      <p>By accessing and using the Explorio platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement.</p>
      <h4>2. Use of Service</h4>
      <p>The Service allows you to browse, search, and book activities and experiences from various service providers. You agree to use the Service only for lawful purposes.</p>
      <h4>3. Booking and Payment</h4>
      <p>When you make a booking through our Service, you agree to pay the booking fee at the time of reservation. The remaining balance may be due at the service provider's location.</p>
      <h4>4. User Responsibilities</h4>
      <ul>
        <li>Providing accurate and complete information when making bookings</li>
        <li>Arriving on time for your scheduled activities</li>
        <li>Following all safety instructions provided by service providers</li>
        <li>Treating service providers and their property with respect</li>
      </ul>
      <h4>5. Service Provider Relationship</h4>
      <p>Explorio acts as an intermediary platform connecting users with independent service providers. We are not responsible for the quality, safety, or legality of the activities offered.</p>
    </>
  ) : title === 'Privacy Policy' ? (
    <>
      <p className="legal-date">Last updated: January 10, 2026</p>
      <h4>1. Acceptance of Terms</h4>
      <p>By accessing and using the Explorio platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement.</p>
      <h4>2. Use of Service</h4>
      <p>The Service allows you to browse, search, and book activities and experiences from various service providers.</p>
      <h4>3. Booking and Payment</h4>
      <p>When you make a booking through our Service, you agree to pay the booking fee at the time of reservation.</p>
      <h4>4. User Responsibilities</h4>
      <ul>
        <li>Providing accurate and complete information when making bookings</li>
        <li>Arriving on time for your scheduled activities</li>
        <li>Following all safety instructions provided by service providers</li>
        <li>Notifying us of any changes or cancellations</li>
      </ul>
      <h4>5. Service Provider Relationship</h4>
      <p>Explorio acts as an intermediary platform connecting users with independent service providers.</p>
    </>
  ) : (
    <p>{content || 'Content coming soon.'}</p>
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal legal-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        <h3>{title}</h3>
        <div className="legal-content">
          {defaultContent}
        </div>
        <div className="close-link" onClick={onClose} style={{ marginTop: 16 }}>
          <X size={14} /> CLOSE
        </div>
      </div>
    </div>
  )
}
