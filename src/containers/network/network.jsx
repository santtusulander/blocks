import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import {
  getAnalyticsUrl,
  getNetworkUrl
} from '../../util/routes.js'

import {
  ADD_EDIT_NETWORK,
  ADD_EDIT_POP,
  ADD_EDIT_POD,
  ADD_NODE,
  EDIT_NODE,
  ADD_EDIT_ACCOUNT
} from '../../constants/network-modals.js'

import {
  NETWORK_SCROLL_AMOUNT,
  NETWORK_NUMBER_OF_NODE_COLUMNS,
  NETWORK_NODES_PER_COLUMN
} from '../../constants/network'

import CONTENT_ITEMS_TYPES from '../../constants/content-items-types'
import * as PERMISSIONS from '../../constants/permissions'

import * as accountActionCreators from '../../redux/modules/account'
import * as groupActionCreators from '../../redux/modules/group'
import * as uiActionCreators from '../../redux/modules/ui'
import * as metricsActionCreators from '../../redux/modules/metrics'

import networkActions from '../../redux/modules/entities/networks/actions'
import { getByGroup as getNetworksByGroup } from '../../redux/modules/entities/networks/selectors'

import nodeActions from '../../redux/modules/entities/nodes/actions'
import { getByPod } from '../../redux/modules/entities/nodes/selectors'

import popActions from '../../redux/modules/entities/pops/actions'
import { getByNetwork as getPopsByNetwork } from '../../redux/modules/entities/pops/selectors'

import Content from '../../components/layout/content'
import PageContainer from '../../components/layout/page-container'
import PageHeader from '../../components/layout/page-header'
import TruncatedTitle from '../../components/truncated-title'
import EntityList from '../../components/network/entity-list'

import NetworkFormContainer from './modals/network-modal'
import PopFormContainer from './modals/pop-modal'
import PodFormContainer from './modals/pod-modal'
import AddNodeContainer from './modals/add-node-modal'
import EditNodeContainer from './modals/edit-node-modal'
import AccountForm from '../../components/account-management/account-form'

import checkPermissions from '../../util/permissions'

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

// This can be replaced with real URL params once we get API integrations to all the other network entities
const nodesUrlParams = { brand: 'udn', account: '238', group: '339', network: 'Test%202', pop: 'Pop-pop', pod: 'pod1' }

class Network extends React.Component {
  constructor(props) {
    super(props)

    this.addEntity = this.addEntity.bind(this)
    this.handleCancel = this.handleCancel.bind(this)

    this.handleAccountClick = this.handleAccountClick.bind(this)
    this.handleAccountEdit = this.handleAccountEdit.bind(this)
    this.handleAccountSave = this.handleAccountSave.bind(this)

    this.handleGroupClick = this.handleGroupClick.bind(this)
    this.handleGroupEdit = this.handleGroupEdit.bind(this)
    this.handleGroupSave = this.handleGroupSave.bind(this)
    this.handleGroupDelete = this.handleGroupDelete.bind(this)

    this.handleNetworkClick = this.handleNetworkClick.bind(this)
    this.handleNetworkEdit = this.handleNetworkEdit.bind(this)

    this.handlePopClick = this.handlePopClick.bind(this)
    this.handlePopEdit = this.handlePopEdit.bind(this)

    this.handlePodClick = this.handlePodClick.bind(this)
    this.handlePodEdit = this.handlePodEdit.bind(this)
    this.handlePodSave = this.handlePodSave.bind(this)
    this.handlePodDelete = this.handlePodDelete.bind(this)

    this.handleNodeEdit = this.handleNodeEdit.bind(this)

    this.scrollToEntity = this.scrollToEntity.bind(this)

    this.state = {
      networks: Immutable.List(),
      pops: Immutable.List(),
      pods: Immutable.List(),
      nodes: Immutable.List(),

      groupId: null,
      networkId: null,
      popId: null,
      podId: null,
      nodeId: null
    }

    this.entityList = {
      accountList: null,
      groupList: null,
      networkList: null,
      popList: null,
      podList: null,
      nodeList: null
    }
  }

  componentWillMount() {
    const { group, network } = this.props.params
    this.props.fetchData()

    this.props.fetchNetworks(group)
    this.props.fetchPops(network)
  }

