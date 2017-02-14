import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Map, List } from 'immutable'
import { Button } from 'react-bootstrap'

import * as hostActionCreators from '../../../redux/modules/host'
import * as uiActionCreators from '../../../redux/modules/ui'

import locationActions from '../../../redux/modules/entities/locations/actions'
import { getByGroup as getLocationsByGroup } from '../../../redux/modules/entities/locations/selectors'

import { getFetchingByTag } from '../../../redux/modules/fetching/selectors'

import networkActions from '../../../redux/modules/entities/networks/actions'
import { getByGroup as getNetworksByGroup } from '../../../redux/modules/entities/networks/selectors'

import SidePanel from '../../../components/side-panel'

import TruncatedTitle from '../../../components/truncated-title'
import ModalWindow from '../../../components/modal'

import NetworkLocationFormContainer from '../../network/modals/location-modal'

import {
  userIsContentProvider,
  userIsCloudProvider,
  accountIsServiceProviderType,
  userIsServiceProvider
} from '../../../util/helpers'

import GroupForm from '../../../components/account-management/group-form'
import '../../../components/account-management/group-form.scss'

class GroupFormContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hostToDelete: null,
      usersToAdd: List(),
      usersToDelete: List(),
      visibleLocationForm: false,
      selectedLocationId: null
    }

    this.notificationTimeout = null

    this.onSubmit = this.onSubmit.bind(this)
    this.handleDeleteHost = this.handleDeleteHost.bind(this)
    this.showLocationForm = this.showLocationForm.bind(this)
    this.hideLocationForm = this.hideLocationForm.bind(this)
  }

  componentWillMount() {
    const { hostActions: { fetchHosts, startFetching }, params: { brand, account }, groupId, canSeeLocations } = this.props
    if (groupId && !accountIsServiceProviderType(this.props.account)) {
      startFetching()
      fetchHosts(brand, account, groupId)
    }

    if (groupId && canSeeLocations) {
      this.props.fetchLocations(groupId)
    }

    if (groupId) {
      this.props.fetchNetworks(groupId)
    }
  }

  onSubmit(values) {
    const { groupId, invalid, onSave } = this.props
    if(!invalid) {
      // TODO: enable this when API is ready
      //const members = this.getMembers()
      // if (groupId) {
      //   return onSave(
      //     groupId,
      //     values,
      //     this.state.usersToAdd,
      //     this.state.usersToDelete
      //   )
      // } else {
      //   return onSave(values, this.state.usersToAdd)
      // }
      if (groupId) {
        return onSave({
          groupId,
          data: values,
          addUsers: this.state.usersToAdd,
          deleteUsers: this.state.usersToDelete,
          edit: true
        })
      } else {
        return onSave({
          data: values,
          usersToAdd: this.state.usersToAdd,
          edit: false
        })
      }
    }
  }

  showLocationForm(id) {
    this.setState({ selectedLocationId: id, visibleLocationForm: true })
  }

  hideLocationForm() {
    this.setState({ selectedLocationId: null, visibleLocationForm: false })
  }

  // deleteMember(userEmail) {
  //   // New members will be just removed from the new members list
  //   if (this.state.usersToAdd.includes(userEmail)) {
  //     this.setState({
  //       usersToAdd: this.state.usersToAdd.delete(this.state.usersToAdd.keyOf(userEmail))
  //     })
  //   }
  //   // Existing members will be added to the to be deleted list
  //   else {
  //     this.setState({
  //       usersToDelete: this.state.usersToDelete.push(userEmail)
  //     })
  //   }
  // }
  //
  // undoDelete(userEmail) {
  //   this.setState({
  //     usersToDelete: this.state.usersToDelete.delete(this.state.usersToDelete.keyOf(userEmail))
  //   })
  // }
  //
  // isEdited() {
  //   return this.state.usersToAdd.size || this.state.usersToDelete.size
  // }

  handleDeleteHost(host) {
    this.setState({hostToDelete: host})
  }

  deleteHost(host) {
    const {
      uiActions,
      hostActions,
      params: {
        brand
      },
      account,
      groupId
    } = this.props

    const accountId = account.get('id')

    hostActions.fetchHost(
      brand,
      accountId,
      groupId,
      host
    )
      .then(() => {
        hostActions.deleteHost(
          brand,
          accountId,
          groupId,
          this.props.activeHost
        )
          .then(res => {
            this.setState({ hostToDelete: null })
            if (res.error) {
              uiActions.showInfoDialog({
                title: 'Error',
                content: res.payload.data.message,
                buttons: <Button onClick={this.props.uiActions.hideInfoDialog} bsStyle="primary"><FormattedMessage
                  id="portal.accountManagement.accoutnUpdated.text"/></Button>
              })
            } else {
              this.showNotification(
                this.props.intl.formatMessage(
                  { id: 'portal.accountManagement.propertyDeleted.text' },
                  { propertyName: host }
                )
              )
            }
          })
      })
  }

  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.uiActions.changeNotification(message)
    this.notificationTimeout = setTimeout(this.props.uiActions.changeNotification, 10000)
  }

  render() {
    const {
      account,
      canEditBilling,
      canSeeBilling,
      canSeeLocations,
      groupId,
      hostActions,
      hosts,
      initialValues,
      isFetchingHosts,
      isFetchingEntities,
      show,
      name,
      onCancel,
      onDelete,
      intl,
      invalid,
      locations,
      networks} = this.props

    /**
     * This logic is for handling members of a group. Not yet supported in the API.
     */

    // const currentMembers = this.props.users.reduce((members, user) => {
    //   if (this.state.usersToAdd.includes(user.get('email'))) {
    //     return [user.set('toAdd', true), ...members]
    //   }
    //   if (this.state.usersToDelete.includes(user.get('email'))) {
    //     return [...members, user.set('toDelete', true)]
    //   }
    //   if (user.get('group_id').includes(this.props.group.get('id'))) {
    //     return [...members, user]
    //   }
    //   return members
    // }, [])


    // const addMembersOptions = fromJS(this.props.users.reduce((arr, user) => {
    //   const userEmail = user.get('email')
    //   if(!user.get('group_id').includes(this.props.group.get('id'))) {
    //     return [...arr, {label: userEmail, value: userEmail}]
    //   }
    //   return arr;
    // }, []))
    const title = groupId ? <FormattedMessage id="portal.account.groupForm.editGroup.title"/> : <FormattedMessage id="portal.account.groupForm.newGroup.title"/>
    const subTitle = groupId ? `${account.get('name')} / ${name}` : account.get('name')
    return (
      <div>
        <SidePanel
          show={show}
          title={title}
          subTitle={subTitle}
          cancel={onCancel}
          >
          <GroupForm
            accountIsServiceProviderType={accountIsServiceProviderType(account)}
            canEditBilling={canEditBilling}
            canSeeBilling={canSeeBilling}
            canSeeLocations={canSeeLocations}
            locations={locations}
            groupId={groupId}
            hasNetworks={networks.size > 0}
            hostActions={hostActions}
            hosts={hosts}
            initialValues={initialValues}
            intl={intl}
            invalid={invalid}
            isFetchingHosts={isFetchingHosts}
            isFetchingEntities={isFetchingEntities}
            onCancel={onCancel}
            onDelete={onDelete ? () => onDelete(this.props.group) : null}
            onDeleteHost={this.handleDeleteHost}
            onSubmit={this.onSubmit}
            onShowLocation={this.showLocationForm}
            />
        </SidePanel>

      {this.state.hostToDelete &&
        <ModalWindow
          title={
            <div>
              <div className="left">
                <FormattedMessage id="portal.button.delete" />&nbsp;
              </div>
              <TruncatedTitle content={this.state.hostToDelete} tooltipPlacement="bottom" />
            </div>
          }
          content={<FormattedMessage id="portal.accountManagement.deletePropertyConfirmation.text"/>}
          invalid={true}
          verifyDelete={true}
          cancelButton={true}
          deleteButton={true}
          cancel={() => this.setState({ hostToDelete: null })}
          onSubmit={() => this.deleteHost(this.state.hostToDelete)}/>
      }

      {canSeeLocations &&
        <NetworkLocationFormContainer
          params={this.props.params}
          groupId={this.props.groupId}
          onCancel={this.hideLocationForm}
          show={this.state.visibleLocationForm}
          locationId={this.state.selectedLocationId}
        />
      }

      </div>
    )
  }
}

