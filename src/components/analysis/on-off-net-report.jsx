import React from 'react'
import { Col, Row } from 'react-bootstrap'
import numeral from 'numeral'
import moment from 'moment'
import Immutable from 'immutable'

import AnalysisStackedByTime from './stacked-by-time'
import AnalysisByTime from './by-time'
import TableSorter from '../table-sorter'
import {formatBytes} from '../../util/helpers'
import { paleblue } from '../../constants/colors'

import {injectIntl} from 'react-intl'

class AnalysisOnOffNetReport extends React.Component {
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

        const lhs = a.get(sortBy[0])
        const rhs = b.get(sortBy[0])

        // the following conditionals handle cases where a & b contain null data
        if (!lhs && rhs) { return -1 * sortDir }
        if (lhs && !rhs) { return 1 * sortDir }
        if (lhs && rhs) {
          if (lhs.get(sortBy[1]) < rhs.get(sortBy[1])) {
            return -1 * sortDir
          } else if(lhs.get(sortBy[1]) > rhs.get(sortBy[1])) {
            return 1 * sortDir
          }
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
    const stats = this.props.onOffStats
    const statsToday = this.props.onOffStatsToday

    let chart = null
    const onNet = stats.get('detail').map(datapoint => {

      return {
        bytes: datapoint.getIn(['net_on' , 'bytes']) || 0,
        timestamp: datapoint.get('timestamp')
      }
    })

    const offNet = stats.get('detail').map(datapoint => {
      return {
        bytes: datapoint.getIn(['net_off' , 'bytes']) || 0,
        timestamp: datapoint.get('timestamp')
      }
    })

    let dataSets = [];
    if ( this.props.onOffFilter.contains('on-net') ) {
      dataSets.push( onNet.toJS() )
    } else {
      dataSets.push( [] )
    }

    if ( this.props.onOffFilter.contains('off-net') ) {
      dataSets.push( offNet.toJS() )
    }

    const datasets = []
    if(this.props.onOffFilter.contains('on-net') && onNet) {
      datasets.push({
        area: false,
        color: paleblue,
        comparisonData: false,
        data: onNet.toJS(),
        id: '',
        label: this.props.intl.formatMessage({id: 'portal.analytics.onOfNet.primaryLabel.text'}),
        line: true,
        stackedAgainst: false,
        xAxisFormatter: false
      })
    }
    if(this.props.onOffFilter.contains('off-net') && offNet) {
      datasets.push({
        area: false,
        color: 'yellow',
        comparisonData: false,
        data: offNet.toJS(),
        id: '',
        label: this.props.intl.formatMessage({id: 'portal.analytics.onOfNet.secondaryLabel.text'}),
        line: true,
        stackedAgainst: false,
        xAxisFormatter: false
      })
    }

    if(this.props.onOffNetChartType === 'bar') {
      chart = (
        <AnalysisStackedByTime padding={40}
          dataKey="bytes"
          dataSets={dataSets}
          width={this.state.stacksWidth} height={this.state.stacksWidth / 3}
          yAxisCustomFormat={formatBytes}/>
      )
    }
    else {
      chart = (
        <AnalysisByTime axes={true} padding={40}
          dataKey="bytes"
          dataSets={datasets}
          yAxisCustomFormat={(val, setMax) => formatBytes(val, false, setMax)}
          width={this.state.stacksWidth} height={this.state.stacksWidth / 3}
          showLegend={true}
          showTooltip={false}
        />
      )
    }
    const sorterProps = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }
    const sortedStats = this.sortedData(stats.get('detail'), this.state.sortBy, this.state.sortDir)
    return (
      <div className="analysis-on-off-net-report">
        <Row>
          <Col xs={12}>
            <div className="analysis-data-box">
              <h4>Traffic today</h4>
              <p>{formatBytes(statsToday.get('total'))}</p>
              <Row className="extra-margin-top">
              {this.props.onOffFilter.contains('on-net') &&
                <Col xs={6}>
                  <h4>On-net</h4>
                  <p className="on-net">
                    {numeral(statsToday.getIn(['net_on', 'percent_total'])).format('0,0%')}
                  </p>
                </Col>
              }
              {this.props.onOffFilter.contains('off-net') &&
                <Col xs={6}>
                  <h4>Off-net</h4>
                  <p className="off-net">
                    {numeral(statsToday.getIn(['net_off', 'percent_total'])).format('0,0%')}
                  </p>
                </Col>
              }
              </Row>
            </div>
            <div className="analysis-data-box">
              <h4>Traffic Month to Date</h4>
              <p>{formatBytes(stats.get('total'))}</p>
              <Row className="extra-margin-top">
              {this.props.onOffFilter.contains('on-net') &&
                <Col xs={6}>
                  <h4>On-net</h4>
                  <p className="on-net">
                      {numeral(stats.getIn(['net_on', 'percent_total'])).format('0,0%')}
                  </p>
                </Col>
              }
              {this.props.onOffFilter.contains('off-net') &&
                <Col xs={6}>
                  <h4>Off-net</h4>
                  <p className="off-net">
                      {numeral(stats.getIn(['net_off', 'percent_total'])).format('0,0%')}
                  </p>
                </Col>
              }
              </Row>
            </div>
          </Col>
        </Row>
        <h3>ON/OFF NET</h3>
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
                On Net (Bytes)
              </TableSorter>
              <TableSorter {...sorterProps} column="net_on,percent_total" sortFunc="specific">
                On Net (%)
              </TableSorter>
              <TableSorter {...sorterProps} column="net_off,bytes" sortFunc="specific">
                Off Net (Bytes)
              </TableSorter>
              <TableSorter {...sorterProps} column="net_off,percent_total" sortFunc="specific">
                Off Net (%)
              </TableSorter>
              <TableSorter {...sorterProps} column="total">
                Total (Bytes)
              </TableSorter>
            </tr>
          </thead>
          <tbody>
            {sortedStats.map((day, i) => {
              return (
                <tr key={i}>
                  <td>{moment(day.get('timestamp')).format('MM/DD/YYYY')}</td>
                  <td>{formatBytes(day.getIn(['net_on','bytes']))}</td>
                  <td>{numeral(day.getIn(['net_on','percent_total'])).format('0%')}</td>
                  <td>{formatBytes(day.getIn(['net_off','bytes']))}</td>
                  <td>{numeral(day.getIn(['net_off', 'percent_total'])).format('0%')}</td>
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

AnalysisOnOffNetReport.displayName = 'AnalysisOnOffNetReport'
AnalysisOnOffNetReport.propTypes = {
  fetching: React.PropTypes.bool,
  intl: React.PropTypes.object,
  onOffFilter: React.PropTypes.instanceOf(Immutable.List),
  onOffNetChartType: React.PropTypes.string,
  onOffStats: React.PropTypes.instanceOf(Immutable.Map),
  onOffStatsToday: React.PropTypes.instanceOf(Immutable.Map)
}

AnalysisOnOffNetReport.defaultProps = {
  onOffStats: Immutable.Map(),
  onOffStatsToday: Immutable.Map(),
  onOffFilter: Immutable.Map()
}

module.exports = injectIntl(AnalysisOnOffNetReport)
