import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import moment from 'moment'

import {
  getAnalyticsUrl,
  getNetworkUrl
} from '../../util/routes.js'

import {
  ADD_EDIT_NETWORK,
  ADD_EDIT_GROUP,
  ADD_EDIT_POP,
  ADD_EDIT_POD,
  ADD_NODE,
  EDIT_NODE,
  ADD_EDIT_ACCOUNT
} from '../../constants/network-modals.js'

import {
  DELETE_GROUP
} from '../../constants/account-management-modals.js'

import {
  NETWORK_SCROLL_AMOUNT,
  NETWORK_NUMBER_OF_NODE_COLUMNS,
  NETWORK_NODES_PER_COLUMN,
  NODE_ROLE_OPTIONS,
  NODE_ENVIRONMENT_OPTIONS,
  POD_TYPE_OPTIONS,
  DISCOVERY_METHOD_OPTIONS
} from '../../constants/network'

import CONTENT_ITEMS_TYPES from '../../constants/content-items-types'
import * as PERMISSIONS from '../../constants/permissions'

import * as uiActionCreators from '../../redux/modules/ui'
import * as metricsActionCreators from '../../redux/modules/metrics'

import accountsActions from '../../redux/modules/entities/accounts/actions'
import { getById as getAccountById} from '../../redux/modules/entities/accounts/selectors'

// TODO: Rename to groupActions once the old groupActions is abandoned
import groupActions from '../../redux/modules/entities/groups/actions'
import {getByAccount as getGroupsByAccount} from '../../redux/modules/entities/groups/selectors'

import { getFetchingByTag } from '../../redux/modules/fetching/selectors'

import nodeActions from '../../redux/modules/entities/nodes/actions'
import { getByPod as getNodesByPod } from '../../redux/modules/entities/nodes/selectors'

import networkActions from '../../redux/modules/entities/networks/actions'
import { getByGroup as getNetworksByGroup } from '../../redux/modules/entities/networks/selectors'

import popActions from '../../redux/modules/entities/pops/actions'
import { getByNetwork as getPopsByNetwork } from '../../redux/modules/entities/pops/selectors'

import { getByPop as getPodsByPop } from '../../redux/modules/entities/pods/selectors'

import { buildReduxId, parseResponseError } from '../../redux/util'
import { getCurrentUser } from '../../redux/modules/user'

import Content from '../../components/shared/layout/content'
import PageContainer from '../../components/shared/layout/page-container'
import PageHeader from '../../components/shared/layout/page-header'
import TruncatedTitle from '../../components/shared/page-elements/truncated-title'
import EntityList from '../../components/network/entity-list'
import ModalWindow from '../../components/shared/modal'

import GroupFormContainer from '../../containers/account-management/modals/group-form'
import NetworkFormContainer from './modals/network-modal'
import PopFormContainer from './modals/pop-modal'
import PodFormContainer from './modals/pod-modal'
import AddNodeContainer from './modals/add-node-modal'
import EditNodeContainer from './modals/edit-node-modal'
import EntityEdit from '../../components/account-management/entity-edit'

import { sortByKey } from '../../util/helpers'
import { checkUserPermissions } from '../../util/permissions'

