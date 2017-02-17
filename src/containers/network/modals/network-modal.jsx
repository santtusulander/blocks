import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { SubmissionError } from 'redux-form'
import { List, Map } from 'immutable'

import accountActions from '../../../redux/modules/entities/accounts/actions'
import groupActions from '../../../redux/modules/entities/groups/actions'
import networkActions from '../../../redux/modules/entities/networks/actions'
import popActions from '../../../redux/modules/entities/pops/actions'
import { changeNotification } from '../../../redux/modules/ui'

import { getById as getNetworkById } from '../../../redux/modules/entities/networks/selectors'
import { getById as getAccountById } from '../../../redux/modules/entities/accounts/selectors'
import { getById as getGroupById } from '../../../redux/modules/entities/groups/selectors'
import { getByNetwork as getPopsByNetwork } from '../../../redux/modules/entities/pops/selectors'

import { buildReduxId } from '../../../redux/util'

import SidePanel from '../../../components/side-panel'
import ModalWindow from '../../../components/modal'
import NetworkForm from '../../../components/network/forms/network-form'
import '../../../components/account-management/group-form.scss'

class NetworkFormContainer extends React.Component {
  constructor(props) {
    super(props)
    this.networkId = null
    this.notificationTimeout = null
    this.state = {
      showDeleteModal : false
    }
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

  onToggleDeleteModal(showDeleteModal) {
    this.setState({ showDeleteModal })
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

        const message = edit ? <FormattedMessage id="portal.network.networkForm.updateNetwork.status"/> :
         <FormattedMessage id="portal.network.networkForm.createNetwork.status"/>
        this.showNotification(message)

        // Close modal
        this.props.onCancel();
      })
  }

  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.showNotification(message)
    this.notificationTimeout = setTimeout(this.props.showNotification, 10000)
  }

  /**
   * Handler for Delete
   */
  onDelete(){
    const params = {
      brand: 'udn',
      account: this.props.accountId,
      group: this.props.groupId,
      id: this.networkId
    }

    return this.props.onDelete(params)
      .then( (resp) => {
        if (resp.error) {
          // Throw error => will be shown inside form
          throw new SubmissionError({'_error': resp.error.data.message})
        }
        this.showNotification(<FormattedMessage id="portal.network.networkForm.deleteNetwork.status"/>)

        // Unselect network item
        if (this.props.selectedEntityId == this.networkId) {
          this.props.handleSelectedEntity(this.networkId)
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
    const { account, group, network, initialValues, onCancel} = this.props
    const { showDeleteModal } = this.state
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
              this.onToggleDeleteModal(true)
            }
            }
            onCancel={onCancel}
          />
        </SidePanel>

        {edit && showDeleteModal &&
          <ModalWindow
            title={<FormattedMessage id="portal.network.networkForm.deleteNetwork.title"/>}
            verifyDelete={true}
            cancelButton={true}
            deleteButton={true}
            cancel={() => this.onToggleDeleteModal(false)}
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
  showNotification: PropTypes.func
}

NetworkFormContainer.defaultProps = {
  account: Map(),
  group: Map(),
  network: Map(),
  pops: List()
}


const mapStateToProps = (state, ownProps) => {
  const networkId = buildReduxId(ownProps.groupId, ownProps.networkId)
  const network = ownProps.networkId && getNetworkById(state, networkId)
  const pops = ownProps.networkId && getPopsByNetwork(state, networkId)
  const edit = !!ownProps.networkId

  return {
    account: ownProps.accountId && getAccountById(state, ownProps.accountId),
    group: ownProps.groupId && getGroupById(state, ownProps.groupId),
    network,
    pops,

    initialValues: {
      name: edit && network ? network.get('name') : '',
      description: edit && network ? network.get('description') : ''
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCreate: (params, data) => dispatch( networkActions.create( {...params, data } )),
    onUpdate: (params, data) => dispatch( networkActions.update( {...params, data } )),
    onDelete: (params) => dispatch( networkActions.remove( {...params } )),

    fetchAccount: (params) => dispatch( accountActions.fetchOne(params) ),
    fetchGroup: (params) => dispatch( groupActions.fetchOne(params) ),
    fetchNetwork: (params) => dispatch( networkActions.fetchOne(params) ),
    fetchPops: (params) => dispatch( popActions.fetchAll(params) ),

    showNotification: (message) => dispatch( changeNotification(message) )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NetworkFormContainer)
