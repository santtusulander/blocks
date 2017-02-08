import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { SubmissionError } from 'redux-form'
import { List, Map } from 'immutable'
import { bindActionCreators } from 'redux'

import accountActions from '../../../redux/modules/entities/accounts/actions'
import groupActions from '../../../redux/modules/entities/groups/actions'
import networkActions from '../../../redux/modules/entities/networks/actions'
import popActions from '../../../redux/modules/entities/pops/actions'
import * as uiActionCreators from '../../../redux/modules/ui'

import { getById as getNetworkById } from '../../../redux/modules/entities/networks/selectors'
import { getById as getAccountById } from '../../../redux/modules/entities/accounts/selectors'
import { getById as getGroupById } from '../../../redux/modules/entities/groups/selectors'
import { getByNetwork as getPopsByNetwork } from '../../../redux/modules/entities/pops/selectors'

import SidePanel from '../../../components/side-panel'
import ModalWindow from '../../../components/modal'
import NetworkForm from '../../../components/network/forms/network-form'
import '../../../components/account-management/group-form.scss'

class NetworkFormContainer extends React.Component {
  constructor(props) {
    super(props)
    this.networkId = null
  }

  componentWillMount(){
    const { brand, accountId, groupId, networkId } = this.props

    // If editing => fetch data from API
    accountId && this.props.fetchAccount({brand, id: accountId})
    groupId && this.props.fetchGroup({brand, account: accountId, id: groupId})
    networkId && this.props.fetchNetwork({brand, account: accountId, group: groupId, id: networkId})
    networkId && this.props.fetchPops({brand, account: accountId, group: groupId, network: networkId})

  }

  componentWillReceiveProps(nextProps){
    const { brand, accountId, groupId, networkId } = nextProps

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
      description: values.description
    }

    // add id if create new
    if (!edit) {
      data.id = values.name
    }

    const params = {
      brand: 'udn',
      account: this.props.accountId,
      group: this.props.groupId,
      payload: data
    }

    if (edit) params.id = values.name;
    const save = edit ? this.props.onUpdate : this.props.onCreate

    return save(params)
      .then( (resp) => {
        if (resp.error) {
          // Throw error => will be shown inside form
          throw new SubmissionError({'_error': resp.error.data.message})
        }

        // Close modal
        this.props.onCancel();
      })
  }

  /**
   * Handler for Delete
   */
  onDelete(networkId){
    const {toggleDeleteConfirmationModal} = this.props
    const params = {
      brand: 'udn',
      account: this.props.accountId,
      group: this.props.groupId,
      id: networkId
    }

    return this.props.onDelete(params)
      .then( (resp) => {
        if (resp.error) {
          // Throw error => will be shown inside form
          throw new SubmissionError({'_error': resp.error.data.message})
        }
        toggleDeleteConfirmationModal(false)

        // Unselect network item
        if (this.props.selectedEntityId == networkId) {
          this.props.handleSelectedEntity(networkId)
        }
        // Close modal
        this.props.onCancel()
      })
  }

  /**
   * Used to check if current element has children (and can be deleted)
   */
  hasChildren(edit) {
    return !!(edit ? this.props.pops.size : false)
  }

  render() {
    const { account, group, network, initialValues, onCancel, confirmationModalToggled, toggleDeleteConfirmationModal} = this.props
    // simple way to check if editing -> no need to pass 'edit' - prop
    const edit = !!initialValues.name

    const title = edit ? <FormattedMessage id="portal.network.networkForm.editNetwork.title"/>
                       : <FormattedMessage id="portal.network.networkForm.newNetwork.title"/>

    const subTitle = edit ? `${account.get('name')} / ${group.get('name')} / ${network.get('name')}`
                          : `${account.get('name')} / ${group.get('name')}`

    return (
      <div>
        <SidePanel show={true} title={title} subTitle={subTitle} cancel={onCancel}>
          <NetworkForm
            hasPops={this.hasChildren(edit)}
            initialValues={initialValues}
            onSave={(values) => this.onSave(edit, values)}
            onDelete={(networkId) => {
              this.networkId = networkId
              toggleDeleteConfirmationModal(true)
            }
            }
            onCancel={onCancel}
          />
        </SidePanel>

        {edit && confirmationModalToggled &&
          <ModalWindow
            title={<FormattedMessage id="portal.network.networkForm.deleteNetwork.title"/>}
            verifyDelete={true}
            cancelButton={true}
            deleteButton={true}
            cancel={() => toggleDeleteConfirmationModal(false)}
            onSubmit={() => this.onDelete()}>
            <p>
             <FormattedMessage id="portal.network.networkForm.deleteNetwork.confirmation.text"/>
            </p>
          </ModalWindow>}
      </div>
    )
  }
}

NetworkFormContainer.displayName = "NetworkFormContainer"

NetworkFormContainer.propTypes = {
  account: PropTypes.instanceOf(Map),
  accountId: PropTypes.string,
  brand: PropTypes.string,
  confirmationModalToggled: PropTypes.bool,
  fetchAccount: PropTypes.func,
  fetchGroup: PropTypes.func,
  fetchNetwork: PropTypes.func,
  fetchPops: PropTypes.func,
  group: PropTypes.instanceOf(Map),
  groupId: PropTypes.string,
  handleSelectedEntity: PropTypes.func,
  initialValues: PropTypes.object,
  network: PropTypes.instanceOf(Map),
  networkId: PropTypes.string,
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  pops: PropTypes.instanceOf(List),
  selectedEntityId: PropTypes.string,
  toggleDeleteConfirmationModal: PropTypes.func
}

NetworkFormContainer.defaultProps = {
  account: Map(),
  group: Map(),
  network: Map(),
  pops: List()
}


const mapStateToProps = (state, ownProps) => {
  const network = ownProps.networkId && getNetworkById(state, ownProps.networkId)
  const pops = ownProps.networkId && getPopsByNetwork(state, ownProps.networkId)
  const edit = !!ownProps.networkId

  return {
    account: ownProps.accountId && getAccountById(state, ownProps.accountId),
    group: ownProps.groupId && getGroupById(state, ownProps.groupId),
    network,
    pops,
    confirmationModalToggled: state.ui.get('networkDeleteConfirmationModal'),

    initialValues: {
      name: edit && network ? network.get('name') : '',
      description: edit && network ? network.get('description') : ''
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  const uiActions = bindActionCreators(uiActionCreators, dispatch)
  return {
    onCreate: (params, data) => dispatch( networkActions.create( {...params, data } )),
    onUpdate: (params, data) => dispatch( networkActions.update( {...params, data } )),
    onDelete: (params) => dispatch( networkActions.remove( {...params } )),

    fetchAccount: (params) => dispatch( accountActions.fetchOne(params) ),
    fetchGroup: (params) => dispatch( groupActions.fetchOne(params) ),
    fetchNetwork: (params) => dispatch( networkActions.fetchOne(params) ),
    fetchPops: (params) => dispatch( popActions.fetchAll(params) ),
    toggleDeleteConfirmationModal: uiActions.toggleNetworkDeleteConfirmationModal
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NetworkFormContainer)
