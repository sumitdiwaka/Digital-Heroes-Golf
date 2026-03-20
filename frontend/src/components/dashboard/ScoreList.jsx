import { useEffect, useState } from 'react'
import API from '../../api/axios'
import toast from 'react-hot-toast'

export default function ScoreList({ refresh }) {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({ value:'', date:'' })

  useEffect(() => { fetchScores() }, [refresh])

  const fetchScores = async () => {
    setLoading(true)
    try { const {data} = await API.get('/scores'); setScores(data.scores) }
    catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  const startEdit = s => { setEditing(s._id); setEditForm({ value:s.value, date:new Date(s.date).toISOString().split('T')[0] }) }

  const saveEdit = async id => {
    const val = parseInt(editForm.value)
    if(isNaN(val)||val<1||val>45) return toast.error('Score must be 1–45')
    try {
      const {data} = await API.put('/scores/'+id, { value:val, date:editForm.date })
      setScores(data.scores); setEditing(null); toast.success('Updated')
    } catch(e) { toast.error('Update failed') }
  }

  const del = async id => {
    if(!window.confirm('Delete this score?')) return
    try { const {data} = await API.delete('/scores/'+id); setScores(data.scores); toast.success('Deleted') }
    catch(e) { toast.error('Failed') }
  }

  return (
    <div className="card">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:700, marginBottom:4 }}>My Scores</h3>
          <p style={{ fontSize:13, color:'var(--text-3)' }}>Most recent first</p>
        </div>
        <span className="badge badge-gray">{scores.length} / 5</span>
      </div>

      {loading ? (
        <p style={{ fontSize:13, color:'var(--text-3)', textAlign:'center', padding:'32px 0' }}>Loading...</p>
      ) : scores.length === 0 ? (
        <div style={{ textAlign:'center', padding:'32px 0' }}>
          <p style={{ fontSize:13, color:'var(--text-3)' }}>No scores yet. Add your first score!</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {scores.map((s, i) => (
            <div key={s._id} style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'14px 16px' }}>
              {editing === s._id ? (
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  <div style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:10 }}>
                    <input type="number" min="1" max="45" value={editForm.value}
                      onChange={e => setEditForm({...editForm, value:e.target.value})} className="input-field" style={{ padding:'8px 10px', fontSize:13 }} />
                    <input type="date" value={editForm.date}
                      onChange={e => setEditForm({...editForm, date:e.target.value})} className="input-field" style={{ padding:'8px 10px', fontSize:13 }} />
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => saveEdit(s._id)} className="btn-primary" style={{ padding:'7px 16px', fontSize:12 }}>Save</button>
                    <button onClick={() => setEditing(null)} className="btn-ghost" style={{ fontSize:12 }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div className="score-ball">{s.value}</div>
                    <div>
                      <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15 }}>Score: {s.value}</p>
                      <p style={{ fontSize:12, color:'var(--text-3)' }}>{new Date(s.date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</p>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    {i === 0 && <span className="badge badge-green" style={{ fontSize:10 }}>Latest</span>}
                    <button onClick={() => startEdit(s)} className="btn-ghost" style={{ fontSize:12, padding:'5px 10px' }}>Edit</button>
                    <button onClick={() => del(s._id)} style={{ fontSize:12, padding:'5px 10px', background:'transparent', border:'none', color:'var(--text-3)', cursor:'pointer', borderRadius:'var(--radius-sm)', transition:'color 0.15s' }}
                      onMouseEnter={e => e.target.style.color='#FF4D4D'} onMouseLeave={e => e.target.style.color='var(--text-3)'}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}