import React from 'react'

import AnalysisByTime from '../components/analysis/by-time'

const fakeRecentData = [
  {epoch_start: 1451606400, bytes: 39405, requests: 943},
  {epoch_start: 1451606500, bytes: 54766, requests: 546},
  {epoch_start: 1451606600, bytes: 54675, requests: 435},
  {epoch_start: 1451606700, bytes: 34336, requests: 345},
  {epoch_start: 1451606800, bytes: 23456, requests: 567},
  {epoch_start: 1451606900, bytes: 56756, requests: 244},
  {epoch_start: 1451607000, bytes: 65466, requests: 455},
  {epoch_start: 1451607100, bytes: 23456, requests: 233},
  {epoch_start: 1451607200, bytes: 67454, requests: 544},
  {epoch_start: 1451607300, bytes: 54766, requests: 546},
  {epoch_start: 1451607400, bytes: 54675, requests: 435},
  {epoch_start: 1451607500, bytes: 34336, requests: 456},
  {epoch_start: 1451607600, bytes: 23456, requests: 567},
  {epoch_start: 1451607700, bytes: 56756, requests: 244},
  {epoch_start: 1451607800, bytes: 65466, requests: 455},
  {epoch_start: 1451607900, bytes: 23456, requests: 456},
  {epoch_start: 1451608000, bytes: 67454, requests: 544},
  {epoch_start: 1451608100, bytes: 23456, requests: 233},
  {epoch_start: 1451608200, bytes: 67454, requests: 544},
  {epoch_start: 1451608300, bytes: 54766, requests: 546},
  {epoch_start: 1451608400, bytes: 54675, requests: 435},
  {epoch_start: 1451608500, bytes: 34336, requests: 456},
  {epoch_start: 1451608600, bytes: 23456, requests: 567},
  {epoch_start: 1451608700, bytes: 56756, requests: 244},
  {epoch_start: 1451608800, bytes: 65466, requests: 455},
  {epoch_start: 1451608900, bytes: 23456, requests: 456},
  {epoch_start: 1451609000, bytes: 67454, requests: 544}
]

const fakeAverageData = [
  {epoch_start: 1451606400, bytes: 54675, requests: 345},
  {epoch_start: 1451606500, bytes: 65756, requests: 444},
  {epoch_start: 1451606600, bytes: 12333, requests: 345},
  {epoch_start: 1451606700, bytes: 32443, requests: 466},
  {epoch_start: 1451606800, bytes: 23554, requests: 346},
  {epoch_start: 1451606900, bytes: 43545, requests: 546},
  {epoch_start: 1451607000, bytes: 34436, requests: 546},
  {epoch_start: 1451607100, bytes: 76678, requests: 546},
  {epoch_start: 1451607200, bytes: 45666, requests: 456},
  {epoch_start: 1451607300, bytes: 33453, requests: 234},
  {epoch_start: 1451607400, bytes: 21444, requests: 234},
  {epoch_start: 1451607500, bytes: 34666, requests: 235},
  {epoch_start: 1451607600, bytes: 56666, requests: 466},
  {epoch_start: 1451607700, bytes: 23444, requests: 234},
  {epoch_start: 1451607800, bytes: 23333, requests: 235},
  {epoch_start: 1451607900, bytes: 45562, requests: 234},
  {epoch_start: 1451608000, bytes: 23445, requests: 234},
  {epoch_start: 1451608100, bytes: 23456, requests: 123},
  {epoch_start: 1451608200, bytes: 85645, requests: 345},
  {epoch_start: 1451608300, bytes: 34566, requests: 123},
  {epoch_start: 1451608400, bytes: 34666, requests: 233},
  {epoch_start: 1451608500, bytes: 44444, requests: 122},
  {epoch_start: 1451608600, bytes: 33453, requests: 567},
  {epoch_start: 1451608700, bytes: 22345, requests: 456},
  {epoch_start: 1451608800, bytes: 43566, requests: 345},
  {epoch_start: 1451608900, bytes: 34611, requests: 333},
  {epoch_start: 1451609000, bytes: 23435, requests: 654}
]

class Analysis extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      byTimeWidth: 0
    }

    this.measureContainers = this.measureContainers.bind(this)
  }
  componentDidMount() {
    this.measureContainers()
    window.addEventListener('resize', this.measureContainers)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers)
  }
  measureContainers() {
    this.setState({byTimeWidth: this.refs.byTimeHolder.clientWidth})
  }
  render() {
    return (
      <div className="analysis-container container">
        <h1 className="page-header">Analysis</h1>
        <div ref="byTimeHolder">
          <AnalysisByTime
            primaryData={fakeRecentData} secondaryData={fakeAverageData}
            width={this.state.byTimeWidth} height={this.state.byTimeWidth / 2} padding={20}/>
        </div>
      </div>
    );
  }
}

Analysis.displayName = 'Analysis'
Analysis.propTypes = {}

module.exports = Analysis
