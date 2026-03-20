import { useEffect, useState } from 'react'
import API from '../../api/axios'
import toast from 'react-hot-toast'

const EMPTY = { name:'', description:'', imageUrl:'', website:'', isFeatured:false }

export default function CharityManager() {
  const [charities, setCharities] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchCharities() }, [])

  const fetchCharities = async () => {
    setLoading(true)
    try { const {data}=await API.get('/charities'); setCharities(data.charities) }
    catch(e){} finally { setLoading(false) }
  }

  const submit = async e => {
    e.preventDefault()
    try {
      if (editing) { await API.put('/charities/'+editing, form); toast.success('Updated') }
      else { await API.post('/charities', form); toast.success('Charity created') }
      setForm(EMPTY); setEditing(null); fetchCharities()
    } catch(err) { toast.error(err.response?.data?.message||'Failed') }
  }

  const del = async id => {
    if (!window.confirm('Delete this charity?')) return
    try { await API.delete('/charities/'+id); toast.success('Deleted'); fetchCharities() }
    catch(e) { toast.error('Delete failed') }
  }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>

      <div className="card">
        <h3 style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:700, marginBottom:20 }}>
          {editing ? 'Edit Charity' : 'Add Charity'}
        </h3>
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div><label className="label">Name *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-field" required /></div>
          <div><label className="label">Description *</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="input-field" required /></div>
          <div><label className="label">Image URL</label><input value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})} className="input-field" /></div>
          <div><label className="label">Website</label><input value={form.website} onChange={e=>setForm({...form,website:e.target.value})} className="input-field" /></div>
          <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
            <input type="checkbox" checked={form.isFeatured} onChange={e=>setForm({...form,isFeatured:e.target.checked})} style={{ accentColor:'var(--green)', width:15, height:15 }} />
            <span style={{ fontSize:14, color:'var(--text-2)' }}>Featured on homepage</span>
          </label>
          <div style={{ display:'flex', gap:10 }}>
            <button type="submit" className="btn-primary" style={{ flex:1 }}>{editing?'Update':'Add Charity'}</button>
            {editing && <button type="button" onClick={()=>{setEditing(null);setForm(EMPTY)}} className="btn-outline">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="card">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:700 }}>Charities</h3>
          <span className="badge badge-gray">{charities.length}</span>
        </div>
        {loading ? <p style={{ fontSize:13, color:'var(--text-3)' }}>Loading...</p> : (
          <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:520, overflowY:'auto' }}>
            {charities.map(c => (
              <div key={c._id} style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'14px 16px', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                    <p style={{ fontWeight:600, fontSize:14, color:'var(--text-1)' }}>{c.name}</p>
                    {c.isFeatured && <span className="badge badge-green" style={{ fontSize:10 }}>Featured</span>}
                  </div>
                  <p className="line-clamp-2" style={{ fontSize:12, color:'var(--text-3)' }}>{c.description}</p>
                </div>
                <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                  <button onClick={()=>{setEditing(c._id);setForm({name:c.name,description:c.description,imageUrl:c.imageUrl||'',website:c.website||'',isFeatured:c.isFeatured||false})}} className="btn-ghost" style={{ fontSize:12, padding:'5px 10px' }}>Edit</button>
                  <button onClick={()=>del(c._id)} style={{ fontSize:12, padding:'5px 10px', background:'transparent', border:'none', color:'var(--text-3)', cursor:'pointer', borderRadius:'var(--radius-sm)', transition:'color 0.15s' }}
                    onMouseEnter={e=>e.target.style.color='#FF4D4D'} onMouseLeave={e=>e.target.style.color='var(--text-3)'}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}