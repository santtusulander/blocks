import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { formValueSelector, SubmissionError } from 'redux-form'

import { List, Map } from 'immutable'
import moment from 'moment'

import accountActions from '../../../redux/modules/entities/accounts/actions'
import groupActions from '../../../redux/modules/entities/groups/actions'
import locationActions from '../../../redux/modules/entities/locations/actions'
import networkActions from '../../../redux/modules/entities/networks/actions'
import popActions from '../../../redux/modules/entities/pops/actions'
import podActions from '../../../redux/modules/entities/pods/actions'
import { getRegionsInfo } from '../../../redux/modules/service-info/selectors'
import { changeNotification } from '../../../redux/modules/ui'

import { fetchAll as serviceInfofetchAll } from '../../../redux/modules/service-info/actions'
import { getById as getNetworkById } from '../../../redux/modules/entities/networks/selectors'
import { getById as getAccountById } from '../../../redux/modules/entities/accounts/selectors'
import { getById as getGroupById } from '../../../redux/modules/entities/groups/selectors'
import {
  getByGroup as getLocationsByGroup,
  getById as getLocationById
} from '../../../redux/modules/entities/locations/selectors'
import { getById as getPopById } from '../../../redux/modules/entities/pops/selectors'
import { getByPop as getPodsByPop } from '../../../redux/modules/entities/pods/selectors'
import { getAll as getRoles } from '../../../redux/modules/entities/roles/selectors'

import { buildReduxId } from '../../../redux/util'

import checkPermissions from '../../../util/permissions'
import * as PERMISSIONS from '../../../constants/permissions'

import SidePanel from '../../../components/shared/side-panel'
import ModalWindow from '../../../components/shared/modal'
import NetworkPopForm from '../../../components/network/forms/pop-form.jsx'
import { POP_FORM_NAME } from '../../../components/network/forms/pop-form.jsx'
import { NETWORK_DATE_FORMAT, STATUS_VALUE_DEFAULT } from '../../../constants/network'

class PopFormContainer extends Component {
  constructor(props) {
    super(props)
    this.notificationTimeout = null
    this.state = {
      showDeleteModal: false
    }
  }

  componentWillMount() {
    const {brand, accountId, groupId, networkId, popId} = this.props

    // If editing => fetch data from API
    accountId && this.props.fetchAccount({brand, id: accountId})
    groupId && this.props.fetchGroup({brand, account: accountId, id: groupId})
    groupId && this.props.fetchLocations({brand, account: accountId, group: groupId})
    networkId && this.props.fetchNetwork({brand, account: accountId, group: groupId, id: networkId})
    popId && this.props.fetchPop({brand, account: accountId, group: groupId, network: networkId, id: popId})
    popId && this.props.fetchPods({brand, account: accountId, group: groupId, network: networkId, pop: popId})

    this.props.fetchServiceInfo()
  }

  componentWillReceiveProps(nextProps) {
    const {brand, accountId, groupId, networkId} = nextProps

    // If editing => fetch data from API
    if (this.props.networkId !== networkId) {
      networkId && this.props.fetchNetwork({brand, account: accountId, group: groupId, id: networkId})
    }

    if (this.props.accountId !== accountId) {
      accountId && this.props.fetchAccount({brand, id: accountId})
    }

    if (this.props.groupId !== groupId) {
      groupId && this.props.fetchGroup({brand, account: accountId, id: groupId})
    }
  }

  onToggleDeleteModal(showDeleteModal) {
    this.setState({ showDeleteModal })
  }

  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.showNotification(message)
    this.notificationTimeout = setTimeout(this.props.showNotification, 10000)
  }

  /**
   * hander for save
   */
  onSave(edit, values) {

    const data = {
      name: values.name,
      status: values.status
    }

    // add id if create new
    if (!edit) {
      data.id = this.props.iata + values.id
      data.iata = this.props.iata.toLowerCase()
      data.location_id = `${values.locationId}`
    }

    data.billing_region = values.billing_region

    const params = {
      brand: 'udn',
      account: this.props.accountId,
      group: this.props.groupId,
      network: this.props.networkId,
      payload: data
    }

    if (edit) {
      params.id = this.props.popId
    }
    const save = edit ? this.props.onUpdate : this.props.onCreate

    return save(params)
      .then(() => {

        const message = edit ? <FormattedMessage id="portal.network.popEditForm.updatePop.status"/> :
         <FormattedMessage id="portal.network.popEditForm.createPop.status"/>
        this.showNotification(message)

        //Close modal
        this.props.onCancel();
      }).catch(resp => {

        throw new SubmissionError({'_error': resp.data.message})

      })
  }

  /**
   * Handler for Delete
   */
  onDelete(popId) {

    const params = {
      brand: 'udn',
      account: this.props.accountId,
      group: this.props.groupId,
      network: this.props.networkId,
      id: popId
    }

    return this.props.onDelete(params)
      .then(() => {
        // Unselect POP item
        if (this.props.selectedEntityId === popId) {
          this.props.handleSelectedEntity(popId)
        }
        this.showNotification(<FormattedMessage id="portal.network.popEditForm.deletePop.status"/>)
        //Close modal
        this.props.onCancel();
      }).catch(resp => {
        // Throw error => will be shown inside form
        throw new SubmissionError({'_error': resp.data.message})
      })
  }

  hasChildren(edit) {
    return (edit ? (this.props.pods.size > 0) : false)
  }

  render() {
    const { initialValues, iata, onCancel, group, network, popId, allowModify } = this.props

    const { showDeleteModal } = this.state

    const edit = !!initialValues.id

    const title = edit ? <FormattedMessage id='portal.network.popEditForm.editPop.title' />
                       : <FormattedMessage id='portal.network.popEditForm.addPop.title' />

    const subTitle = (group && network) && `${group.get('name')} / ${network.get('name')} ${edit ? `/ ${initialValues.name}` : ''}`

    const subSubTitle = edit ? (<FormattedMessage id="portal.network.subTitle.date.text"
                                                  values={{
                                                    createdDate: moment.unix(initialValues.createdDate).format(NETWORK_DATE_FORMAT),
                                                    updatedDate: moment.unix(initialValues.updatedDate).format(NETWORK_DATE_FORMAT)
                                                  }} />) : ''

    return (
      <div>
        <SidePanel
          show={true}
          title={title}
          subTitle={subTitle}
          subSubTitle={subSubTitle}
          cancel={() => onCancel()}
        >

          <NetworkPopForm
            hasPods={this.hasChildren(edit)}
            iata={iata}
            initialValues={initialValues}
            onDelete={() => this.onToggleDeleteModal(true)}
            onSave={(values) => this.onSave(edit, values)}
            onCancel={() => onCancel()}
            readOnly={!allowModify}
          />

        </SidePanel>

        {edit && showDeleteModal &&
          <ModalWindow
            className='modal-window-raised'
            title={<FormattedMessage id="portal.network.popEditForm.deletePop.title"/>}
            verifyDelete={true}
            cancelButton={true}
            deleteButton={true}
            cancel={() => this.onToggleDeleteModal(false)}
            onSubmit={() => this.onDelete(popId)}>
            <p>
             <FormattedMessage id="portal.network.popEditForm.deletePop.confirmation.text"/>
            </p>
          </ModalWindow>}
      </div>
    )
  }
}

