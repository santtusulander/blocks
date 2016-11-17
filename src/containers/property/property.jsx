import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import * as accountActionCreators from '../../redux/modules/account'
import * as groupActionCreators from '../../redux/modules/group'
import * as hostActionCreators from '../../redux/modules/host'
import * as purgeActionCreators from '../../redux/modules/purge'
import * as uiActionCreators from '../../redux/modules/ui'

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

  componentDidMount() {
    const { brand, account, group, property} = this.props.params
    this.props.hostActions.fetchHost(brand, account, group, property);
    this.props.hostActions.fetchHosts(brand, account, group);
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
      currentUser,
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
          currentUser={currentUser}
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
          activeHost={this.props.activeHost}
          activePurge={this.props.activePurge}
          allHosts={this.props.allHosts}
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
  allHosts: React.PropTypes.instanceOf(Immutable.List),
  brand: React.PropTypes.string,
  children: React.PropTypes.object,
  currentUser: React.PropTypes.instanceOf(Immutable.Map),
  description: React.PropTypes.string,
  group: React.PropTypes.string,
  groupActions: React.PropTypes.object,
  hostActions: React.PropTypes.object,
  id: React.PropTypes.string,
  location: React.PropTypes.object,
  name: React.PropTypes.string,
  params: React.PropTypes.object,
  properties: React.PropTypes.instanceOf(Immutable.List),
  purgeActions: React.PropTypes.object,
  router: React.PropTypes.object,
  uiActions: React.PropTypes.object
}
Property.defaultProps = {
  activeAccount: Immutable.Map(),
  activeGroup: Immutable.Map(),
  activeHost: Immutable.Map(),
  activePurge: Immutable.Map(),
  allHosts: Immutable.List(),
  currentUser: Immutable.Map(),
  properties: Immutable.List()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    activeHost: state.host.get('activeHost'),
    activeHostConfiguredName: state.host.get('activeHostConfiguredName'),
    activePurge: state.purge.get('activePurge'),
    allHosts: state.host.get('allHosts'),
    currentUser: state.user.get('currentUser'),
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
