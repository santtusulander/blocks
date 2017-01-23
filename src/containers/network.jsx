import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'

import {
  getNetworkUrl
} from '../util/routes.js'
import * as accountActionCreators from '../redux/modules/account'
import * as groupActionCreators from '../redux/modules/group'

import Content from '../components/layout/content'
import PageHeader from '../components/layout/page-header'
import TruncatedTitle from '../components/truncated-title'
import PlaceholderEntityList from '../components/network/placeholder-entity-list'

import PodFormContainer from './network/modals/pod-modal'

const placeholderNetworks = Immutable.fromJS([
  { id: 1, name: 'Network 1' },
  { id: 2, name: 'Network 2' },
  { id: 3, name: 'Network 3' }
])

const placeholderPops = Immutable.fromJS([
  { id: 'JFK1', name: 'Pod 1 for JFK' },
  { id: 'JFK2', name: 'Pod 2 for JFK' },
  { id: 'JFK7', name: 'Pod 7 for JFK' },
  { id: 'SJC1', name: 'Pod 1 for SJC' }
])

const placeholderPods = Immutable.fromJS([
  { id: 1, name: 'Pod 1' },
  { id: 2, name: 'Pod 2' },
  { id: 3, name: 'Pod 3' }
])

const placeholderNodes = Immutable.fromJS([
  { id: 'cache-1.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 1' },
  { id: 'cache-2.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 2' },
  { id: 'gslb-1.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 3' },
  { id: 'cache-1.sjc.cdx-dev.unifieddeliverynetwork.net', name: 'Node 4' },
  { id: 'slsb-1.sjc.cdx-dev.unifieddeliverynetwork.net', name: 'Node 5' }
])

class Network extends React.Component {
  constructor(props) {
    super(props)

    this.handleGroupClick = this.handleGroupClick.bind(this)
    this.handleNetworkClick = this.handleNetworkClick.bind(this)
    this.handlePopClick = this.handlePopClick.bind(this)
    this.handlePodClick = this.handlePodClick.bind(this)
    this.handleEditPodClick = this.handleEditPodClick.bind(this)
    this.togglePodModal = this.togglePodModal.bind(this)

    this.state = {
      networks: Immutable.List(),
      pops: Immutable.List(),
      pods: Immutable.List(),
      nodes: Immutable.List(),
      showPodModal: false
    }
  }

  componentWillMount() {
    this.props.fetchData()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.group) {
      this.setState({ networks: placeholderNetworks })
    }
    if (nextProps.params.network) {
      this.setState({ pops: placeholderPops })
    }
    if (nextProps.params.pop) {
      this.setState({ pods: placeholderPods })
    }
    if (nextProps.params.pod) {
      this.setState({ nodes: placeholderNodes })
    }
  }

  handleGroupClick(groupId) {
    const url = getNetworkUrl('group', groupId, this.props.params)
    this.props.router.push(url)
  }

  handleNetworkClick(networkId) {
    const url = getNetworkUrl('network', networkId, this.props.params)
    this.props.router.push(url)
  }

  handlePopClick(popId) {
    const url = getNetworkUrl('pop', popId, this.props.params)
    this.props.router.push(url)
  }

  handlePodClick(podId) {
    const url = getNetworkUrl('pod', podId, this.props.params)
    this.props.router.push(url)
  }

  savePod() {
    this.setState({
      showPodModal: !this.state.showPodModal
    })
  }

  togglePodModal() {
    this.setState({
      showPodModal: !this.state.showPodModal,
      podId: undefined
    })
  }

  handleEditPodClick(podId) {
    this.setState({
      showPodModal: !this.state.showPodModal,
      podId: podId
    })
  }

  render() {
    const {
      activeAccount,
      groups,
      params
    } = this.props

    const {
      networks,
      pops,
      pods,
      nodes
    } = this.state
    return (
      <Content>

        <PageHeader pageSubTitle="Network">
          <div className="dropdown-toggle header-toggle">
            <h1>
              <TruncatedTitle content={activeAccount.get('name')} tooltipPlacement="bottom"/>
            </h1>
          </div>
        </PageHeader>

        {params.account &&
          <PlaceholderEntityList
            entities={groups}
            addEntity={() => null}
            deleteEntity={() => () => null}
            editEntity={() => () => null}
            selectEntity={this.handleGroupClick}
            selectedEntityId={`${params.group}`}
            title="Groups"
          />
        }

        {params.group &&
          <PlaceholderEntityList
            entities={networks}
            addEntity={() => null}
            deleteEntity={() => () => null}
            editEntity={() => () => null}
            selectEntity={this.handleNetworkClick}
            selectedEntityId={`${params.network}`}
            title="Networks"
          />
        }

        {params.network &&
          <PlaceholderEntityList
            entities={pops}
            addEntity={() => null}
            deleteEntity={() => () => null}
            editEntity={() => () => null}
            selectEntity={this.handlePopClick}
            selectedEntityId={`${params.pop}`}
            title="Pops"
          />
        }

        {params.pop &&
          <PlaceholderEntityList
            entities={pods}
            addEntity={this.togglePodModal}
            deleteEntity={() => () => null}
            editEntity={this.handleEditPodClick}
            selectEntity={this.handlePodClick}
            selectedEntityId={`${params.pod}`}
            title="Pods"
          />
        }

        {params.pod &&
          <PlaceholderEntityList
            entities={nodes}
            addEntity={() => null}
            deleteEntity={() => () => null}
            editEntity={() => () => null}
            selectEntity={() => null}
            title="Nodes"
          />
        }
        <PodFormContainer
          id="pod-form"
          // params={this.props.params}
          podId={this.state.podId}
          onSave={() => this.savePod()}
          onCancel={() => this.togglePodModal()}
          show={this.state.showPodModal}
          {...params}
        />

      </Content>
    )
  }
}

Network.displayName = 'Network'
Network.propTypes = {
  activeAccount: PropTypes.instanceOf(Immutable.Map),
  fetchData: PropTypes.func,
  groups: PropTypes.instanceOf(Immutable.List),
  params: PropTypes.object,
  router: PropTypes.object
}

Network.defaultProps = {
  activeAccount: Immutable.Map(),
  groups: Immutable.List()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    fetching: state.group.get('fetching'),
    groups: state.group.get('allGroups')
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { brand, account } = ownProps.params
  const accountActions = bindActionCreators(accountActionCreators, dispatch)
  const groupActions = bindActionCreators(groupActionCreators, dispatch)

  const fetchData = () => {
    accountActions.fetchAccount(brand, account)
    groupActions.startFetching()
    groupActions.fetchGroups(brand, account)
  }
  return {
    fetchData: fetchData,
    groupActions: groupActions
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Network))
