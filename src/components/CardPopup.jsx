import { MapPin, Navigation, X } from 'lucide-react'
import { categories } from '../data/demoData'

export default function CardPopup({ activity, onClose, onViewDetails }) {
  const category = categories.find(c => c.id === activity.category)

  return (
    <div className="card-popup-overlay" onClick={onClose}>
      <div className="card-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><X size={20} /></button>
        <img src={activity.images?.[0] || activity.image} alt={activity.name} className="popup-image" />
        <h3>{activity.name}</h3>
        <div className="popup-meta">
          <span><MapPin size={14} /> {category?.name || activity.category}</span>
          <span><Navigation size={14} /> {activity.distance} Km away</span>
        </div>
        <div className="popup-price">
          <div>
            <span className="price-label">starting from</span>
            <div className="price-value">{activity.currency}{activity.price.toFixed(2).replace('.', ',')}</div>
          </div>
          <button className="view-details-btn" onClick={onViewDetails} style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
            View more details
          </button>
        </div>
      </div>
    </div>
  )
}
