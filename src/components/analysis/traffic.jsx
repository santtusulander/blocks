import React from 'react'
import numeral from 'numeral'
import moment from 'moment'
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
    const httpData = this.props.serviceTypes.includes('http') ?
      this.props.byTime.filter(time => time.get('service_type') === 'http')
      : Immutable.List()
    const httpsData = this.props.serviceTypes.includes('https') ?
      this.props.byTime.filter(time => time.get('service_type') === 'https')
      : Immutable.List()
    return (
      <div className="analysis-traffic">
        <div className="total-egress">
          <h4>Total Egress Yesterday</h4>
          <p>{Math.floor(this.props.totalEgress / 1000000)} GB</p>
        </div>
        <h3>TRANSFER BY TIME</h3>
        <div ref="byTimeHolder">
          {this.props.fetching ?
            <div>Loading...</div> :
            <AnalysisByTime axes={true} padding={40}
              dataKey="bytes"
              primaryData={httpData.toJS()}
              secondaryData={httpsData.toJS()}
              width={this.state.byTimeWidth} height={this.state.byTimeWidth / 3}/>
            }
        </div>
        <h3>BY GEOGRAPHY</h3>
        <div ref="byLocationHolder">
          {this.props.fetching ?
            <div>Loading...</div> :
            <AnalysisByLocation
              dataKey="bytes"
              timelineKey="detail"
              width={this.state.byLocationWidth}
              height={this.state.byLocationWidth / 1.6}
              countryData={this.props.byCountry}/>
          }
        </div>
        <h3>BY COUNTRY</h3>
        <table className="table by-country-table">
          <thead>
            <tr>
              <th>Country</th>
              <th>Traffic</th>
              <th>% of Traffic</th>
              <th width="300">Period Trend</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {this.props.byCountry.map((country, i) => {
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
              let formattedBytes = numeral(totalBytes / 100000000).format('0,0')+' GB'
              if(totalBytes < 1000) {
                formattedBytes = numeral(totalBytes).format('0,0')+' B'

              }
              else if(totalBytes < 1000000) {
                formattedBytes = numeral(totalBytes / 1000).format('0,0')+' KB'

              }
              else if(totalBytes < 100000000) {
                formattedBytes = numeral(totalBytes / 1000000).format('0,0')+' MB'

              }
              return (
                <tr key={i}>
                  <td>{country.get('name')}</td>
                  <td>{formattedBytes}</td>
                  <td>{numeral(country.get('percent_total')).format('0%')}</td>
                  <td width="300">
                    <AnalysisByTime axes={false} padding={0}
                      primaryData={country.get('detail').map(datapoint => {
                        return datapoint.set(
                          'timestamp',
                          moment(datapoint.get('timestamp'), 'X').toDate()
                        )
                      }).toJS()}
                      dataKey='bytes'
                      width={300}
                      height={50} />
                  </td>
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
  fetching: React.PropTypes.bool,
  serviceTypes: React.PropTypes.instanceOf(Immutable.List),
  totalEgress: React.PropTypes.number
}

module.exports = AnalysisTraffic