GroupFormContainer.displayName = "GroupFormContainer"

GroupFormContainer.propTypes = {
  account: PropTypes.instanceOf(Map).isRequired,
  activeHost: PropTypes.instanceOf(Map),
  canEditBilling: PropTypes.bool,
  canSeeBilling: PropTypes.bool,
  canSeeLocations: PropTypes.bool,
  fetchLocations: PropTypes.func,
  fetchNetworks: PropTypes.func,
  group: PropTypes.instanceOf(Map),
  groupId: PropTypes.number,
  hostActions: PropTypes.object,
  hosts: PropTypes.instanceOf(List),
  initialValues: PropTypes.object,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  isFetchingEntities: PropTypes.bool,
  isFetchingHosts: PropTypes.bool,
  locations: PropTypes.instanceOf(List),
  name: PropTypes.string,
  networks: PropTypes.instanceOf(List),
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
  params: PropTypes.object,
  show: PropTypes.bool,
  uiActions: PropTypes.object
}

GroupFormContainer.defaultProps = {
  account: Map(),
  activeHost: Map(),
  hosts: List(),
  networks: List()
}

const determineInitialValues = (groupId, activeGroup = Map()) => {
  let initialValues = {}
  if (groupId) {
    const { charge_model, ...rest } = activeGroup.toJS()
    initialValues = charge_model ? { charge_model, ...rest } : { ...rest }
  }
  return initialValues
}

