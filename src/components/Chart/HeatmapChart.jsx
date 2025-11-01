import React, { useMemo, useRef, useEffect } from 'react'
import ReactECharts from 'echarts-for-react'
import PropTypes from 'prop-types'
import {
  CHART_HEIGHT,
  CHART_ANIMATION_DURATION,
  PROGRESSIVE_CHUNK_SIZE,
  PROGRESSIVE_RENDER_THRESHOLD,
  EXPORT_CHART_EVENT
} from '../../utils'

// Helper: map meta value -> meta entry
function buildMetaMap(meta) {
  const map = {}
  if (!meta || !Array.isArray(meta.sources)) return map
  meta.sources.forEach((s) => {
    map[s.value] = s
  })
  return map
}

function HeatmapChart({ data, meta, dateRange, visibleSources }) {
  const metaMap = useMemo(() => buildMetaMap(meta), [meta])
  const chartRef = useRef(null)

  // Build heatmap matrix: date x time -> rtsources value
  const { dates, times, matrix } = useMemo(() => {
    let datesArr = Object.keys(data).sort()

    if (dateRange && (dateRange.start || dateRange.end)) {
      const start = dateRange.start ? new Date(dateRange.start) : null
      const end = dateRange.end ? new Date(dateRange.end) : null
      datesArr = datesArr.filter((d) => {
        const dt = new Date(d)
        if (start && dt < start) return false
        if (end && dt > end) return false
        return true
      })
    }

    const timesSet = new Set()
    const matrix = []

    datesArr.forEach((d) => {
      const entries = data[d] || []
      entries.forEach((r) => {
        if (r && r.time) timesSet.add(r.time)
      })
    })

    const timesArr = Array.from(timesSet).sort()

    datesArr.forEach((d) => {
      const row = []
      const entries = data[d] || []
      const m = {}
      entries.forEach((e) => {
        m[e.time] = e
      })
      timesArr.forEach((t) => {
        const entry = m[t]
        const v = entry ? entry.rtsources : null
        row.push(v == null ? null : Number(v))
      })
      matrix.push(row)
    })

    return { dates: datesArr, times: timesArr, matrix }
  }, [data, dateRange])

  // transform to ECharts heatmap dataset: [timeIndex, dateIndex, value]
  const seriesData = useMemo(() => {
    const s = []
    const hasFilter = visibleSources && typeof visibleSources.has === 'function'
    for (let di = 0; di < matrix.length; di++) {
      for (let ti = 0; ti < matrix[di].length; ti++) {
        const val = matrix[di][ti]
        if (val === null || typeof val === 'undefined') continue
        // if there's a visibility filter, skip values that are not enabled
        if (hasFilter && visibleSources.size > 0 && !visibleSources.has(val)) continue
        s.push([ti, di, val])
      }
    }
    return s
  }, [matrix, visibleSources])

  const visualMapPieces = useMemo(() => {
    const pieces = []
    for (const v in metaMap) {
      const m = metaMap[v]
      pieces.push({
        value: Number(v),
        label: m.display || m.name || String(v),
        color: m.color || '#999'
      })
    }
    pieces.sort((a, b) => a.value - b.value)
    return pieces
  }, [metaMap])

  const option = useMemo(() => {
    return {
      animation: true,
      animationDuration: CHART_ANIMATION_DURATION,
      animationEasing: 'cubicOut',
      tooltip: {
        position: 'top',
        formatter: function (params) {
          const timeIdx = params.data[0]
          const dateIdx = params.data[1]
          const val = params.data[2]
          const date = dates[dateIdx]
          const time = times[timeIdx]
          const metaEntry = metaMap[val] || {}
          return [
            `<b>${date} ${time}</b>`,
            `source: ${metaEntry.display || metaEntry.name || val}`,
            `${metaEntry.desc ? `<div style="font-size:12px;opacity:0.9">${metaEntry.desc}</div>` : ''}`
          ].join('<br/>')
        }
      },
      grid: {
        height: '80%',
        top: '7%',
        bottom: '50%'  // Reduced margin since visualMap is hidden
      },
      // Enable zooming / panning on both axes. Inside allows mousewheel/drag zooming,
      // slider provides visible handles to adjust the window.
      dataZoom: [
        { type: 'inside', xAxisIndex: 0, start: 0, end: 100 },
        { type: 'inside', yAxisIndex: 0, start: 0, end: 100 },
        {
          type: 'slider',
          xAxisIndex: 0,
          top: '95%',
          height: 12,
          start: 0,
          end: 100
        },
        {
          type: 'slider',
          yAxisIndex: 0,
          left: '92%',
          width: 12,
          start: 0,
          end: 100,
          orient: 'vertical'
        }
      ],
      toolbox: {
        show: true,
        feature: {
          saveAsImage: { title: 'Save' },
          restore: { title: 'Restore' },
          dataZoom: { title: 'Zoom' }
        }
      },
      xAxis: {
        type: 'category',
        data: times,
        splitArea: { show: true },
        axisLabel: { rotate: 45, interval: 'auto', fontSize: 11 }
      },
      yAxis: {
        type: 'category',
        data: dates,
        splitArea: { show: true },
        axisLabel: { interval: 'auto', fontSize: 11 }
      },
      visualMap: {
        show: false,  // Hide the built-in visualMap
        type: 'piecewise',
        pieces: visualMapPieces.map((p) => ({
          value: p.value,
          color: p.color
        }))
      },
      series: [
        {
          name: 'Runtime heatmap',
          type: 'heatmap',
          data: seriesData,
          progressive: PROGRESSIVE_CHUNK_SIZE,
          progressiveThreshold: PROGRESSIVE_RENDER_THRESHOLD,
          emphasis: {
            itemStyle: {
              borderColor: '#000',
              borderWidth: 1
            }
          }
        }
      ]
    }
  }, [dates, times, seriesData, visualMapPieces, metaMap])

  useEffect(() => {
    const handler = () => {
      const echartsInstance = chartRef.current && chartRef.current.getEchartsInstance()
      if (echartsInstance) {
        const url = echartsInstance.getDataURL({ pixelRatio: 2 })
        const a = document.createElement('a')
        a.href = url
        a.download = 'runtime-heatmap.png'
        a.click()
      }
    }
    window.addEventListener(EXPORT_CHART_EVENT, handler)
    return () => window.removeEventListener(EXPORT_CHART_EVENT, handler)
  }, [])

  return (
    <div style={{ width: '100%', height: `${CHART_HEIGHT}px` }}>
      <ReactECharts ref={chartRef} option={option} style={{ height: '100%' }} />
    </div>
  )
}

HeatmapChart.propTypes = {
  data: PropTypes.object.isRequired,
  meta: PropTypes.shape({
    sources: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        color: PropTypes.string,
        display: PropTypes.string,
        desc: PropTypes.string
      })
    )
  }).isRequired,
  dateRange: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string
  }),
  visibleSources: PropTypes.instanceOf(Set)
}

export default React.memo(HeatmapChart)
