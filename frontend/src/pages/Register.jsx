import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      toast.success('Account created!')
      navigate('/subscribe')
    } catch(err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ position:'fixed', inset:0, backgroundImage:'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize:'60px 60px', maskImage:'radial-gradient(ellipse 60% 60% at 50% 40%, black 20%, transparent 100%)', pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:400, position:'relative' }} className="animate-fade-up">
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ width:44, height:44, background:'var(--green)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, color:'#000' }}>G</span>
          </div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:800, marginBottom:6 }}>Create account</h1>
          <p style={{ fontSize:14, color:'var(--text-3)' }}>Start your GolfGives journey</p>
        </div>

        <div className="card">
          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <label className="label">Full name</label>
              <input name="name" type="text" placeholder="John Smith" value={form.name} onChange={handle} className="input-field" required />
            </div>
            <div>
              <label className="label">Email address</label>
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} className="input-field" required />
            </div>
            <div>
              <label className="label">Password</label>
              <input name="password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={handle} className="input-field" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width:'100%', marginTop:4, padding:13 }}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <hr className="divider" />
          <p style={{ textAlign:'center', fontSize:13, color:'var(--text-3)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'var(--green)', fontWeight:600, textDecoration:'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}