import { useNavigate } from 'react-router-dom'
import { ArrowLeft, List, LayoutGrid, Search } from 'lucide-react'

export default function Header({
  searchQuery = '',
  onSearchChange,
  onFilterClick,
  viewMode = 'map',
  onViewModeChange,
  onContactClick,
  onFaqClick,
  showBack = false,
  onBack
}) {
  const navigate = useNavigate()

  return (
    <header className="header">
      {showBack && (
        <button className="back-btn" onClick={onBack || (() => navigate(-1))}>
          <ArrowLeft size={20} />
        </button>
      )}
      <div className="logo-text" style={{ cursor: 'pointer' }} onClick={() => navigate('/map')}>
        Explorio
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search activities, tours, attractions..."
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
      <button className="filter-btn" onClick={onFilterClick}>
        Filters
      </button>
      <div className="view-toggle">
        <button
          className={viewMode === 'grid' ? 'active' : ''}
          onClick={() => {
            onViewModeChange?.('grid')
            navigate('/grid')
          }}
          title="List view"
        >
          <List size={18} />
        </button>
        <button
          className={viewMode === 'map' ? 'active' : ''}
          onClick={() => {
            onViewModeChange?.('map')
            navigate('/map')
          }}
          title="Map view"
        >
          <LayoutGrid size={18} />
        </button>
      </div>
      <div className="header-links">
        <a onClick={onContactClick}>Contact Support</a>
        <a onClick={onFaqClick}>FAQ</a>
      </div>
    </header>
  )
}
