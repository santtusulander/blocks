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
import PageContainer from '../components/layout/page-container'
import PageHeader from '../components/layout/page-header'
import TruncatedTitle from '../components/truncated-title'
import EntityList from '../components/network/entity-list'

import {
  ADD_EDIT_POP
} from '../constants/network-modals.js'

import {
  NETWORK_SCROLL_AMOUNT,
  NETWORK_WINDOW_OFFSET
} from '../constants/network'

import NetworkPopFormContainer from './network/modals/pop-modal.jsx'

const placeholderNetworks = Immutable.fromJS([
  { id: 1, name: 'Network 1' },
  { id: 2, name: 'Network 2' },
  { id: 3, name: 'Network 3' },
  { id: 4, name: 'Network 4' },
  { id: 5, name: 'Network 5' },
  { id: 6, name: 'Network 6' },
  { id: 7, name: 'Network 7' },
  { id: 8, name: 'Network 8' },
  { id: 9, name: 'Network 9' },
  { id: 10, name: 'Network 10' },
  { id: 11, name: 'Network 11' },
  { id: 12, name: 'Network 12' },
  { id: 13, name: 'Network 13' },
  { id: 14, name: 'Network 14' }
])

const placeholderPops = Immutable.fromJS([
  { id: 'JFK1', name: 'Pod 1 for JFK' },
  { id: 'JFK2', name: 'Pod 2 for JFK' },
  { id: 'JFK7', name: 'Pod 7 for JFK' },
  { id: 'SJC1', name: 'Pod 1 for SJC' },
  { id: 'SJC2', name: 'Pod 2 for SJC' },
  { id: 'KFC1', name: 'Pod 1 for KFC' },
  { id: 'KFC2', name: 'Pod 2 for KFC' },
  { id: 'MCD1', name: 'Pod 1 for MCD' },
  { id: 'MCD2', name: 'Pod 2 for MCD' }
])

const placeholderPods = Immutable.fromJS([
  { id: 1, name: 'Pod 1' },
  { id: 2, name: 'Pod 2' },
  { id: 3, name: 'Pod 3' },
  { id: 4, name: 'Pod 4' },
  { id: 5, name: 'Pod 5' },
  { id: 6, name: 'Pod 6' },
  { id: 7, name: 'Pod 7' },
  { id: 8, name: 'Pod 8' },
  { id: 9, name: 'Pod 9' },
  { id: 10, name: 'Pod 10' },
  { id: 11, name: 'Pod 11' }
])