  componentWillReceiveProps(nextProps) {
    const { group, network, pop } = nextProps.params

    if (group !== this.props.params.group) {
      this.props.fetchNetworks( group )
    }

    if (network !== this.props.params.network) {
      this.props.fetchPops( network )
    }

    if (pop) {
      this.setState({ pods: placeholderPods })
    }

    if (this.props.params.group !== group) {
      this.props.fetchNetworks( group )
    }
  }

  componentDidUpdate(prevProps) {
    // We're doing the scrolling in componentDidUpdate because we'll need to access
    // the DOM element's widths and other attributes AFTER they become visible.
    // Otherwise, for example, we're not able to do the twoLastFitToView check
    // in scrollToEntity method. Having the scrolling determined here also
    // allows us to use the browsers navigation buttons to active the scrolling.
    const { group, network, pop, pod } = this.props.params

    if (group) {
      this.selectEntityAndScroll('groupList', false)
    } else if (prevProps.params.group && !group) {
      this.selectEntityAndScroll('groupList', true)
    }

    if (network) {
      this.selectEntityAndScroll('networkList', false)
    } else if (prevProps.params.network && !network) {
      this.selectEntityAndScroll('networkList', true)
    }

    if (pop) {
      this.selectEntityAndScroll('popList', false)
    } else if (prevProps.params.pop && !pop) {
      this.selectEntityAndScroll('popList', true)
    }

    if (pod) {
      this.selectEntityAndScroll('podList', false)
    } else if (prevProps.params.pod && !pod) {
      this.selectEntityAndScroll('podList', true)
    }
  }

  addEntity(entityModal) {
    switch (entityModal) {

      case ADD_EDIT_ACCOUNT:
        this.setState({groupId: null})
        this.props.toggleModal(ADD_EDIT_ACCOUNT)
        break;

      case ADD_EDIT_NETWORK:
        this.setState({networkId: null})
        this.props.toggleModal(ADD_EDIT_NETWORK)
        break;

      case ADD_EDIT_POP:
        this.setState({popId: null})
        this.props.toggleModal(ADD_EDIT_POP)
        break;

      case ADD_EDIT_POD:
        this.setState({podId: null})
        this.props.toggleModal(ADD_EDIT_POD)
        break;

      case ADD_NODE:
        this.setState({nodeId: null})
        this.props.toggleModal(ADD_NODE)
        break;

      default:
        break;
    }
  }

  handleCancel(entityModal) {
    switch (entityModal) {

      case ADD_EDIT_ACCOUNT:
        this.props.toggleModal(null)
        break;

      case ADD_EDIT_NETWORK:
        this.props.toggleModal(null)
        this.setState({networkId: null})
        break;

      case ADD_EDIT_POP:
        this.props.toggleModal(null)
        this.setState({popId: null})
        break;

      case ADD_EDIT_POD:
        this.props.toggleModal(null)
        this.setState({podId: null})
        break;

      case ADD_NODE:
        this.props.toggleModal(null)
        this.setState({nodeId: null})
        break;

      case EDIT_NODE:
        this.props.toggleModal(null)
        this.setState({nodeId: null})
        break;

      default:
        break;
    }
  }

  /* ==== Account Handlers ==== */
  handleAccountClick(accountId) {
    return this.determineNextState({
      currentId: accountId,
      // We need to set the previousId when we're navigating/scrolling backwards
      // and the only way to navigate back from and hide the groups is to check
      // if the URL has 'groups' included.
      previousId: this.hasGroupsInUrl() ? this.props.params.account : null,
      // TODO UDNP-2563: Remove -v2 once done with all the Network changes
      goToRoute: 'groups-v2',
      goBackToRoute: 'account-v2',
      returnUrl: true
    })
  }

  handleAccountEdit() {
    this.props.toggleModal(ADD_EDIT_ACCOUNT)
  }

  handleAccountSave(brandId, accountId, data) {
    this.props.accountActions.updateAccount(brandId, accountId, data)
      .then(() => this.handleCancel(ADD_EDIT_ACCOUNT))
  }

  /* ==== Group Handlers ==== */
  handleGroupClick(groupId) {
    return this.determineNextState({
      currentId: groupId,
      previousId: this.props.params.group,
      goToRoute: 'group',
      // TODO UDNP-2563: Remove -v2 once done with all the Network changes
      goBackToRoute: 'groups-v2',
      returnUrl: true
    })
  }

