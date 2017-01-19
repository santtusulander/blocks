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

const placeholderEntities = [
  'groups',
  'networks',
  'pops',
  'pods',
  'nodes'
]

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
    const scrollToPrevious = groupId === parseInt(this.props.params.group)
    const url = getNetworkUrl('group', groupId, this.props.params)
    this.props.router.push(url)
    this.selectEntityAndScroll('groups', scrollToPrevious)
  }

  handleNetworkClick(networkId) {
    const scrollToPrevious = networkId === parseInt(this.props.params.network)

    const url = scrollToPrevious ? getNetworkUrl('group', this.props.params.group, this.props.params) : getNetworkUrl('network', networkId, this.props.params)
    this.props.router.push(url)
    this.selectEntityAndScroll('networks', scrollToPrevious)
  }

  handlePopClick(popId) {
    const scrollToPrevious = popId === this.props.params.pop

    const url = scrollToPrevious ? getNetworkUrl('network', this.props.params.network, this.props.params) : getNetworkUrl('pop', popId, this.props.params)
    this.props.router.push(url)
    this.selectEntityAndScroll('pops', scrollToPrevious)
  }

  handlePodClick(podId) {
    const scrollToPrevious = podId === parseInt(this.props.params.pod)

    const url = scrollToPrevious ? getNetworkUrl('pop', this.props.params.pop, this.props.params) : getNetworkUrl('pod', podId, this.props.params)
    this.props.router.push(url)
    this.selectEntityAndScroll('pods', scrollToPrevious)
  }

  selectEntityAndScroll(selectedEntity, scrollToPrevious) {
    let nextEntity = placeholderEntities[placeholderEntities.indexOf(selectedEntity) + 1]

    if (scrollToPrevious) {
      nextEntity = placeholderEntities.indexOf(selectedEntity) - 1 >= 0 ? placeholderEntities[placeholderEntities.indexOf(selectedEntity) - 1] : placeholderEntities[0]
    }

    requestAnimationFrame(() => this.scrollToEntity(nextEntity, scrollToPrevious))
  }

  scrollToEntity(entity, scrollToPrevious) {
    const container = findDOMNode(this.refs['network-entities']);
    const element = findDOMNode(this.refs[entity]);

    let elemLeft = element.getBoundingClientRect().left
    let elemRight = element.getBoundingClientRect().right

    const visibleByPixels = scrollToPrevious ? 84 : 0
    const isVisible = (elemLeft >= visibleByPixels) && (elemRight <= window.innerWidth)

    if (!isVisible) {
      scrollToPrevious ? container.scrollLeft -= 25 : container.scrollLeft += 25
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
            ref={placeholderEntities[0]}
            entities={params.account && groups}
            addEntity={() => null}
            deleteEntity={() => () => null}
            editEntity={() => () => null}
            selectEntity={this.handleGroupClick}
            selectedEntityId={`${params.group}`}
            title="Groups"
          />


          <PlaceholderEntityList
            ref={placeholderEntities[1]}
            entities={params.group && networks}
            addEntity={() => null}
            deleteEntity={() => () => null}
            editEntity={() => () => null}
            selectEntity={this.handleNetworkClick}
            selectedEntityId={`${params.network}`}
            title="Networks"
          />


          <PlaceholderEntityList
            ref={placeholderEntities[2]}
            entities={params.network && pops}
            addEntity={() => null}
            deleteEntity={() => () => null}
            editEntity={() => () => null}
            selectEntity={this.handlePopClick}
            selectedEntityId={`${params.pop}`}
            title="Pops"
          />

          <PlaceholderEntityList
            ref={placeholderEntities[3]}
            entities={params.pop && pods}
            addEntity={() => null}
            deleteEntity={() => () => null}
            editEntity={() => () => null}
            selectEntity={this.handlePodClick}
            selectedEntityId={`${params.pod}`}
            title="Pods"
          />

          <PlaceholderEntityList
            ref={placeholderEntities[4]}
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
