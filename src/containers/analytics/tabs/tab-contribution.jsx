import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import AnalysisContribution from '../../../components/analysis/contribution.jsx'

import * as filterActionCreators from '../../../redux/modules/filters'
import * as trafficActionCreators from '../../../redux/modules/traffic'
import { buildAnalyticsOptsForContribution, changedParamsFiltersQS, userIsCloudProvider } from '../../../util/helpers.js'
import ProviderTypes from '../../../constants/provider-types'

class AnalyticsTabContribution extends React.Component {
  componentDidMount() {
    this.fetchData(
      this.props.params,
      this.props.filters,
      this.props.location,
      this.props.activeHostConfiguredName,
      this.props.accountType,
      this.props.accounts.toJS()
    )
  }

  componentWillReceiveProps(nextProps){
    if (this.props.activeAccount !== nextProps.activeAccount) {
      this.props.filterActions.resetContributionFilters()
    }

    if (changedParamsFiltersQS(this.props, nextProps) ||
      this.props.activeHostConfiguredName !== nextProps.activeHostConfiguredName ||
      this.props.filters !== nextProps.filters ||
      this.props.accountType !== nextProps.accountType ||
      this.props.activeAccount !== nextProps.activeAccount ||
      this.props.accounts !== nextProps.accounts
    ) {
      this.fetchData(
        nextProps.params,
        nextProps.filters,
        nextProps.location,
        nextProps.activeHostConfiguredName,
        nextProps.accountType,
        nextProps.accounts.toJS()
      )
    }
  }

  componentWillUnmount() {
    this.props.filterActions.resetContributionFilters()
  }

  fetchData(params, filters, location, hostConfiguredName, accountType, accounts){
    if(params.property && hostConfiguredName) {
      params = Object.assign({}, params, {
        property: hostConfiguredName
      })
    }

    const fetchOpts = buildAnalyticsOptsForContribution(params, filters, accountType)
    const dataQueryOpts = Object.assign({}, fetchOpts)
    dataQueryOpts.granularity = 'day'

    let fetchDataAction

    if (accountType === ProviderTypes.CONTENT_PROVIDER) {
      this.props.filterActions.fetchServiceProvidersWithTrafficForCP(
        params.brand,
        accounts,
        fetchOpts
      )

      // TODO: this outer check is TEMPORARY and should be removed as part of UDNP-1577
      if (userIsCloudProvider(this.props.currentUser)) {
        if (filters.get('serviceProviders').size === 1) {
          const spAccount = filters.getIn(['serviceProviders', 0])
          const filterFetchOpts = Object.assign({}, fetchOpts)
          delete filterFetchOpts.sp_account_ids

          this.props.filterActions.fetchServiceProviderGroupsWithTrafficForCP(
            params.brand,
            accounts,
            spAccount,
            filterFetchOpts
          )
        }
      }

      fetchDataAction = this.props.trafficActions.fetchServiceProviders
    } else {
      this.props.filterActions.fetchContentProvidersWithTrafficForSP(
        params.brand,
        accounts,
        fetchOpts
      )

      if (userIsCloudProvider(this.props.currentUser)) {
        if (filters.get('contentProviders').size === 1) {
          const cpAccount = filters.getIn(['contentProviders', 0])
          const filterFetchOpts = Object.assign({}, fetchOpts)
          delete filterFetchOpts.cp_account_ids

          this.props.filterActions.fetchContentProviderGroupsWithTrafficForSP(
            params.brand,
            accounts,
            cpAccount,
            filterFetchOpts
          )
        }
      }

      fetchDataAction = this.props.trafficActions.fetchContentProviders
    }

    if (fetchDataAction) {
      this.props.trafficActions.startFetching()
      fetchDataAction(dataQueryOpts, accounts)
        .then(this.props.trafficActions.finishFetching, this.props.trafficActions.finishFetching)
    }
  }

  render(){
    let sectionHeaderTitle = <FormattedMessage id="portal.analytics.contentProviderContribution.totalTraffic.label"/>
    if (this.props.accountType === ProviderTypes.CONTENT_PROVIDER) {
      sectionHeaderTitle = <FormattedMessage id="portal.analytics.serviceProviderContribution.totalTraffic.label"/>
    }

    return (
      <AnalysisContribution
        fetching={this.props.fetching}
        sectionHeaderTitle={sectionHeaderTitle}
        stats={this.props.contribution}
        accounts={this.props.accounts}
        onOffFilter={this.props.filters.get('onOffNet')}
        serviceTypes={this.props.filters.get('serviceTypes')}
      />
    )
  }
}

AnalyticsTabContribution.propTypes = {
  accountType: React.PropTypes.number,
  accounts: React.PropTypes.instanceOf(Immutable.List),
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeHostConfiguredName: React.PropTypes.string,
  contribution: React.PropTypes.instanceOf(Immutable.List),
  currentUser: React.PropTypes.instanceOf(Immutable.Map),
  fetching: React.PropTypes.bool,
  filterActions: React.PropTypes.object,
  filterOptions: React.PropTypes.instanceOf(Immutable.Map),
  filters: React.PropTypes.instanceOf(Immutable.Map),
  location: React.PropTypes.object,
  params: React.PropTypes.object,
  trafficActions: React.PropTypes.object
}

AnalyticsTabContribution.defaultProps = {
  accounts: Immutable.List(),
  currentUser: Immutable.Map(),
  filters: Immutable.Map(),
  contribution: Immutable.List()
}

function mapStateToProps(state) {
  return {
    accountType: state.account.getIn(['activeAccount', 'provider_type']),
    activeAccount: state.account.get('activeAccount'),
    activeHostConfiguredName: state.host.get('activeHostConfiguredName'),
    fetching: state.traffic.get('fetching'),
    contribution: state.traffic.get('contribution'),
    accounts: state.account.get('allAccounts'),
    filters: state.filters.get('filters'),
    currentUser: state.user.get('currentUser')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    filterActions: bindActionCreators(filterActionCreators, dispatch),
    trafficActions: bindActionCreators(trafficActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabContribution);
