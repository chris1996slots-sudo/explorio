import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { activities, providers, bundles, timeSlots } from '../data/demoData'
import { ChevronLeft, ChevronRight, Clock, Hourglass, Calendar, Users, Info } from 'lucide-react'

export default function ActivityDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentImage, setCurrentImage] = useState(0)
  const [selectedDuration, setSelectedDuration] = useState('')
  const [adults, setAdults] = useState(0)
  const [children, setChildren] = useState(0)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 1)) // Feb 2026
  const [showLightbox, setShowLightbox] = useState(false)

  const activity = activities.find(a => a.id === id)
  if (!activity) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Activity not found. <button onClick={() => navigate('/grid')}>Go back</button></div>
  }

  const provider = providers.find(p => p.id === activity.providerId)
  const images = activity.images || [activity.image]

  // Determine if this is participant-based (has no durations or specific flag)
  const isParticipantBased = !activity.durations || activity.durations.length === 0

  const totalParticipants = adults + children
  const participantSummary = totalParticipants > 0
    ? `${adults} Adult${adults !== 1 ? 's' : ''}${children > 0 ? `, ${children} Child` : ''}`
    : ''

  const canReserve = isParticipantBased
    ? (totalParticipants > 0 && selectedDate && selectedTime)
    : (selectedDuration && selectedDate && selectedTime)

  // Calendar helpers
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay()
  const monthName = calendarMonth.toLocaleDateString('en-US', { month: 'long' })
  const year = calendarMonth.getFullYear()

  const handleReserve = () => {
    navigate(`/booking/${activity.id}`, {
      state: {
        activity,
        provider,
        duration: selectedDuration,
        participants: participantSummary,
        adults,
        children,
        date: selectedDate,
        time: selectedTime
      }
    })
  }

  return (
    <div className="activity-detail-page">
      <Header
        showBack={true}
        onBack={() => navigate(-1)}
        onFilterClick={() => {}}
        onContactClick={() => {}}
        onFaqClick={() => {}}
      />

      <div className="activity-detail-content">
        {/* Left Side - Images & Info */}
        <div className="activity-left">
          <div className="provider-hero" style={{ height: 280, borderRadius: 12, overflow: 'hidden' }}>
            <img
              src={images[currentImage]}
              alt={activity.name}
              style={{ cursor: 'pointer' }}
              onClick={() => setShowLightbox(true)}
            />
            {images.length > 1 && (
              <>
                <button className="carousel-btn prev" onClick={() => setCurrentImage(i => i === 0 ? images.length - 1 : i - 1)}>
                  <ChevronLeft size={20} />
                </button>
                <button className="carousel-btn next" onClick={() => setCurrentImage(i => i === images.length - 1 ? 0 : i + 1)}>
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          <div className="thumbnail-strip">
            {images.map((img, i) => (
              <img key={i} src={img} alt="" className={i === currentImage ? 'active' : ''} onClick={() => setCurrentImage(i)} />
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <h2 className="activity-title">{activity.name}</h2>
            {activity.duration && (
              <div className="activity-duration">
                <Clock size={14} /> {activity.duration}
              </div>
            )}
            <div className="activity-price">
              <span className="label">Starting from</span>
              <span className="value">{activity.currency}{activity.price.toFixed(2).replace('.', ',')}</span>
            </div>

            {activity.description && (
              <p className="activity-desc">{activity.description}</p>
            )}

            <div className="info-columns">
              {activity.whatsIncluded && (
                <div>
                  <h4>WHAT'S INCLUDED</h4>
                  <ul>
                    {activity.whatsIncluded.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              )}
              {activity.whatToBring && (
                <div>
                  <h4>WHAT TO BRING</h4>
                  <ul>
                    {activity.whatToBring.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Booking Form */}
        <div>
          <div className="booking-form">
            <h3>Book Your Experience</h3>

            {/* Duration or Participants */}
            {!isParticipantBased ? (
              <div className="form-group">
                <label><Hourglass size={14} /> Duration <span className="required">*</span></label>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                >
                  <option value="">Select Duration</option>
                  {activity.durations.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="form-group">
                <label><Users size={14} /> Number of Participants <span className="required">*</span></label>
                <select value={participantSummary} readOnly style={{ cursor: 'default' }}>
                  <option>{participantSummary || 'Select Participants'}</option>
                </select>
                <div className="participant-selector" style={{ marginTop: 8 }}>
                  <div className="participant-row">
                    <div>
                      <div className="label">Adults</div>
                      <div className="sublabel">{activity.currency}{activity.price.toFixed(2)} each</div>
                    </div>
                    <div className="participant-counter">
                      <button onClick={() => setAdults(a => Math.max(0, a - 1))}>−</button>
                      <span className="count">{adults}</span>
                      <button onClick={() => setAdults(a => a + 1)}>+</button>
                    </div>
                  </div>
                  <div className="participant-row">
                    <div>
                      <div className="label">Children (under 16)</div>
                      <div className="sublabel">{activity.currency}{(activity.price * 0.6).toFixed(2)} each</div>
                    </div>
                    <div className="participant-counter">
                      <button onClick={() => setChildren(c => Math.max(0, c - 1))}>−</button>
                      <span className="count">{children}</span>
                      <button onClick={() => setChildren(c => c + 1)}>+</button>
                    </div>
                  </div>
                </div>
                {totalParticipants >= 3 && (
                  <div className="tip-banner">
                    Add one more person and get 10% off per participant!
                  </div>
                )}
                <div className="bundles-info" style={{ marginTop: 12 }}>
                  <h4><Info size={14} /> Available Bundles</h4>
                  {bundles.map((b, i) => (
                    <div key={i} className="bundle-row">
                      <span>{b.label}</span>
                      <span>{activity.currency}{b.pricePerPerson.toFixed(2)} per person</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Date */}
            <div className="form-group">
              <label><Calendar size={14} /> Date <span className="required">*</span></label>
              <div className="calendar">
                <div className="calendar-header">
                  <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}>
                    <ChevronLeft size={16} />
                  </button>
                  <span className="month-year">{year} &nbsp; {monthName}</span>
                  <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}>
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div className="calendar-grid">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="day-header">{d}</div>
                  ))}
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const dateStr = `${day} ${monthName}, ${year}`
                    const isSelected = selectedDate === dateStr
                    const today = new Date()
                    const isToday = day === today.getDate() && calendarMonth.getMonth() === today.getMonth() && calendarMonth.getFullYear() === today.getFullYear()
                    const isPast = new Date(year, calendarMonth.getMonth(), day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
                    return (
                      <div
                        key={day}
                        className={`day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isPast ? 'disabled' : ''}`}
                        onClick={() => !isPast && setSelectedDate(dateStr)}
                      >
                        {day}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Time */}
            <div className="form-group">
              <label><Clock size={14} /> Time <span className="required">*</span></label>
              {!selectedDate ? (
                <p className="time-slot-hint">Select a date in order to choose a time slot</p>
              ) : (
                <div className="time-slots">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              className="reserve-btn"
              disabled={!canReserve}
              onClick={handleReserve}
            >
              Make your reservation
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="lightbox" onClick={() => setShowLightbox(false)}>
          <img src={images[currentImage]} alt={activity.name} onClick={(e) => e.stopPropagation()} />
          <button className="carousel-btn prev" onClick={(e) => { e.stopPropagation(); setCurrentImage(i => i === 0 ? images.length - 1 : i - 1) }}>
            <ChevronLeft size={24} />
          </button>
          <button className="carousel-btn next" onClick={(e) => { e.stopPropagation(); setCurrentImage(i => i === images.length - 1 ? 0 : i + 1) }}>
            <ChevronRight size={24} />
          </button>
          <button className="close-lightbox" onClick={() => setShowLightbox(false)}>X CLOSE</button>
        </div>
      )}
    </div>
  )
}
