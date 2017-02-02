import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import accountActions from '../../../redux/modules/entities/accounts/actions'
import groupActions from '../../../redux/modules/entities/groups/actions'
import networkActions from '../../../redux/modules/entities/networks/actions'
import popActions from '../../../redux/modules/entities/pops/actions'
import podActions from '../../../redux/modules/entities/pods/actions'

import { getById as getNetworkById } from '../../../redux/modules/entities/networks/selectors'
import { getById as getAccountById } from '../../../redux/modules/entities/accounts/selectors'
import { getById as getGroupById } from '../../../redux/modules/entities/groups/selectors'
import { getById as getPopById } from '../../../redux/modules/entities/pops/selectors'
import { getById as getPodById } from '../../../redux/modules/entities/pods/selectors'


import SidePanel from '../../../components/side-panel'

import PodForm from '../../../components/network/forms/pod-form'

//TODO Remove mockInitialValues after Redux integration
const mockInitialValues = {
  get: function(field) {
    switch (field) {
      case 'pod_name':
        return 'pod1'

      case 'lb_method':
        return 1

      case 'pod_type':
        return 2

      case 'localAS':
        return 'AS206810'

      default:
        return null
    }
  }
}

class PodFormContainer extends React.Component {
  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
    this.checkforNodes = this.checkforNodes.bind(this)
  }



  componentWillMount(){
    const {brand, accountId,groupId,networkId, popId, podId} = this.props

    //If editing => fetch data from API
    accountId && this.props.fetchAccount({brand, id: accountId})
    groupId && this.props.fetchGroup({brand, account: accountId, id: groupId})
    networkId && this.props.fetchNetwork({brand, account: accountId, group: groupId, id: networkId})
    popId && this.props.fetchPop({brand, account: accountId, group: groupId, network: networkId, id: popId})
    podId && this.props.fetchPod({brand, account: accountId, group: groupId, network: networkId, pop: popId, id: podId})
    //TODO: fetch location by Group

  }
  onSubmit(values) {
    const { onSave } = this.props
    return onSave(values)
  }

  checkforNodes() {
    //TODO: this should check weather the current POD has Nodes or not
    // and return a boolean
    return false
  }

  render() {
    const {
      account,
      brand,
      group,
      network,
      pop,
      pod,
      //podId,
      initialValues,
      onCancel,
      onDelete
    } = this.props
console.log(initialValues);
    const edit = !!initialValues.pod_name

    const title = edit ? <FormattedMessage id="portal.network.podForm.editPod.title"/> :
      <FormattedMessage id="portal.network.podForm.newPod.title"/>

    const subTitle = 'subtitle' //`${group.get('name')} / ${network.get('name')} / ${pop.get('name')} / ${edit ? ' / ' + podId : ''}`

    return (
      <div>
        <SidePanel
          show={true}
          className="pod-form-sidebar"
          title={title}
          subTitle={subTitle}
          cancel={onCancel}
          >

          <PodForm
            initialValues={initialValues}
            hasNodes={this.checkforNodes()}
            onCancel={onCancel}
            onDelete={onDelete}
            onSubmit={this.onSubmit}

            // brand={brand}
            // account={account}
            // group={group}
            // network={network}
            // pop={pop}

          />

        </SidePanel>
      </div>
    )
  }
}

PodFormContainer.displayName = "PodFormContainer"

PodFormContainer.propTypes = {
  initialValues: PropTypes.object,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
  podId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

PodFormContainer.defaultProps = {
  account: Map(),
  group: Map(),
  network: Map(),
  pop: Map(),
  pod: Map()
}

const mapStateToProps = ( state, ownProps) => {
  const edit = !!ownProps.podId
  const pop = ownProps.popId && getPopById(state, ownProps.popId)
  const pod = ownProps.podId && pop && getPodById(state, `${pop.get('name')}-${ownProps.podId}`)

  return {
    account: ownProps.accountId && getAccountById(state, ownProps.accountId),
    group: ownProps.groupId && getGroupById(state, ownProps.groupId),
    network: ownProps.networkId && getNetworkById(state, ownProps.networkId),
    pop,//: ownProps.popId && getPopById(state, ownProps.popId),
    pod,

    initialValues: {
      ...pod.toJS()

      // id: edit && pod ? pod.get('id') : null,
      // pod_name: edit && pod ? pod.get('pod_name') : null,
      // lb_method: edit && pod ? pod.get('lb_method') : null,
      // pod_type: edit && pod ? pod.get('pod_type') : null,
      // local_as: edit && pod ? pod.get('local_as') : null
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
    fetchPod: (params) => dispatch( podActions.fetchOne(params) )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(PodFormContainer)
)
