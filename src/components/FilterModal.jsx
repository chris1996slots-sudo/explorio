import { useState } from 'react'
import { X, Waves, Landmark, Mountain, UtensilsCrossed, Bike } from 'lucide-react'
import { categories, cities } from '../data/demoData'

const iconMap = {
  'water-sports': Waves,
  'culture': Landmark,
  'hiking': Mountain,
  'food-tours': UtensilsCrossed,
  'cycling': Bike,
}

export default function FilterModal({ onClose, activeFilters, onApply }) {
  const [selectedCategories, setSelectedCategories] = useState(activeFilters?.categories || [])
  const [selectedCities, setSelectedCities] = useState(activeFilters?.cities || [])
  const [priceRange, setPriceRange] = useState(activeFilters?.priceRange || [0, 100])

  const toggleCategory = (catId) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    )
  }

  const toggleCity = (cityId) => {
    setSelectedCities(prev =>
      prev.includes(cityId) ? prev.filter(c => c !== cityId) : [...prev, cityId]
    )
  }

  const handleApply = () => {
    onApply?.({ categories: selectedCategories, cities: selectedCities, priceRange })
    onClose()
  }

  const handleReset = () => {
    setSelectedCategories([])
    setSelectedCities([])
    setPriceRange([0, 100])
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        <h3>Filters</h3>

        <div className="filter-section">
          <h4>CATEGORY</h4>
          <div className="filter-chips">
            {categories.map(cat => {
              const Icon = iconMap[cat.id]
              return (
                <button
                  key={cat.id}
                  className={`filter-chip ${selectedCategories.includes(cat.id) ? 'active' : ''}`}
                  onClick={() => toggleCategory(cat.id)}
                >
                  {Icon && <Icon size={14} />} {cat.name}
                </button>
              )
            })}
          </div>
        </div>

        <div className="filter-section">
          <h4>CITY</h4>
          <div className="filter-chips">
            {cities.map(city => (
              <button
                key={city.id}
                className={`filter-chip ${selectedCities.includes(city.id) ? 'active' : ''}`}
                onClick={() => toggleCity(city.id)}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h4>PRICE RANGE</h4>
          <div className="price-range">
            <div className="range-labels">
              <span>Min: €{priceRange[0].toFixed(2).replace('.', ',')}</span>
              <span>Max: €{priceRange[1].toFixed(2).replace('.', ',')}</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            />
          </div>
        </div>

        <div className="filter-actions">
          <button className="reset-btn" onClick={handleReset}>Reset</button>
          <button className="apply-btn" onClick={handleApply}>Apply Filters</button>
        </div>
      </div>
    </div>
  )
}
