import React from 'react'
import numeral from 'numeral'
import moment from 'moment'
import Immutable from 'immutable'

import AnalysisStacked from './stacked'
import AnalysisByTime from './by-time'
import TableSorter from '../table-sorter'
import {formatBytes} from '../../util/helpers'

class AnalysisServiceProviders extends React.Component {
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
    const {stats} = this.props
    let chart = null
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
    if(this.props.chartType === 'bar') {
      chart = (
        <AnalysisStacked padding={40}
          dataSets={[onNet, offNet]}
          width={this.state.stacksWidth} height={this.state.stacksWidth / 3}/>
      )
    }
    else {
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
        <h3>TOTAL TRAFFIC BY SERVICE PROVIDER</h3>
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

AnalysisServiceProviders.displayName = 'AnalysisServiceProviders'
AnalysisServiceProviders.propTypes = {
  chartType: React.PropTypes.string,
  fetching: React.PropTypes.bool,
  stats: React.PropTypes.instanceOf(Immutable.Map)
}
AnalysisServiceProviders.defaultProps = {
  stats: Immutable.Map()
}

module.exports = AnalysisServiceProviders
