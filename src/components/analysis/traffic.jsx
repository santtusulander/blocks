import React from 'react'
import numeral from 'numeral'
import Immutable from 'immutable'

import AnalysisByTime from './by-time'
import AnalysisByLocation from './by-location'

class AnalysisTraffic extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      byLocationWidth: 100,
      byTimeWidth: 100
    }

    this.measureContainers = this.measureContainers.bind(this)
  }
  componentDidMount() {
    this.measureContainers()
    setTimeout(() => {this.measureContainers()}, 500)
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
      <div className="analysis-traffic">
        <div className="total-egress">
          <h4>Total Egress Yesterday</h4>
          <p>43,200 GB</p>
        </div>
        <h3>TRANSFER BY TIME</h3>
        <div ref="byTimeHolder">
          {this.props.fetching ?
            <div>Loading...</div> :
            <AnalysisByTime axes={true} padding={40}
              dataKey="bytes"
              data={this.props.byTime.toJS()}
              width={this.state.byTimeWidth} height={this.state.byTimeWidth / 2}/>
            }
        </div>
        <h3>BY GEOGRAPHY</h3>
        <div ref="byLocationHolder">
          {this.props.fetching ?
            <div>Loading...</div> :
            <AnalysisByLocation
              dataKey="bytes"
              timelineKey="traffic"
              width={this.state.byLocationWidth}
              height={this.state.byLocationWidth / 2}
              countryData={this.props.byCountry}/>
          }
        </div>
        <h3>BY COUNTRY</h3>
        <table className="table by-country-table">
          <thead>
            <tr>
              <th>Country</th>
              <th>Traffic GB</th>
              <th>% of Traffic</th>
              <th>Period Trend</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {this.props.byCountry.map((country, i) => {
              const totalBytes = country.get('traffic').reduce((total, traffic) => {
                return total + traffic.get('bytes')
              }, 0)
              const startBytes = country.get('traffic').first().get('bytes')
              const endBytes = country.get('traffic').last().get('bytes')
              let trending = startBytes / endBytes
              if(trending > 1) {
                trending = numeral((trending - 1) * -1).format('0%')
              }
              else {
                trending = numeral(trending).format('+0%');
              }
              return (
                <tr key={i}>
                  <td>{country.get('country')}</td>
                  <td>{numeral(totalBytes).format('0,0')}</td>
                  <td>{country.get('percent_total')}%</td>
                  <td>Chart</td>
                  <td>{trending}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

AnalysisTraffic.displayName = 'AnalysisTraffic'
AnalysisTraffic.propTypes = {
  byCountry: React.PropTypes.instanceOf(Immutable.List),
  byTime: React.PropTypes.instanceOf(Immutable.List),
  fetching: React.PropTypes.bool
}

module.exports = AnalysisTraffic
