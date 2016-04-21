import React from 'react'
import { Col, Row } from 'react-bootstrap'
import numeral from 'numeral'
import moment from 'moment'
import Immutable from 'immutable'

import AnalysisStacked from './stacked'
import AnalysisByTime from './by-time'
import TableSorter from '../table-sorter'
import {formatBytes} from '../../util/helpers'

class AnalysisSPReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stacksWidth: 100,
      sortBy: 'timestamp',
      sortDir: -1,
      sortFunc: ''
    }

    this.measureContainers = this.measureContainers.bind(this)
    this.changeSort = this.changeSort.bind(this)
    this.sortedData = this.sortedData.bind(this)
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
      stacksWidth: this.refs.stacksHolder.clientWidth
    })
  }
  changeSort(column, direction, sortFunc) {
    this.setState({
      sortBy: column,
      sortDir: direction,
      sortFunc: sortFunc
    })
  }
  sortedData(data, sortBy, sortDir) {
    let sortFunc = ''
    if(this.state.sortFunc === 'specific' && sortBy.indexOf(',') > -1) {
      sortFunc = data.sort((a, b) => {
        sortBy = sortBy.toString().split(',')
        if(a.get(sortBy[0]).get(sortBy[1]) < b.get(sortBy[0]).get(sortBy[1])) {
          return -1 * sortDir
        }
        else if(a.get(sortBy[0]).get(sortBy[1]) > b.get(sortBy[0]).get(sortBy[1])) {
          return 1 * sortDir
        }
        return 0
      })
    } else {
      sortFunc = data.sort((a, b) => {
        if(a.get(sortBy) < b.get(sortBy)) {
          return -1 * sortDir
        }
        else if(a.get(sortBy) > b.get(sortBy)) {
          return 1 * sortDir
        }
        return 0
      })
    }
    return sortFunc
  }
  render() {
    const stats = this.props.serviceProviderStats
    const statsToday = this.props.serviceProviderStatsToday
    let chart = null
    if(this.props.spChartType === 'bar') {
      chart = (
        <AnalysisStacked padding={40}
          data={stats.get('detail').toJS()}
          width={this.state.stacksWidth} height={this.state.stacksWidth / 3}/>
      )
    }
    else {
      const onNet = stats.get('detail').toJS().map(datapoint => {
        return {
          bytes: datapoint.net_on.bytes,
          timestamp: datapoint.timestamp
        }
      })
      const offNet = stats.get('detail').toJS().map(datapoint => {
        return {
          bytes: datapoint.net_off.bytes,
          timestamp: datapoint.timestamp
        }
      })
      chart = (
        <AnalysisByTime axes={true} padding={40}
          dataKey="bytes"
          primaryData={onNet}
          secondaryData={offNet}
          primaryLabel='On Net'
          secondaryLabel='Off Net'
          yAxisCustomFormat={formatBytes}
          width={this.state.stacksWidth} height={this.state.stacksWidth / 3}/>
      )
    }
    const sorterProps = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }
    const sortedStats = this.sortedData(stats.get('detail'), this.state.sortBy, this.state.sortDir)
    return (
      <div className="analysis-traffic">
        <Row>
          <Col xs={12}>
            <div className="analysis-data-box">
              <h4>Traffic today</h4>
              <p>{formatBytes(statsToday.get('total'))}</p>
              <Row className="extra-margin-top">
                <Col xs={6}>
                  <h4>On-net</h4>
                  <p className="on-net">
                    {numeral(statsToday.get('net_on').get('percent_total')).format('0,0%')}
                  </p>
                </Col>
                <Col xs={6}>
                  <h4>Off-net</h4>
                  <p className="off-net">
                    {numeral(statsToday.get('net_off').get('percent_total')).format('0,0%')}
                  </p>
                </Col>
              </Row>
            </div>
            <div className="analysis-data-box">
              <h4>Traffic Month to Date</h4>
              <p>{formatBytes(stats.get('total'))}</p>
              <Row className="extra-margin-top">
                <Col xs={6}>
                  <h4>On-net</h4>
                  <p className="on-net">
                    {numeral(stats.get('net_on').get('percent_total')).format('0,0%')}
                  </p>
                </Col>
                <Col xs={6}>
                  <h4>Off-net</h4>
                  <p className="off-net">
                    {numeral(stats.get('net_off').get('percent_total')).format('0,0%')}
                  </p>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <h3>SERVICE PROVIDER ON/OFF NET</h3>
        <div ref="stacksHolder">
          {this.props.fetching ?
            <div>Loading...</div> : chart}
        </div>
        <table className="table table-striped table-analysis extra-margin-top">
          <thead>
            <tr>
              <TableSorter {...sorterProps} column="timestamp">
                Date
              </TableSorter>
              <TableSorter {...sorterProps} column="net_on,bytes" sortFunc="specific">
                On-Net in bytes
              </TableSorter>
              <TableSorter {...sorterProps} column="net_on,percent_total" sortFunc="specific">
                On-Net in %
              </TableSorter>
              <TableSorter {...sorterProps} column="net_off,bytes" sortFunc="specific">
                Off-Net in bytes
              </TableSorter>
              <TableSorter {...sorterProps} column="net_off,percent_total" sortFunc="specific">
                Off-Net in %
              </TableSorter>
              <TableSorter {...sorterProps} column="total">
                Total in bytes
              </TableSorter>
            </tr>
          </thead>
          <tbody>
            {sortedStats.map((day, i) => {
              return (
                <tr key={i}>
                  <td>{moment(day.get('timestamp')).format('MM/DD/YYYY')}</td>
                  <td>{formatBytes(day.get('net_on').get('bytes'))}</td>
                  <td>{numeral(day.get('net_on').get('percent_total')).format('0%')}</td>
                  <td>{formatBytes(day.get('net_off').get('bytes'))}</td>
                  <td>{numeral(day.get('net_off').get('percent_total')).format('0%')}</td>
                  <td>{formatBytes(day.get('total'))}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

AnalysisSPReport.displayName = 'AnalysisSPReport'
AnalysisSPReport.propTypes = {
  fetching: React.PropTypes.bool,
  serviceProviderStats: React.PropTypes.instanceOf(Immutable.Map),
  serviceProviderStatsToday: React.PropTypes.instanceOf(Immutable.Map),
  spChartType: React.PropTypes.string
}

module.exports = AnalysisSPReport
