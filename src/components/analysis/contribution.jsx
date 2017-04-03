import React from 'react'
import numeral from 'numeral'
import Immutable from 'immutable'

import SectionHeader from '../layout/section-header'
import SectionContainer from '../layout/section-container'
import BarChart from '../charts/bar-chart'
import TableSorter from '../table-sorter'
import {formatBytes} from '../../util/helpers'

import {getTrafficByDateRangeLabel} from './helpers'

import { injectIntl, FormattedMessage } from 'react-intl'

class AnalysisContribution extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortBy: 'percent_total',
      sortDir: -1,
      sortFunc: ''
    }
    this.changeSort = this.changeSort.bind(this)
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
      }
      else if (a.get(sortBy) > b.get(sortBy)) {
        return 1 * sortDir
      }
      return 0
    })
  }

  render() {
    const isHttp = this.props.serviceTypes.includes('http')
    const isHttps = this.props.serviceTypes.includes('https')
    const isOnNet = this.props.onOffFilter.includes('on')
    const isOffNet = this.props.onOffFilter.includes('off')

    const barModels = []
    if (isHttps && isOffNet)
      {barModels.push({
        dataKey: 'offNetHttps',
        name: this.props.intl.formatMessage({id: 'portal.analytics.serviceProviderContribution.offNetHttps.label'}),
        className: 'line-3'
      })}
    if (isHttp && isOffNet)
      {barModels.push({
        dataKey: 'offNetHttp',
        name: this.props.intl.formatMessage({id: 'portal.analytics.serviceProviderContribution.offNetHttp.label'}),
        className: 'line-2'
      })}
    if (isHttps && isOnNet)
      {barModels.push({
        dataKey: 'onNetHttps',
        name: this.props.intl.formatMessage({id: 'portal.analytics.serviceProviderContribution.onNetHttps.label'}),
        className: 'line-1'
      })}
    if (isHttp && isOnNet)
      {barModels.push({
        dataKey: 'onNetHttp',
        name: this.props.intl.formatMessage({id: 'portal.analytics.serviceProviderContribution.onNetHttp.label'}),
        className: 'line-0'
      })}

    const chartData = this.props.stats.map(provider => {
      const dataObject = {}
      if (isHttp && isOnNet)
        {dataObject.onNetHttp = provider.getIn(['http','net_on_bytes'])}
      if (isHttps && isOnNet)
        {dataObject.onNetHttps = provider.getIn(['https','net_on_bytes'])}
      if (isHttp && isOffNet)
        {dataObject.offNetHttp = provider.getIn(['http','net_off_bytes'])}
      if (isHttps && isOffNet)
        {dataObject.offNetHttps = provider.getIn(['https','net_off_bytes'])}

      return {
        name: provider.get('name'),
        ...dataObject
      }

    }).toJS()

    const byCountryStats = this.props.stats.reduce((byCountry, provider) => {
      const countryRecord = provider.get('countries').map(country => {
        return Immutable.Map({
          provider: provider.get('name'),
          country: country.get('name'),
          bytes: country.get('bytes'),
          percent_total: country.get('percent_total')
        })
      })

      return byCountry.push(...countryRecord);
    }, Immutable.List())

    const sorterProps = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }
    const sortedStats = this.sortedData(byCountryStats, this.state.sortBy, this.state.sortDir)

    const trafficByDateRangeLabel = getTrafficByDateRangeLabel(this.props.dateRange, this.props.dateRangeLabel, this.props.intl.formatMessage)

    return (
      <div>
        <SectionHeader sectionHeaderTitle={this.props.sectionHeaderTitle} />
        <div>
          <SectionContainer className="analysis-chart-container">
            <BarChart
              chartLabel={trafficByDateRangeLabel}
              maxBarSize={90}
              barModels={barModels}
              chartData={chartData}/>
          </SectionContainer>

          <SectionContainer>
            <table className="table table-striped table-analysis">
              <thead>
                <tr>
                  <TableSorter {...sorterProps} column="provider">
                    <FormattedMessage id="portal.analytics.contribution.provider.label"/>
                  </TableSorter>
                  <TableSorter {...sorterProps} column="country">
                    <FormattedMessage id="portal.analytics.contribution.country.label"/>
                  </TableSorter>
                  <TableSorter {...sorterProps} column="bytes">
                    <FormattedMessage id="portal.analytics.contribution.traffic.label"/>
                  </TableSorter>
                  <TableSorter {...sorterProps} column="percent_total">
                    <FormattedMessage id="portal.analytics.contribution.trafficPercentage.label"/>
                  </TableSorter>
                </tr>
              </thead>
              <tbody>
                {sortedStats.map((country, i) => {
                  return (
                    <tr key={i}>
                      <td>{country.get('provider')}</td>
                      <td>{country.get('country')}</td>
                      <td>{formatBytes(country.get('bytes'))}</td>
                      <td>{numeral(country.get('percent_total')).format('0.00%')}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </SectionContainer>
        </div>
      </div>
    )
  }
}

AnalysisContribution.displayName = 'AnalysisContribution'
AnalysisContribution.propTypes = {
  dateRange: React.PropTypes.instanceOf(Immutable.Map),
  dateRangeLabel: React.PropTypes.string,
  intl: React.PropTypes.object,
  onOffFilter: React.PropTypes.instanceOf(Immutable.List),
  sectionHeaderTitle: React.PropTypes.object,
  serviceTypes: React.PropTypes.instanceOf(Immutable.List),
  stats: React.PropTypes.instanceOf(Immutable.List)
}
AnalysisContribution.defaultProps = {
  onOffFilter: Immutable.List(),
  serviceTypes: Immutable.List(),
  stats: Immutable.List()
}

module.exports = injectIntl(AnalysisContribution)
