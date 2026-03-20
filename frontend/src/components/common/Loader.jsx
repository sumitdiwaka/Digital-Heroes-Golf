export default function Loader() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
        <div style={{
          width:40, height:40, borderRadius:'50%',
          border:'3px solid var(--surface-3)',
          borderTopColor:'var(--green)',
        }} className="animate-spin" />
        <p style={{ fontSize:13, color:'var(--text-3)', fontFamily:'var(--font-display)', fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase' }}>Loading</p>
      </div>
    </div>
  )
}