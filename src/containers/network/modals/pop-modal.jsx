import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { formValueSelector, SubmissionError } from 'redux-form'
import { List } from 'immutable'
import { bindActionCreators } from 'redux'

import accountActions from '../../../redux/modules/entities/accounts/actions'
import groupActions from '../../../redux/modules/entities/groups/actions'
import networkActions from '../../../redux/modules/entities/networks/actions'
import popActions from '../../../redux/modules/entities/pops/actions'
import podActions from '../../../redux/modules/entities/pods/actions'
import * as uiActionCreators from '../../../redux/modules/ui'

import { getById as getNetworkById } from '../../../redux/modules/entities/networks/selectors'
import { getById as getAccountById } from '../../../redux/modules/entities/accounts/selectors'
import { getById as getGroupById } from '../../../redux/modules/entities/groups/selectors'
import { getById as getPopById } from '../../../redux/modules/entities/pops/selectors'
import { getByPop as getPodsByPop } from '../../../redux/modules/entities/pods/selectors'


import SidePanel from '../../../components/side-panel'
import ModalWindow from '../../../components/modal'
import NetworkPopForm from '../../../components/network/forms/pop-form.jsx'
import { POP_FORM_NAME } from '../../../components/network/forms/pop-form.jsx'

const mockLocations = [
  {
    value: 'ORD',
    label: 'ORD, Chicago'
  }, {
    value: 'OLD',
    label: 'OLD, Miami'
  }, {
    value: 'MDL',
    label: 'MDL, Lviv'
  }]

class PopFormContainer extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount(){
    const {brand, accountId, groupId, networkId, popId} = this.props

    // If editing => fetch data from API
    accountId && this.props.fetchAccount({brand, id: accountId})
    groupId && this.props.fetchGroup({brand, account: accountId, id: groupId})
    networkId && this.props.fetchNetwork({brand, account: accountId, group: groupId, id: networkId})
    popId && this.props.fetchPop({brand, account: accountId, group: groupId, network: networkId, id: popId})
    popId && this.props.fetchPods({brand, account: accountId, group: groupId, network: networkId, pop: popId})

    // TODO: fetch location by Group

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
      iata: values.iata,
      name: values.name,
      location_id: `${values.locationId}`
    }

    // add id if create new
    if (!edit) {
      data.id = values.name
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
        this.props.toggleDeleteConfirmationModal(false)
        //Close modal
        this.props.onCancel();
      })
  }

  hasChildren(edit) {
    return !(edit ? this.props.pods.size : false)
  }

  render() {
    const {
      initialValues,
      iata,
      onCancel,
      groupId,
      networkId,
      popId,
      confirmationModalToggled,
      toggleDeleteConfirmationModal
    } = this.props
    console.log(confirmationModalToggled);

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
                                                    createdDate: initialValues.createdDate,
                                                    updatedDate: initialValues.updatedDate
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
            onDelete={() => toggleDeleteConfirmationModal(true)}
            onSave={(values) => this.onSave(edit, values)}
            onCancel={() => onCancel()}
          />

        </SidePanel>

        {edit && confirmationModalToggled &&
          <ModalWindow
            title={<FormattedMessage id="portal.network.popEditForm.deletePop.title"/>}
            verifyDelete={true}
            cancelButton={true}
            deleteButton={true}
            cancel={() => toggleDeleteConfirmationModal(false)}
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
  brand: PropTypes.string,
  confirmationModalToggled: PropTypes.bool,

  fetchAccount: PropTypes.func,
  fetchGroup: PropTypes.func,
  fetchNetwork: PropTypes.func,
  fetchPods: PropTypes.func,
  fetchPop: PropTypes.func,

  groupId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  iata: PropTypes.string,
  initialValues: PropTypes.object,
  networkId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  pods: PropTypes.instanceOf(List),
  popId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  toggleDeleteConfirmationModal: PropTypes.func
}

const formSelector = formValueSelector(POP_FORM_NAME)

const mapStateToProps = (state, ownProps) => {
  const edit = !!ownProps.popId
  const pop = ownProps.popId && getPopById(state, ownProps.popId)
  const pods = ownProps.popId && getPodsByPop(state, ownProps.popId)

  return {
    account: ownProps.accountId && getAccountById(state, ownProps.accountId),
    group: ownProps.groupId && getGroupById(state, ownProps.groupId),
    network: ownProps.networkId && getNetworkById(state, ownProps.networkId),
    pop,
    pods,
    iata: formSelector(state, 'iata'),
    confirmationModalToggled: state.ui.get('networkDeleteConfirmationModal'),

    initialValues: {
      id: edit && pop ? pop.get('id') : null,
      name: edit && pop ? pop.get('name') : '',
      createdDate: edit && pop ? pop.get('created') : '',
      updatedDate: edit && pop ? pop.get('updated') : '',
      locationOptions: mockLocations,
      iata: edit && pop ? pop.get('iata') : '',
      locationId: edit && pop ? pop.get('location_id') : ''
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  const uiActions = bindActionCreators(uiActionCreators, dispatch)
  return {
    onCreate: (params, data) => dispatch( popActions.create( {...params, data } )),
    onUpdate: (params, data) => dispatch( popActions.update( {...params, data } )),
    onDelete: (params) => dispatch( popActions.remove( {...params } )),

    fetchAccount: (params) => dispatch( accountActions.fetchOne(params) ),
    fetchGroup: (params) => dispatch( groupActions.fetchOne(params) ),
    fetchNetwork: (params) => dispatch( networkActions.fetchOne(params) ),
    fetchPop: (params) => dispatch( popActions.fetchOne(params) ),
    fetchPods: (params) => dispatch( podActions.fetchAll(params) ),
    toggleDeleteConfirmationModal: uiActions.toggleNetworkDeleteConfirmationModal
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PopFormContainer)
