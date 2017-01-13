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
    const isHttp = this.props.serviceTypes.includes('http')
    const isHttps = this.props.serviceTypes.includes('https')
    const isOnNet = this.props.onOffFilter.includes('on')
    const isOffNet = this.props.onOffFilter.includes('off')


    const providers = this.props.stats.reduce((list, provider, i) => {
      let data = [0, 0, 0, 0];

      if (isHttp && isOnNet)
        data[0] = (provider.getIn(['http','net_on_bytes'], 0))
      if (isHttps && isOnNet)
        data[1] = (provider.getIn(['https','net_on_bytes'], 0))
      if (isHttp && isOffNet)
        data[2] = (provider.getIn(['http','net_off_bytes'], 0))
      if (isHttps && isOffNet)
        data[3] = (provider.getIn(['https','net_off_bytes'], 0))

      const providerRecord = Immutable.fromJS({
        group: provider.get('name'),
        groupIndex: i,
        data: data
      })

      // Only show the data for this provider if it is selected in the filter
      // and there is data for the provider after taking the on/off net and
      // service type filters into account.
      if (data.length && data.some(val => val > 0)) {
        return list.push(providerRecord);
      } else {
        return list;
      }

    }, Immutable.List())

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

    const trafficByDateRangeLabel = getTrafficByDateRangeLabel( this.props.dateRange, this.props.dateRangeLabel, this.props.intl.formatMessage)

    return (
      <div>
        <SectionHeader sectionHeaderTitle={this.props.sectionHeaderTitle} />
        <div>
          <SectionContainer className="analysis-contribution">
            <div ref="stacksHolder">
              <AnalysisStackedByGroup padding={40}
                chartLabel={`${this.props.intl.formatMessage({id: 'portal.analytics.contribution.traffic.label'})} ${trafficByDateRangeLabel}`}
                datasets={providers}
                datasetLabels={[
                  <FormattedMessage id="portal.analytics.serviceProviderContribution.onNetHttp.label"/>,
                  <FormattedMessage id="portal.analytics.serviceProviderContribution.onNetHttps.label"/>,
                  <FormattedMessage id="portal.analytics.serviceProviderContribution.offNetHttp.label"/>,
                  <FormattedMessage id="portal.analytics.serviceProviderContribution.offNetHttps.label"/>
                ]}
                width={this.state.stacksWidth} height={this.state.stacksWidth / 3}/>
            </div>
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
