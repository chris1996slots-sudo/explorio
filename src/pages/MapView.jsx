import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import FilterModal from '../components/FilterModal'
import FAQModal from '../components/FAQModal'
import LegalModal from '../components/LegalModal'
import CardPopup from '../components/CardPopup'
import { activities, mapMarkers } from '../data/demoData'
import { Waves, Landmark, Mountain, UtensilsCrossed, Bike } from 'lucide-react'

const categoryIcons = {
  'water-sports': Waves,
  'culture': Landmark,
  'hiking': Mountain,
  'food-tours': UtensilsCrossed,
  'cycling': Bike,
}

const markerColors = {
  'water-sports': '#E8A94E',
  'culture': '#8B6F47',
  'hiking': '#6BBF8A',
  'food-tours': '#7CC8D0',
  'cycling': '#D4903A',
}

export default function MapView() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showFAQ, setShowFAQ] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [viewMode, setViewMode] = useState('map')

  // Position markers in a cluster pattern
  const markerPositions = [
    { top: '30%', left: '55%', category: 'water-sports' },
    { top: '35%', left: '50%', category: 'culture' },
    { top: '33%', left: '53%', category: 'hiking' },
    { top: '50%', left: '54%', category: 'food-tours' },
  ]

  const handleMarkerClick = (category) => {
    const activity = activities.find(a => a.category === category)
    if (activity) setSelectedActivity(activity)
  }

  return (
    <div>
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={() => setShowFilters(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onContactClick={() => setShowContact(true)}
        onFaqClick={() => setShowFAQ(true)}
      />

      <div className="map-container">
        <div className="map-placeholder">
          {/* Simulated road labels */}
          <div style={{ position: 'absolute', top: '25%', left: '40%', transform: 'rotate(-30deg)', color: '#999', fontSize: '0.75rem', letterSpacing: '2px' }}>
            Agion Saranta
          </div>
          <div style={{ position: 'absolute', top: '60%', left: '20%', color: '#999', fontSize: '0.75rem', letterSpacing: '2px' }}>
            Spyrou Kyprianou
          </div>
          <div style={{ position: 'absolute', top: '70%', left: '30%', color: '#999', fontSize: '0.7rem' }}>
            Foti Pitta
          </div>
          <div style={{ position: 'absolute', top: '55%', left: '35%', color: '#999', fontSize: '0.7rem' }}>
            Fanou
          </div>

          {/* Map markers */}
          {markerPositions.map((pos, idx) => {
            const Icon = categoryIcons[pos.category] || Waves
            const color = markerColors[pos.category] || '#6BBF8A'
            return (
              <div
                key={idx}
                className="map-marker"
                style={{ top: pos.top, left: pos.left }}
                onClick={() => handleMarkerClick(pos.category)}
              >
                <div className="marker-pin" style={{ background: color }}>
                  <div className="marker-icon">
                    <Icon size={16} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Card Popup */}
      {selectedActivity && (
        <CardPopup
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
          onViewDetails={() => {
            navigate(`/activity/${selectedActivity.id}`)
            setSelectedActivity(null)
          }}
        />
      )}

      {/* Modals */}
      {showFilters && <FilterModal onClose={() => setShowFilters(false)} />}
      {showFAQ && <FAQModal onClose={() => setShowFAQ(false)} />}
      {showContact && (
        <LegalModal
          title="Contact Support"
          onClose={() => setShowContact(false)}
          content="For support, please email support@explorio.com or call +357 12 345 678."
        />
      )}
    </div>
  )
}
