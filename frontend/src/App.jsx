import React, { useEffect, useState } from 'react'

export default function App() {
  const [restaurants, setRestaurants] = useState([])
  const [selected, setSelected] = useState('')
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  // load restaurants on mount
  useEffect(() => {
    fetch('/api/restaurants')
      .then(r => r.json())
      .then(setRestaurants)
      .catch(() => setMsg('Failed to load restaurants'))
  }, [])

  async function loadMenu(id) {
    setSelected(id)
    setMsg('')
    setLoading(true)
    try {
      const items = await fetch(`/api/restaurants/${id}/menu`).then(r => r.json())
      setMenu(items)
    } catch {
      setMsg('Failed to load menu')
    } finally {
      setLoading(false)
    }
  }

  async function placeOrder(menuId) {
    if (!selected) return
    setLoading(true)
    setMsg('')
    try {
      const body = { restaurantId: selected, items: [{ menuId, qty: 1 }] }
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (res.ok) setMsg(`Order ${data.id} placed! Total $${data.total}`)
      else setMsg(`Error: ${data.error || 'unknown'}`)
    } catch {
      setMsg('Network error placing order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 920, margin: '32px auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1>QuickBite</h1>
      <p style={{ color: '#555' }}>Gateway :8080 → Logic :8081. This UI calls <code>/api</code> and the gateway forwards.</p>

      <section>
        <h2>Restaurants</h2>
        <ul>
          {restaurants.map(r => (
            <li key={r.id} style={{ marginBottom: 8 }}>
              <button onClick={() => loadMenu(r.id)} disabled={loading} style={{ marginRight: 8 }}>
                View Menu
              </button>
              <strong>{r.name}</strong> <em style={{ color: '#666' }}>{r.tags}</em>
            </li>
          ))}
        </ul>
      </section>

      {selected && (
        <section>
          <h2>Menu — {selected}</h2>
          {loading && <p>Loading…</p>}
          <ul>
            {menu.map(m => (
              <li key={m.id} style={{ marginBottom: 6 }}>
                <button onClick={() => placeOrder(m.id)} disabled={loading} style={{ marginRight: 8 }}>
                  Order
                </button>
                {m.name} — ${m.price?.toFixed ? m.price.toFixed(2) : m.price}
              </li>
            ))}
          </ul>
        </section>
      )}

      {msg && (
        <p style={{ marginTop: 16 }}>
          <strong>{msg}</strong>
        </p>
      )}
    </div>
  )
}
