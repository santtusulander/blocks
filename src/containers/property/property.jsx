import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

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
    const { account, brand, group, property} = this.props.params
    this.props.hostActions.fetchHost(brand, account, group, property)
    this.props.hostActions.fetchHosts(brand, account, group);
  }

  togglePurge() {
    this.setState({
      purgeActive: !this.state.purgeActive
    })
    this.props.purgeActions.resetActivePurge()
  }

  savePurge() {
    const { account, brand, group } = this.props.params
    const { activeHostConfiguredName, activePurge, purgeActions } = this.props

    purgeActions.createPurge(
      brand,
      account,
      group,
      activeHostConfiguredName,
      activePurge.toJS()
    )
    .then(({ payload }) => {
      const getMessage = () => payload instanceof Error ?
        <FormattedMessage id="portal.content.property.summary.requestFailed.label" values={{reason: payload.message}}/> :
        <FormattedMessage id="portal.content.property.summary.requestSuccess.label"/>

      this.setState({purgeActive: false})
      this.showNotification(getMessage())
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
        group
      },
      router
    } = this.props

    const toggleDelete = () => this.setState({ deleteModal: !this.state.deleteModal })

    return (
      <Content>
        <PropertyHeader
          currentUser={currentUser}
          params={this.props.params}
          currentTab={this.props.routes.slice(-1)[0].path}
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
          onSubmit={() => {
            deleteHost(brand, account, group, this.props.activeHost)
              .then(() => router.replace(getContentUrl('group', group, { brand, account })))
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
  activeHost: React.PropTypes.instanceOf(Immutable.Map),
  activeHostConfiguredName: React.PropTypes.string,
  activePurge: React.PropTypes.instanceOf(Immutable.Map),
  allHosts: React.PropTypes.instanceOf(Immutable.List),
  brand: React.PropTypes.string,
  children: React.PropTypes.object,
  currentUser: React.PropTypes.instanceOf(Immutable.Map),
  group: React.PropTypes.string,
  hostActions: React.PropTypes.object,
  location: React.PropTypes.object,
  params: React.PropTypes.object,
  purgeActions: React.PropTypes.object,
  router: React.PropTypes.object,
  routes: React.PropTypes.array,
  uiActions: React.PropTypes.object
}
Property.defaultProps = {
  activeHost: Immutable.Map(),
  activePurge: Immutable.Map(),
  allHosts: Immutable.List(),
  currentUser: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    activeHost: state.host.get('activeHost'),
    activeHostConfiguredName: state.host.get('activeHostConfiguredName'),
    activePurge: state.purge.get('activePurge'),
    allHosts: state.host.get('allHosts'),
    currentUser: state.user.get('currentUser')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hostActions: bindActionCreators(hostActionCreators, dispatch),
    purgeActions: bindActionCreators(purgeActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Property));
