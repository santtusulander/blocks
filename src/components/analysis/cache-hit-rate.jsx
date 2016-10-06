import React from 'react'
import numeral from 'numeral'
import moment from 'moment'
import Immutable from 'immutable'
import {FormattedMessage} from 'react-intl'

import SectionHeader from '../layout/section-header'
import SectionContainer from '../layout/section-container'
import AnalysisStackedByTime from './stacked-by-time'
import AnalysisByTime from './by-time'
import TableSorter from '../table-sorter'
import { paleblue } from '../../constants/colors'
// import Select from '../select'

class AnalysisCacheHitRate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stacksWidth: 100,
      sortBy: 'timestamp',
      sortDir: -1,
      sortFunc: '',
      chartType: 'column'
    }

    this.measureContainers = this.measureContainers.bind(this)
    this.changeSort = this.changeSort.bind(this)
    this.changeChartType = this.changeChartType.bind(this)
    this.sortedData = this.sortedData.bind(this)

    this.measureContainersTimeout = null
  }
  componentDidMount() {
    this.measureContainers()
    this.measureContainersTimeout = setTimeout(() => {this.measureContainers()}, 500)
    window.addEventListener('resize', this.measureContainers)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers)
    clearTimeout(this.measureContainersTimeout)
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
          dontShowHours={true}
          dataKey='chit_ratio'
          dataSets={dataSets}
          width={this.state.stacksWidth} height={this.state.stacksWidth / 3}/>
      )
    } else {
      const datasets = []
      if(dataSets) {
        datasets.push({
          area: false,
          color: paleblue,
          comparisonData: false,
          data: dataSets[0],
          id: 'http',
          label: 'Cache Hit Ratio',
          line: true,
          stackedAgainst: false,
          xAxisFormatter: false
        })
      }
      chart = (
        <AnalysisByTime
          axes={true}
          dataKey="chit_ratio"
          dataSets={datasets}
          padding={40}
          showLegend={true}
          showTooltip={false}
          width={this.state.stacksWidth} height={this.state.stacksWidth / 3}/>
      )
    }
    const sorterProps = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }
    const sortedStats = this.sortedData(detail, this.state.sortBy, this.state.sortDir)
    return (
      <div>
        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.analytics.cacheHitRateByDay.text"/>}>
          {/* Disabled as part of UDNP-1531
          <Select
            className='pull-right'
            options={[{value: 'column', label: 'Column Chart'}]}
            value={this.state.chartType}
            onSelect= {this.changeChartType}
          />
          */}
        </SectionHeader>

        <SectionContainer>
          <div ref="stacksHolder">
            {this.props.fetching ?
              <div>Loading...</div> : chart}
          </div>
        </SectionContainer>

        <SectionContainer>
          <table className="table table-striped table-analysis">
            <thead>
              <tr>
                <TableSorter {...sorterProps} column="timestamp">
                Date
                </TableSorter>
                <TableSorter {...sorterProps} column="chit_ratio">
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
        </SectionContainer>
      </div>
    )
  }
}

AnalysisCacheHitRate.displayName = 'AnalysisCacheHitRate'
AnalysisCacheHitRate.propTypes = {
  fetching: React.PropTypes.bool,
  onOffNetChartType: React.PropTypes.string,
  traffic: React.PropTypes.instanceOf(Immutable.List)
}

AnalysisCacheHitRate.defaultProps = {
  cacheHitRateFilter: Immutable.Map(),
  traffic: Immutable.List()
}

module.exports = AnalysisCacheHitRate
