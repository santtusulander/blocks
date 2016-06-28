import React from 'react'
import moment from 'moment'
import Immutable from 'immutable'
import { Col, Row } from 'react-bootstrap'

import AnalysisByTime from './by-time'
import AnalysisByLocation from './by-location'
import TableSorter from '../table-sorter'
import { formatBitsPerSecond } from '../../util/helpers'

class AnalysisTraffic extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      byLocationWidth: 100,
      byTimeWidth: 100,
      sortBy: 'average_bits_per_second',
      sortDir: -1
    }

    this.measureContainers = this.measureContainers.bind(this)
    this.changeSort        = this.changeSort.bind(this)
    this.sortedData        = this.sortedData.bind(this)
  }

  componentDidMount() {
    this.measureContainers()
    setTimeout(() => {this.measureContainers()}, 500)
    window.addEventListener('resize', this.measureContainers)
  }

  componentWillReceiveProps() {
    setTimeout(() => {this.measureContainers()}, 500)
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

  changeSort(column, direction) {
    this.setState({
      sortBy: column,
      sortDir: direction
    })
  }

  sortedData(data, sortBy, sortDir) {
    return data.sort((a, b) => {
      if(a.get(sortBy) < b.get(sortBy)) {
        return -1 * sortDir
      }
      else if(a.get(sortBy) > b.get(sortBy)) {
        return 1 * sortDir
      }
      return 0
    })
  }

  render() {
    const httpData    = this.props.serviceTypes.includes('http') ?
      this.props.byTime.filter(time => time.get('service_type') === 'http')
      : Immutable.List()
    const httpsData   = this.props.serviceTypes.includes('https') ?
      this.props.byTime.filter(time => time.get('service_type') === 'https')
      : Immutable.List()
    const sorterProps = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }

    const bandWithData = () => {

      let peak = Math.max(Math.max.apply(Math, httpData.toJS().map((data) => data.bits_per_second || 0)), Math.max.apply(Math, httpsData.toJS().map((data) => data.bits_per_second || 0)))
      let low  = Math.min(Math.min.apply(Math, httpData.toJS().map((data) => (data.bits_per_second && data.bits_per_second > 0) ? data.bits_per_second : Infinity)), Math.min.apply(Math, httpsData.toJS().map((data) => (data.bits_per_second && data.bits_per_second > 0) ? data.bits_per_second : Infinity)))

      return {
        peak: isFinite(peak) ? peak : 0,
        low: isFinite(low) ? low : 0,
        average: (peak + low) / 2
      }
    }

    const sortedCountries = this.sortedData(this.props.byCountry, this.state.sortBy, this.state.sortDir)
    return (
      <div className="analysis-traffic">
        {/*<div className="analysis-data-box">
         <h4>Total Egress Yesterday</h4>
         <p>{formatBytes(this.props.totalEgress)}</p>
         </div>*/}
        <h3>BANDWIDTH {this.props.dateRange.toUpperCase()}</h3>
        <div className="analysis-data-box wide">
          {(bandWithData().peak + bandWithData().low + bandWithData().average) > 0 ?
            <Row>
              <Col xs={4} className="right-separator">
                <h4>Peak</h4>
                {!this.props.fetching &&
                <p>{formatBitsPerSecond(bandWithData().peak, 2)}</p>
                }
              </Col>
              <Col xs={4} className="right-separator">
                <h4>Average</h4>
                {!this.props.fetching &&
                <p>{formatBitsPerSecond(bandWithData().average, 2)}</p>
                }
              </Col>
              <Col xs={4}>
                <h4>Low</h4>
                {!this.props.fetching &&
                <p>{formatBitsPerSecond(bandWithData().low, 2)}</p>
                }
              </Col>
            </Row>
            : <p>No data found</p>}
        </div>
        <h3>TRANSFER BY TIME</h3>
        <div ref="byTimeHolder" className="transfer-by-time">
          {this.props.fetching ?
            <div>Loading...</div> :
            <AnalysisByTime axes={true} padding={40}
                            dataKey="bits_per_second"
                            primaryData={httpData.toJS()}
                            secondaryData={httpsData.toJS()}
                            primaryLabel='HTTP'
                            secondaryLabel='HTTPS'
                            stacked={true}
                            showLegend={true}
                            showTooltip={false}
                            yAxisCustomFormat={formatBitsPerSecond}
                            width={this.state.byTimeWidth} height={this.state.byTimeWidth / 2.5}/>
          }
        </div>
        <h3>BY GEOGRAPHY</h3>
        <div ref="byLocationHolder">
          {this.props.fetching ?
            <div>Loading...</div> :
            <AnalysisByLocation
              dataKey="average_bits_per_second"
              tooltipCustomFormat={formatBitsPerSecond}
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
            <TableSorter {...sorterProps} column="name">
              Country
            </TableSorter>
            <TableSorter {...sorterProps} column="average_bits_per_second">
              Bandwidth
            </TableSorter>
            <th className="text-center">Period Trend</th>
          </tr>
          </thead>
          <tbody>
          {!this.props.fetching ? sortedCountries.map((country, i) => {
            return (
              <tr key={i}>
                <td>{country.get('name')}</td>
                <td>{formatBitsPerSecond(country.get('average_bits_per_second'))}</td>
                <td width={this.state.byTimeWidth / 2}>
                  <AnalysisByTime axes={false} padding={0} area={false}
                                  primaryData={country.get('detail').map(datapoint => {
                        return datapoint.set(
                          'timestamp',
                          moment(datapoint.get('timestamp'), 'X').toDate()
                        )
                      }).toJS()}
                                  dataKey='bits_per_second'
                                  showTooltip={true}
                                  width={this.state.byTimeWidth / 2}
                                  height={50}/>
                </td>
              </tr>
            )
          }) : <tr>
            <td colSpan="3">Loading...</td>
          </tr>}
          </tbody>
        </table>
      </div>
    )
  }
}

AnalysisTraffic.displayName = 'AnalysisTraffic'
AnalysisTraffic.propTypes   = {
  avgTraffic: React.PropTypes.string,
  byCountry: React.PropTypes.instanceOf(Immutable.List),
  byTime: React.PropTypes.instanceOf(Immutable.List),
  dateRange: React.PropTypes.string,
  fetching: React.PropTypes.bool,
  lowTraffic: React.PropTypes.string,
  peakTraffic: React.PropTypes.string,
  serviceTypes: React.PropTypes.instanceOf(Immutable.List),
  totalEgress: React.PropTypes.number
}

AnalysisTraffic.defaultProps = {
  byCountry: Immutable.List(),
  byTime: Immutable.List(),
  serviceTypes: Immutable.List()
}

module.exports = AnalysisTraffic
