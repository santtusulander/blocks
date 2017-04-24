import React from 'react'
import numeral from 'numeral'
import moment from 'moment'
import Immutable from 'immutable'
import { FormattedMessage } from 'react-intl'

import LoadingSpinner from '../loading-spinner/loading-spinner'
import BarChart from '../charts/bar-chart'
import SectionHeader from '../shared/layout/section-header'
import SectionContainer from '../shared/layout/section-container'
import AnalysisByTime from './by-time'
import TableSorter from '../shared/table-sorter'
import { paleblue } from '../../constants/colors'
// import Select from '../shared/form-elements/select'

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

    this.changeSort = this.changeSort.bind(this)
    this.changeChartType = this.changeChartType.bind(this)
    this.sortedData = this.sortedData.bind(this)
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
      if (a.get(sortBy) < b.get(sortBy)) {
        return -1 * sortDir
      } else if (a.get(sortBy) > b.get(sortBy)) {
        return 1 * sortDir
      }
      return 0
    })
  }
  changeChartType(value) {
    this.setState({chartType: value})
  }
  render() {
    const stats = this.props.traffic.first() || Immutable.Map()

    let chart = null

    const detail = stats.get('detail') || Immutable.List()

    const data = detail.map(datapoint => {
      const timestamp = datapoint.get('timestamp')
      return {
        formattedDate: moment(timestamp).format('MM/DD/YYYY'),
        chit_ratio: datapoint.get('chit_ratio'),
        name: timestamp.getDate()
      }
    })

    const secondaryXAxisTick = detail.map(datapoint =>
      moment(datapoint.get('timestamp')).format('MMM')
    )

    if (this.state.chartType === 'column') {
      chart = (
        <BarChart
          valueFormatter={(value) => value + ' %'}
          chartLabel={<FormattedMessage id={this.props.dateRange}/>}
          maxBarSize={70}
          barModels={[{ dataKey: 'chit_ratio', name: '', className: 'line-1' }]}
          chartData={data.toJS()}
          secondaryXAxisTick={secondaryXAxisTick.toJS()} />
      )
    } else {
      const dataset = {
        area: false,
        color: paleblue,
        comparisonData: false,
        data,
        id: 'http',
        label: <FormattedMessage id="portal.analytics.cacheHitRatio.text"/>,
        line: true,
        stackedAgainst: false,
        xAxisFormatter: false
      }
      chart = (
        <AnalysisByTime
          axes={true}
          dataKey="chit_ratio"
          dataSets={[dataset]}
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

        <SectionContainer className="analysis-chart-container">
          {this.props.fetching ? <LoadingSpinner/> : chart}
        </SectionContainer>

        <SectionContainer>
          <table className="table table-striped table-analysis">
            <thead>
              <tr>
                <TableSorter {...sorterProps} column="timestamp">
                  <FormattedMessage id="portal.analytics.report.table.date.text" />
                </TableSorter>
                <TableSorter {...sorterProps} column="chit_ratio">
                  <FormattedMessage id="portal.analytics.tabs.cacheHitRatePercentage.label" />
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
  dateRange: React.PropTypes.string,
  fetching: React.PropTypes.bool,
  traffic: React.PropTypes.instanceOf(Immutable.List)
}

AnalysisCacheHitRate.defaultProps = {
  dateRange: "portal.constants.date-ranges.month_to_date",
  cacheHitRateFilter: Immutable.Map(),
  traffic: Immutable.List()
}

module.exports = AnalysisCacheHitRate
