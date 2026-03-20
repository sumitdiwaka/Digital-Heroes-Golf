import { useEffect, useState } from 'react'
import API from '../api/axios'

export default function Charities() {
  const [charities, setCharities] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    setLoading(true)
    API.get('/charities?search='+search)
      .then(r => setCharities(r.data.charities))
      .catch(()=>{}).finally(()=>setLoading(false))
  }, [search])

  return (
    <div style={{ minHeight:'100vh', padding:'60px 0' }}>
      <div className="container">

        <div style={{ marginBottom:48 }}>
          <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--green)', marginBottom:12 }}>Our partners</p>
          <h1 className="section-title" style={{ marginBottom:16 }}>Charities worth<br />playing for.</h1>
          <p style={{ fontSize:15, color:'var(--text-2)', maxWidth:480 }}>Every subscription directly supports causes that matter. Choose yours at signup.</p>
        </div>

        <div style={{ maxWidth:360, marginBottom:40 }}>
          <input type="text" placeholder="Search charities..." value={search} onChange={e=>setSearch(e.target.value)} className="input-field" />
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:64, color:'var(--text-3)' }}>Loading...</div>
        ) : charities.length === 0 ? (
          <div style={{ textAlign:'center', padding:64, color:'var(--text-3)' }}>No charities found.</div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
            {charities.map(c => (
              <div key={c._id} className="card" onClick={() => setSelectedId(selectedId===c._id?null:c._id)}
                style={{ cursor:'pointer', transition:'border-color 0.2s, transform 0.2s', borderColor: selectedId===c._id?'var(--green-border)':'var(--border)' }}
                onMouseEnter={e=>{ if(selectedId!==c._id) e.currentTarget.style.borderColor='var(--border-2)' }}
                onMouseLeave={e=>{ if(selectedId!==c._id) e.currentTarget.style.borderColor='var(--border)' }}
              >
                {c.imageUrl && <img src={c.imageUrl} alt={c.name} style={{ width:'100%', height:140, objectFit:'cover', borderRadius:'var(--radius-sm)', marginBottom:16 }} />}

                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <h3 style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:700, flex:1 }}>{c.name}</h3>
                  {c.isFeatured && <span className="badge badge-green" style={{ fontSize:10 }}>Featured</span>}
                </div>

                <p className="line-clamp-3" style={{ fontSize:13, color:'var(--text-2)', lineHeight:1.65 }}>{c.description}</p>

                {selectedId === c._id && (
                  <div style={{ marginTop:16, paddingTop:16, borderTop:'1px solid var(--border)' }}>
                    {c.website && (
                      <a href={String(c.website)} target="_blank" rel="noopener noreferrer"
                        style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, color:'var(--green)', textDecoration:'none', marginBottom:12 }}>
                        Visit website →
                      </a>
                    )}
                    {c.upcomingEvents?.length > 0 && (
                      <div>
                        <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--text-3)', marginBottom:10 }}>Upcoming events</p>
                        {c.upcomingEvents.map((ev,i) => (
                          <div key={i} style={{ background:'var(--surface-2)', borderRadius:'var(--radius-sm)', padding:'10px 12px', marginBottom:8 }}>
                            <p style={{ fontWeight:600, fontSize:13 }}>{ev.title}</p>
                            <p style={{ fontSize:11, color:'var(--text-3)', marginTop:2 }}>{new Date(ev.date).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <p style={{ fontSize:12, color:'var(--text-3)', marginTop:8 }}>
                      Total received: <span style={{ color:'var(--green)', fontWeight:700 }}>£{c.totalReceived?.toFixed(2)||'0.00'}</span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}