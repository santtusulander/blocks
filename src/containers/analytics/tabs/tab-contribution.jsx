import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'
import SectionHeader from '../../../components/shared/layout/section-header'

import AnalysisContribution from '../../../components/analysis/contribution.jsx'

import * as filterActionCreators from '../../../redux/modules/filters'
import * as trafficActionCreators from '../../../redux/modules/traffic'
import { buildAnalyticsOptsForContribution, changedParamsFiltersQS, userIsCloudProvider } from '../../../util/helpers.js'
import { getById as getActiveAccount } from '../../../redux/modules/entities/accounts/selectors'
import { getCurrentUser } from '../../../redux/modules/user'

import ProviderTypes from '../../../constants/provider-types'

class AnalyticsTabContribution extends React.Component {
  constructor(props) {
    super(props)

    this.getChartName = this.getChartName.bind(this)
  }

  componentDidMount() {
    if (this.props.accountType) {
      this.fetchData(
        this.props.params,
        this.props.filters,
        this.props.location,
        this.props.activeHostConfiguredName,
        this.props.accountType
      )
    }
  }

  componentWillReceiveProps(nextProps) {
    const prevParams = JSON.stringify(this.props.params)
    const params = JSON.stringify(nextProps.params)

    if (prevParams !== params) {
      this.props.filterActions.resetContributionFilters()
    }

    if (changedParamsFiltersQS(this.props, nextProps) ||
      this.props.activeHostConfiguredName !== nextProps.activeHostConfiguredName ||
      !Immutable.is(this.props.filters, nextProps.filters) ||
      (!this.props.accountType && nextProps.accountType)
    ) {
      this.fetchData(
        nextProps.params,
        nextProps.filters,
        nextProps.location,
        nextProps.activeHostConfiguredName,
        nextProps.accountType
      )
    }
  }

  componentWillUnmount() {
    this.props.filterActions.resetContributionFilters()
  }

  getChartName() {
    const { contribution, accountType, filterOptions, filters } = this.props
    const isCP = accountType === ProviderTypes.CONTENT_PROVIDER

    const accountTier = isCP ? 'serviceProviders' : 'contentProviders'
    const groupTier = isCP ? 'serviceProviderGroups': 'contentProviderGroups'
    const groupTag = isCP ? 'sp_group' : 'group'
    const accountTag = isCP ? 'sp_account' : 'account'

    const isFilterByGroup = filters.get(groupTier) && !filters.get(groupTier).isEmpty()
    const providers =  isFilterByGroup ? filterOptions.get(groupTier) : filterOptions.get(accountTier)

    return contribution.map(item => {
      const service = providers.find(provider => provider.get('id') === item.get(isFilterByGroup ? groupTag : accountTag))
      return service ? item.set('chartName', service.get('name')) : item
    })
  }

  fetchData(params, filters, location, hostConfiguredName, accountType) {
    if (params.property && hostConfiguredName) {
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
        fetchOpts
      )

      if (filters.get('serviceProviders').size === 1) {
        const spAccount = filters.getIn(['serviceProviders', 0])
        const filterFetchOpts = Object.assign({}, fetchOpts)
        delete filterFetchOpts.sp_account_ids

        this.props.filterActions.fetchServiceProviderGroupsWithTrafficForCP(
          params.brand,
          spAccount,
          filterFetchOpts
        )
      }

      fetchDataAction = this.props.trafficActions.fetchServiceProviders
    } else {
      this.props.filterActions.fetchContentProvidersWithTrafficForSP(
        params.brand,
        fetchOpts
      )

      if (userIsCloudProvider(this.props.currentUser)) {
        if (filters.get('contentProviders').size === 1) {
          const cpAccount = filters.getIn(['contentProviders', 0])
          const filterFetchOpts = Object.assign({}, fetchOpts)
          delete filterFetchOpts.cp_account_ids

          this.props.filterActions.fetchContentProviderGroupsWithTrafficForSP(
            params.brand,
            cpAccount,
            filterFetchOpts
          )
        }
      }

      fetchDataAction = this.props.trafficActions.fetchContentProviders
    }

    if (fetchDataAction) {
      this.props.trafficActions.startFetching()
      fetchDataAction(dataQueryOpts)
        .then(this.props.trafficActions.finishFetching, this.props.trafficActions.finishFetching)
    }
  }

  render() {
    const contributionWithName = this.getChartName()

    let sectionHeaderTitle = <FormattedMessage id="portal.analytics.contentProviderContribution.totalTraffic.label"/>
    if (this.props.accountType === ProviderTypes.CONTENT_PROVIDER) {
      sectionHeaderTitle = <FormattedMessage id="portal.analytics.serviceProviderContribution.totalTraffic.label"/>
    }

    if (contributionWithName.size === 0) {
      return (
        <div>
          <SectionHeader sectionHeaderTitle={sectionHeaderTitle} />
          <h4><FormattedMessage id="portal.common.no-data.text" /></h4>
        </div>
      )
    }

    return (
      <AnalysisContribution
        dateRangeLabel={this.props.filters.get('dateRangeLabel')}
        dateRange={this.props.filters.get('dateRange')}
        sectionHeaderTitle={sectionHeaderTitle}
        stats={contributionWithName}
        onOffFilter={this.props.filters.get('onOffNet')}
        serviceTypes={this.props.filters.get('serviceTypes')}
        fetching={this.props.fetching}
      />
    )
  }
}

AnalyticsTabContribution.displayName = "AnalyticsTabContribution"
AnalyticsTabContribution.propTypes = {
  accountType: React.PropTypes.number,
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
  currentUser: Immutable.Map(),
  filters: Immutable.Map(),
  filterOptions: Immutable.Map(),
  contribution: Immutable.List()
}

function mapStateToProps(state, ownProps) {
  const activeAccount = getActiveAccount(state, ownProps.params.account)

  return {
    accountType: activeAccount && activeAccount.get('provider_type'),
    activeHostConfiguredName: state.host.get('activeHostConfiguredName'),
    contribution: state.traffic.getIn(['contribution', 'details']),
    filters: state.filters.get('filters'),
    currentUser: getCurrentUser(state),
    filterOptions: state.filters.get('filterOptions'),
    fetching: state.traffic.get('fetching') || state.filters.get('fetching')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    filterActions: bindActionCreators(filterActionCreators, dispatch),
    trafficActions: bindActionCreators(trafficActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabContribution);