PopFormContainer.displayName = "PopFormContainer"
PopFormContainer.propTypes = {
  accountId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  allowModify: PropTypes.bool,
  brand: PropTypes.string,
  fetchAccount: PropTypes.func,
  fetchGroup: PropTypes.func,
  fetchLocations: PropTypes.func,
  fetchNetwork: PropTypes.func,
  fetchPods: PropTypes.func,
  fetchPop: PropTypes.func,
  fetchServiceInfo: PropTypes.func,
  group: PropTypes.instanceOf(Map),
  groupId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleSelectedEntity: PropTypes.func,
  iata: PropTypes.string,
  initialValues: PropTypes.object,
  network: PropTypes.instanceOf(Map),
  networkId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  pods: PropTypes.instanceOf(List),
  popId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedEntityId: PropTypes.string,
  showNotification: PropTypes.func
}

const formSelector = formValueSelector(POP_FORM_NAME)

const mapStateToProps = (state, ownProps) => {
  const edit = !!ownProps.popId
  const roles = getRoles(state)
  const currentUser = state.user.get('currentUser')

  const popReduxId = buildReduxId(ownProps.groupId, ownProps.networkId, ownProps.popId)

  const locations = ownProps.groupId && getLocationsByGroup(state, ownProps.groupId)
  const pop = ownProps.popId && getPopById(state, popReduxId)
  const pods = ownProps.popId && getPodsByPop(state, popReduxId)
  const selectedLocationId = buildReduxId(ownProps.groupId, formSelector(state, 'locationId'))
  const selectedLocation = getLocationById(state, selectedLocationId)
  const locationOptions = locations.map(location => ({
    value: location.get('name'),
    label: location.get('iataCode') + (location.get('cityName') ? `, ${location.get('cityName')}` : '')
  })).toJS()

  const billingRegionOptions = getRegionsInfo(state).map(region => ({
    value: region.region_code,
    label: region.description
  }))

  return {
    account: ownProps.accountId && getAccountById(state, ownProps.accountId),
    group: ownProps.groupId && getGroupById(state, ownProps.groupId),
    network: ownProps.networkId && getNetworkById(state, buildReduxId(ownProps.groupId, ownProps.networkId)),
    pop,
    pods,
    iata: selectedLocation ? selectedLocation.get('iataCode') : '',
    allowModify: checkPermissions(roles, currentUser, PERMISSIONS.MODIFY_POP),

    initialValues: {
      id: edit && pop ? pop.get('id').replace(/\D/g, '') : null,
      name: edit && pop ? pop.get('name') : '',
      createdDate: edit && pop ? pop.get('created') : '',
      updatedDate: edit && pop ? pop.get('updated') : '',
      locationOptions: locationOptions,
      billingRegionOptions: billingRegionOptions,
      iata: edit && pop ? pop.get('iata') : '',
      locationId: edit && pop ? pop.get('location_id') : '',
      billing_region: edit && pop ? pop.get('billing_region') : '',
      status: edit && pop ? pop.get('status') : STATUS_VALUE_DEFAULT
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCreate: (params, data) => dispatch(popActions.create({...params, data })),
    onUpdate: (params, data) => dispatch(popActions.update({...params, data })),
    onDelete: (params) => dispatch(popActions.remove(params)),

    fetchAccount: (params) => dispatch(accountActions.fetchOne(params)),
    fetchGroup: (params) => dispatch(groupActions.fetchOne(params)),
    fetchNetwork: (params) => dispatch(networkActions.fetchOne(params)),
    fetchPop: (params) => dispatch(popActions.fetchOne(params)),
    fetchPods: (params) => dispatch(podActions.fetchAll(params)),
    fetchLocations: (params) => dispatch(locationActions.fetchAll(params)),
    fetchServiceInfo: () => dispatch(serviceInfofetchAll()),

    showNotification: (message) => dispatch(changeNotification(message))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PopFormContainer)
