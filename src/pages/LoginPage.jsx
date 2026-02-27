import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const isValid = email.length > 0 && password.length > 0

  const handleLogin = (e) => {
    e.preventDefault()
    if (isValid) {
      onLogin()
      navigate('/map')
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-branding">
          <div className="logo-text" style={{ fontSize: '3rem', marginBottom: '24px' }}>Explorio</div>
          <div className="subtitle">Login into<br/>your account</div>
          <div className="subtitle-small">Welcome back! Please enter your details.</div>
        </div>
        <form className="login-form-card" onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="text"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={email ? 'filled' : ''}
          />
          <label>Password</label>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={password ? 'filled' : ''}
            />
            <button
              type="button"
              className="toggle-pw"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button
            type="submit"
            className={`login-btn ${isValid ? 'active' : ''}`}
            disabled={!isValid}
          >
            Login
          </button>
        </form>
      </div>
      <div className="login-footer">
        2026 © Explorio . All Rights Reserved
      </div>
    </div>
  )
}
