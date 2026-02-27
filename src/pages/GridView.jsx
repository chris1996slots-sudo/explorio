import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import FilterModal from '../components/FilterModal'
import FAQModal from '../components/FAQModal'
import LegalModal from '../components/LegalModal'
import CardPopup from '../components/CardPopup'
import { activities, categories } from '../data/demoData'
import { MapPin, Navigation } from 'lucide-react'

export default function GridView() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('price-asc')
  const [showFilters, setShowFilters] = useState(false)
  const [showFAQ, setShowFAQ] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [activeFilters, setActiveFilters] = useState({ categories: [], cities: [], priceRange: [0, 200] })

  const filteredActivities = useMemo(() => {
    let result = [...activities]

    // Search filter
    if (searchQuery) {
      result = result.filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (activeFilters.categories.length > 0) {
      result = result.filter(a => activeFilters.categories.includes(a.category))
    }

    // City filter
    if (activeFilters.cities.length > 0) {
      result = result.filter(a => activeFilters.cities.includes(a.city))
    }

    // Price filter
    result = result.filter(a => a.price >= activeFilters.priceRange[0] && a.price <= activeFilters.priceRange[1])

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'distance') {
      result.sort((a, b) => a.distance - b.distance)
    }

    return result
  }, [searchQuery, sortBy, activeFilters])

  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId)
    return cat ? cat.name : catId
  }

  return (
    <div>
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={() => setShowFilters(true)}
        viewMode="grid"
        onViewModeChange={(mode) => { if (mode === 'map') navigate('/map') }}
        onContactClick={() => setShowContact(true)}
        onFaqClick={() => setShowFAQ(true)}
      />

      <div className="grid-page">
        {searchQuery && (
          <h2 className="results-title">All Results for "{searchQuery}"</h2>
        )}

        <div className="sort-bar">
          <span>Sort By</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="distance">Distance (Closest)</option>
          </select>
        </div>

        <div className="activity-grid">
          {filteredActivities.map(activity => (
            <div key={activity.id} className="activity-card" onClick={() => setSelectedActivity(activity)}>
              <img src={activity.image} alt={activity.name} className="card-image" loading="lazy" />
              <div className="card-body">
                <div className="card-title">{activity.name}</div>
                <div className="card-meta">
                  <span><MapPin size={12} /> {getCategoryName(activity.category)}</span>
                  <span><Navigation size={12} /> {activity.distance} Km away</span>
                </div>
                <div className="card-footer">
                  <div className="card-price">
                    <span>starting from</span>
                    <strong>{activity.currency}{activity.price.toFixed(2).replace('.', ',')}</strong>
                  </div>
                  <button
                    className="view-details-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedActivity(activity)
                    }}
                  >
                    View more details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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

      {showFilters && (
        <FilterModal
          onClose={() => setShowFilters(false)}
          activeFilters={activeFilters}
          onApply={(filters) => {
            setActiveFilters(filters)
            setShowFilters(false)
          }}
        />
      )}
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
