import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EyeOff, Eye } from 'lucide-react'

export default function LogoutPage({ onLogout }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const isValid = email.length > 0 && password.length > 0

  const handleLogout = (e) => {
    e.preventDefault()
    if (isValid) {
      onLogout()
      navigate('/')
    }
  }

  return (
    <div className="logout-flow">
      <div className="logout-header">
        <h2>Are you sure you want to logout?</h2>
        <p>Enter your admin credentials below to logout</p>
      </div>
      <div className="logout-content">
        <form onSubmit={handleLogout}>
          <div className="form-group">
            <label style={{ fontWeight: 600, marginBottom: 6, display: 'block' }}>Email</label>
            <input
              type="text"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>
          <div className="form-group" style={{ marginTop: 16 }}>
            <label style={{ fontWeight: 600, marginBottom: 6, display: 'block' }}>Password</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '0.9rem', outline: 'none' }}
              />
              <button
                type="button"
                className="toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={`logout-btn ${isValid ? 'active' : ''}`}
            disabled={!isValid}
            style={{ marginTop: 32 }}
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  )
}
