import React, { Suspense, lazy } from 'react'

// Lazy-load the heavy chart implementation so the initial bundle is smaller.
const HeatmapChart = lazy(() => import('./HeatmapChart'))

export default function Heatmap(props) {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Loading chart…</div>}>
      <HeatmapChart {...props} />
    </Suspense>
  )
}
