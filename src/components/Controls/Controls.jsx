import React from 'react'
import PropTypes from 'prop-types'

function Controls({ range, setRange, onExport, live, setLive }) {
  return (
    <div className="controls">
      <label className="date-label">
        Date start
        <input
          className="date-input"
          type="date"
          value={range.start}
          onChange={(e) => setRange((r) => ({ ...r, start: e.target.value }))}
        />
      </label>

      <label className="date-label">
        Date end
        <input
          className="date-input"
          type="date"
          value={range.end}
          onChange={(e) => setRange((r) => ({ ...r, end: e.target.value }))}
        />
      </label>

      <button title="Export chart as PNG" onClick={onExport}>
        Export
      </button>

      <button
        className={`live-toggle ${live ? 'live-on' : 'live-off'}`}
        onClick={() => setLive((v) => !v)}
        title="Toggle live updates (polling)"
      >
        {live ? 'Live: On' : 'Live: Off'}
      </button>
    </div>
  )
}

Controls.propTypes = {
  range: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string
  }).isRequired,
  setRange: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  live: PropTypes.bool.isRequired,
  setLive: PropTypes.func.isRequired
}

export default Controls
