import { useEffect, useState } from 'react'
import API from '../../api/axios'
import toast from 'react-hot-toast'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function WinningsOverview() {
  const [winners, setWinners] = useState([])
  const [loading, setLoading] = useState(true)
  const [proofInputs, setProofInputs] = useState({})

  useEffect(() => { fetch() }, [])

  const fetch = async () => {
    setLoading(true)
    try { const r = await API.get('/winners/my-winnings'); setWinners(r.data.winners) }
    catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  const submitProof = async id => {
    const url = proofInputs[id] || ''
    if (!url.trim()) return toast.error('Enter a proof URL')
    try {
      await API.post('/winners/'+id+'/upload-proof', { proofImageUrl: url })
      toast.success('Proof submitted!')
      setProofInputs(p => { const n={...p}; delete n[id]; return n })
      fetch()
    } catch(e) { toast.error('Failed') }
  }

  const total = winners.reduce((s,w) => s+(w.prizeAmount||0), 0)

  const vBadge = s => s==='approved'?'badge-green':s==='rejected'?'badge-red':'badge-yellow'
  const pBadge = s => s==='paid'?'badge-green':'badge-gray'

  if (loading) return <div style={{ textAlign:'center', padding:48, color:'var(--text-3)', fontSize:14 }}>Loading winnings...</div>

  return (
    <div style={{ maxWidth:640 }}>
      <div className="card-highlight" style={{ marginBottom:20, display:'flex', alignItems:'center', gap:20 }}>
        <div style={{ width:52, height:52, background:'rgba(0,232,122,0.1)', border:'1px solid var(--green-border)', borderRadius:'var(--radius-md)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>🏆</div>
        <div>
          <p style={{ fontSize:12, color:'var(--text-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>Total winnings</p>
          <p style={{ fontFamily:'var(--font-display)', fontSize:36, fontWeight:800, color:'var(--green)', lineHeight:1 }}>£{total.toFixed(2)}</p>
        </div>
      </div>

      {winners.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:48 }}>
          <p style={{ fontSize:14, color:'var(--text-3)' }}>No winnings yet — keep playing!</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {winners.map(w => {
            const drawLabel = w.draw ? MONTHS[w.draw.month-1]+' '+w.draw.year : ''
            const prize = w.prizeAmount ? w.prizeAmount.toFixed(2) : '0.00'
            const proofUrl = w.proofImageUrl || ''
            return (
              <div key={w._id} className="card">
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
                  <div>
                    <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, textTransform:'capitalize', marginBottom:4 }}>{w.matchType}</p>
                    <p style={{ fontSize:12, color:'var(--text-3)' }}>{drawLabel}</p>
                  </div>
                  <p style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:800, color:'var(--green)' }}>£{prize}</p>
                </div>

                <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:proofUrl||w.verificationStatus==='pending'?14:0 }}>
                  <span className={'badge '+vBadge(w.verificationStatus)}>Verification: {w.verificationStatus}</span>
                  <span className={'badge '+pBadge(w.paymentStatus)}>Payment: {w.paymentStatus}</span>
                </div>

                {w.verificationStatus==='pending' && !proofUrl && (
                  <div style={{ borderTop:'1px solid var(--border)', paddingTop:14 }}>
                    <label className="label">Submit proof (screenshot URL)</label>
                    <div style={{ display:'flex', gap:8 }}>
                      <input type="url" placeholder="https://..." value={proofInputs[w._id]||''} onChange={e => setProofInputs(p=>({...p,[w._id]:e.target.value}))} className="input-field" style={{ fontSize:13, padding:'9px 12px' }} />
                      <button onClick={() => submitProof(w._id)} className="btn-primary" style={{ padding:'9px 16px', fontSize:13, whiteSpace:'nowrap' }}>Submit</button>
                    </div>
                  </div>
                )}
                {proofUrl && (
                  <a href={proofUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:'var(--green)', textDecoration:'none', display:'block' }}>
                    View submitted proof →
                  </a>
                )}
                {w.adminNote && <p style={{ fontSize:12, color:'var(--text-3)', marginTop:8, fontStyle:'italic' }}>Note: {w.adminNote}</p>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}