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
import * as uiActionCreators from '../redux/modules/ui'

import Content from '../components/layout/content'
import PageHeader from '../components/layout/page-header'
import TruncatedTitle from '../components/truncated-title'
import PlaceholderEntityList from '../components/network/placeholder-entity-list'

import {
  ADD_EDIT_POP
} from '../constants/network-modals.js'

import NetworkPopFormContainer from './network/modals/pop-modal.jsx'

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

    this.addEntity = this.addEntity.bind(this)
    this.handleCancel = this.handleCancel.bind(this)

    this.handleGroupClick = this.handleGroupClick.bind(this)
    this.handleGroupEdit = this.handleGroupEdit.bind(this)
    this.handleGroupSave = this.handleGroupSave.bind(this)
    this.handleGroupDelete = this.handleGroupDelete.bind(this)

    this.handleNetworkClick = this.handleNetworkClick.bind(this)
    this.handleNetworkEdit = this.handleNetworkEdit.bind(this)
    this.handleNetworkSave = this.handleNetworkSave.bind(this)
    this.handleNetworkDelete = this.handleNetworkDelete.bind(this)

    this.handlePopClick = this.handlePopClick.bind(this)
    this.handlePopEdit = this.handlePopEdit.bind(this)
    this.handlePopSave = this.handlePopSave.bind(this)
    this.handlePopDelete = this.handlePopDelete.bind(this)

    this.handlePodClick = this.handlePodClick.bind(this)
    this.handlePodEdit = this.handlePodEdit.bind(this)
    this.handlePodSave = this.handlePodSave.bind(this)
    this.handlePodDelete = this.handlePodDelete.bind(this)

    this.state = {
      networks: Immutable.List(),
      pops: Immutable.List(),
      pods: Immutable.List(),
      nodes: Immutable.List(),

      selectedGroupId: null,
      selectedNetworkId: null,
      selectedPopId: null,
      selectedPodId: null
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

  addEntity(entityModal) {
    switch (entityModal) {
      case ADD_EDIT_POP:
        this.props.toggleModal(ADD_EDIT_POP)
        break;

      default:
        break;
    }
  }

  handleCancel(entityModal) {
    switch (entityModal) {
      case ADD_EDIT_POP:
        this.props.toggleModal(null)
        this.setState({selectedPopId: null})
        break;

      default:
        break;
    }
  }

  /* ==== Group Handlers ==== */
  handleGroupClick(groupId) {
    const url = getNetworkUrl('group', groupId, this.props.params)
    this.props.router.push(url)
  }

  handleGroupEdit(groupId) {
    this.setState({selectedGroupId: groupId})
    // TODO: this.props.toggleModal(ADD_EDIT_GROUP)
  }

  handleGroupSave() {
    // TODO
  }

  handleGroupDelete() {
    // TODO
  }

  /* ==== Network Handlers ==== */
  handleNetworkClick(networkId) {
    const url = getNetworkUrl('network', networkId, this.props.params)
    this.props.router.push(url)
  }

  handleNetworkEdit(networkId) {
    this.setState({selectedGroupId: networkId})
    // TODO: this.props.toggleModal(ADD_EDIT_NETWORK)
  }

  handleNetworkSave() {
    // TODO
  }

  handleNetworkDelete() {
    // TODO
  }

  /* ==== POP Handlers ==== */
  handlePopClick(popId) {
    const url = getNetworkUrl('pop', popId, this.props.params)
    this.props.router.push(url)
  }

  handlePopEdit(popId) {
    this.setState({selectedPopId: popId})
    this.props.toggleModal(ADD_EDIT_POP)
  }

  handlePopSave() {
    // TODO
  }

  handlePopDelete() {
    // TODO
  }

  /* ==== POD Handlers ==== */
  handlePodClick(podId) {
    const url = getNetworkUrl('pod', podId, this.props.params)
    this.props.router.push(url)
  }

  handlePodEdit(podId) {
    this.setState({selectedPodId: podId})
    // TODO: this.props.toggleModal(ADD_EDIT_POD)
  }

  handlePodSave() {
    // TODO
  }

  handlePodDelete() {
    // TODO
  }

  render() {
    const {
      activeAccount,
      networkModal,
      groups,
      params,
      fetching
    } = this.props

    const {
      networks,
      pops,
      pods,
      nodes,
      selectedGroupId,
      selectedNetworkId,
      selectedPopId
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
            deleteEntity={() => (groupId) => this.handleGroupEdit(groupId)}
            editEntity={() => (groupId) => this.handleGroupEdit(groupId)}
            selectEntity={this.handleGroupClick}
            selectedEntityId={`${params.group}`}
            title="Groups"
          />
        }

        {params.group &&
          <PlaceholderEntityList
            entities={networks}
            addEntity={() => null}
            deleteEntity={() => (networkId) => this.handleNetworkEdit(networkId)}
            editEntity={() => (networkId) => this.handleNetworkEdit(networkId)}
            selectEntity={this.handleNetworkClick}
            selectedEntityId={`${params.network}`}
            title="Networks"
          />
        }

        {params.network &&
          <PlaceholderEntityList
            entities={pops}
            addEntity={() => this.addEntity(ADD_EDIT_POP)}
            deleteEntity={() => (popId) => this.handlePopEdit(popId)}
            editEntity={() => (popId) => this.handlePopEdit(popId)}
            selectEntity={this.handlePopClick}
            selectedEntityId={`${params.pop}`}
            title="Pops"
          />
        }

        {params.pop &&
          <PlaceholderEntityList
            entities={pods}
            addEntity={() => null}
            deleteEntity={() => (podId) => this.handlePodEdit(podId)}
            editEntity={() => (podId) => this.handlePodEdit(podId)}
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

        {/* MODALS
            TODO: Add/edit Group
        */}
        {/* MODALS
            TODO: Add/edit Network
        */}
        {/* MODALS
            TODO: Add/edit POD
        */}


        {/* MODALS
            Add/edit POP
        */}
        {networkModal === ADD_EDIT_POP &&
          <NetworkPopFormContainer
            account={activeAccount.get('name')}
            groupId={selectedGroupId}
            networkId={selectedNetworkId}
            fetching={fetching}
            onDelete={this.handlePopDelete}
            onSave={this.handlePopSave}
            onCancel={() => this.handleCancel(ADD_EDIT_POP)}
            selectedPopId={params.pop}
            show={true}
            edit={(selectedPopId !== null) ? true : false}
          />
        }

      </Content>
    )
  }
}

