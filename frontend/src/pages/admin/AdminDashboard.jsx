import { useState } from 'react'
import AdminReports from '../../components/admin/AdminReports'
import UserTable from '../../components/admin/UserTable'
import DrawManager from '../../components/admin/DrawManager'
import CharityManager from '../../components/admin/CharityManager'
import WinnerVerification from '../../components/admin/WinnerVerification'

const TABS = ['Reports','Users','Draws','Charities','Winners']

export default function AdminDashboard() {
  const [tab, setTab] = useState('Reports')

  return (
    <div style={{ minHeight:'100vh', padding:'40px 0' }}>
      <div className="container">
        <div style={{ marginBottom:32 }}>
          <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--green)', marginBottom:8 }}>Admin panel</p>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:32, fontWeight:800 }}>Platform Control</h1>
        </div>
        <div className="tab-bar" style={{ marginBottom:32 }}>
          {TABS.map(t => (
            <button key={t} className={'tab-item'+(tab===t?' active':'')} onClick={()=>setTab(t)}>{t}</button>
          ))}
        </div>
        {tab==='Reports'   && <AdminReports />}
        {tab==='Users'     && <UserTable />}
        {tab==='Draws'     && <DrawManager />}
        {tab==='Charities' && <CharityManager />}
        {tab==='Winners'   && <WinnerVerification />}
      </div>
    </div>
  )
}