const  mapStateToProps = (state, ownProps) => {
  const { user, host, group, account } = state
  // const groupId = ownProps.params.group || ownProps.groupId
  const { groupId } = ownProps
  const currentUser = user.get('currentUser')
  const canEditBilling = ownProps.hasOwnProperty('canEditBilling') ? ownProps.canEditBilling : userIsCloudProvider(currentUser)
  const canSeeBilling = ownProps.hasOwnProperty('canSeeBilling') ? ownProps.canSeeBilling : userIsContentProvider(currentUser) || canEditBilling
  const canSeeLocations = groupId && ownProps.hasOwnProperty('canSeeLocations') ? ownProps.canSeeLocations : userIsServiceProvider(currentUser)
  return {
    account: account.get('activeAccount'),
    activeHost: host.get('activeHost'),
    canEditBilling,
    canSeeBilling,
    canSeeLocations,
    hosts: groupId && host.get('allHosts'),
    initialValues: determineInitialValues(groupId, group.get('activeGroup')),
    isFetchingHosts: host.get('fetching'),
    isFetchingEntities: getFetchingByTag(state, 'location') || getFetchingByTag(state, 'network'),
    locations: canSeeLocations && getLocationsByGroup(state, groupId) || List(),
    name: group.getIn(['activeGroup', 'name']),
    group: group.get('activeGroup'),
    networks: getNetworksByGroup(state, groupId)
  }
}

const mapDispatchToProps = (dispatch, { params: { brand, account } }) => {
  return {
    fetchLocations: (group) => group && dispatch(locationActions.fetchAll({ brand, account, group })),
    fetchNetworks: (group) => group && networkActions.fetchByIds(dispatch)({ brand, account, group }),
    hostActions: bindActionCreators(hostActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(GroupFormContainer)
)
