import { useEffect, useState } from 'react'
import API from '../../api/axios'
import toast from 'react-hot-toast'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function DrawManager() {
    const [draws, setDraws] = useState([])
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear(), drawType: 'random', jackpotRollover: 0 })

    useEffect(() => { fetchDraws() }, [])

    const fetchDraws = async () => {
        setLoading(true)
        try { const { data } = await API.get('/draws'); setDraws(data.draws) }
        catch (e) { } finally { setLoading(false) }
    }

    const configure = async e => {
        e.preventDefault()
        try { await API.post('/draws/configure', form); toast.success('Draw configured!'); fetchDraws() }
        catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    }

    const simulate = async id => {
        try { await API.post('/draws/' + id + '/simulate'); toast.success('Simulation complete!'); fetchDraws() }
        catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    }

    const publish = async id => {
        if (!window.confirm('Publish this draw? This will notify winners.')) return
        try { const { data } = await API.post('/draws/' + id + '/publish'); toast.success('Published! ' + data.winnersCreated + ' winner(s) created.'); fetchDraws() }
        catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            <div className="card">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Configure New Draw</h3>
                <form onSubmit={configure} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14 }}>
                    <div>
                        <label className="label">Month</label>
                        <select value={form.month} onChange={e => setForm({ ...form, month: parseInt(e.target.value) })} className="input-field">
                            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="label">Year</label>
                        <input type="number" value={form.year} onChange={e => setForm({ ...form, year: parseInt(e.target.value) })} className="input-field" />
                    </div>
                    <div>
                        <label className="label">Draw Type</label>
                        <select value={form.drawType} onChange={e => setForm({ ...form, drawType: e.target.value })} className="input-field">
                            <option value="random">Random</option>
                            <option value="algorithmic">Algorithmic</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Jackpot Rollover (£)</label>
                        <input type="number" min="0" step="0.01" value={form.jackpotRollover} onChange={e => setForm({ ...form, jackpotRollover: parseFloat(e.target.value) })} className="input-field" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Configure</button>
                    </div>
                </form>
            </div>

            <div className="card">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 16 }}>All Draws</h3>
                {loading ? <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Loading...</p> : draws.length === 0 ? (
                    <p style={{ fontSize: 13, color: 'var(--text-3)' }}>No draws configured yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {draws.map(d => (
                            <div key={d._id} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px 18px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{MONTHS[d.month - 1]} {d.year}</p>
                                        <span className={'badge ' + (d.status === 'published' ? 'badge-green' : d.status === 'simulated' ? 'badge-blue' : 'badge-yellow')}>{d.status}</span>
                                    </div>
                                    <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
                                        {d.drawType} · {d.participantCount} participants · £{d.totalPrizePool?.toFixed(2)} pool
                                    </p>
                                    {d.drawnNumbers?.length > 0 && (
                                        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                                            {d.drawnNumbers.map((n, i) => (
                                                <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,232,122,0.1)', border: '1px solid var(--green-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, color: 'var(--green)' }}>{n}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {d.status !== 'published' && (
                                        <>
                                            <button onClick={() => simulate(d._id)} className="btn-outline" style={{ padding: '8px 16px', fontSize: 13 }}>Simulate</button>
                                            <button onClick={() => publish(d._id)} className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>Publish</button>
                                        </>
                                    )}
                                    <button
                                        onClick={async () => {
                                            if (!window.confirm('Delete this draw?')) return
                                            try {
                                                await API.delete('/draws/' + d._id)
                                                toast.success('Draw deleted')
                                                fetchDraws()
                                            } catch (e) {
                                                toast.error(e.response?.data?.message || 'Failed')
                                            }
                                        }}
                                        className="btn-danger"
                                        style={{ padding: '8px 14px', fontSize: 13 }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}