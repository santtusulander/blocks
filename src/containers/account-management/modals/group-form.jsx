import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Map, List } from 'immutable'

import { fetchAll as serviceInfofetchAll } from '../../../redux/modules/service-info/actions'
import locationActions from '../../../redux/modules/entities/locations/actions'
import networkActions from '../../../redux/modules/entities/networks/actions'

import { getByGroup as getLocationsByGroup } from '../../../redux/modules/entities/locations/selectors'
import { getByGroup as getNetworksByGroup } from '../../../redux/modules/entities/networks/selectors'
import { getServiceOptions, getServicesInfo } from '../../../redux/modules/service-info/selectors'
import { getById as getAccountById } from '../../../redux/modules/entities/accounts/selectors'
import { getById as getGroupsById } from '../../../redux/modules/entities/groups/selectors'
import { getAll as getRoles } from '../../../redux/modules/entities/roles/selectors'
import { getFetchingByTag } from '../../../redux/modules/fetching/selectors'
import { isUdnAdmin } from '../../../redux/modules/user'

import NetworkLocationFormContainer from '../../network/modals/location-modal'
import SidePanel from '../../../components/shared/side-panel'
import GroupForm from '../../../components/account-management/group-form'

import * as PERMISSIONS from '../../../constants/permissions'

import { accountIsContentProviderType, accountIsServiceProviderType } from '../../../util/helpers'
import { getServiceOptionsForGroup } from '../../../util/services-helpers'
import checkPermissions from '../../../util/permissions'


class GroupFormContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      usersToAdd: List(),
      usersToDelete: List(),
      visibleLocationForm: false,
      selectedLocationId: null
    }

    this.notificationTimeout = null

    this.onSubmit = this.onSubmit.bind(this)
    this.showLocationForm = this.showLocationForm.bind(this)
    this.hideLocationForm = this.hideLocationForm.bind(this)
  }

  componentWillMount() {
    const { groupId, canSeeLocations, canFetchNetworks, fetchServiceInfo } = this.props

    fetchServiceInfo()

    if (groupId && canSeeLocations) {
      this.props.fetchLocations(groupId)
    }

    if (groupId && canFetchNetworks) {
      this.props.fetchNetworks(groupId)
    }
  }

  onSubmit(values) {
    const { groupId, invalid, onSave } = this.props
    if (!invalid) {
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

  render() {
    const {
      account,
      allowModify,
      canEditServices,
      canSeeLocations,
      disableDelete,
      groupId,
      initialValues,
      isFetchingEntities,
      show,
      locations,
      name,
      onCancel,
      onChangeServiceItem,
      onDelete,
      intl,
      invalid,
      networks,
      serviceOptions,
      showServiceItemForm
    } = this.props

    const title = groupId ? <FormattedMessage id="portal.account.groupForm.editGroup.title"/> : <FormattedMessage id="portal.account.groupForm.newGroup.title"/>
    const subTitle = groupId ? `${account.get('name')} / ${name}` : account.get('name')
    return (
      <div>
        <SidePanel show={show} title={title} subTitle={subTitle} cancel={onCancel}>
          <GroupForm
            accountIsContentProviderType={accountIsContentProviderType(account)}
            canEditServices={canEditServices}
            canSeeLocations={canSeeLocations}
            disableDelete={disableDelete}
            locations={locations}
            groupId={groupId}
            hasNetworks={networks.size > 0}
            initialValues={initialValues}
            intl={intl}
            invalid={invalid}
            isFetchingEntities={isFetchingEntities}
            onCancel={onCancel}
            onChangeServiceItem={onChangeServiceItem}
            onDelete={onDelete ? () => onDelete(this.props.group) : null}
            onSubmit={this.onSubmit}
            onShowLocation={this.showLocationForm}
            serviceOptions={serviceOptions}
            showServiceItemForm={showServiceItemForm}
            readOnly={!allowModify}
          />
        </SidePanel>

      {canSeeLocations && this.state.visibleLocationForm &&
        <NetworkLocationFormContainer
          params={this.props.params}
          groupId={this.props.groupId}
          onCancel={this.hideLocationForm}
          show={true}
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
  allowModify: PropTypes.bool,
  canEditServices: PropTypes.bool,
  canFetchNetworks: PropTypes.bool,
  canSeeLocations: PropTypes.bool,
  disableDelete: PropTypes.bool,
  fetchLocations: PropTypes.func,
  fetchNetworks: PropTypes.func,
  fetchServiceInfo: PropTypes.func,
  group: PropTypes.instanceOf(Map),
  groupId: PropTypes.number,
  initialValues: PropTypes.object,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  isFetchingEntities: PropTypes.bool,
  locations: PropTypes.instanceOf(List),
  name: PropTypes.string,
  networks: PropTypes.instanceOf(List),
  onCancel: PropTypes.func,
  onChangeServiceItem: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
  params: PropTypes.object,
  serviceOptions: PropTypes.array,
  show: PropTypes.bool,
  showServiceItemForm: PropTypes.func
}

GroupFormContainer.defaultProps = {
  account: Map(),
  networks: List()
}

/* istanbul ignore next */
const  mapStateToProps = (state, ownProps) => {
  const { user } = state
  const { groupId, params: { account } } = ownProps
  const currentUser = user.get('currentUser')
  const canEditServices = isUdnAdmin(currentUser)
  const activeAccount = getAccountById(state, account)
  const activeGroup = getGroupsById(state, groupId) || Map()
  const allServiceOptions = activeAccount && getServiceOptions(state, activeAccount.get('provider_type'))
  const canSeeLocations = groupId && ownProps.hasOwnProperty('canSeeLocations') ? ownProps.canSeeLocations : accountIsServiceProviderType(activeAccount)
  const canFetchNetworks = accountIsServiceProviderType(activeAccount)
  const roles = getRoles(state)
  //Since group object in new redux has several property that are not accepted by the server,
  //we have to filter out those fields. This is temporary until we have better solution
  const filteredGroupData = activeGroup.delete('backend_id').delete('parentId')

  return {
    account: activeAccount,
    canEditServices,
    canSeeLocations,
    canFetchNetworks,
    initialValues: {
      ...(groupId && filteredGroupData ? filteredGroupData.toJS() : {}),
      services: groupId ? (activeGroup.get('services') || List()) : List()
    },
    isFetchingEntities: getFetchingByTag(state, 'location') || getFetchingByTag(state, 'network'),
    locations: canSeeLocations && getLocationsByGroup(state, groupId) || List(),
    name: groupId ? activeGroup.get('name') : '',
    serviceOptions: allServiceOptions
                    ? getServiceOptionsForGroup(allServiceOptions, activeAccount.get('services'), (activeGroup && activeGroup.get('services') || List()))
                    : [],
    servicesInfo: getServicesInfo(state),
    group: activeGroup,
    allowModify: checkPermissions(roles, currentUser, PERMISSIONS.MODIFY_GROUP),
    networks: getNetworksByGroup(state, groupId)
  }
}

/* istanbul ignore next */
const mapDispatchToProps = (dispatch, { params: { brand, account } }) => {
  return {
    fetchLocations: (group) => group && dispatch(locationActions.fetchAll({ brand, account, group })),
    fetchNetworks: (group) => group && dispatch(networkActions.fetchAll({ brand, account, group })),
    fetchServiceInfo: () => dispatch(serviceInfofetchAll())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(GroupFormContainer)
)
