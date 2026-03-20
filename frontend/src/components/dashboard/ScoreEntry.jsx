import { useState } from 'react'
import API from '../../api/axios'
import toast from 'react-hot-toast'

export default function ScoreEntry({ onScoreAdded }) {
  const [form, setForm] = useState({ value:'', date: new Date().toISOString().split('T')[0] })
  const [loading, setLoading] = useState(false)

  const submit = async e => {
    e.preventDefault()
    const val = parseInt(form.value)
    if (isNaN(val)||val<1||val>45) return toast.error('Score must be between 1 and 45')
    setLoading(true)
    try {
      await API.post('/scores', { value:val, date:form.date })
      toast.success('Score added')
      setForm({ value:'', date:new Date().toISOString().split('T')[0] })
      onScoreAdded()
    } catch(err) { toast.error(err.response?.data?.message||'Failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="card">
      <div style={{ marginBottom:20 }}>
        <h3 style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:700, marginBottom:4 }}>Add Score</h3>
        <p style={{ fontSize:13, color:'var(--text-3)' }}>Stableford format · Range 1–45</p>
      </div>
      <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div>
          <label className="label">Score (1–45)</label>
          <input type="number" min="1" max="45" placeholder="e.g. 36" value={form.value}
            onChange={e => setForm({...form, value:e.target.value})} className="input-field" required />
        </div>
        <div>
          <label className="label">Date played</label>
          <input type="date" value={form.date} onChange={e => setForm({...form, date:e.target.value})} className="input-field" required />
        </div>
        <button type="submit" disabled={loading} className="btn-primary" style={{ width:'100%' }}>
          {loading ? 'Adding...' : 'Add score'}
        </button>
      </form>
      <div style={{ marginTop:16, padding:'12px 14px', background:'var(--surface-2)', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)' }}>
        <p style={{ fontSize:12, color:'var(--text-3)', lineHeight:1.6 }}>
          💡 Only your last 5 scores are kept. Adding a new score removes the oldest automatically.
        </p>
      </div>
    </div>
  )
}