  handleGroupEdit(groupId) {
    this.setState({groupId: groupId})
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
    this.determineNextState({
      currentId: networkId,
      previousId: this.props.params.network,
      goToRoute: 'network',
      goBackToRoute: 'group'
    })
  }

  handleNetworkEdit(networkId) {
    this.setState({networkId: networkId})
    this.props.toggleModal(ADD_EDIT_NETWORK)
  }

  /* ==== POP Handlers ==== */
  handlePopClick(popId) {
    this.determineNextState({
      currentId: popId,
      previousId: this.props.params.pop,
      goToRoute: 'pop',
      goBackToRoute: 'network'
    })
  }

  handlePopEdit(popId) {
    this.setState({popId: popId})
    this.props.toggleModal(ADD_EDIT_POP)
  }

  /* ==== POD Handlers ==== */
  handlePodClick(podId) {
    const { brand, account, group, network, pop } = this.props.params

    this.props.fetchNodes({ brand, account, group, network, pop, pod: podId })
      .then(() => {

        this.determineNextState({
          currentId: podId,
          previousId: this.props.params.pod,
          goToRoute: 'pod',
          goBackToRoute: 'pop'
        })
      })
  }

  handlePodEdit(podId) {
    this.setState({podId: podId})
    this.props.toggleModal(ADD_EDIT_POD)
  }

  handlePodSave() {
    // TODO
  }

  handlePodDelete() {
    // TODO
  }

  /* ==== Node Handlers ==== */
  handleNodeEdit(nodeId) {
    this.setState({ nodeId: [ nodeId ] })
    this.props.toggleModal(EDIT_NODE)
  }

  /**
   * Determines the next state and sets the correct URL based on id.
   * It checks if the user clicked an already selected entity and then either
   * goes up one level or unselects it and goes back one level.
   *
   * @method determineNextState
   * @param  {number OR string} currentId     ID of recently selected entity
   * @param  {number OR string} previousId    ID of already selected entity
   * @param  {string}           goToRoute     Name of a level where we should go to
   * @param  {string}           goBackToRoute Name of a level where we should go back to
   * @return {boolean}                        Boolean to determine scrolling direction
   */
  determineNextState({ currentId, previousId, goToRoute, goBackToRoute, returnUrl } = {}) {
    // Transform IDs to strings as they can be numbers, too.
    const shouldScrollToPrevious = previousId && currentId.toString() === previousId.toString()
    // TODO UDNP-2563: Remove .split('-v2')[0] once done with all the Network changes
    const entityId = shouldScrollToPrevious ? this.props.params[goBackToRoute.split('-v2')[0]] : currentId
    const nextEntity = shouldScrollToPrevious ? goBackToRoute : goToRoute

    const url = getNetworkUrl(nextEntity, entityId, this.props.params)

    if (!returnUrl) {
      return this.props.router.push(url)
    }

    return url
  }

