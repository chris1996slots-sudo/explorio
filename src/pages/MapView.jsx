import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Header from '../components/Header'
import FilterModal from '../components/FilterModal'
import FAQModal from '../components/FAQModal'
import LegalModal from '../components/LegalModal'
import CardPopup from '../components/CardPopup'
import { activities } from '../data/demoData'

const markerColors = {
  'water-sports': '#E8A94E',
  'culture': '#8B6F47',
  'hiking': '#6BBF8A',
  'food-tours': '#7CC8D0',
  'cycling': '#D4903A',
}

const categorySymbols = {
  'water-sports': '🌊',
  'culture': '🏛',
  'hiking': '⛰',
  'food-tours': '🍴',
  'cycling': '🚴',
}

function createMarkerIcon(category) {
  const color = markerColors[category] || '#6BBF8A'
  const symbol = categorySymbols[category] || '📍'
  return L.divIcon({
    className: '',
    html: `<div style="
      width:36px;height:36px;border-radius:50%;
      background:${color};
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      font-size:16px;cursor:pointer;
      border:2px solid white;
    ">${symbol}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  })
}

// Spread activities across the Ayia Napa / Protaras area
const activityLocations = {
  'blue-waves-1': [34.9825, 33.9780],
  'scuba-diving-1': [34.9870, 33.9830],
  'scuba-diving-2': [35.0150, 34.0530],
  'cultural-tour-1': [34.9890, 33.9750],
  'hiking-1': [34.9750, 33.9600],
  'food-tour-1': [34.9840, 33.9820],
  'cycling-1': [35.0120, 34.0480],
  'blue-waves-2': [35.0180, 34.0550],
  'kayak-tour-1': [34.9800, 33.9700],
  'jeep-safari-1': [34.9700, 33.9550],
  'wine-tour-1': [34.9780, 33.9680],
  'bike-tour-2': [34.9730, 33.9620],
  'boat-party-1': [35.0100, 34.0600],
  'church-tour-1': [34.9860, 33.9760],
}

// Center between Ayia Napa and Protaras
const MAP_CENTER = [34.9950, 34.0100]
const MAP_ZOOM = 13

export default function MapView() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showFAQ, setShowFAQ] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [viewMode, setViewMode] = useState('map')

  const filteredActivities = useMemo(() => {
    if (!searchQuery) return activities
    return activities.filter(a =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

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
        <MapContainer
          center={MAP_CENTER}
          zoom={MAP_ZOOM}
          style={{ width: '100%', height: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredActivities.map(activity => {
            const pos = activityLocations[activity.id]
            if (!pos) return null
            return (
              <Marker
                key={activity.id}
                position={pos}
                icon={createMarkerIcon(activity.category)}
                eventHandlers={{
                  click: () => setSelectedActivity(activity),
                }}
              />
            )
          })}
        </MapContainer>
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
