import React from 'react'
import { Col, Row } from 'react-bootstrap'
import numeral from 'numeral'
import moment from 'moment'
import Immutable from 'immutable'
import {FormattedMessage} from 'react-intl'

import SectionHeader from '../layout/section-header'
import SectionContainer from '../layout/section-container'
import AnalysisStackedByTime from './stacked-by-time'
import AnalysisByTime from './by-time'
import TableSorter from '../table-sorter'
import LoadingSpinner from '../loading-spinner/loading-spinner'
import {formatBytes} from '../../util/helpers'
import { paleblue } from '../../constants/colors'
import {getTrafficByDateRangeLabel} from './helpers'

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

    this.measureContainersTimeout = null
  }
  componentDidMount() {
    this.measureContainers()
    // TODO: remove this timeout as part of UDNP-1426
    this.measureContainersTimeout = setTimeout(() => {this.measureContainers()}, 500)
    window.addEventListener('resize', this.measureContainers)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers)
    clearTimeout(this.measureContainersTimeout)
  }
  measureContainers() {
    this.setState({
      stacksWidth: this.refs.stacksHolder && this.refs.stacksHolder.clientWidth
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
    if ( this.props.onOffFilter.contains('on') ) {
      dataSets.push( onNet.toJS() )
    } else {
      dataSets.push( [] )
    }

    if ( this.props.onOffFilter.contains('off') ) {
      dataSets.push( offNet.toJS() )
    }

    const datasets = []
    if(this.props.onOffFilter.contains('on') && onNet) {
      datasets.push({
        area: false,
        color: paleblue,
        comparisonData: false,
        data: onNet.toJS(),
        id: '',
        label: this.props.intl.formatMessage({id: 'portal.analytics.onOffNet.primaryLabel.text'}),
        line: true,
        stackedAgainst: false,
        xAxisFormatter: false
      })
    }
    if(this.props.onOffFilter.contains('off') && offNet) {
      datasets.push({
        area: false,
        color: 'yellow',
        comparisonData: false,
        data: offNet.toJS(),
        id: '',
        label: this.props.intl.formatMessage({id: 'portal.analytics.onOffNet.secondaryLabel.text'}),
        line: true,
        stackedAgainst: false,
        xAxisFormatter: false
      })
    }

    if (this.props.onOffNetChartType === 'bar') {
      chart = (
        <AnalysisStackedByTime padding={40}
          dataKey="bytes"
          dataSets={dataSets}
          width={this.state.stacksWidth} height={this.state.stacksWidth / 3}
          yAxisCustomFormat={formatBytes}/>
      )
    } else {
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

    /* Get values for KPIs */
    const dataKey = this.props.onOffFilter.get(0) === 'off' ? 'net_off' : 'net_on'
    const trafficToday = this.props.onOffFilter.contains('on') && this.props.onOffFilter.contains('off')
      ? statsToday.get('total')
      : statsToday.getIn([ dataKey, 'bytes'] )

    const totalTrafficByDateRange = this.props.onOffFilter.contains('on') && this.props.onOffFilter.contains('off')
      ? stats.get('total')
      : stats.getIn([ dataKey, 'bytes'] )

    const trafficByDateRangeLabel = getTrafficByDateRangeLabel( this.props.dateRange, this.props.dateRangeLabel, this.props.intl.formatMessage)

    return (
      <div>
        <SectionContainer>
          <Row>
            <Col xs={12}>
              {/* KPI Traffic Today */}
              <div className="analysis-data-box">
                <h4><FormattedMessage id='portal.analytics.onOffNet.trafficToday.label' /></h4>
                <p>{formatBytes(trafficToday)}</p>
                <Row className="extra-margin-top">
                {this.props.onOffFilter.contains('on') &&
                  <Col xs={6}>
                    <h4>On-net</h4>
                    <p className="on-net">
                      {numeral(statsToday.getIn(['net_on', 'percent_total'])).format('0,0%')}
                    </p>
                  </Col>
                }
                {this.props.onOffFilter.contains('off') &&
                  <Col xs={6}>
                    <h4>Off-net</h4>
                    <p className="off-net">
                      {numeral(statsToday.getIn(['net_off', 'percent_total'])).format('0,0%')}
                    </p>
                  </Col>
                }
                </Row>
              </div>
              {/* KPI Traffic By Date Range */}
              <div className="analysis-data-box">
                <h4><FormattedMessage id='portal.analytics.onOffNet.traffic.label' /> {trafficByDateRangeLabel}</h4>
                <p>{formatBytes(totalTrafficByDateRange)}</p>
                <Row className="extra-margin-top">
                {this.props.onOffFilter.contains('on') &&
                  <Col xs={6}>
                    <h4>On-net</h4>
                    <p className="on-net">
                        {numeral(stats.getIn(['net_on', 'percent_total'])).format('0,0%')}
                    </p>
                  </Col>
                }
                {this.props.onOffFilter.contains('off') &&
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
        </SectionContainer>

        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.analytics.onOffNet.text"/>} />
        <SectionContainer>
          <div ref="stacksHolder">
            {this.props.fetching
              ? <LoadingSpinner/>
              : (datasets.length ? chart : <h4><FormattedMessage id="portal.common.no-data.text" /></h4>)}
          </div>
        </SectionContainer>

        <SectionContainer>
          {datasets.length &&
            <table className="table table-striped table-analysis">
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
          }
        </SectionContainer>
      </div>
    )
  }
}

AnalysisOnOffNetReport.displayName = 'AnalysisOnOffNetReport'
AnalysisOnOffNetReport.propTypes = {
  dateRange: React.PropTypes.instanceOf(Immutable.Map),
  dateRangeLabel: React.PropTypes.string,
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
  onOffFilter: Immutable.List()
}

module.exports = injectIntl(AnalysisOnOffNetReport)
