import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [draw, setDraw] = useState(null)

  useEffect(() => {
    API.get('/charities/featured').then(r => setFeatured(r.data.charities)).catch(() => {})
    API.get('/draws/current').then(r => setDraw(r.data.draw)).catch(() => {})
  }, [])

  return (
    <div>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section style={{ position:'relative', minHeight:'92vh', display:'flex', alignItems:'center', overflow:'hidden' }}>
        {/* Grid background */}
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize:'60px 60px',
          maskImage:'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        }} />
        {/* Glow */}
        <div style={{ position:'absolute', top:'20%', left:'50%', transform:'translateX(-50%)', width:600, height:300, background:'radial-gradient(ellipse, rgba(0,232,122,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />

        <div className="container" style={{ position:'relative', zIndex:1, padding:'80px 24px' }}>
          <div style={{ maxWidth:720 }}>

            <div style={{
              display:'inline-flex', alignItems:'center', gap:8,
              background:'rgba(0,232,122,0.06)', border:'1px solid var(--green-border)',
              borderRadius:99, padding:'6px 14px', marginBottom:32,
            }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--green)', display:'inline-block' }} className="animate-pulse" />
              <span style={{ fontSize:12, fontWeight:600, color:'var(--green)', letterSpacing:'0.04em', textTransform:'uppercase' }}>Monthly draws now live</span>
            </div>

            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(44px,7vw,84px)', fontWeight:800, lineHeight:1.05, letterSpacing:'-0.03em', marginBottom:24 }}>
              Golf that funds<br />
              <span style={{ color:'var(--green)' }}>what matters.</span>
            </h1>

            <p style={{ fontSize:'clamp(15px,2vw,18px)', color:'var(--text-2)', lineHeight:1.7, maxWidth:520, marginBottom:40 }}>
              Track your Stableford scores, enter monthly prize draws, and automatically fund the charity you care about — all in one platform.
            </p>

            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <Link to="/subscribe" className="btn-primary" style={{ fontSize:15, padding:'14px 28px' }}>
                Start for £9.99/mo
              </Link>
              <Link to="/charities" className="btn-outline" style={{ fontSize:15, padding:'14px 28px' }}>
                Explore charities
              </Link>
            </div>

            {/* Trust bar */}
            <div style={{ display:'flex', alignItems:'center', gap:24, marginTop:48, flexWrap:'wrap' }}>
              {[['🔒', 'Stripe secured'], ['♻️', 'Jackpot rollover'], ['💚', 'Min 10% to charity'], ['⛳', 'Stableford format']].map(([icon, label]) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ fontSize:14 }}>{icon}</span>
                  <span style={{ fontSize:12, color:'var(--text-3)', fontWeight:500 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section style={{ padding:'100px 0', borderTop:'1px solid var(--border)' }}>
        <div className="container">
          <div style={{ marginBottom:56 }}>
            <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--green)', marginBottom:12 }}>How it works</p>
            <h2 className="section-title">Three steps to play,<br />win, and give.</h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:2 }}>
            {[
              { n:'01', title:'Subscribe', body:'Choose monthly or yearly. A portion of every payment goes straight to your chosen charity — no extra steps.', icon:'💳' },
              { n:'02', title:'Enter Scores', body:'Log your last 5 Stableford scores after each round. They become your draw entries automatically.', icon:'⛳' },
              { n:'03', title:'Win & Give', body:'Monthly draws reward 3, 4 and 5-number matches. Jackpots roll over. Your charity gets funded regardless.', icon:'🏆' },
            ].map((step, i) => (
              <div key={step.n} style={{
                background: i === 1 ? 'var(--surface)' : 'transparent',
                border: i === 1 ? '1px solid var(--border)' : '1px solid transparent',
                borderRadius:'var(--radius-lg)', padding:32,
                position:'relative', overflow:'hidden',
              }}>
                <div style={{ position:'absolute', top:20, right:24, fontFamily:'var(--font-display)', fontSize:64, fontWeight:800, color:'var(--surface-3)', lineHeight:1, userSelect:'none' }}>{step.n}</div>
                <div style={{ fontSize:32, marginBottom:20 }}>{step.icon}</div>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:700, marginBottom:12, position:'relative' }}>{step.title}</h3>
                <p style={{ fontSize:14, color:'var(--text-2)', lineHeight:1.7, position:'relative' }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIZE POOL ────────────────────────────────────── */}
      <section style={{ padding:'80px 0', background:'var(--surface)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>

            <div>
              <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--green)', marginBottom:12 }}>Prize structure</p>
              <h2 className="section-title" style={{ marginBottom:20 }}>Every subscriber<br />grows the pot.</h2>
              <p style={{ fontSize:15, color:'var(--text-2)', lineHeight:1.7, marginBottom:32 }}>
                A fixed share of each subscription builds the monthly prize pool. Match more numbers, win a bigger share.
              </p>
              {draw && (
                <div style={{ background:'var(--surface-2)', border:'1px solid var(--green-border)', borderRadius:'var(--radius-md)', padding:'16px 20px', display:'inline-block' }}>
                  <p style={{ fontSize:11, color:'var(--text-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>Current pool</p>
                  <p style={{ fontFamily:'var(--font-display)', fontSize:32, fontWeight:800, color:'var(--green)' }}>
                    £{draw.totalPrizePool?.toFixed(2) || '0.00'}
                  </p>
                  <p style={{ fontSize:12, color:'var(--text-3)', marginTop:4 }}>{draw.participantCount} active participants</p>
                </div>
              )}
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[
                { match:'5 Numbers', pct:'40%', label:'Jackpot', note:'Rolls over if unclaimed', color:'#FFB800' },
                { match:'4 Numbers', pct:'35%', label:'Major Prize', note:'Split equally among winners', color:'var(--green)' },
                { match:'3 Numbers', pct:'25%', label:'Prize', note:'Split equally among winners', color:'#58A6FF' },
              ].map(tier => (
                <div key={tier.match} style={{
                  background:'var(--surface-3)', border:'1px solid var(--border)',
                  borderRadius:'var(--radius-md)', padding:'18px 20px',
                  display:'flex', alignItems:'center', justifyContent:'space-between', gap:16,
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                    <div style={{ width:40, height:40, borderRadius:8, background:'rgba(255,255,255,0.04)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:16, fontWeight:800, color:tier.color }}>
                      {tier.pct}
                    </div>
                    <div>
                      <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, color:'var(--text-1)' }}>{tier.match}</p>
                      <p style={{ fontSize:12, color:'var(--text-3)' }}>{tier.note}</p>
                    </div>
                  </div>
                  <span style={{ fontSize:12, fontWeight:600, color:tier.color, background:`${tier.color}15`, padding:'4px 10px', borderRadius:99 }}>{tier.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED CHARITIES ────────────────────────────── */}
      {featured.length > 0 && (
        <section style={{ padding:'100px 0' }}>
          <div className="container">
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:48, flexWrap:'wrap', gap:16 }}>
              <div>
                <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--green)', marginBottom:12 }}>Charity partners</p>
                <h2 className="section-title">Causes worth<br />playing for.</h2>
              </div>
              <Link to="/charities" className="btn-outline">View all charities</Link>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:16 }}>
              {featured.map(c => (
                <div key={c._id} className="card" style={{ transition:'border-color 0.2s, transform 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='var(--green-border)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='translateY(0)'; }}
                >
                  {c.imageUrl && <img src={c.imageUrl} alt={c.name} style={{ width:'100%', height:140, objectFit:'cover', borderRadius:'var(--radius-sm)', marginBottom:16 }} />}
                  <h3 style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:700, marginBottom:8 }}>{c.name}</h3>
                  <p className="line-clamp-2" style={{ fontSize:13, color:'var(--text-2)', lineHeight:1.65 }}>{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────── */}
      <section style={{ padding:'80px 0', borderTop:'1px solid var(--border)' }}>
        <div className="container">
          <div style={{
            background:'var(--surface)', border:'1px solid var(--green-border)',
            borderRadius:'var(--radius-xl)', padding:'64px 48px',
            textAlign:'center', position:'relative', overflow:'hidden',
            boxShadow:'var(--shadow-green)',
          }}>
            <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:400, height:200, background:'radial-gradient(ellipse, rgba(0,232,122,0.06) 0%, transparent 70%)', pointerEvents:'none' }} />
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(28px,4vw,44px)', fontWeight:800, marginBottom:16, position:'relative' }}>
              Ready to make your<br />game count?
            </h2>
            <p style={{ fontSize:15, color:'var(--text-2)', maxWidth:400, margin:'0 auto 36px', position:'relative' }}>
              Join golfers who are winning prizes and funding charities every single month.
            </p>
            <Link to="/subscribe" className="btn-primary" style={{ fontSize:15, padding:'14px 32px', position:'relative' }}>
              Subscribe now — from £9.99/mo
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}