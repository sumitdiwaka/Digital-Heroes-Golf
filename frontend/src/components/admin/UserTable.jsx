import { useEffect, useState } from 'react'
import API from '../../api/axios'
import toast from 'react-hot-toast'

export default function UserTable() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [ef, setEf] = useState({})

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try { const {data}=await API.get('/admin/users'); setUsers(data.users) }
    catch(e){} finally { setLoading(false) }
  }

  const startEdit = u => { setEditing(u._id); setEf({ name:u.name, subscriptionStatus:u.subscriptionStatus, subscriptionPlan:u.subscriptionPlan||'' }) }

  const save = async () => {
    try {
      await API.put('/admin/users/'+editing, { name:ef.name })
      await API.put('/admin/users/'+editing+'/subscription', { subscriptionStatus:ef.subscriptionStatus, subscriptionPlan:ef.subscriptionPlan||null })
      toast.success('User updated'); setEditing(null); fetchUsers()
    } catch(e) { toast.error('Update failed') }
  }

  if (loading) return <div style={{ textAlign:'center', padding:48, color:'var(--text-3)' }}>Loading users...</div>

  return (
    <div className="card" style={{ overflowX:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <h3 style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:700 }}>All Users</h3>
        <span className="badge badge-gray">{users.length} total</span>
      </div>
      <table className="data-table" style={{ minWidth:600 }}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Status</th><th>Plan</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              {editing===u._id ? (
                <>
                  <td><input value={ef.name} onChange={e=>setEf({...ef,name:e.target.value})} className="input-field" style={{ padding:'7px 10px',fontSize:13 }} /></td>
                  <td style={{ color:'var(--text-3)' }}>{u.email}</td>
                  <td>
                    <select value={ef.subscriptionStatus} onChange={e=>setEf({...ef,subscriptionStatus:e.target.value})} className="input-field" style={{ padding:'7px 10px',fontSize:13 }}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="lapsed">Lapsed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <select value={ef.subscriptionPlan} onChange={e=>setEf({...ef,subscriptionPlan:e.target.value})} className="input-field" style={{ padding:'7px 10px',fontSize:13 }}>
                      <option value="">None</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={save} className="btn-primary" style={{ padding:'7px 14px', fontSize:12 }}>Save</button>
                      <button onClick={()=>setEditing(null)} className="btn-ghost" style={{ fontSize:12 }}>Cancel</button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td style={{ fontWeight:600, color:'var(--text-1)' }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={'badge '+(u.subscriptionStatus==='active'?'badge-green':'badge-gray')}>{u.subscriptionStatus}</span></td>
                  <td style={{ textTransform:'capitalize' }}>{u.subscriptionPlan||'—'}</td>
                  <td><button onClick={()=>startEdit(u)} className="btn-ghost" style={{ fontSize:12 }}>Edit</button></td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}