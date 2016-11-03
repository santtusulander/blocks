import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import * as accountActionCreators from '../../redux/modules/account'
import * as groupActionCreators from '../../redux/modules/group'
import * as hostActionCreators from '../../redux/modules/host'
import * as metricsActionCreators from '../../redux/modules/metrics'
import * as purgeActionCreators from '../../redux/modules/purge'
import * as trafficActionCreators from '../../redux/modules/traffic'
import * as uiActionCreators from '../../redux/modules/ui'
import * as visitorsActionCreators from '../../redux/modules/visitors'

import Content from '../../components/layout/content'
import PropertyHeader from '../../components/content/property/property-header'
import PropertyTabControl from '../../components/content/property/property-tab-control'
import PurgeModal from '../../components/purge-modal'
import ModalWindow from '../../components/modal'

import { getContentUrl } from '../../util/routes'

export class Property extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      deleteModal: false,
      purgeActive: false,
      propertyMenuOpen: false
    }

    this.togglePurge = this.togglePurge.bind(this)
    this.savePurge = this.savePurge.bind(this)
    this.showNotification = this.showNotification.bind(this)
    this.togglePropertyMenu = this.togglePropertyMenu.bind(this)
  }

  togglePurge() {
    this.setState({
      purgeActive: !this.state.purgeActive
    })
    this.props.purgeActions.resetActivePurge()
  }

  savePurge() {
    this.props.purgeActions.createPurge(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      this.props.activeHostConfiguredName,
      this.props.activePurge.toJS()
    ).then((action) => {
      if (action.payload instanceof Error) {
        this.setState({ purgeActive: false })
        this.showNotification('Purge request failed: ' +
          action.payload.message)
      }
      else {
        this.setState({ purgeActive: false })
        this.showNotification('Purge request succesfully submitted')
      }
    })
  }

  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.uiActions.changeNotification(message)
    this.notificationTimeout = setTimeout(
      this.props.uiActions.changeNotification, 10000)
  }

  togglePropertyMenu() {
    this.setState({ propertyMenuOpen: !this.state.propertyMenuOpen })
  }

  render() {

    const {
      hostActions: {
        deleteHost
      },
      params: {
        brand,
        account,
        group,
        property
      },
      router
    } = this.props

    const toggleDelete = () => this.setState({ deleteModal: !this.state.deleteModal })

    return (
      <Content>
        <PropertyHeader
          params={this.props.params}
          togglePurge={this.togglePurge}
          deleteProperty={() => this.setState({ deleteModal: true })}
        />

        <PropertyTabControl
          params={this.props.params}
          location={this.props.location}
        />

        {this.props.children}

        {this.state.purgeActive && <PurgeModal
          activePurge={this.props.activePurge}
          changePurge={this.props.purgeActions.updateActivePurge}
          hideAction={this.togglePurge}
          savePurge={this.savePurge}
          showNotification={this.showNotification}/>}
        {this.state.deleteModal &&
        <ModalWindow
          title={<FormattedMessage id="portal.deleteModal.header.text" values={{ itemToDelete: "Property" }}/>}
          cancelButton={true}
          deleteButton={true}
          cancel={toggleDelete}
          submit={() => {
            deleteHost(brand, account, group, property, this.props.activeHostConfiguredName)
              .then(() => router.push(getContentUrl('group', group, { brand, account })))
          }}
          invalid={true}
          verifyDelete={true}>
          <p>
            <FormattedMessage id="portal.deleteModal.warning.text" values={{ itemToDelete: "Property" }}/>
          </p>
        </ModalWindow>
        }
      </Content>
    )
  }
}

Property.displayName = 'Property'
Property.propTypes = {
  account: React.PropTypes.string,
  accountActions: React.PropTypes.object,
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  activeHost: React.PropTypes.instanceOf(Immutable.Map),
  activeHostConfiguredName: React.PropTypes.string,
  activePurge: React.PropTypes.instanceOf(Immutable.Map),
  brand: React.PropTypes.string,
  children: React.PropTypes.object,
  dailyTraffic: React.PropTypes.instanceOf(Immutable.List),
  description: React.PropTypes.string,
  fetching: React.PropTypes.bool,
  fetchingMetrics: React.PropTypes.bool,
  group: React.PropTypes.string,
  groupActions: React.PropTypes.object,
  hostActions: React.PropTypes.object,
  hourlyTraffic: React.PropTypes.instanceOf(Immutable.Map),
  id: React.PropTypes.string,
  location: React.PropTypes.object,
  metricsActions: React.PropTypes.object,
  name: React.PropTypes.string,
  params: React.PropTypes.object,
  properties: React.PropTypes.instanceOf(Immutable.List),
  purgeActions: React.PropTypes.object,
  router: React.PropTypes.object,
  trafficActions: React.PropTypes.object,
  trafficFetching: React.PropTypes.bool,
  uiActions: React.PropTypes.object,
  visitorsActions: React.PropTypes.object,
  visitorsByCountry: React.PropTypes.instanceOf(Immutable.Map),
  visitorsFetching: React.PropTypes.bool
}
Property.defaultProps = {
  activeAccount: Immutable.Map(),
  activeGroup: Immutable.Map(),
  activeHost: Immutable.Map(),
  activePurge: Immutable.Map(),
  dailyTraffic: Immutable.List(),
  hourlyTraffic: Immutable.fromJS({
    now: [],
    history: []
  }),
  properties: Immutable.List(),
  visitorsByCountry: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    activeHost: state.host.get('activeHost'),
    activeHostConfiguredName: state.host.get('activeHostConfiguredName'),
    activePurge: state.purge.get('activePurge'),
    properties: state.host.get('allHosts')
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Property));
