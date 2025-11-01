import React from 'react'
import PropTypes from 'prop-types'

function Legend({ sources = [], visibleSources = new Set(), toggleSource }) {
  return (
    <div className="heatmap-legend">
      <div className="legend-container">
        {sources.map((s) => {
          const val = typeof s.value === 'number' ? s.value : Number(s.value || s.name)
          const enabled = visibleSources.has(val)
          return (
            <div
              key={s.name || s.value}
              className={`legend-item ${enabled ? '' : 'disabled'}`}
              onClick={() => toggleSource(s.value)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleSource(s.value)}
            >
              <span className="legend-swatch" style={{ backgroundColor: s.color }} />
              <span className="legend-label">{s.display || s.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

Legend.propTypes = {
  sources: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      color: PropTypes.string,
      display: PropTypes.string,
      desc: PropTypes.string
    })
  ),
  visibleSources: PropTypes.instanceOf(Set),
  toggleSource: PropTypes.func.isRequired
}

Legend.defaultProps = {
  sources: [],
  visibleSources: new Set()
}

export default Legend
