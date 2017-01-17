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

import PageContainer from '../../../components/layout/page-container'
import PurgeHistoryReport from '../../../components/content/property/purge-status'

import withPagination from '../../../components/paginator/pagination-hoc'

class PurgeStatus extends React.Component {

  constructor(props) {
    super(props)

    this.state = {}

    this.fetchData = this.fetchData.bind(this)
  }

  componentWillMount() {
    this.fetchData(this.props.params)
  }

  componentWillReceiveProps(nextProps) {
    if (
        nextProps.params !== this.props.params ||
        nextProps.pagingQueryParams.offset !== this.props.pagingQueryParams.offset
    ) {
      this.fetchData(nextProps.params)
    }
  }

  fetchData(params) {
    const { purgeActions, pagingQueryParams } = this.props
    const { brand, account, group, property } = params
    purgeActions.startFetching()
    purgeActions.fetchPurgeObjects(brand, account, group, { published_host_id: property, ...pagingQueryParams })
  }

  render() {
    const { fetching, purgeObjects, pagingConfig, sortColumn } = this.props

    return (
      <PageContainer className="property-container">
        <PurgeHistoryReport
          fetching={fetching}
          historyData={purgeObjects}
          pagination={pagingConfig}
          columnSorter={sortColumn}
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
  params: React.PropTypes.object,
  purgeActions: React.PropTypes.object,
  purgeObjects: React.PropTypes.instanceOf(List)
}

function mapStateToProps(state) {
  return {
    activeHostConfiguredName: state.host.get('activeHostConfiguredName'),
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

// export default connect(mapStateToProps, mapDispatchToProps)(withRouter((PurgeStatus)));
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withPagination(PurgeStatus)));
