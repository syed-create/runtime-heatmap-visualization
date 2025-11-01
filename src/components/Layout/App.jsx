import React, { useEffect, useState, useCallback } from 'react'
import { Heatmap } from '../Chart'
import Controls from '../Controls'
import Legend from '../Legend'
import { POLLING_INTERVAL_MS, DATA_ENDPOINT, EXPORT_CHART_EVENT } from '../../utils'

export default function App() {
  const [data, setData] = useState(null)
  const [meta, setMeta] = useState(null)
  const [visibleSources, setVisibleSources] = useState(new Set())
  const [range, setRange] = useState({ start: '', end: '' })
  const [live, setLive] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(() => {
    setLoading(true)
    setError(null)
    return fetch(DATA_ENDPOINT)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`)
        return r.json()
      })
      .then((j) => {
        setMeta(j.meta || null)
        setData(j.data || null)
        setLoading(false)
      })
      .catch((e) => {
        console.error('Failed to load runtime data:', e)
        setError(e.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    // initial load
    fetchData()
  }, [fetchData])

  // when meta loads, initialize visibleSources to include all source values
  useEffect(() => {
    if (!meta || !Array.isArray(meta.sources)) return
    const vals = new Set()
    meta.sources.forEach((s) => {
      // keep numeric if possible
      const v = typeof s.value === 'number' ? s.value : Number(s.value || s.name)
      vals.add(v)
    })
    setVisibleSources(vals)
  }, [meta])

  const toggleSource = (value) => {
    setVisibleSources((prev) => {
      const next = new Set(prev)
      const num = typeof value === 'number' ? value : Number(value)
      if (next.has(num)) next.delete(num)
      else next.add(num)
      return next
    })
  }

  useEffect(() => {
    if (!live) return undefined
    // poll when live mode is enabled
    const id = setInterval(() => fetchData(), POLLING_INTERVAL_MS)
    return () => clearInterval(id)
  }, [live, fetchData])

  const handleExport = useCallback(() => {
    const evt = new CustomEvent(EXPORT_CHART_EVENT)
    window.dispatchEvent(evt)
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>Runtime Report</h1>
        <Controls
          range={range}
          setRange={setRange}
          onExport={handleExport}
          live={live}
          setLive={setLive}
        />
      </header>

      <main>
        {error && (
          <div className="error-banner">
            <strong>Error loading data:</strong> {error}
            <button onClick={fetchData} className="retry-btn">Retry</button>
          </div>
        )}

        <section className="heatmap-area">
          <Legend
            sources={meta ? meta.sources : []}
            visibleSources={visibleSources}
            toggleSource={toggleSource}
          />

          {loading ? (
            <div className="loading-state">Loading runtime data...</div>
          ) : data && meta ? (
            <Heatmap
              data={data}
              meta={meta}
              dateRange={range}
              visibleSources={visibleSources}
            />
          ) : !error ? (
            <div className="loading-state">No data available</div>
          ) : null}
        </section>
      </main>

      <footer className="footer">Heatmap demo — ECharts + React</footer>
    </div>
  )
}