Network.displayName = 'Network'
Network.propTypes = {
  activeAccount: PropTypes.instanceOf(Immutable.Map),
  fetchData: PropTypes.func,
  fetching: PropTypes.bool,
  groups: PropTypes.instanceOf(Immutable.List),
  networkModal: PropTypes.string,
  params: PropTypes.object,
  router: PropTypes.object,
  toggleModal: PropTypes.func
}

Network.defaultProps = {
  activeAccount: Immutable.Map(),
  groups: Immutable.List()
}

function mapStateToProps(state) {
  return {
    networkModal: state.ui.get('networkModal'),
    activeAccount: state.account.get('activeAccount'),
    fetching: state.group.get('fetching'),
    groups: state.group.get('allGroups')
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { brand, account } = ownProps.params
  const accountActions = bindActionCreators(accountActionCreators, dispatch)
  const groupActions = bindActionCreators(groupActionCreators, dispatch)
  const uiActions = bindActionCreators(uiActionCreators, dispatch)

  const fetchData = () => {
    accountActions.fetchAccount(brand, account)
    groupActions.startFetching()
    groupActions.fetchGroups(brand, account)
  }
  return {
    toggleModal: uiActions.toggleNetworkModal,
    fetchData: fetchData,
    groupActions: groupActions
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Network))