const placeholderNodes = Immutable.fromJS([
  { id: 'cache-1.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 1' },
  { id: 'cache-2.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 2' },
  { id: 'gslb-1.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 3' },
  { id: 'cache-1.sjc.cdx-dev.unifieddeliverynetwork.net', name: 'Node 4' },
  { id: 'slsb-1.sjc.cdx-dev.unifieddeliverynetwork.net', name: 'Node 5' },
  { id: 'cache-12.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 1' },
  { id: 'cache-23.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 2' },
  { id: 'gslb-14.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 3' },
  { id: 'cache-15.sjc.cdx-dev.unifieddeliverynetwork.net', name: 'Node 4' },
  { id: 'slsb-17.sjc.cdx-dev.unifieddeliverynetwork.net', name: 'Node 5' },
  { id: 'cache-17.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 1' },
  { id: 'cache-26.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 2' },
  { id: 'gslb-13.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 3' },
  { id: 'cache-1435.sjc.cdx-dev.unifieddeliverynetwork.net', name: 'Node 4' },
  { id: 'slsb-1435.sjc.cdx-dev.unifieddeliverynetwork.net', name: 'Node 5' },
  { id: 'cache-1134.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 1' },
  { id: 'cache-4562.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 2' },
  { id: 'gslb-8761.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 3' },
  { id: 'cache-1345.sjc.cdx-dev.unifieddeliverynetwork.net', name: 'Node 4' },
  { id: 'slsb-124.sjc.cdx-dev.unifieddeliverynetwork.net', name: 'Node 5' },
  { id: 'cache-156.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 1' },
  { id: 'cache-28.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 2' },
  { id: 'gslb-113.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 3' },
  { id: 'cache-1444.sjc.cdx-dev.unifieddeliverynetwork.net', name: 'Node 4' },
  { id: 'slsb-165.sjc.cdx-dev.unifieddeliverynetwork.net', name: 'Node 5' },
  { id: 'cache-1987.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 1' },
  { id: 'cache-2123.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 2' },
  { id: 'gslb-156867.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 3' },
  { id: 'cache-145.sjc.cdx-dev.unifieddeliverynetwork.net', name: 'Node 4' },
  { id: 'slsb-31.sjc.cdx-dev.unifieddeliverynetwork.net', name: 'Node 5' },
  { id: 'cache-15.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 1' },
  { id: 'cache-62.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 2' },
  { id: 'gslb-187.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 3' },
  { id: 'cache-198.sjc.cdx-dev.unifieddeliverynetwork.net', name: 'Node 4' },
  { id: 'slsb-3121.sjc.cdx-dev.unifieddeliverynetwork.net', name: 'Node 5' },
  { id: 'cache-451.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 1' },
  { id: 'cache-20890.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 2' },
  { id: 'gslb-135467.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 3' },
  { id: 'cache-19000.sjc.cdx-dev.unifieddeliverynetwork.net', name: 'Node 4' },
  { id: 'slsb-11111.sjc.cdx-dev.unifieddeliverynetwork.net', name: 'Node 5' },
  { id: 'cache-4444.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 1' },
  { id: 'cache-276888.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 2' },
  { id: 'gslb-199000.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 3' },
  { id: 'cache-13422.sjc.cdx-dev.unifieddeliverynetwork.net', name: 'Node 4' },
  { id: 'slsb-1690.sjc.cdx-dev.unifieddeliverynetwork.net', name: 'Node 5' },
  { id: 'cache-36781.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 1' },
  { id: 'cache-2789078.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 2' },
  { id: 'gslb-123234.jfk.cdx-dev.unifieddeliverynetwork.net', name: 'Node 3' },
  { id: 'cache-6786781.sjc.cdx-dev.unifieddeliverynetwork.net', name: 'Node 4' },
  { id: 'slsb-17878.sjc.cdx-dev.unifieddeliverynetwork.net', name: 'Node 5' }
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

    this.scrollToEntity = this.scrollToEntity.bind(this)

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

    this.entityList = {
      groupList: null,
      networkList: null,
      popList: null,
      podList: null,
      nodeList: null
    }
  }

  componentWillMount() {
    this.props.fetchData()
  }

  componentDidMount() {
    const { group, network, pop, pod } = this.props.params

    if (group) {
      this.selectEntityAndScroll('groupList', false)
    }

    if (network) {
      this.selectEntityAndScroll('networkList', false)
    }

    if (pop) {
      this.selectEntityAndScroll('popList', false)
    }

    if (pod) {
      this.selectEntityAndScroll('podList', false)
    }
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
    const shouldScrollToPrevious = this.determineNextState({
      currentId: groupId,
      previousId: this.props.params.group,
      goToRoute: 'group',
      goBackToRoute: 'account'
    })

    this.selectEntityAndScroll('groupList', shouldScrollToPrevious)
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
    const shouldScrollToPrevious = this.determineNextState({
      currentId: networkId,
      previousId: this.props.params.network,
      goToRoute: 'network',
      goBackToRoute: 'group'
    })

    this.selectEntityAndScroll('networkList', shouldScrollToPrevious)
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
    const shouldScrollToPrevious = this.determineNextState({
      currentId: popId,
      previousId:
      this.props.params.pop,
      goToRoute: 'pop',
      goBackToRoute: 'network'
    })

    this.selectEntityAndScroll('popList', shouldScrollToPrevious)
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
    const shouldScrollToPrevious = this.determineNextState({
      currentId: podId,
      previousId: this.props.params.pod,
      goToRoute: 'pod',
      goBackToRoute: 'pop'
    })

    this.selectEntityAndScroll('podList', shouldScrollToPrevious)
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

  /**
   * Determines the next state and sets the correct URL based on id.
   * It checks if the user clicked an already selected entity and then either
   * goes up one level or unselects it and goes back one level. Hence returning
   * shouldScrollToPrevious boolean that determines the scrolling direction.
   *
   * @method determineNextState
   * @param  {number OR string} currentId     ID of recently selected entity
   * @param  {number OR string} previousId    ID of already selected entity
   * @param  {string}           goToRoute     Name of a level where we should go to
   * @param  {string}           goBackToRoute Name of a level where we should go back to
   * @return {boolean}                        Boolean to determine scrolling direction
   */
  determineNextState({ currentId, previousId, goToRoute, goBackToRoute } = {}) {
    // Transform IDs to strings as they can be numbers, too.
    const shouldScrollToPrevious = previousId && currentId.toString() === previousId.toString()
    const entityId = shouldScrollToPrevious ? this.props.params[goBackToRoute] : currentId
    const nextEntity = shouldScrollToPrevious ? goBackToRoute : goToRoute
    const url = getNetworkUrl(nextEntity, entityId, this.props.params)

    this.props.router.push(url)

    return shouldScrollToPrevious
  }

  /**
   * Selects the next entity to be scrolled to. Entities are determined by refs.
   *
   * @method selectEntityAndScroll
   * @param  {string}              selectedEntity   Name of current entity
   * @param  {boolean}             shouldScrollToPrevious A boolean to determine scroll direction
   */
  selectEntityAndScroll(selectedEntity, shouldScrollToPrevious) {
    const entities = this.entityList
    const entityKeys = Object.keys(entities)


    // Get the next entity ref
    let selectedIndex = entityKeys.indexOf(selectedEntity) + 2 <= entityKeys.length - 1 ?
                        entityKeys.indexOf(selectedEntity) + 2 :
                        entityKeys.length - 1

    if (shouldScrollToPrevious) {
      // Get the previous entity ref
      selectedIndex = entityKeys.indexOf(selectedEntity) - 1 >= 0 ?
                      entityKeys.indexOf(selectedEntity) - 1 :
                      entityKeys[0]
    }

    // Get the DOM node
    const nextEntity = entities[entityKeys[selectedIndex]].entityList

    // Start the scrolling animation
    this.scrollToEntity(nextEntity, shouldScrollToPrevious)
  }

  /**
   * Scrolls the container until the given entity is visible on the viewport.
   *
   * @method scrollToEntity
   * @param  {string}       entity           Target entity to scroll to
   * @param  {boolean}      shouldScrollToPrevious A boolean to determine scroll direction
   */
  scrollToEntity(entity, shouldScrollToPrevious) {
    const container = this.container.pageContainerRef
    const containerLeft = container.getBoundingClientRect().left

    // Get the element's –– entity's –– offset/location in the viewport
    const elemLeft = entity.getBoundingClientRect().left
    const elemRight = entity.getBoundingClientRect().right

    // If we're scrolling back to the previous entity, we need to add some
    // offset so it doesn't just stay underneath the navigation bar.
    const visibleByPixels = shouldScrollToPrevious ? containerLeft : 0
    // Check if element is visible fully in the viewport. We're adding pixels to
    // window.innerWidth in order to stop the animation from stucking in a loop.
    const isVisible = (elemLeft >= visibleByPixels) && (elemRight <= window.innerWidth + NETWORK_WINDOW_OFFSET)

    if (!isVisible) {
      // If shouldScrollToPrevious is true, we should scroll to right –– backwards. Otherwise keep scrolling to left
      shouldScrollToPrevious ? container.scrollLeft -= NETWORK_SCROLL_AMOUNT : container.scrollLeft += NETWORK_SCROLL_AMOUNT
      // Continue scrolling animation
      requestAnimationFrame(() => this.scrollToEntity(entity, shouldScrollToPrevious))
    }
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
      selectedPopId
    } = this.state

    return (
      <Content className="network-content">

        <PageHeader pageSubTitle="Network">
          <div className="dropdown-toggle header-toggle">
            <h1>
              <TruncatedTitle content={activeAccount.get('name')} tooltipPlacement="bottom"/>
            </h1>
          </div>
        </PageHeader>

        <PageContainer ref={container => this.container = container} className="network-entities-container">
          <EntityList
            ref={groups => this.entityList.groupList = groups}
            entities={params.account && groups}
            addEntity={() => null}
            deleteEntity={() => (groupId) => this.handleGroupEdit(groupId)}
            editEntity={() => (groupId) => this.handleGroupEdit(groupId)}
            selectEntity={this.handleGroupClick}
            selectedEntityId={`${params.group}`}
            title="Groups"
          />

          <EntityList
            ref={networks => this.entityList.networkList = networks}
            entities={params.group && networks}
            addEntity={() => null}
            deleteEntity={() => (networkId) => this.handleNetworkEdit(networkId)}
            editEntity={() => (networkId) => this.handleNetworkEdit(networkId)}
            selectEntity={this.handleNetworkClick}
            selectedEntityId={`${params.network}`}
            title="Networks"
          />

          <EntityList
            ref={pops => this.entityList.popList = pops}
            entities={params.network && pops}
            addEntity={() => this.addEntity(ADD_EDIT_POP)}
            deleteEntity={() => (popId) => this.handlePopEdit(popId)}
            editEntity={() => (popId) => this.handlePopEdit(popId)}
            selectEntity={this.handlePopClick}
            selectedEntityId={`${params.pop}`}
            title="Pops"
          />

          <EntityList
            ref={pods => this.entityList.podList = pods}
            entities={params.pop && pods}
            addEntity={() => null}
            deleteEntity={() => (podId) => this.handlePodEdit(podId)}
            editEntity={() => (podId) => this.handlePodEdit(podId)}
            selectEntity={this.handlePodClick}
            selectedEntityId={`${params.pod}`}
            title="Pods"
          />

          <EntityList
            ref={nodes => this.entityList.nodeList = nodes}
            entities={params.pod && nodes}
            addEntity={() => null}
            deleteEntity={() => () => null}
            editEntity={() => () => null}
            selectEntity={() => null}
            title="Nodes"
          />
        </PageContainer>

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
            groupId={params.group}
            networkId={params.network}
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
