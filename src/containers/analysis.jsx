import React from 'react'
import Immutable from 'immutable'

import AnalysisByTime from '../components/analysis/by-time'
import AnalysisByLocation from '../components/analysis/by-location'

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

const fakeCountryData = Immutable.fromJS([
  {id: 'usa', trending: -1},
  {id: 'can', trending: 1},
  {id: 'mex', trending: 0},
  {id: 'aus', trending: 0},
  {id: 'bra', trending: -1},
  {id: 'rus', trending: 1}
])

const fakeStateData = Immutable.fromJS([
  {id: 'Alabama', trending: -1},
  {id: 'Alaska', trending: 1},
  {id: 'Arkansas', trending: 0},
  {id: 'Arizona', trending: -1},
  {id: 'California', trending: -1},
  {id: 'Connecticut', trending: 0},
  {id: 'Delaware', trending: -1},
  {id: 'Florida', trending: 1},
  {id: 'Georgia', trending: 1},
  {id: 'Oregon', trending: -1},
  {id: 'Michigan', trending: -1},
  {id: 'Nevada', trending: 0},
  {id: 'Utah', trending: 1}
])

const fakeCityData = Immutable.fromJS([
  {name: 'Atlanta', state: 'Georgia', trending: 1},
  {name: 'Savannah', state: 'Georgia', trending: 0},
  {name: 'San Francisco', state: 'California', trending: 1},
  {name: 'Sacramento', state: 'California', trending: -1},
  {name: 'San Bernardino', state: 'California', trending: 0},
  {name: 'Los Angeles', state: 'California', trending: 1},
  {name: 'San Diego', state: 'California', trending: 0}
])

class Analysis extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      byLocationWidth: 0,
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
    this.setState({
      byLocationWidth: this.refs.byLocationHolder.clientWidth,
      byTimeWidth: this.refs.byTimeHolder.clientWidth
    })
  }
  render() {
    return (
      <div className="analysis-container container">
        <h1 className="page-header">Analysis</h1>
        <div ref="byLocationHolder">
          <AnalysisByLocation padding={20}
            width={this.state.byLocationWidth}
            height={this.state.byLocationWidth / 2}
            countryData={fakeCountryData}
            stateData={fakeStateData}
            cityData={fakeCityData}/>
        </div>
        <div ref="byTimeHolder">
          <AnalysisByTime axes={true} padding={20}
            primaryData={fakeRecentData} secondaryData={fakeAverageData}
            width={this.state.byTimeWidth} height={this.state.byTimeWidth / 2}/>
        </div>
      </div>
    );
  }
}

Analysis.displayName = 'Analysis'
Analysis.propTypes = {}

module.exports = Analysis
