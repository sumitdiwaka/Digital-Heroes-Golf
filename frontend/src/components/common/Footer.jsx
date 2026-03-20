import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background:'var(--surface)', borderTop:'1px solid var(--border)', marginTop:'auto' }}>
      <div className="container" style={{ padding:'48px 24px 32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:48, marginBottom:48 }}>

          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:28, height:28, background:'var(--green)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:14, color:'#000' }}>G</span>
              </div>
              <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:16, color:'var(--text-1)' }}>GolfGives</span>
            </div>
            <p style={{ fontSize:13, color:'var(--text-3)', lineHeight:1.7, maxWidth:260 }}>
              The golf platform that turns your game into charitable impact — every subscription, every score, every month.
            </p>
          </div>

          <div>
            <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--text-3)', marginBottom:16 }}>Platform</p>
            {[['/', 'Home'], ['/charities', 'Charities'], ['/subscribe', 'Pricing']].map(([to, label]) => (
              <Link key={to} to={to} style={{ display:'block', fontSize:13, color:'var(--text-2)', textDecoration:'none', marginBottom:10, transition:'color 0.15s' }}
                onMouseEnter={e => e.target.style.color = 'var(--text-1)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-2)'}
              >{label}</Link>
            ))}
          </div>

          <div>
            <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--text-3)', marginBottom:16 }}>Account</p>
            {[['/login', 'Sign in'], ['/register', 'Register'], ['/dashboard', 'Dashboard']].map(([to, label]) => (
              <Link key={to} to={to} style={{ display:'block', fontSize:13, color:'var(--text-2)', textDecoration:'none', marginBottom:10, transition:'color 0.15s' }}
                onMouseEnter={e => e.target.style.color = 'var(--text-1)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-2)'}
              >{label}</Link>
            ))}
          </div>
        </div>

        <div style={{ borderTop:'1px solid var(--border)', paddingTop:24, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <p style={{ fontSize:12, color:'var(--text-3)' }}>© {new Date().getFullYear()} GolfGives. All rights reserved.</p>
          <p style={{ fontSize:12, color:'var(--text-3)' }}>Secured by Stripe · Built for golfers who give</p>
        </div>
      </div>
    </footer>
  )
}