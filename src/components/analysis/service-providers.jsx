import React from 'react'
import numeral from 'numeral'
import moment from 'moment'
import Immutable from 'immutable'

import SectionHeader from '../layout/section-header'
import AnalysisStackedByGroup from './stacked-by-group'
import TableSorter from '../table-sorter'
import {formatBytes} from '../../util/helpers'

import { FormattedMessage } from 'react-intl'

class AnalysisServiceProviders extends React.Component {
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
    const month = moment().format('MMMM YYYY')

    const providers = this.props.stats.map((provider, i) => {
      return Immutable.fromJS({
        group: provider.get('name'),
        groupIndex: i,
        data: [
          provider.getIn(['http','net_on_bytes'], 0),
          provider.getIn(['https','net_on_bytes'], 0),
          provider.getIn(['http','net_off_bytes'], 0),
          provider.getIn(['https','net_off_bytes'], 0)
        ]
      })
    })
    const byCountryStats = this.props.stats.reduce((byCountry, provider) => {
      byCountry = byCountry.push(...provider.get('countries').map(country => {
        return Immutable.Map({
          provider: provider.get('name'),
          country: country.get('name'),
          bytes: country.get('bytes'),
          percent_total: country.get('percent_total')
        })
      }))
      return byCountry
    }, Immutable.List())
    const sorterProps = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }
    const sortedStats = this.sortedData(byCountryStats, this.state.sortBy, this.state.sortDir)
    return (
      <div className="analysis-service-providers">
        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.analytics.serviceProviderContribution.totalTraffic.label"/>} />
        <div ref="stacksHolder">
          {this.props.fetching ?
            <div>Loading...</div> :
            <AnalysisStackedByGroup padding={40}
              chartLabel={`${month}, Month to Date`}
              datasets={providers}
              datasetLabels={[
                <FormattedMessage id="portal.analytics.serviceProviderContribution.onNetHttp.label"/>,
                <FormattedMessage id="portal.analytics.serviceProviderContribution.onNetHttps.label"/>,
                <FormattedMessage id="portal.analytics.serviceProviderContribution.ofNetHttp.label"/>,
                <FormattedMessage id="portal.analytics.serviceProviderContribution.ofNetHttps.label"/>
              ]}
              width={this.state.stacksWidth} height={this.state.stacksWidth / 3}/>
          }
        </div>
        {<table className="table table-striped table-analysis extra-margin-top">
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
        </table>}
      </div>
    )
  }
}

AnalysisServiceProviders.displayName = 'AnalysisServiceProviders'
AnalysisServiceProviders.propTypes = {
  fetching: React.PropTypes.bool,
  stats: React.PropTypes.instanceOf(Immutable.List)
}
AnalysisServiceProviders.defaultProps = {
  stats: Immutable.List()
}

module.exports = AnalysisServiceProviders
