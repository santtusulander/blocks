import React from 'react'
import numeral from 'numeral'
import moment from 'moment'
import Immutable from 'immutable'

import AnalysisByTime from './by-time'
import AnalysisByLocation from './by-location'
import {formatBytes} from '../../util/helpers'
import {formatBitsPerSecond} from '../../util/helpers'

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
    const httpData = this.props.serviceTypes.includes('http') ?
      this.props.byTime.filter(time => time.get('service_type') === 'http')
      : Immutable.List()
    const httpsData = this.props.serviceTypes.includes('https') ?
      this.props.byTime.filter(time => time.get('service_type') === 'https')
      : Immutable.List()
    return (
      <div className="analysis-traffic">
        <div className="analysis-data-box">
          <h4>Total Egress Yesterday</h4>
          <p>{formatBytes(this.props.totalEgress)}</p>
        </div>
        <h3>TRANSFER BY TIME</h3>
        <div ref="byTimeHolder">
          {this.props.fetching ?
            <div>Loading...</div> :
            <AnalysisByTime axes={true} padding={40}
              dataKey="bits_per_second"
              primaryData={httpData.toJS()}
              secondaryData={httpsData.toJS()}
              primaryLabel='HTTP'
              secondaryLabel='HTTPS'
              yAxisCustomFormat={formatBitsPerSecond}
              width={this.state.byTimeWidth} height={this.state.byTimeWidth / 2.5}/>
            }
        </div>
        <h3>BY GEOGRAPHY</h3>
        <div ref="byLocationHolder">
          {this.props.fetching ?
            <div>Loading...</div> :
            <AnalysisByLocation
              timelineKey="detail"
              width={this.state.byLocationWidth}
              height={this.state.byLocationWidth / 1.6}
              countryData={this.props.byCountry}/>
          }
        </div>
        <h3>BY COUNTRY</h3>
        <table className="table table-striped table-analysis by-country-table">
          <thead>
            <tr>
              <th>Country</th>
              <th>Traffic</th>
              <th>% of Traffic</th>
              <th className="text-center">Period Trend</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {!this.props.fetching ? this.props.byCountry.map((country, i) => {
              const totalBytes = country.get('detail').reduce((total, traffic) => {
                return total + traffic.get('bytes')
              }, 0)
              const startBytes = country.get('detail').first().get('bytes')
              const endBytes = country.get('detail').last().get('bytes')
              let trending = startBytes / endBytes
              if(isNaN(trending)) {
                trending = 'N/A'
              }
              else if(trending > 1) {
                trending = numeral((trending - 1) * -1).format('0%')
              }
              else {
                trending = numeral(trending).format('+0%');
              }
              return (
                <tr key={i}>
                  <td>{country.get('name')}</td>
                  <td>{formatBytes(totalBytes)}</td>
                  <td>{numeral(country.get('percent_total')).format('0%')}</td>
                  <td width={this.state.byTimeWidth / 3}>
                    <AnalysisByTime axes={false} padding={0} area={false}
                      primaryData={country.get('detail').map(datapoint => {
                        return datapoint.set(
                          'timestamp',
                          moment(datapoint.get('timestamp'), 'X').toDate()
                        )
                      }).toJS()}
                      dataKey='bytes'
                      width={this.state.byTimeWidth / 3}
                      height={50} />
                  </td>
                  <td>{trending}</td>
                </tr>
              )
            }) : <tr><td colSpan="5">Loading...</td></tr>}
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
  fetching: React.PropTypes.bool,
  serviceTypes: React.PropTypes.instanceOf(Immutable.List),
  totalEgress: React.PropTypes.number
}

module.exports = AnalysisTraffic
