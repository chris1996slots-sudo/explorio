import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { providers, activities } from '../data/demoData'
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react'

export default function ProviderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentImage, setCurrentImage] = useState(0)

  const provider = providers.find(p => p.id === id)
  if (!provider) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Provider not found. <button onClick={() => navigate('/grid')}>Go back</button></div>
  }

  const providerActivities = activities.filter(a => a.providerId === id)

  // Use images from provider's activities for the carousel
  const heroImages = providerActivities.length > 0
    ? [...new Set(providerActivities.flatMap(a => a.images || [a.image]).slice(0, 5))]
    : [provider.image]

  return (
    <div className="provider-page">
      <Header
        showBack={true}
        onBack={() => navigate(-1)}
        onFilterClick={() => {}}
        onContactClick={() => {}}
        onFaqClick={() => {}}
      />

      {/* Hero Image Carousel */}
      <div className="provider-hero">
        <img src={heroImages[currentImage]} alt={provider.name} />
        {heroImages.length > 1 && (
          <>
            <button
              className="carousel-btn prev"
              onClick={() => setCurrentImage(i => i === 0 ? heroImages.length - 1 : i - 1)}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="carousel-btn next"
              onClick={() => setCurrentImage(i => i === heroImages.length - 1 ? 0 : i + 1)}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
      <div className="carousel-dots">
        {heroImages.map((_, i) => (
          <div
            key={i}
            className={`dot ${i === currentImage ? 'active' : ''}`}
            onClick={() => setCurrentImage(i)}
          />
        ))}
      </div>

      {/* Thumbnail strip */}
      <div style={{ padding: '0 24px' }}>
        <div className="thumbnail-strip">
          {heroImages.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className={i === currentImage ? 'active' : ''}
              onClick={() => setCurrentImage(i)}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="provider-content">
        <div className="provider-info">
          <h2>{provider.name}</h2>
          <p className="address">
            <MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {provider.address}
          </p>
          <p className="address">{provider.distance}</p>
          <p className="description">{provider.descriptionLong}</p>
          <p className="description">{provider.descriptionLong}</p>

          <div className="opening-hours">
            <h3>Opening Hours</h3>
            {Object.entries(provider.openingHours).map(([day, time]) => (
              <div key={day} className="hours-row">
                <span className="day">{day}:</span>
                <span className={time === 'Closed' ? 'closed' : 'time'}>{time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="provider-activities">
          <h3>AVAILABLE ACTIVITIES</h3>
          <div className="activities-grid">
            {providerActivities.map(activity => (
              <div key={activity.id} className="activity-card">
                <img src={activity.image} alt={activity.name} className="card-image" loading="lazy" />
                <div className="card-body">
                  <div className="card-title">{activity.name}</div>
                  {activity.duration && (
                    <div className="card-meta">
                      <span><Clock size={12} /> {activity.duration}</span>
                    </div>
                  )}
                  <div className="card-footer">
                    <div className="card-price">
                      <strong>{activity.currency}{activity.price.toFixed(2).replace('.', ',')}</strong>
                    </div>
                    <button
                      className="view-details-btn"
                      onClick={() => navigate(`/activity/${activity.id}`)}
                    >
                      View more details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
