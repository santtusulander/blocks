/* eslint-disable react/no-find-dom-node */
// It is acceptible to use ReactDOM.findDOMNode, since it is not deprecated.
// react/no-find-dom-node is designed to avoid use of React.findDOMNode and
// Component.getDOMNode

import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
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
import PageContainer from '../components/layout/page-container'

import {
  NETWORK_ENTITIES_REFS,
  NETWORK_VISIBLE_BY_PIXELS,
  NETWORK_SCROLL_AMOUNT } from '../constants/network'

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
    this.scrollToEntity = this.scrollToEntity.bind(this)

    this.state = {
      networks: Immutable.List(),
      pops: Immutable.List(),
      pods: Immutable.List(),
      nodes: Immutable.List()
    }
  }

  componentWillMount() {
    this.props.fetchData()
  }

  componentDidMount() {
    if (this.props.params.group) {
      this.selectEntityAndScroll('groups', false)
    }

    if (this.props.params.network) {
      this.selectEntityAndScroll('networks', false)
    }

    if (this.props.params.pop) {
      this.selectEntityAndScroll('pops', false)
    }

    if (this.props.params.pod) {
      this.selectEntityAndScroll('pods', false)
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

  handleGroupClick(groupId) {
    const scrollToPrevious = this.determineNextState({
      currentId: groupId,
      previousId: this.props.params.group,
      goToRoute: 'group',
      goBackToRoute: 'account'
    })

    this.selectEntityAndScroll('groups', scrollToPrevious)
  }

  handleNetworkClick(networkId) {
    const scrollToPrevious = this.determineNextState({
      currentId: networkId,
      previousId: this.props.params.network,
      goToRoute: 'network',
      goBackToRoute: 'group'
    })

    this.selectEntityAndScroll('networks', scrollToPrevious)
  }

  handlePopClick(popId) {
    const scrollToPrevious = this.determineNextState({
      currentId: popId,
      previousId:
      this.props.params.pop,
      goToRoute: 'pop',
      goBackToRoute: 'network'
    })

    this.selectEntityAndScroll('pops', scrollToPrevious)
  }

  handlePodClick(podId) {
    const scrollToPrevious = this.determineNextState({
      currentId: podId,
      previousId: this.props.params.pod,
      goToRoute: 'pod',
      goBackToRoute: 'pop'
    })

    this.selectEntityAndScroll('pods', scrollToPrevious)
  }

  /**
   * Determines the next state and sets the correct URL based on id.
   * It checks if the user clicked an already selected entity and then either
   * goes up one level or unselects it and goes back one level. Hence returning
   * scrollToPrevious boolean that determines the scrolling direction.
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
    const scrollToPrevious = previousId && currentId.toString() === previousId.toString()
    const entityId = scrollToPrevious ? this.props.params[goBackToRoute] : currentId
    const nextEntity = scrollToPrevious ? goBackToRoute : goToRoute
    const url = getNetworkUrl(nextEntity, entityId, this.props.params)

    this.props.router.push(url)

    return scrollToPrevious
  }

  /**
   * Selects the next entity to be scrolled to. Entities are determined by refs.
   *
   * @method selectEntityAndScroll
   * @param  {string}              selectedEntity   Name of current entity
   * @param  {boolean}             scrollToPrevious A boolean to determine scroll direction
   */
  selectEntityAndScroll(selectedEntity, scrollToPrevious) {
    // Get the next entity ref
    let nextEntity = NETWORK_ENTITIES_REFS[NETWORK_ENTITIES_REFS.indexOf(selectedEntity) + 1]

    if (scrollToPrevious) {
      // Get the previous entity ref
      nextEntity = NETWORK_ENTITIES_REFS.indexOf(selectedEntity) - 1 >= 0 ? NETWORK_ENTITIES_REFS[NETWORK_ENTITIES_REFS.indexOf(selectedEntity) - 1] : NETWORK_ENTITIES_REFS[0]
    }

    // Start the scrolling animation
    requestAnimationFrame(() => this.scrollToEntity(nextEntity, scrollToPrevious))
  }

  /**
   * Scrolls the container until the given entity is visible on the viewport.
   *
   * @method scrollToEntity
   * @param  {string}       entity           Target entity to scroll to
   * @param  {boolean}      scrollToPrevious A boolean to determine scroll direction
   */
  scrollToEntity(entity, scrollToPrevious) {
    const container = findDOMNode(this.refs['network-entities']);
    const element = findDOMNode(this.refs[entity]);

    // Get the element's –– entity's –– offset/location in the viewport
    const elemLeft = element.getBoundingClientRect().left
    const elemRight = element.getBoundingClientRect().right

    // If we're scrolling back to the previous entity, we need to add some
    // offset so it doesn't just stay underneath the navigation bar.
    const visibleByPixels = scrollToPrevious ? NETWORK_VISIBLE_BY_PIXELS : 0
    // Check if element is visible fully in the viewport
    const isVisible = (elemLeft >= visibleByPixels) && (elemRight <= window.innerWidth)

    if (!isVisible) {
      // If scrollToPrevious is true, we should scroll to right –– backwards. Otherwise keep scrolling to left
      scrollToPrevious ? container.scrollLeft -= NETWORK_SCROLL_AMOUNT : container.scrollLeft += NETWORK_SCROLL_AMOUNT
      // Continue scrolling animation
      requestAnimationFrame(() => this.scrollToEntity(entity, scrollToPrevious))
    }
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
      <Content className="network-content">

        <PageHeader pageSubTitle="Network">
          <div className="dropdown-toggle header-toggle">
            <h1>
              <TruncatedTitle content={activeAccount.get('name')} tooltipPlacement="bottom"/>
            </h1>
          </div>
        </PageHeader>

        <PageContainer ref="network-entities" className="network-entities-container">
          <PlaceholderEntityList
            ref={NETWORK_ENTITIES_REFS[0]}
            entities={params.account && groups}
            addEntity={() => null}
            deleteEntity={() => () => null}
            editEntity={() => () => null}
            selectEntity={this.handleGroupClick}
            selectedEntityId={`${params.group}`}
            title="Groups"
          />


          <PlaceholderEntityList
            ref={NETWORK_ENTITIES_REFS[1]}
            entities={params.group && networks}
            addEntity={() => null}
            deleteEntity={() => () => null}
            editEntity={() => () => null}
            selectEntity={this.handleNetworkClick}
            selectedEntityId={`${params.network}`}
            title="Networks"
          />


          <PlaceholderEntityList
            ref={NETWORK_ENTITIES_REFS[2]}
            entities={params.network && pops}
            addEntity={() => null}
            deleteEntity={() => () => null}
            editEntity={() => () => null}
            selectEntity={this.handlePopClick}
            selectedEntityId={`${params.pop}`}
            title="Pops"
          />

          <PlaceholderEntityList
            ref={NETWORK_ENTITIES_REFS[3]}
            entities={params.pop && pods}
            addEntity={() => null}
            deleteEntity={() => () => null}
            editEntity={() => () => null}
            selectEntity={this.handlePodClick}
            selectedEntityId={`${params.pod}`}
            title="Pods"
          />

          <PlaceholderEntityList
            ref={NETWORK_ENTITIES_REFS[4]}
            entities={params.pod && nodes}
            addEntity={() => null}
            deleteEntity={() => () => null}
            editEntity={() => () => null}
            selectEntity={() => null}
            title="Nodes"
          />
      </PageContainer>

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
