import React from 'react'
import { Map, List } from 'immutable'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'

import * as accountActionCreators from '../../../redux/modules/account'
import * as groupActionCreators from '../../../redux/modules/group'
import * as hostActionCreators from '../../../redux/modules/host'
import * as purgeActionCreators from '../../../redux/modules/purge'
import * as uiActionCreators from '../../../redux/modules/ui'

import PageContainer from '../../../components/shared/layout/page-container'
import PurgeHistoryReport from '../../../components/content/property/purge-status'

import withPagination from '../../../decorators/pagination-hoc'

class PurgeStatus extends React.Component {

  constructor(props) {
    super(props)

    this.state = {}

    this.fetchData = this.fetchData.bind(this)

    props.pagination.registerSubscriber((pagingParams) => this.fetchData(this.props.params, pagingParams))
  }

  componentWillMount() {
    const { params, pagination: { getQueryParams }} = this.props
    this.fetchData(params, getQueryParams())
  }

  componentWillReceiveProps(nextProps) {
    const { params, purgeStatus: { id, status }, pagination: { getQueryParams, resetPagination }} = nextProps
    const purgeCreated = () => status === 'created' && id !== this.props.purgeStatus.id

    if (params !== this.props.params || purgeCreated()) {
      resetPagination()
      this.fetchData(params, getQueryParams(paginationConfig))
    }
  }

  fetchData(params, pagingParams) {
    const { purgeActions } = this.props
    const { brand, account, group, property } = params

    purgeActions.startFetching()
    purgeActions.fetchPurgeObjects(brand, account, group, { published_host_id: property, ...pagingParams })
      .then((resp) => {
        const total = resp && resp.payload && (resp.payload.total >= 0) ? resp.payload.total : null;
        this.props.pagination.paging.onTotalChange(total)

        return resp
      })
  }

  render() {
    const { fetching, purgeObjects, pagination: { paging, filtering, sorting }} = this.props

    return (
      <PageContainer
        className="property-container"
      >
        <PurgeHistoryReport
          fetching={fetching}
          historyData={purgeObjects}
          {...paging}
          {...filtering}
          {...sorting}
        />
      </PageContainer>
    )
  }
}

PurgeStatus.displayName = 'PurgeStatus'

PurgeStatus.defaultProps = {
  activeAccount: Map(),
  activeGroup: Map(),
  activeHost: Map(),
  activePurge: Map(),
  allPurges: List(),
  fetching: false,
  params: {},
  properties: List(),
  purgeObjects: List()
}

PurgeStatus.propTypes = {
  fetching: React.PropTypes.bool,
  pagination: React.PropTypes.shape({
    filtering: React.PropTypes.object,
    paging: React.PropTypes.object,
    sorting: React.PropTypes.object,
    registerSubscriber: React.PropTypes.func
  }).isRequired,
  params: React.PropTypes.object,
  purgeActions: React.PropTypes.object,
  purgeObjects: React.PropTypes.instanceOf(List),
  purgeStatus: React.PropTypes.object
}

const paginationConfig = {
  fields: [],
  page_size: 5
}

function mapStateToProps(state) {
  return {
    activeHostConfiguredName: state.host.get('activeHostConfiguredName'),
    purgeStatus: {
      status: state.purge.getIn(['activePurge', 'status']),
      id: state.purge.getIn(['activePurge', 'purge_id'])
    },
    fetching: state.purge.get('fetching'),
    purgeObjects: state.purge.get('purgeObjects')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    groupActions: bindActionCreators(groupActionCreators, dispatch),
    hostActions: bindActionCreators(hostActionCreators, dispatch),
    purgeActions: bindActionCreators(purgeActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withPagination(PurgeStatus, paginationConfig)));
