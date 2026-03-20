import { useEffect, useState } from 'react'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function CharitySelector() {
  const { user, updateUser } = useAuth()
  const [charities, setCharities] = useState([])
  const [selected, setSelected] = useState(user?.selectedCharity?._id || user?.selectedCharity || '')
  const [pct, setPct] = useState(user?.charityPercentage || 10)
  const [loading, setLoading] = useState(false)

  useEffect(() => { API.get('/charities').then(r => setCharities(r.data.charities)).catch(()=>{}) }, [])

  const save = async () => {
    if (!selected) return toast.error('Select a charity first')
    if (pct<10||pct>100) return toast.error('Percentage must be 10–100')
    setLoading(true)
    try {
      const {data} = await API.put('/auth/update-profile', { selectedCharity:selected, charityPercentage:pct })
      updateUser({ selectedCharity:data.user.selectedCharity, charityPercentage:data.user.charityPercentage })
      toast.success('Saved!')
    } catch(e) { toast.error('Failed to save') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth:640 }}>
      <div className="card">
        <h3 style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:700, marginBottom:4 }}>Your Charity</h3>
        <p style={{ fontSize:13, color:'var(--text-3)', marginBottom:24 }}>Choose which charity receives your monthly contribution.</p>

        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:24 }}>
          {charities.map(c => (
            <div key={c._id} onClick={() => setSelected(c._id)} style={{
              display:'flex', alignItems:'center', gap:12, padding:'14px 16px',
              background: selected===c._id ? 'rgba(0,232,122,0.05)' : 'var(--surface-2)',
              border: `1px solid ${selected===c._id ? 'var(--green-border)' : 'var(--border)'}`,
              borderRadius:'var(--radius-md)', cursor:'pointer', transition:'all 0.15s',
            }}>
              <div style={{
                width:18, height:18, borderRadius:'50%', flexShrink:0,
                border:`2px solid ${selected===c._id ? 'var(--green)' : 'var(--border-2)'}`,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                {selected===c._id && <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--green)' }} />}
              </div>
              <span style={{ fontSize:14, fontWeight:500, color:'var(--text-1)' }}>{c.name}</span>
              {c.isFeatured && <span className="badge badge-green" style={{ marginLeft:'auto', fontSize:10 }}>Featured</span>}
            </div>
          ))}
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <label className="label" style={{ marginBottom:0 }}>Monthly contribution</label>
            <span style={{ fontFamily:'var(--font-display)', fontSize:24, fontWeight:800, color:'var(--green)' }}>{pct}%</span>
          </div>
          <input type="range" min="10" max="100" step="5" value={pct}
            onChange={e => setPct(parseInt(e.target.value))}
            style={{ width:'100%', accentColor:'var(--green)', height:4 }} />
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
            <span style={{ fontSize:11, color:'var(--text-3)' }}>10% min</span>
            <span style={{ fontSize:11, color:'var(--text-3)' }}>Prize pool share: {100-pct}%</span>
            <span style={{ fontSize:11, color:'var(--text-3)' }}>100%</span>
          </div>
        </div>

        <button onClick={save} disabled={loading} className="btn-primary" style={{ width:'100%' }}>
          {loading ? 'Saving...' : 'Save preferences'}
        </button>
      </div>
    </div>
  )
}