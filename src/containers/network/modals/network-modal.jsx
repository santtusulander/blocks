import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { SubmissionError } from 'redux-form'
import { Map } from 'immutable'

import accountActions from '../../../redux/modules/entities/accounts/actions'
import groupActions from '../../../redux/modules/entities/groups/actions'
import networkActions from '../../../redux/modules/entities/networks/actions'

import { getById as getNetworkById } from '../../../redux/modules/entities/networks/selectors'
import { getById as getAccountById } from '../../../redux/modules/entities/accounts/selectors'
import { getById as getGroupById } from '../../../redux/modules/entities/groups/selectors'

import SidePanel from '../../../components/side-panel'
import NetworkForm from '../../../components/network/forms/network-form'
import '../../../components/account-management/group-form.scss'

class NetworkFormContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount(){
    const { brand, accountId, groupId, networkId } = this.props

    // If editing => fetch data from API
    accountId && this.props.fetchAccount({brand, id: accountId})
    groupId && this.props.fetchGroup({brand, account: accountId, id: groupId})
    networkId && this.props.fetchNetwork({brand, account: accountId, group: groupId, id: networkId})

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
  onDelete(networkId) {

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

        // Close modal
        this.props.onCancel();
      })
  }

  /**
   * Used to check if current element has children (and can be deleted)
   */
  hasChildren() {
    // TODO: this should check weather the current Network has POPs or not
    return false
  }

  render() {
    const { account, group, network, initialValues, onCancel } = this.props

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
            hasPops={this.hasChildren()}
            initialValues={initialValues}
            onSave={(values) => this.onSave(edit, values)}
            onDelete={(networkId) => this.onDelete(networkId)}
            onCancel={onCancel}
          />
        </SidePanel>
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
  group: PropTypes.instanceOf(Map),
  groupId: PropTypes.string,
  initialValues: PropTypes.object,
  network: PropTypes.instanceOf(Map),
  networkId: PropTypes.string,
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func
}

NetworkFormContainer.defaultProps = {
  account: Map(),
  group: Map(),
  network: Map()
}


const mapStateToProps = (state, ownProps) => {
  const network = ownProps.networkId && getNetworkById(state, ownProps.networkId)
  const edit = !!ownProps.networkId

  return {
    account: ownProps.accountId && getAccountById(state, ownProps.accountId),
    group: ownProps.groupId && getGroupById(state, ownProps.groupId),
    network,

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
    fetchNetwork: (params) => dispatch( networkActions.fetchOne(params) )

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NetworkFormContainer)
