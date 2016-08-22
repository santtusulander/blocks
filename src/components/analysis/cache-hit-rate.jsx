import React from 'react'
import { Col, Row } from 'react-bootstrap'
import numeral from 'numeral'
import moment from 'moment'
import Immutable from 'immutable'

import AnalysisStackedByTime from './stacked-by-time'
import AnalysisByTime from './by-time'
import TableSorter from '../table-sorter'
import {formatBytes} from '../../util/helpers'
import Select from '../select'

import './cache-hit-rate.scss'

class AnalysisCacheHitRate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stacksWidth: 100,
      sortBy: 'timestamp',
      sortDir: -1,
      sortFunc: '',
      chartType: 'area'
    }

    this.measureContainers = this.measureContainers.bind(this)
    this.changeSort = this.changeSort.bind(this)
    this.changeChartType = this.changeChartType.bind(this)
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
  changeChartType( value ) {
    this.setState({chartType: value})
  }
  render() {
    const stats = this.props.traffic.first() || Immutable.Map()

    let chart = null

    const detail = stats.get('detail') || Immutable.List()

    const details = detail.map(datapoint => {

      return {
        chit_ratio: datapoint.get('chit_ratio'),
        timestamp: datapoint.get('timestamp')
      }
    })

    let dataSets = [];
    dataSets.push( details.toJS() )

    if(this.state.chartType === 'column') {
      chart = (
        <AnalysisStackedByTime
          padding={40}
          dataKey='chit_ratio'
          dataSets={ dataSets }
          width={this.state.stacksWidth} height={this.state.stacksWidth / 3}/>
      )
    } else {

      chart = (

        <AnalysisByTime axes={true} padding={40}
          dataKey="chit_ratio"
          primaryData={ dataSets && dataSets[0] }
          primaryLabel='Cache Hit Ratio'
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
    const sortedStats = this.sortedData(detail, this.state.sortBy, this.state.sortDir)
    return (
      <div className="analysis-cache-hit-rate">
        <Row>
          <Col sm={8}>
            <h3>Cache Hit Rate By Day</h3>
          </Col>

          <Col sm={4}>
            <Select
              className='pull-right'
              options={ [{value: 'area', label: 'Area Chart'}, {value: 'column', label: 'Column Chart'}] }
              value={ this.state.chartType }
              onSelect= { this.changeChartType }
            />
          </Col>
        </Row>

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
              <TableSorter {...sorterProps} column="chit_ratio,percent_total" sortFunc="specific">
              Cache Hit Rate (%)
              </TableSorter>
            </tr>
          </thead>
          <tbody>
                {sortedStats.map((day, i) => {
                  return (
                    <tr key={i}>
                      <td>{moment(day.get('timestamp')).format('MM/DD/YYYY')}</td>
                      <td>{numeral(day.get('chit_ratio') / 100).format('0%')}</td>
                    </tr>
                  )
                })}
          </tbody>
        </table>
      </div>
    )
  }
}

AnalysisCacheHitRate.displayName = 'AnalysisCacheHitRate'
AnalysisCacheHitRate.propTypes = {
  fetching: React.PropTypes.bool,
  onOffNetChartType: React.PropTypes.string
}

AnalysisCacheHitRate.defaultProps = {
  cacheHitRateFilter: Immutable.Map(),
  traffic: Immutable.List()
}

module.exports = AnalysisCacheHitRate
