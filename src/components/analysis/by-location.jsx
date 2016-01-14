import React from 'react'
import d3 from 'd3'
import topojson from 'topojson'

// TODO: Load this async with redux once the express server is written

class AnalysisByTime extends React.Component {
  render() {
    if(!this.props.width) {
      return <div>Loading...</div>
    }

    return (
      <svg
        className='analysis-by-location'
        width={this.props.width}
        height={this.props.height}>
      </svg>
    )
  }
}

AnalysisByTime.displayName = 'AnalysisByTime'
AnalysisByTime.propTypes = {
  height: React.PropTypes.number,
  padding: React.PropTypes.number,
  width: React.PropTypes.number
}

module.exports = AnalysisByTime
