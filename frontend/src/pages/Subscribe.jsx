import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import toast from 'react-hot-toast'

const PLANS = [
  { id:'monthly', name:'Monthly', price:'£9.99', period:'per month', features:['Monthly draw entry','Min 10% to charity','5-score rolling tracker','Cancel anytime'] },
  { id:'yearly',  name:'Yearly',  price:'£99.99', period:'per year', badge:'Save 17%', features:['Everything in Monthly','2 months free','Priority support','Annual impact report'] },
]

export default function Subscribe() {
  const [selected, setSelected] = useState('monthly')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSubscribe = async () => {
    if (!user) { navigate('/register'); return }
    setLoading(true)
    try {
      const { data } = await API.post('/subscriptions/create-checkout', { plan: selected })
      window.location.href = data.url
    } catch(err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', padding:'80px 24px' }}>
      <div style={{ maxWidth:800, margin:'0 auto' }}>

        <div style={{ textAlign:'center', marginBottom:56 }}>
          <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--green)', marginBottom:12 }}>Pricing</p>
          <h1 className="section-title" style={{ marginBottom:16 }}>Simple, transparent pricing.</h1>
          <p style={{ fontSize:15, color:'var(--text-2)', maxWidth:440, margin:'0 auto' }}>
            One subscription. Monthly draws. Guaranteed charity impact.
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:32 }}>
          {PLANS.map(plan => (
            <div key={plan.id} onClick={() => setSelected(plan.id)} style={{
              background:'var(--surface)', border:`2px solid ${selected === plan.id ? 'var(--green)' : 'var(--border)'}`,
              borderRadius:'var(--radius-lg)', padding:28, cursor:'pointer',
              transition:'all 0.2s', position:'relative',
              boxShadow: selected === plan.id ? 'var(--shadow-green)' : 'none',
            }}>
              {plan.badge && (
                <div style={{ position:'absolute', top:-12, right:20 }}>
                  <span className="badge badge-green">{plan.badge}</span>
                </div>
              )}
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                <div style={{
                  width:20, height:20, borderRadius:'50%',
                  border:`2px solid ${selected === plan.id ? 'var(--green)' : 'var(--border-2)'}`,
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                }}>
                  {selected === plan.id && <div style={{ width:10, height:10, borderRadius:'50%', background:'var(--green)' }} />}
                </div>
                <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18 }}>{plan.name}</span>
              </div>

              <div style={{ marginBottom:20 }}>
                <span style={{ fontFamily:'var(--font-display)', fontSize:38, fontWeight:800 }}>{plan.price}</span>
                <span style={{ fontSize:13, color:'var(--text-3)', marginLeft:6 }}>{plan.period}</span>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:16, height:16, borderRadius:'50%', background:'rgba(0,232,122,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span style={{ color:'var(--green)', fontSize:10, fontWeight:700 }}>✓</span>
                    </div>
                    <span style={{ fontSize:13, color:'var(--text-2)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Charity note */}
        <div style={{ background:'rgba(0,232,122,0.04)', border:'1px solid var(--green-border)', borderRadius:'var(--radius-md)', padding:'16px 20px', display:'flex', alignItems:'flex-start', gap:14, marginBottom:24 }}>
          <span style={{ fontSize:20, flexShrink:0 }}>💚</span>
          <div>
            <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, marginBottom:4 }}>Charity contribution built in</p>
            <p style={{ fontSize:13, color:'var(--text-2)', lineHeight:1.6 }}>A minimum of 10% of your subscription goes to your chosen charity. You can increase this at any time from your dashboard.</p>
          </div>
        </div>

        <button onClick={handleSubscribe} disabled={loading} className="btn-primary" style={{ width:'100%', padding:15, fontSize:15 }}>
          {loading ? 'Redirecting to checkout...' : `Subscribe ${selected === 'monthly' ? '£9.99/mo' : '£99.99/yr'} →`}
        </button>
        <p style={{ textAlign:'center', fontSize:12, color:'var(--text-3)', marginTop:12 }}>Secured by Stripe · Cancel anytime · No hidden fees</p>
      </div>
    </div>
  )
}