import { useEffect, useState } from 'react'
import API from '../../api/axios'
import toast from 'react-hot-toast'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function WinnerVerification() {
  const [winners, setWinners] = useState([])
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState({})

  useEffect(() => { fetchWinners() }, [])

  const fetchWinners = async () => {
    setLoading(true)
    try { const {data}=await API.get('/winners'); setWinners(data.winners) }
    catch(e){} finally { setLoading(false) }
  }

  const verify = async (id, status) => {
    try { await API.put('/winners/'+id+'/verify', { status, adminNote:notes[id]||'' }); toast.success('Winner '+status); fetchWinners() }
    catch(e) { toast.error('Failed') }
  }

  const markPaid = async id => {
    try { await API.put('/winners/'+id+'/mark-paid'); toast.success('Marked as paid'); fetchWinners() }
    catch(e) { toast.error('Failed') }
  }

  const vBadge = s => s==='approved'?'badge-green':s==='rejected'?'badge-red':'badge-yellow'
  const pBadge = s => s==='paid'?'badge-green':'badge-gray'

  if (loading) return <div style={{ textAlign:'center', padding:48, color:'var(--text-3)' }}>Loading winners...</div>

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <h3 style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:700 }}>Winners</h3>
        <span className="badge badge-gray">{winners.length} total</span>
      </div>

      {winners.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:48 }}>
          <p style={{ fontSize:14, color:'var(--text-3)' }}>No winners yet.</p>
        </div>
      ) : winners.map(w => {
        const userName = w.user ? w.user.name : 'Unknown'
        const userEmail = w.user ? w.user.email : ''
        const drawLabel = w.draw ? MONTHS[w.draw.month-1]+' '+w.draw.year : ''
        const prize = w.prizeAmount ? w.prizeAmount.toFixed(2) : '0.00'
        const proofUrl = w.proofImageUrl || ''
        return (
          <div key={w._id} className="card">
            <div style={{ display:'flex', flexWrap:'wrap', alignItems:'flex-start', justifyContent:'space-between', gap:16, marginBottom:14 }}>
              <div>
                <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, marginBottom:2 }}>{userName}</p>
                <p style={{ fontSize:12, color:'var(--text-3)', marginBottom:6 }}>{userEmail}</p>
                <p style={{ fontSize:13, color:'var(--text-2)', textTransform:'capitalize' }}>
                  {w.matchType} · {drawLabel}
                </p>
              </div>
              <div style={{ textAlign:'right' }}>
                <p style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:800, color:'var(--green)' }}>£{prize}</p>
                <div style={{ display:'flex', gap:6, justifyContent:'flex-end', marginTop:6, flexWrap:'wrap' }}>
                  <span className={'badge '+vBadge(w.verificationStatus)}>{w.verificationStatus}</span>
                  <span className={'badge '+pBadge(w.paymentStatus)}>{w.paymentStatus}</span>
                </div>
              </div>
            </div>

            {proofUrl && (
              <a href={proofUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize:13, color:'var(--green)', textDecoration:'none', display:'inline-block', marginBottom:14 }}>
                View proof screenshot →
              </a>
            )}

            {w.verificationStatus === 'pending' && (
              <div style={{ borderTop:'1px solid var(--border)', paddingTop:14, display:'flex', flexDirection:'column', gap:10 }}>
                <div>
                  <label className="label">Admin note (optional)</label>
                  <input type="text" placeholder="Add a note..." value={notes[w._id]||''}
                    onChange={e=>setNotes(p=>({...p,[w._id]:e.target.value}))} className="input-field" style={{ fontSize:13, padding:'9px 12px' }} />
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={()=>verify(w._id,'approved')} className="btn-primary" style={{ padding:'9px 20px', fontSize:13 }}>Approve</button>
                  <button onClick={()=>verify(w._id,'rejected')} className="btn-danger" style={{ padding:'9px 20px' }}>Reject</button>
                </div>
              </div>
            )}

            {w.verificationStatus==='approved' && w.paymentStatus==='pending' && (
              <div style={{ borderTop:'1px solid var(--border)', paddingTop:14 }}>
                <button onClick={()=>markPaid(w._id)} className="btn-primary" style={{ padding:'9px 20px', fontSize:13 }}>Mark as paid</button>
              </div>
            )}

            {w.adminNote && <p style={{ fontSize:12, color:'var(--text-3)', marginTop:10, fontStyle:'italic' }}>Note: {w.adminNote}</p>}
          </div>
        )
      })}
    </div>
  )
}