import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }
  const isActive = (path) => location.pathname === path

  return (
    <header style={{
      position:'sticky', top:0, zIndex:100,
      background:'rgba(8,11,15,0.85)',
      backdropFilter:'blur(20px)',
      borderBottom:'1px solid var(--border)',
    }}>
      <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:64 }}>

        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <div style={{
            width:32, height:32, background:'var(--green)', borderRadius:8,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:16, color:'#000' }}>G</span>
          </div>
          <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:18, color:'var(--text-1)', letterSpacing:'-0.02em' }}>
            GolfGives
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display:'flex', alignItems:'center', gap:4 }} className="desktop-nav">
          {[['/', 'Home'], ['/charities', 'Charities']].map(([path, label]) => (
            <Link key={path} to={path} style={{
              padding:'8px 14px', borderRadius:'var(--radius-sm)',
              fontFamily:'var(--font-body)', fontSize:14, fontWeight:500,
              textDecoration:'none',
              color: isActive(path) ? 'var(--green)' : 'var(--text-2)',
              background: isActive(path) ? 'rgba(0,232,122,0.08)' : 'transparent',
              transition:'all 0.15s',
            }}>
              {label}
            </Link>
          ))}
          {user && (
            <Link to="/dashboard" style={{
              padding:'8px 14px', borderRadius:'var(--radius-sm)',
              fontFamily:'var(--font-body)', fontSize:14, fontWeight:500,
              textDecoration:'none',
              color: isActive('/dashboard') ? 'var(--green)' : 'var(--text-2)',
              background: isActive('/dashboard') ? 'rgba(0,232,122,0.08)' : 'transparent',
              transition:'all 0.15s',
            }}>
              Dashboard
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" style={{
              padding:'8px 14px', borderRadius:'var(--radius-sm)',
              fontFamily:'var(--font-body)', fontSize:14, fontWeight:500,
              textDecoration:'none',
              color: isActive('/admin') ? 'var(--green)' : 'var(--text-2)',
              background: isActive('/admin') ? 'rgba(0,232,122,0.08)' : 'transparent',
              transition:'all 0.15s',
            }}>
              Admin
            </Link>
          )}
        </nav>

        {/* Desktop Auth */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {user ? (
            <>
              <div style={{
                display:'flex', alignItems:'center', gap:10,
                background:'var(--surface-2)', border:'1px solid var(--border)',
                borderRadius:'var(--radius-sm)', padding:'6px 12px',
              }}>
                <div style={{
                  width:26, height:26, borderRadius:'50%',
                  background:'var(--green)', display:'flex', alignItems:'center',
                  justifyContent:'center', fontSize:11, fontWeight:700, color:'#000',
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize:13, fontWeight:500, color:'var(--text-1)' }}>
                  {user.name?.split(' ')[0]}
                </span>
                {user.subscriptionStatus === 'active' && (
                  <span className="badge badge-green" style={{ fontSize:10 }}>PRO</span>
                )}
              </div>
              {user.subscriptionStatus !== 'active' && (
                <Link to="/subscribe" className="btn-primary" style={{ padding:'9px 18px', fontSize:13 }}>
                  Upgrade
                </Link>
              )}
              <button onClick={handleLogout} className="btn-ghost" style={{ fontSize:13 }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Sign in</Link>
              <Link to="/subscribe" className="btn-primary" style={{ padding:'9px 20px' }}>
                Get started
              </Link>
            </>
          )}
        </div>

      </div>

      <style>{`
        @media(max-width:768px){
          .desktop-nav { display:none !important; }
        }
      `}</style>
    </header>
  )
}