  /**
   * Selects the next entity to be scrolled to. Entities are determined by refs.
   *
   * @method selectEntityAndScroll
   * @param  {string}              selectedEntity   Name of current entity
   * @param  {boolean}             shouldScrollToPrevious A boolean to determine scroll direction
   */
  selectEntityAndScroll(selectedEntity, shouldScrollToPrevious) {
    const { entities, entityKeys } = this.elementAndContainerValues()

    // Get the next entity ref
    let selectedIndex = entityKeys.indexOf(selectedEntity)

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
   * @param  {DOMElement}   entity                 Target entity to scroll to
   * @param  {boolean}      shouldScrollToPrevious A boolean to determine scroll direction
   */
  scrollToEntity(entity, shouldScrollToPrevious) {
    const {
      container,
      containerLeft,
      containerRight,
      containerScrollLeft,
      containerWidth,
      containerScrollWidth,
      elemLeft,
      elemRight,
      lastEntity,
      secondLastEntity
    } = this.elementAndContainerValues(entity)

    // If we're scrolling back to the previous entity, we need to add some
    // offset so it doesn't just stay underneath the navigation bar.
    const visibleByPixels = containerLeft

    // Check if element is visible fully in the viewport.
    const leftSideVisibility = shouldScrollToPrevious ? (elemLeft >= visibleByPixels) : (elemLeft <= visibleByPixels)
    const rightSideVisibility = elemRight <= containerRight
    const isVisible = leftSideVisibility && rightSideVisibility

    // We also have to check if we're already at the right end of the scrolling container
    // or that we're scrolling backwards to prevent scrolling looping or not working.
    // Without checking shouldScrollToPrevious the backwards scroll won't happen past
    // PODs and without checking the right end the scrolling stays in a loop on bigger
    // resolutions (above 2000px in width).
    const scrollingBackOrAtEnd = shouldScrollToPrevious || containerScrollWidth - containerScrollLeft !== containerWidth

    // If two last entities fit into the view, we should scroll to the very end
    const entityWidthSum = lastEntity.clientWidth + entity.clientWidth
    const twoLastFitToView = entity === secondLastEntity && entityWidthSum < containerWidth && containerScrollWidth - containerScrollLeft !== containerWidth

    if ((!isVisible && scrollingBackOrAtEnd) || twoLastFitToView) {
      // If shouldScrollToPrevious is true, we should scroll to right –– backwards. Otherwise keep scrolling to left
      shouldScrollToPrevious ? container.scrollLeft -= NETWORK_SCROLL_AMOUNT : container.scrollLeft += NETWORK_SCROLL_AMOUNT
      // Continue scrolling animation
      requestAnimationFrame(() => this.scrollToEntity(entity, shouldScrollToPrevious))
    }
  }

  /**
   * Wrapper for various DOM element values and what-not.
   *
   * @method elementAndContainerValues
   * @param  {DOMElement}              entity Target entity
   * @return {object}                         Object containing needed values for
   *                                          calculations
   */
  elementAndContainerValues(entity) {
    const entities = this.entityList
    const entityKeys = Object.keys(entities)
    const container = this.container.pageContainerRef
    const containerLeft = container.getBoundingClientRect().left
    const containerRight = container.getBoundingClientRect().right
    const containerScrollLeft = container.scrollLeft
    const containerWidth = container.clientWidth
    const containerScrollWidth = container.scrollWidth
    const lastEntity = entities[entityKeys[entityKeys.length - 1]].entityList
    const secondLastEntity = entities[entityKeys[entityKeys.length - 2]].entityList
    // Get the element's –– entity's –– offset/location in the viewport
    const elemLeft = entity && entity.getBoundingClientRect().left
    const elemRight = entity && entity.getBoundingClientRect().right

    return {
      entities,
      entityKeys,
      elemLeft,
      elemRight,
      container,
      containerLeft,
      containerRight,
      containerScrollLeft,
      containerWidth,
      containerScrollWidth,
      lastEntity,
      secondLastEntity
    }
  }

  /**
   * Checks if the url has 'groups' string in it.
   *
   * @method hasGroupsInUrl
   * @return {Boolean}      Boolean of having groups or not in the url
   */
  hasGroupsInUrl() {
    return this.props.location.pathname.includes('groups')
  }

  render() {
    const {
      activeAccount,
      networkModal,
      groups,
      params,
      networks,
      pops,
      currentUser,
      roles
    } = this.props

    const {
      pods,
      podId
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
            ref={accounts => this.entityList.accountList = accounts}
            entities={params.account && Immutable.List([activeAccount])}
            addEntity={() => null}
            deleteEntity={() => null}
            editEntity={this.handleAccountEdit}
            selectEntity={this.handleAccountClick}
            selectedEntityId={this.hasGroupsInUrl() ? `${params.account}` : ''}
            title="Account"
            showButtons={false}
            showAsStarbursts={true}
            starburstData={{
              dailyTraffic: this.props.accountDailyTraffic,
              contentMetrics: this.props.accountMetrics,
              type: CONTENT_ITEMS_TYPES.ACCOUNT,
              chartWidth: '450',
              barMaxHeight: '30',
              analyticsURLBuilder: getAnalyticsUrl,
              isAllowedToConfigure: checkPermissions(roles, currentUser, PERMISSIONS.MODIFY_ACCOUNTS)
            }}
            params={params}
            nextEntityList={this.entityList.groupList && this.entityList.groupList.entityListItems}
          />

          <EntityList
            ref={groups => this.entityList.groupList = groups}
            entities={this.hasGroupsInUrl() ? groups : Immutable.List()}
            addEntity={() => null}
            deleteEntity={this.handleGroupEdit}
            editEntity={this.handleGroupEdit}
            selectEntity={this.handleGroupClick}
            selectedEntityId={`${params.group}`}
            title="Groups"
            showAsStarbursts={true}
            starburstData={{
              dailyTraffic: this.props.groupDailyTraffic,
              contentMetrics: this.props.groupMetrics,
              type: CONTENT_ITEMS_TYPES.GROUP,
              chartWidth: '350',
              barMaxHeight: '30',
              analyticsURLBuilder: getAnalyticsUrl,
              isAllowedToConfigure: checkPermissions(roles, currentUser, PERMISSIONS.MODIFY_GROUP)
            }}
            params={params}
            nextEntityList={this.entityList.networkList && this.entityList.networkList.entityListItems}
          />

          <EntityList
            ref={networkListRef => this.entityList.networkList = networkListRef}
            entities={params.group && networks}
            addEntity={() => this.addEntity(ADD_EDIT_NETWORK)}
            deleteEntity={() => () => null}
            editEntity={this.handleNetworkEdit}
            selectEntity={this.handleNetworkClick}
            selectedEntityId={`${params.network}`}
            title="Networks"
            nextEntityList={this.entityList.popList && this.entityList.popList.entityListItems}
          />

          <EntityList
            ref={pops => this.entityList.popList = pops}
            entities={params.network && pops}
            addEntity={() => this.addEntity(ADD_EDIT_POP)}
            deleteEntity={() => () => null}
            editEntity={this.handlePopEdit}
            selectEntity={this.handlePopClick}
            selectedEntityId={`${params.pop}`}
            title="Pops"
            nextEntityList={this.entityList.podList && this.entityList.podList.entityListItems}
          />

          <EntityList
            ref={pods => this.entityList.podList = pods}
            addEntity={() => this.addEntity(ADD_EDIT_POD)}
            deleteEntity={() => () => null}
            editEntity={this.handlePodEdit}
            entities={params.pop && pods}
            selectEntity={this.handlePodClick}
            selectedEntityId={`${params.pod}`}
            title="Pods"
            nextEntityList={this.entityList.nodeList && this.entityList.nodeList.entityListItems}
          />

          <EntityList
            ref={nodes => this.entityList.nodeList = nodes}
            entities={params.pod && this.props.getNodes(params.pod)}
            addEntity={() => this.addEntity(ADD_NODE)}
            deleteEntity={() => () => null}
            editEntity={this.handleNodeEdit}
            selectEntity={() => null}
            title="Nodes"
            multiColumn={true}
            numOfColumns={NETWORK_NUMBER_OF_NODE_COLUMNS}
            itemsPerColumn={NETWORK_NODES_PER_COLUMN}

          />
        </PageContainer>

        {networkModal === ADD_EDIT_ACCOUNT &&
          <AccountForm
            id="account-form"
            onSave={this.handleAccountSave}
            account={activeAccount}
            onCancel={() => this.handleCancel(ADD_EDIT_ACCOUNT)}
            show={true}
          />
        }

        {networkModal === ADD_EDIT_NETWORK &&
          <NetworkFormContainer
            accountId={params.account}
            brand={params.brand}
            groupId={params.group}
            networkId={this.state.networkId}
            onCancel={() => this.handleCancel(ADD_EDIT_NETWORK)}
          />
        }

        {networkModal === ADD_EDIT_POP &&
          <PopFormContainer
            accountId={params.account}
            brand={params.brand}
            groupId={params.group}
            networkId={params.network}
            popId={this.state.popId}
            onCancel={() => this.handleCancel(ADD_EDIT_POP)}
          />
        }

        {networkModal === ADD_EDIT_POD &&
          <PodFormContainer
            id="pod-form"
            podId={podId}
            edit={(podId !== null) ? true : false}
            onSave={this.handlePodSave}
            onCancel={() => this.handleCancel(ADD_EDIT_POD)}
            onDelete={() => this.handlePodDelete(podId)}
            show={true}
            {...params}
          />
        }

        {networkModal === ADD_NODE &&
          <AddNodeContainer
            id="node-add-form"
            params={params}
            onSave={this.handleNodeSave}
            onCancel={() => this.handleCancel(ADD_NODE)}
            show={true}
          />
        }

        {networkModal === EDIT_NODE &&
          <EditNodeContainer
            id="node-edit-form"
            nodeIds={this.state.nodeId}
            params={params}
            onCancel={() => this.handleCancel(EDIT_NODE)}
            show={true}
          />
        }
      </Content>
    )
  }
}

Network.displayName = 'Network'
Network.propTypes = {
  accountActions: React.PropTypes.object,
  accountDailyTraffic: React.PropTypes.instanceOf(Immutable.List),
  accountMetrics: React.PropTypes.instanceOf(Immutable.List),
  activeAccount: PropTypes.instanceOf(Immutable.Map),
  currentUser: PropTypes.instanceOf(Immutable.Map),
  fetchData: PropTypes.func,
  fetchNodes: PropTypes.func,
  getNodes: PropTypes.func,
  fetchNetworks: PropTypes.func,
  fetchPops: PropTypes.func,
  groupDailyTraffic: React.PropTypes.instanceOf(Immutable.List),
  groupMetrics: React.PropTypes.instanceOf(Immutable.List),
  groups: PropTypes.instanceOf(Immutable.List),
  location: PropTypes.object,
  networkModal: PropTypes.string,
  networks: PropTypes.instanceOf(Immutable.List),
  params: PropTypes.object,
  pops: PropTypes.instanceOf(Immutable.List),
  roles: PropTypes.instanceOf(Immutable.List),
  router: PropTypes.object,
  toggleModal: PropTypes.func
}

Network.defaultProps = {
  activeAccount: Immutable.Map(),
  groups: Immutable.List()
}

const mapStateToProps = (state, ownProps) => {
  return {
    getNodes: getByPod(state),
    //select networks by Group from redux
    networks: getNetworksByGroup(state, ownProps.params.group),
    pops: getPopsByNetwork(state, ownProps.params.network),
    networkModal: state.ui.get('networkModal'),
    activeAccount: state.account.get('activeAccount'),
    fetching: state.group.get('fetching'),
    groups: state.group.get('allGroups'),
    groupDailyTraffic: state.metrics.get('groupDailyTraffic'),
    groupMetrics: state.metrics.get('groupMetrics'),
    accountDailyTraffic: state.metrics.get('accountDailyTraffic'),
    accountMetrics: state.metrics.get('accountMetrics'),
    roles: state.roles.get('roles'),
    currentUser: state.user.get('currentUser')
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { brand, account, group, pod } = ownProps.params
  const accountActions = bindActionCreators(accountActionCreators, dispatch)
  const groupActions = bindActionCreators(groupActionCreators, dispatch)
  const uiActions = bindActionCreators(uiActionCreators, dispatch)
  const metricsActions = bindActionCreators(metricsActionCreators, dispatch)
  const metricsOpts = {
    account: account,
    startDate: moment.utc().endOf('day').add(1,'second').subtract(28, 'days').format('X'),
    endDate: moment.utc().endOf('day').format('X')
  }
  const accountMetricsOpts = Object.assign({
    list_children: false
  }, metricsOpts)

  const fetchNodes = params => dispatch(nodeActions.fetchAll(params))

  const fetchData = () => {
    //TODO: Fetch accounts and group using entities/redux
    accountActions.fetchAccount(brand, account)
    groupActions.startFetching()
    metricsActions.startGroupFetching()
    groupActions.fetchGroups(brand, account)
    metricsActions.fetchDailyAccountTraffic(accountMetricsOpts)
    metricsActions.fetchAccountMetrics(accountMetricsOpts)
    metricsActions.fetchGroupMetrics(metricsOpts)
    metricsActions.fetchDailyGroupTraffic(metricsOpts)
    pod && fetchNodes(ownProps.params)
  }

  return {
    fetchNodes,
    toggleModal: uiActions.toggleNetworkModal,
    fetchData: fetchData,
    groupActions: groupActions,
    accountActions: accountActions,
    //fetch networks from API (fetchByIds) as we don't get list of full objects from API => iterate each id)
    fetchNetworks: (group) => group && networkActions.fetchByIds(dispatch)({brand, account, group}),
    fetchPops: (network) => network && dispatch( popActions.fetchAll({brand, account, group, network} ) )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Network))