class Network extends React.Component {
  constructor(props) {
    super(props)

    this.container = undefined
    this.notificationTimeout = null
    this.showNotification = this.showNotification.bind(this)

    this.addEntity = this.addEntity.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleReference = this.handleReference.bind(this)

    this.handleAccountClick = this.handleAccountClick.bind(this)
    this.handleAccountEdit = this.handleAccountEdit.bind(this)
    this.handleAccountSave = this.handleAccountSave.bind(this)

    this.handleGroupClick = this.handleGroupClick.bind(this)
    this.handleGroupEdit = this.handleGroupEdit.bind(this)
    this.handleGroupSave = this.handleGroupSave.bind(this)
    this.handleGroupDelete = this.handleGroupDelete.bind(this)
    this.determineNextGroupState = this.determineNextGroupState.bind(this)

    this.handleNetworkClick = this.handleNetworkClick.bind(this)
    this.handleNetworkEdit = this.handleNetworkEdit.bind(this)

    this.handlePopClick = this.handlePopClick.bind(this)
    this.handlePopEdit = this.handlePopEdit.bind(this)

    this.handlePodClick = this.handlePodClick.bind(this)
    this.handlePodEdit = this.handlePodEdit.bind(this)

    this.handleNodeEdit = this.handleNodeEdit.bind(this)

    this.scrollToEntity = this.scrollToEntity.bind(this)

    this.podContentTextGenerator = this.podContentTextGenerator.bind(this)

    this.nodeContentTextGenerator = this.nodeContentTextGenerator.bind(this)
    this.state = {
      networks: Immutable.List(),
      pops: Immutable.List(),
      pods: Immutable.List(),
      nodes: Immutable.List(),

      groupId: null,
      networkId: null,
      popId: null,
      podId: null,
      nodeId: null,

      groupToDelete: null
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
    this.props.fetchData()

    this.props.fetchNetworks(this.props.params)
    this.props.fetchPops(this.props.params)
    this.props.fetchNodes(this.props.params)
  }

  componentWillReceiveProps(nextProps) {
    const { group, network, pod } = nextProps.params

    if (group !== this.props.params.group) {
      this.props.fetchNetworks(nextProps.params)
    }

    if (network !== this.props.params.network) {
      this.props.fetchPops(nextProps.params)
    }

    if (pod !== this.props.params.pod) {
      this.props.fetchNodes(nextProps.params)
    }

  }

  componentDidUpdate(prevProps) {
    // We're doing the scrolling in componentDidUpdate because we'll need to access
    // the DOM element's widths and other attributes AFTER they become visible.
    // Otherwise, for example, we're not able to do the twoLastFitToView check
    // in scrollToEntity method. Having the scrolling determined here also
    // allows us to use the browsers navigation buttons to active the scrolling.
    const { group, network, pop, pod } = this.props.params

    if (!this.container) {
      // There is no reason to perform any operation on detached container.
      return
    }

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

  handleReference(container) {
    // avoid referenece callback re-generation
    // https://github.com/facebook/react/issues/6249
    this.container = container
  }

  addEntity(entityModal) {
    switch (entityModal) {

      case ADD_EDIT_GROUP:
        this.setState({groupId: null})
        this.props.toggleModal(ADD_EDIT_GROUP)
        break;

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

      case ADD_EDIT_GROUP:
        this.props.toggleModal(null)
        this.setState({groupId: null})
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
      goToRoute: 'groups',
      goBackToRoute: 'account',
      returnUrl: true
    })
  }

  handleAccountEdit() {
    this.props.toggleModal(ADD_EDIT_ACCOUNT)
  }

  handleAccountSave(brandId, accountId, data) {
    this.props.updateAccount({brand: brandId, id: accountId, payload: data})
      .then(() => this.handleCancel(ADD_EDIT_ACCOUNT))
  }

  /* ==== Group Handlers ==== */
  determineNextGroupState(groupId) {
    return this.determineNextState({
      currentId: groupId,
      previousId: this.props.params.group,
      goToRoute: 'group',
      goBackToRoute: 'groups',
      returnUrl: true
    })
  }

  handleGroupClick(groupId) {
    this.determineNextGroupState(groupId)
  }

  handleGroupEdit(groupId) {
    this.setState({groupId: groupId})
    this.props.toggleModal(ADD_EDIT_GROUP)
  }

  // handleGroupSave(data) {
  //   console.log(data)
  //   return this.props.groupActions.createGroup('udn', this.props.activeAccount.get('id'), data)
  //     .then(action => {
  //       this.handleCancel(ADD_EDIT_GROUP)
  //       return action.payload
  //     })
  // }

  handleGroupSave(payload) {
    const { edit } = payload
    if (edit) {
      const { groupId, data } = payload

      return Promise.all([
        this.props.updateGroup(
          {
            brand: 'udn',
            account: this.props.activeAccount.get('id'),
            id: groupId,
            payload: data
          }
        )
      ])
        .then(() => {
          this.props.toggleModal(null)
          this.showNotification(<FormattedMessage id="portal.accountManagement.groupUpdated.text"/>)
        })
    } else {
      const { data } = payload
      return this.props.createGroup({brand: 'udn', account: this.props.activeAccount.get('id'), payload: data })
        .then(action => {
          this.props.toggleModal(null)
          this.showNotification(<FormattedMessage id="portal.accountManagement.groupCreated.text"/>)
          return action.payload
        })
    }
  }

  showDeleteGroupModal(group) {
    this.setState({ groupToDelete: group });

    this.props.toggleModal(null)
    this.props.toggleDeleteConfirmationModal(DELETE_GROUP)
  }

  handleGroupDelete(group) {
    const { removeGroup } = this.props
    const url = getNetworkUrl('groups',   this.props.activeAccount.get('id'), this.props.params)

    return removeGroup({
      brand: 'udn',
      account: this.props.activeAccount.get('id'),
      id: group.get('id')
    }).then(response => {
      this.props.toggleDeleteConfirmationModal(null)
      this.showNotification(<FormattedMessage id="portal.accountManagement.groupDeleted.text"/>)
      this.props.router.push(url)
      response.error &&
        this.props.uiActions.showInfoDialog({
          title: <FormattedMessage id="portal.errorModal.error.text"/>,
          content: parseResponseError(response.payload),
          okButton: true,
          cancel: () => this.props.uiActions.hideInfoDialog()
        })
    })
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
    this.determineNextState({
      currentId: podId,
      previousId: this.props.params.pod,
      goToRoute: 'pod',
      goBackToRoute: 'pop'
    })
  }

  handlePodEdit(podId) {
    this.setState({podId: podId})
    this.props.toggleModal(ADD_EDIT_POD)
  }

  podContentTextGenerator(entity) {
    const { intl: { formatMessage } } = this.props
    const podType = entity.get('pod_type')
    const podDiscoveryMethod = entity.get('UIDiscoveryMethod')
    const UIType = POD_TYPE_OPTIONS.filter(({value}) => value === podType)[0]
    const UIDiscoveryMethod = DISCOVERY_METHOD_OPTIONS.filter(({value}) => value === podDiscoveryMethod)[0]
    return `${UIType ? formatMessage({id: UIType.label}) : formatMessage({id: 'portal.network.podForm.pod_type.options.unknown.label'})},
            ${UIDiscoveryMethod ? formatMessage({id: UIDiscoveryMethod.label}) : formatMessage({id: 'portal.network.podForm.discoveryMethod.options.unknown.label'})}`
  }

  /* ==== Node Handlers ==== */
  handleNodeEdit(nodeId) {
    this.setState({ nodeId: [ nodeId ] })
    this.props.toggleModal(EDIT_NODE)
  }

  nodeContentTextGenerator(entity) {
    const { intl: { formatMessage } } = this.props

    const nodeRole = entity.getIn(['roles', '0'])
    const nodeEnv = entity.get('env')
    const UIRole = NODE_ROLE_OPTIONS.filter(({value}) => value === nodeRole)[0]
    const UIEnv = NODE_ENVIRONMENT_OPTIONS.filter(({value, cacheValue}) => (value === nodeEnv || cacheValue === nodeEnv))[0]
    return `${UIRole ? formatMessage({id: UIRole.label}) : formatMessage({id: 'portal.network.nodeForm.roles.unknown'})},
            ${UIEnv ? formatMessage({id: UIEnv.label}) : formatMessage({id: 'portal.network.nodeForm.environment.unknown'})}`
  }

  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.uiActions.changeNotification(message)
    this.notificationTimeout = setTimeout(this.props.uiActions.changeNotification, 10000)
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
    const entityId = shouldScrollToPrevious ? this.props.params[goBackToRoute] : currentId
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
    /* If container is not yet initialized - return */
    if (!this.container) {
      return
    }

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
   * @return {Boolean} Boolean of having groups or not in the url
   */
  hasGroupsInUrl() {
    return this.props.location.pathname.includes('groups')
  }

  render() {
    const {
      isFetching,
      accountManagementModal,
      activeAccount,
      networkModal,
      groups,
      params,
      networks,
      pops,
      pods,
      nodes,
      currentUser,
      roles
    } = this.props

    let deleteModalProps = null
    switch (accountManagementModal) {
      case DELETE_GROUP:
        deleteModalProps = {
          title: <FormattedMessage id="portal.deleteModal.header.text" values={{itemToDelete: this.state.groupToDelete.get('name')}}/>,
          content: <FormattedMessage id="portal.accountManagement.deleteGroupConfirmation.text"/>,
          verifyDelete: true,
          cancelButton: true,
          deleteButton: true,
          cancel: () => this.props.toggleDeleteConfirmationModal(null),
          onSubmit: () => this.handleGroupDelete(this.state.groupToDelete)
        }
        break
    }

    return (
      <Content className="network-content">

        <PageHeader pageSubTitle={<FormattedMessage id="portal.navigation.network.text"/>}>
          <div className="dropdown-toggle header-toggle">
            <h1>
              <TruncatedTitle content={activeAccount.get('name')} tooltipPlacement="bottom"/>
            </h1>
          </div>
        </PageHeader>

        <PageContainer ref={this.handleReference} className="network-entities-container">
          <div className="network-entities-wrapper">
            <EntityList
              fetching={isFetching('account')}
              ref={(accounts) => {
                this.entityList.accountList = accounts
                return this.entityList.accountList
              }}
              entities={params.account && Immutable.List([activeAccount])}
              addEntity={() => null}
              editEntity={this.handleAccountEdit}
              selectEntity={this.handleAccountClick}
              selectedEntityId={this.hasGroupsInUrl() ? `${params.account}` : ''}
              title={<FormattedMessage id='portal.network.account.title'/>}
              showButtons={false}
              showAsStarbursts={true}
              starburstData={{
                linkGenerator: this.handleAccountClick,
                dailyTraffic: this.props.accountDailyTraffic,
                contentMetrics: this.props.accountMetrics,
                type: CONTENT_ITEMS_TYPES.ACCOUNT,
                chartWidth: '450',
                barMaxHeight: '30',
                analyticsURLBuilder: getAnalyticsUrl
              }}
              params={params}
              nextEntityList={this.entityList.groupList && this.entityList.groupList.entityListItems}
              isAllowedToConfigure={checkUserPermissions(currentUser, PERMISSIONS.MODIFY_ACCOUNT)}
            />

            <EntityList
              noDataText={<FormattedMessage id="portal.network.entities.groups.noData"/>}
              fetching={isFetching('groups-network')}
              isParentSelected={!!this.props.params.account}
              ref={(groupsRef) => {
                this.entityList.groupList = groupsRef
                return this.entityList.groupList
              }}
              entities={groups}
              addEntity={() => this.addEntity(ADD_EDIT_GROUP)}
              editEntity={this.handleGroupEdit}
              selectEntity={this.handleGroupClick}
              selectedEntityId={`${params.group}`}
              title={<FormattedMessage id='portal.network.groups.title'/>}
              disableButtons={!this.hasGroupsInUrl()}
              showAsStarbursts={true}
              starburstData={{
                linkGenerator: this.determineNextGroupState,
                dailyTraffic: this.props.groupDailyTraffic,
                contentMetrics: this.props.groupMetrics,
                type: CONTENT_ITEMS_TYPES.GROUP,
                chartWidth: '350',
                barMaxHeight: '30',
                analyticsURLBuilder: getAnalyticsUrl
              }}
              params={params}
              nextEntityList={this.entityList.networkList && this.entityList.networkList.entityListItems}
              creationPermission={PERMISSIONS.CREATE_GROUP}
              isAllowedToConfigure={checkUserPermissions(currentUser, PERMISSIONS.VIEW_GROUP)}
            />

            <EntityList
              fetching={isFetching('network')}
              isParentSelected={!!this.props.params.group}
              noDataText={<FormattedMessage id="portal.network.entities.networks.noData"/>}
              ref={(networkListRef) => {
                this.entityList.networkList = networkListRef
                return this.entityList.networkList
              }}
              entities={params.group && networks}
              addEntity={() => this.addEntity(ADD_EDIT_NETWORK)}
              editEntity={this.handleNetworkEdit}
              selectEntity={this.handleNetworkClick}
              selectedEntityId={`${params.network}`}
              title={<FormattedMessage id='portal.network.networks.title'/>}
              disableButtons={!params.group}
              nextEntityList={this.entityList.popList && this.entityList.popList.entityListItems}
              contentTextGenerator={entity => entity.get('description')}
              creationPermission={PERMISSIONS.CREATE_NETWORK}
              viewPermission={PERMISSIONS.VIEW_NETWORK}
            />

            <EntityList
              fetching={isFetching('pop')}
              isParentSelected={!!this.props.params.network}
              noDataText={<FormattedMessage id="portal.network.entities.pops.noData"/>}
              ref={(popsRef) => {
                this.entityList.popList = popsRef
                return this.entityList.popList
              }}
              entities={params.network && pops}
              addEntity={() => this.addEntity(ADD_EDIT_POP)}
              editEntity={this.handlePopEdit}
              selectEntity={this.handlePopClick}
              selectedEntityId={`${params.pop}`}
              title={<FormattedMessage id='portal.network.pops.title'/>}
              disableButtons={!params.network}
              nextEntityList={this.entityList.podList && this.entityList.podList.entityListItems}
              contentTextGenerator={entity => entity.get('id')}
              creationPermission={PERMISSIONS.CREATE_POP}
              viewPermission={PERMISSIONS.VIEW_POP}
            />

            <EntityList
              fetching={isFetching('pop')}
              isParentSelected={!!this.props.params.pop}
              noDataText={<FormattedMessage id="portal.network.entities.pods.noData"/>}
              ref={(podsRef) => {
                this.entityList.podList = podsRef
                return this.entityList.podList
              }}
              entityIdKey='pod_name'
              titleGenerator={entity => entity.get('pod_name')}
              addEntity={() => this.addEntity(ADD_EDIT_POD)}
              editEntity={this.handlePodEdit}
              entities={params.pop && pods}
              selectEntity={this.handlePodClick}
              selectedEntityId={`${params.pod}`}
              title={<FormattedMessage id='portal.network.pods.title'/>}
              disableButtons={!params.pop}
              nextEntityList={this.entityList.nodeList && this.entityList.nodeList.entityListItems}
              contentTextGenerator={this.podContentTextGenerator}
              creationPermission={PERMISSIONS.CREATE_POD}
              viewPermission={PERMISSIONS.VIEW_POD}
            />

            <EntityList
              fetching={isFetching('node')}
              isParentSelected={!!params.pod}
              noDataText={<FormattedMessage id="portal.network.entities.nodes.noData"/>}
              ref={(nodesRef) => {
                this.entityList.nodeList = nodesRef
                return this.entityList.nodeList
              }}
              entities={params.pod && nodes}
              addEntity={() => this.addEntity(ADD_NODE)}
              editEntity={this.handleNodeEdit}
              selectEntity={() => null}
              title={<FormattedMessage id='portal.network.nodes.title'/>}
              entityIdKey="reduxId"
              disableButtons={!params.pod}
              multiColumn={true}
              numOfColumns={NETWORK_NUMBER_OF_NODE_COLUMNS}
              itemsPerColumn={NETWORK_NODES_PER_COLUMN}
              contentTextGenerator={this.nodeContentTextGenerator}
              creationPermission={PERMISSIONS.CREATE_NODE}
              viewPermission={PERMISSIONS.VIEW_NODE}
            />
          </div>
        </PageContainer>

        {deleteModalProps && <ModalWindow {...deleteModalProps}/>}

        {networkModal === ADD_EDIT_ACCOUNT &&
          <EntityEdit
            type='account'
            entityToUpdate={activeAccount}
            currentUser={this.props.currentUser}
            onCancel={() => this.handleCancel(ADD_EDIT_ACCOUNT)}
            onSave={this.handleAccountSave}
          />
        }

        {networkModal === ADD_EDIT_GROUP &&
          <GroupFormContainer
            account={activeAccount.get('name')}
            params={this.props.params}
            groupId={this.state.groupId}
            canEditBilling={false}
            canSeeBilling={false}
            canSeeLocations={true}
            onCancel={() => this.handleCancel(ADD_EDIT_GROUP)}
            onDelete={(group) => this.showDeleteGroupModal(group)}
            onSave={this.handleGroupSave}
            show={true}
          />
        }

        {networkModal === ADD_EDIT_NETWORK &&
          <NetworkFormContainer
            handleSelectedEntity={this.handleNetworkClick}
            selectedEntityId={`${params.network}`}
            accountId={params.account}
            brand={params.brand}
            groupId={params.group}
            networkId={this.state.networkId}
            isFetching={isFetching('pop')}
            onCancel={() => this.handleCancel(ADD_EDIT_NETWORK)}
          />
        }

        {networkModal === ADD_EDIT_POP &&
          <PopFormContainer
            handleSelectedEntity={this.handlePopClick}
            selectedEntityId={`${params.pop}`}
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
            handleSelectedEntity={this.handlePodClick}
            selectedEntityId={`${params.pod}`}
            accountId={params.account}
            brand={params.brand}
            groupId={params.group}
            networkId={params.network}
            popId={params.pop}
            podId={this.state.podId}
            onCancel={() => this.handleCancel(ADD_EDIT_POD)}
          />
        }

        {networkModal === ADD_NODE &&
          <AddNodeContainer
            id="add-node-form"
            params={params}
            onSave={this.handleNodeSave}
            onCancel={() => this.handleCancel(ADD_NODE)}
            show={true}
          />
        }

        {networkModal === EDIT_NODE && this.state.nodeId &&
          <EditNodeContainer
            id="edit-node-form"
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
  accountDailyTraffic: React.PropTypes.instanceOf(Immutable.List),
  accountManagementModal: PropTypes.string,
  accountMetrics: React.PropTypes.instanceOf(Immutable.List),
  activeAccount: PropTypes.instanceOf(Immutable.Map),
  createGroup: PropTypes.func,
  currentUser: PropTypes.instanceOf(Immutable.Map),
  fetchData: PropTypes.func,
  fetchNetworks: PropTypes.func,
  fetchNodes: PropTypes.func,
  fetchPops: PropTypes.func,
  groupDailyTraffic: React.PropTypes.instanceOf(Immutable.List),
  groupMetrics: React.PropTypes.instanceOf(Immutable.List),
  groups: PropTypes.instanceOf(Immutable.List),
  intl: intlShape,
  isFetching: PropTypes.func,
  location: PropTypes.object,
  networkModal: PropTypes.string,
  networks: PropTypes.instanceOf(Immutable.List),
  nodes: React.PropTypes.instanceOf(Immutable.List),
  params: PropTypes.object,
  pods: PropTypes.instanceOf(Immutable.List),
  pops: PropTypes.instanceOf(Immutable.List),
  removeGroup: PropTypes.func,
  router: PropTypes.object,
  toggleDeleteConfirmationModal: PropTypes.func,
  toggleModal: PropTypes.func,
  uiActions: PropTypes.object,
  updateAccount: PropTypes.func,
  updateGroup: PropTypes.func
}

Network.defaultProps = {
  activeAccount: Immutable.Map(),
  groups: Immutable.List()
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  const { account, group, network, pop, pod } = ownProps.params
  return {

    accountManagementModal: state.ui.get('accountManagementModal'),
    nodes: sortByKey(getNodesByPod(state, buildReduxId(group, network, pop, pod)), 'updated', 'desc'),
    networks: sortByKey(getNetworksByGroup(state, ownProps.params.group)),
    pops: sortByKey(getPopsByNetwork(state, buildReduxId(group, network))),
    pods: sortByKey(getPodsByPop(state, buildReduxId(group, network, pop)), 'pod_name'),
    isFetching: entityType => getFetchingByTag(state, entityType),

    networkModal: state.ui.get('networkModal'),
    //TODO: refactor to entities/redux
    activeAccount: getAccountById(state, account),
    groups: sortByKey(getGroupsByAccount(state, account)),
    groupDailyTraffic: state.metrics.get('groupDailyTraffic'),
    groupMetrics: state.metrics.get('groupMetrics'),
    accountDailyTraffic: state.metrics.get('accountDailyTraffic'),
    accountMetrics: state.metrics.get('accountMetrics'),
    currentUser: getCurrentUser(state)
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch, ownProps) {
  const { brand, account } = ownProps.params

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

  const fetchData = () => {
    //TODO: Fetch accounts and group using entities/redux
    dispatch(accountsActions.fetchOne({brand, id: account}))
    dispatch(groupActions.fetchAll({...ownProps.params, requestTag: 'groups-network'}))
    metricsActions.startGroupFetching()
    metricsActions.fetchDailyAccountTraffic(accountMetricsOpts)
    metricsActions.fetchAccountMetrics(accountMetricsOpts)
    metricsActions.fetchGroupMetrics(metricsOpts)
    metricsActions.fetchDailyGroupTraffic(metricsOpts)
  }

  return {
    toggleModal: uiActions.toggleNetworkModal,
    toggleDeleteConfirmationModal: uiActions.toggleAccountManagementModal,
    fetchData: fetchData,
    uiActions: uiActions,

    updateAccount: (account) => dispatch(accountsActions.update(account)),

    //requestTag is a work around method to prevent unexpected loading behaviors of groups
    createGroup: (group) => dispatch(groupActions.create({...group, requestTag: 'groups-network'})),
    updateGroup: (group) => dispatch(groupActions.update({...group, requestTag: 'groups-network'})),
    removeGroup: (group) =>  dispatch(groupActions.remove({...group, requestTag: 'groups-network'})),

    fetchNetworks: (params) => params.group && dispatch(networkActions.fetchAll(params)),
    fetchPops: (params) => params.network && dispatch(popActions.fetchAll(params)),
    fetchNodes: (params) => params.pod && dispatch(nodeActions.fetchAll(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(Network)))
