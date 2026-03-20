import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ScoreEntry from '../components/dashboard/ScoreEntry'
import ScoreList from '../components/dashboard/ScoreList'
import CharitySelector from '../components/dashboard/CharitySelector'
import DrawParticipation from '../components/dashboard/DrawParticipation'
import WinningsOverview from '../components/dashboard/WinningsOverview'

const TABS = ['Scores','Charity','Draws','Winnings']

export default function Dashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('Scores')
  const [refreshScores, setRefreshScores] = useState(0)
  const isActive = user?.subscriptionStatus === 'active'

  return (
    <div style={{ minHeight:'100vh', padding:'40px 0' }}>
      <div className="container">

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:32, flexWrap:'wrap', gap:16 }}>
          <div>
            <p style={{ fontSize:12, color:'var(--text-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>Dashboard</p>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:32, fontWeight:800 }}>
              Welcome back, {user?.name?.split(' ')[0]}.
            </h1>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {isActive
              ? <span className="badge badge-green">● Active subscriber</span>
              : <span className="badge badge-gray">Inactive</span>
            }
            {!isActive && <Link to="/subscribe" className="btn-primary" style={{ padding:'9px 18px', fontSize:13 }}>Subscribe</Link>}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12, marginBottom:32 }}>
          {[
            { label:'Plan', value: user?.subscriptionPlan ? user.subscriptionPlan.charAt(0).toUpperCase()+user.subscriptionPlan.slice(1) : 'None' },
            { label:'Renewal', value: user?.subscriptionRenewalDate ? new Date(user.subscriptionRenewalDate).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}) : '—' },
            { label:'Charity %', value: user?.charityPercentage ? user.charityPercentage+'%' : '10%' },
            { label:'Total Won', value: '£'+(user?.totalWinnings?.toFixed(2) || '0.00'), green:true },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <p className="stat-label">{s.label}</p>
              <p className={'stat-value'+(s.green?' green':'')}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tab-bar" style={{ marginBottom:28 }}>
          {TABS.map(t => (
            <button key={t} className={'tab-item'+(tab===t?' active':'')} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {/* Subscription warning */}
        {!isActive && tab === 'Scores' && (
          <div style={{ background:'rgba(255,196,0,0.05)', border:'1px solid rgba(255,196,0,0.2)', borderRadius:'var(--radius-md)', padding:'14px 18px', display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
            <span style={{ fontSize:18 }}>⚠️</span>
            <p style={{ fontSize:13, color:'var(--text-2)' }}>
              Score entry requires an active subscription.{' '}
              <Link to="/subscribe" style={{ color:'var(--green)', fontWeight:600, textDecoration:'none' }}>Subscribe now →</Link>
            </p>
          </div>
        )}

        {/* Content */}
        {tab === 'Scores' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            <ScoreEntry onScoreAdded={() => setRefreshScores(p => p+1)} />
            <ScoreList refresh={refreshScores} />
          </div>
        )}
        {tab === 'Charity'  && <CharitySelector />}
        {tab === 'Draws'    && <DrawParticipation />}
        {tab === 'Winnings' && <WinningsOverview />}

      </div>
    </div>
  )
}