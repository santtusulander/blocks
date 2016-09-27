import React from 'react'
import numeral from 'numeral'
import moment from 'moment'
import Immutable from 'immutable'

import SectionHeader from '../layout/section-header'
import SectionContainer from '../layout/section-container'
import AnalysisStackedByGroup from './stacked-by-group'
import LoadingSpinner from '../loading-spinner/loading-spinner'
import TableSorter from '../table-sorter'
import {formatBytes} from '../../util/helpers'

import { FormattedMessage } from 'react-intl'

class AnalysisContribution extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stacksWidth: 100,
      sortBy: 'percent_total',
      sortDir: -1,
      sortFunc: ''
    }

    this.measureContainers = this.measureContainers.bind(this)
    this.changeSort = this.changeSort.bind(this)
    this.sortedData = this.sortedData.bind(this)
    this.isProviderInFilter = this.isProviderInFilter.bind(this)
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
    if (!this.refs.stacksHolder) {
      return;
    }
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

  /**
   * Converts an `Immutable.List` of service provider objects into a lookup table
   * of service provider objects keyed against their `id`.
   *
   * Example input (Immutable.List):
   *  [
   *    {'id': 123, 'name': 'service provider 123', ... },
   *    {'id': 137, 'name': 'service provider 137', ...},
   *    ...
   *  ]
   *
   * Example output (Immutable.Map):
   *  {
   *    '123': {'id': 123, 'name': 'service provider 123', ...},
   *    '137': {'id': 137, 'name': 'service provider 137', ...},
   *    ...
   *  }
   *
   * @param {Immutable.List} serviceProviders - a list of service provider objects
   * @return {Immutable.Map} a map of the service providers keyed against their `id`
   */
  lookUpTableForServiceProviderNames(serviceProviders) {
    return serviceProviders.toMap().mapEntries((entry) => {
      let serviceProvider = entry[1]
      let id = serviceProvider.get('id')

      return [ id, serviceProvider ]
    })
  }

  nameForServiceProvider(provider, lookUpTable) {
    const id = Number(provider.get('sp_account'))
    const serviceProvider = lookUpTable.get(id)
    return serviceProvider ? serviceProvider.get('name') : `ID: ${id}`
  }

  /**
   * Return true if the provider has been selected in the filter dropdown,
   * or nothing has been selected in the filter dropdown.
   */
  isProviderInFilter(provider) {
    const providerId = Number(provider.get('sp_account'))
    const isProviderInFilter = this.props.serviceProviderFilter.includes(providerId)
    return isProviderInFilter || !this.props.serviceProviderFilter.size
  }

  render() {
    const month = moment().format('MMMM YYYY')
    const lookUpTable = this.lookUpTableForServiceProviderNames(this.props.serviceProviders)
    const isHttp = this.props.serviceTypes.includes('http')
    const isHttps = this.props.serviceTypes.includes('https')
    const isOnNet = this.props.onOffFilter.includes('on-net')
    const isOffNet = this.props.onOffFilter.includes('off-net')

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
        group: this.nameForServiceProvider(provider, lookUpTable),
        groupIndex: i,
        data: data
      })

      // Only show the data for this provider if it is selected in the filter
      // and there is data for the provider after taking the on/off net and
      // service type filters into account.
      if (this.isProviderInFilter(provider) && data.length && data.some(val => val > 0)) {
        return list.push(providerRecord);
      } else {
        return list;
      }

    }, Immutable.List())


    const byCountryStats = this.props.stats.reduce((byCountry, provider) => {
      const countryRecord = provider.get('countries').map(country => {
        return Immutable.Map({
          provider: this.nameForServiceProvider(provider, lookUpTable),
          country: country.get('name'),
          bytes: country.get('bytes'),
          percent_total: country.get('percent_total')
        })
      })

      if (this.isProviderInFilter(provider)) {
        return byCountry.push(...countryRecord);
      } else {
        return byCountry;
      }
    }, Immutable.List())

    const sorterProps = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }
    const sortedStats = this.sortedData(byCountryStats, this.state.sortBy, this.state.sortDir)
    return (
      <div>
        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.analytics.serviceProviderContribution.totalTraffic.label"/>} />
          {this.props.fetching ?
          <LoadingSpinner /> :
          <div>
            <SectionContainer className="analysis-contribution">
              <div ref="stacksHolder">
                <AnalysisStackedByGroup padding={40}
                  chartLabel={`${month}, Month to Date`}
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
                      Service Provider
                    </TableSorter>
                    <TableSorter {...sorterProps} column="country">
                      Country
                    </TableSorter>
                    <TableSorter {...sorterProps} column="bytes">
                      Traffic
                    </TableSorter>
                    <TableSorter {...sorterProps} column="percent_total">
                      % of Traffic
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
                        <td>{numeral(country.get('percent_total')).format('0%')}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </SectionContainer>
          </div>
        }
      </div>
    )
  }
}

AnalysisContribution.displayName = 'AnalysisContribution'
AnalysisContribution.propTypes = {
  fetching: React.PropTypes.bool,
  onOffFilter: React.PropTypes.instanceOf(Immutable.List),
  serviceProviderFilter: React.PropTypes.instanceOf(Immutable.List),
  serviceProviders: React.PropTypes.instanceOf(Immutable.List),
  serviceTypes: React.PropTypes.instanceOf(Immutable.List),
  stats: React.PropTypes.instanceOf(Immutable.List)
}
AnalysisContribution.defaultProps = {
  onOffFilter: Immutable.List(),
  serviceProviderFilter: Immutable.List(),
  serviceProviders: Immutable.List(),
  serviceTypes: Immutable.List(),
  stats: Immutable.List()
}

module.exports = AnalysisContribution
