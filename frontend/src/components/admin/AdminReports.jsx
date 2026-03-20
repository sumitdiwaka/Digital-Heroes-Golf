import { useEffect, useState } from 'react'
import API from '../../api/axios'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function AdminReports() {
  const [r, setR] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/admin/reports').then(res=>setR(res.data.reports)).catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  if (loading) return <div style={{ textAlign:'center', padding:48, color:'var(--text-3)' }}>Loading reports...</div>
  if (!r) return null

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        {[
          { label:'Total Users', value:r.totalUsers },
          { label:'Active Subscribers', value:r.activeSubscribers },
          { label:'Total Prize Pool', value:'£'+(r.totalPrizePool?.toFixed(2)||'0.00'), green:true },
          { label:'Charity Contributions', value:'£'+(r.totalCharityContributions?.toFixed(2)||'0.00'), green:true },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <p className="stat-label">{s.label}</p>
            <p className={'stat-value'+(s.green?' green':'')}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div className="card">
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:700, marginBottom:16 }}>Draw History</h3>
          {!r.drawStats?.length ? (
            <p style={{ fontSize:13, color:'var(--text-3)' }}>No draws yet.</p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {r.drawStats.map(d => (
                <div key={d._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 14px', background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)' }}>
                  <div>
                    <p style={{ fontWeight:600, fontSize:14 }}>{MONTHS[d.month-1]} {d.year}</p>
                    <p style={{ fontSize:12, color:'var(--text-3)' }}>{d.participantCount} participants</p>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <p style={{ fontFamily:'var(--font-display)', fontWeight:700, color:'var(--green)', fontSize:15 }}>£{d.totalPrizePool?.toFixed(2)}</p>
                    {d.jackpotRolledOver && <p style={{ fontSize:11, color:'#FFB800' }}>Jackpot rolled</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:700, marginBottom:16 }}>Charity Support</h3>
          {!r.charityTotals?.length ? (
            <p style={{ fontSize:13, color:'var(--text-3)' }}>No data yet.</p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {r.charityTotals.map(c => (
                <div key={c._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 14px', background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)' }}>
                  <p style={{ fontSize:13, fontWeight:500 }}>{c._id||'Unassigned'}</p>
                  <span className="badge badge-green">{c.count} subscribers</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}