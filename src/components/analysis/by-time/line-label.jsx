/* DECRECATED */
import React from 'react'

class AnalysisLineLabel extends React.Component {
  render() {
    return (
      <svg x={this.props.labelX} y={this.props.padding}>
        <path className={`line ${this.props.type}`} d="M0 7L25 7"/>
        <text x={35} y={14}>{this.props.label}</text>
      </svg>
    )
  }
}
AnalysisLineLabel.displayName = 'AnalysisLineLabel'
AnalysisLineLabel.propTypes = {
  label: React.PropTypes.string,
  labelX: React.PropTypes.number,
  padding: React.PropTypes.number,
  type: React.PropTypes.string
}
module.exports = AnalysisLineLabel
