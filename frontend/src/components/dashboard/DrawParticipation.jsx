import { useEffect, useState } from 'react'
import API from '../../api/axios'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function DrawParticipation() {
  const [current, setCurrent] = useState(null)
  const [past, setPast] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([API.get('/draws/current'), API.get('/draws')])
      .then(([c,p]) => { setCurrent(c.data.draw); setPast(p.data.draws?.slice(0,5)||[]) })
      .catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  if (loading) return <div style={{ textAlign:'center', padding:48, color:'var(--text-3)', fontSize:14 }}>Loading draw info...</div>

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20, maxWidth:720 }}>

      {/* Current draw */}
      <div className="card-highlight">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:700, marginBottom:4 }}>Current Month Draw</h3>
            <p style={{ fontSize:13, color:'var(--text-3)' }}>{current ? MONTHS[current.month-1]+' '+current.year : 'No draw configured yet'}</p>
          </div>
          {current && <span className={`badge ${current.status==='published'?'badge-green':current.status==='simulated'?'badge-blue':'badge-yellow'}`}>{current.status}</span>}
        </div>

        {current ? (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:current.drawnNumbers?.length?20:0 }}>
              {[
                { label:'Prize Pool', value:'£'+(current.totalPrizePool?.toFixed(2)||'0.00'), green:true },
                { label:'Jackpot (5-match)', value:'£'+(current.pool5Match?.toFixed(2)||'0.00') },
                { label:'Participants', value:current.participantCount||0 },
              ].map(s => (
                <div key={s.label} style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'14px 16px' }}>
                  <p style={{ fontSize:11, color:'var(--text-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6 }}>{s.label}</p>
                  <p style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:800, color:s.green?'var(--green)':'var(--text-1)' }}>{s.value}</p>
                </div>
              ))}
            </div>

            {current.drawnNumbers?.length > 0 && (
              <div>
                <p style={{ fontSize:12, color:'var(--text-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:12 }}>Drawn numbers</p>
                <div style={{ display:'flex', gap:10 }}>
                  {current.drawnNumbers.map((n,i) => <div key={i} className="draw-ball">{n}</div>)}
                </div>
              </div>
            )}

            {current.jackpotRollover > 0 && (
              <div style={{ marginTop:16, background:'rgba(255,184,0,0.06)', border:'1px solid rgba(255,184,0,0.2)', borderRadius:'var(--radius-sm)', padding:'10px 14px', display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:14 }}>🔄</span>
                <p style={{ fontSize:13, color:'#FFB800' }}>Jackpot rollover included: <strong>£{current.jackpotRollover?.toFixed(2)}</strong></p>
              </div>
            )}
          </>
        ) : (
          <p style={{ fontSize:13, color:'var(--text-3)' }}>The admin will configure this month's draw soon.</p>
        )}
      </div>

      {/* Past draws */}
      {past.length > 0 && (
        <div className="card">
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:700, marginBottom:16 }}>Recent Draws</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {past.map(d => (
              <div key={d._id} style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
                <div>
                  <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14 }}>{MONTHS[d.month-1]} {d.year}</p>
                  <p style={{ fontSize:12, color:'var(--text-3)' }}>£{d.totalPrizePool?.toFixed(2)} pool · {d.participantCount} players</p>
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  {d.drawnNumbers?.map((n,i) => <div key={i} className="draw-ball-sm">{n}</div>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}