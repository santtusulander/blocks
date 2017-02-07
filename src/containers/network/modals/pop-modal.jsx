import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { formValueSelector, SubmissionError } from 'redux-form'
import { List } from 'immutable'
import moment from 'moment'

import accountActions from '../../../redux/modules/entities/accounts/actions'
import groupActions from '../../../redux/modules/entities/groups/actions'
import locationActions from '../../../redux/modules/entities/locations/actions'
import networkActions from '../../../redux/modules/entities/networks/actions'
import popActions from '../../../redux/modules/entities/pops/actions'
import podActions from '../../../redux/modules/entities/pods/actions'

import { getById as getNetworkById } from '../../../redux/modules/entities/networks/selectors'
import { getById as getAccountById } from '../../../redux/modules/entities/accounts/selectors'
import { getById as getGroupById } from '../../../redux/modules/entities/groups/selectors'
import {
  getByGroup as getLocationsByGroup,
  getById as getLocationById
} from '../../../redux/modules/entities/locations/selectors'
import { getById as getPopById } from '../../../redux/modules/entities/pops/selectors'
import { getByPop as getPodsByPop } from '../../../redux/modules/entities/pods/selectors'

import { buildReduxId } from '../../../redux/util'

import SidePanel from '../../../components/side-panel'
import NetworkPopForm from '../../../components/network/forms/pop-form.jsx'
import { POP_FORM_NAME } from '../../../components/network/forms/pop-form.jsx'
import { NETWORK_DATE_FORMAT } from '../../../constants/network'

class PopFormContainer extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount(){
    const {brand, accountId, groupId, networkId, popId} = this.props

    // If editing => fetch data from API
    accountId && this.props.fetchAccount({brand, id: accountId})
    groupId && this.props.fetchGroup({brand, account: accountId, id: groupId})
    groupId && this.props.fetchLocations({brand, account: accountId, group: groupId})
    networkId && this.props.fetchNetwork({brand, account: accountId, group: groupId, id: networkId})
    popId && this.props.fetchPop({brand, account: accountId, group: groupId, network: networkId, id: popId})
    popId && this.props.fetchPods({brand, account: accountId, group: groupId, network: networkId, pop: popId})


  }

  componentWillReceiveProps(nextProps){
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

  /**
   * hander for save
   */
  onSave(edit, values) {

    const data = {
      name: values.name
    }

    // add id if create new
    if (!edit) {
      data.id = this.props.iata + values.id
      data.iata = this.props.iata
      data.location_id = `${values.locationId}`
    }

    const params = {
      brand: 'udn',
      account: this.props.accountId,
      group: this.props.groupId,
      network: this.props.networkId,
      payload: data
    }

    if (edit) params.id = this.props.popId
    const save = edit ? this.props.onUpdate : this.props.onCreate

    return save(params)
      .then( (resp) => {
        if (resp.error) {
          // Throw error => will be shown inside form
          throw new SubmissionError({'_error': resp.error.data.message})
        }

        //Close modal
        this.props.onCancel();
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
      .then( (resp) => {
        if (resp.error) {
          // Throw error => will be shown inside form
          throw new SubmissionError({'_error': resp.error.data.message})
        }

        // Unselect POP item
        if (this.props.selectedEntityId == popId) {
          this.props.handleSelectedEntity(popId)
        }

        //Close modal
        this.props.onCancel();
      })
  }

  hasChildren(edit) {
    return (edit ? ((this.props.pods.size > 0) ? true : false ) : false)
  }

  render() {
    const {
      initialValues,
      iata,
      onCancel,
      groupId,
      networkId,
      popId
    } = this.props

    const edit = !!initialValues.id
    const title = edit ? <FormattedMessage id='portal.network.popEditForm.editPop.title' />
                       : <FormattedMessage id='portal.network.popEditForm.addPop.title' />

    const subTitle = (<FormattedMessage id="portal.network.subTitle.context.text"
                                        values={{
                                          groupId: groupId,
                                          networkId: networkId
                                        }} />)
    const subSubTitle = edit ? (<FormattedMessage id="portal.network.subTitle.date.text"
                                                  values={{
                                                    createdDate: moment.unix(initialValues.createdDate).format(NETWORK_DATE_FORMAT),
                                                    updatedDate: moment.unix(initialValues.updatedDate).format(NETWORK_DATE_FORMAT)
                                                  }} />) : ''

    return (
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
          onDelete={() => this.onDelete(popId)}
          onSave={(values) => this.onSave(edit, values)}
          onCancel={() => onCancel()}
        />

      </SidePanel>
    )
  }
}

PopFormContainer.displayName = "PopFormContainer"
PopFormContainer.propTypes = {
  accountId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  brand: PropTypes.string,

  fetchAccount: PropTypes.func,
  fetchGroup: PropTypes.func,
  fetchLocations: PropTypes.func,
  fetchNetwork: PropTypes.func,
  fetchPods: PropTypes.func,
  fetchPop: PropTypes.func,

  groupId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleSelectedEntity: PropTypes.func,
  iata: PropTypes.string,
  initialValues: PropTypes.object,
  networkId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  pods: PropTypes.instanceOf(List),
  popId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedEntityId: PropTypes.string
}

const formSelector = formValueSelector(POP_FORM_NAME)

const mapStateToProps = (state, ownProps) => {
  const edit = !!ownProps.popId
  const locations = ownProps.groupId && getLocationsByGroup(state, ownProps.groupId)
  const pop = ownProps.popId && getPopById(state, ownProps.popId)
  const pods = ownProps.popId && getPodsByPop(state, ownProps.popId)
  const selectedLocationId = buildReduxId(ownProps.accountId, ownProps.groupId, formSelector(state, 'locationId'))
  const selectedLocation = getLocationById(state, selectedLocationId)
  const locationOptions = locations.map(location => ({
    value: location.get('name'),
    label: location.get('iataCode') + (location.get('cityName') ? `, ${location.get('cityName')}` : '')
  })).toJS()

  return {
    account: ownProps.accountId && getAccountById(state, ownProps.accountId),
    group: ownProps.groupId && getGroupById(state, ownProps.groupId),
    network: ownProps.networkId && getNetworkById(state, ownProps.networkId),
    pop,
    pods,
    iata: selectedLocation ? selectedLocation.get('iataCode') : '',

    initialValues: {
      id: edit && pop ? pop.get('id').replace(/\D/g, '') : null,
      name: edit && pop ? pop.get('name') : '',
      createdDate: edit && pop ? pop.get('created') : '',
      updatedDate: edit && pop ? pop.get('updated') : '',
      locationOptions: locationOptions,
      iata: edit && pop ? pop.get('iata') : '',
      locationId: edit && pop ? pop.get('location_id') : ''
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCreate: (params, data) => dispatch( popActions.create( {...params, data } )),
    onUpdate: (params, data) => dispatch( popActions.update( {...params, data } )),
    onDelete: (params) => dispatch( popActions.remove( {...params } )),

    fetchAccount: (params) => dispatch( accountActions.fetchOne(params) ),
    fetchGroup: (params) => dispatch( groupActions.fetchOne(params) ),
    fetchNetwork: (params) => dispatch( networkActions.fetchOne(params) ),
    fetchPop: (params) => dispatch( popActions.fetchOne(params) ),
    fetchPods: (params) => dispatch( podActions.fetchAll(params) ),
    fetchLocations: (params) => dispatch( locationActions.fetchAll(params) )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PopFormContainer)
