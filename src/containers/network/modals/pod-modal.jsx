import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import { /*formValueSelector,*/ SubmissionError } from 'redux-form'

import { FormattedMessage /*, injectIntl, intlShape */} from 'react-intl'

import accountActions from '../../../redux/modules/entities/accounts/actions'
import groupActions from '../../../redux/modules/entities/groups/actions'
import networkActions from '../../../redux/modules/entities/networks/actions'
import popActions from '../../../redux/modules/entities/pops/actions'
import podActions from '../../../redux/modules/entities/pods/actions'
import footprintActions from '../../../redux/modules/entities/footprints/actions'

import { getById as getNetworkById } from '../../../redux/modules/entities/networks/selectors'
import { getById as getAccountById } from '../../../redux/modules/entities/accounts/selectors'
import { getById as getGroupById } from '../../../redux/modules/entities/groups/selectors'
import { getById as getPopById } from '../../../redux/modules/entities/pops/selectors'
import { getById as getPodById } from '../../../redux/modules/entities/pods/selectors'
import { getById as getFootprintById } from '../../../redux/modules/entities/footprints/selectors'

import SidePanel from '../../../components/side-panel'

import PodForm from '../../../components/network/forms/pod-form'
import FootprintFormContainer from './footprint-modal'

class PodFormContainer extends React.Component {
  constructor(props) {
    super(props)

    this.checkforNodes = this.checkforNodes.bind(this)
    this.onAddFootprintModal = this.onAddFootprintModal.bind(this)
    this.onCancelFootprintModal = this.onCancelFootprintModal.bind(this)

    this.state = {
      showFootprintModal: false,
      //footprints: fromJS(dummyFootprints),
      initialValues: Map()
    }
  }

  componentWillMount(){
    const { brand, accountId, groupId, networkId, popId, podId } = this.props

    //If editing => fetch data from API
    accountId && this.props.fetchAccount({brand, id: accountId})
    groupId && this.props.fetchGroup({brand, account: accountId, id: groupId})
    networkId && this.props.fetchNetwork({brand, account: accountId, group: groupId, id: networkId})
    popId && this.props.fetchPop({brand, account: accountId, group: groupId, network: networkId, id: popId})
    podId && this.props.fetchPod({brand, account: accountId, group: groupId, network: networkId, pop: popId, id: podId})
    //TODO: fetch location by Group

  }

  /**
   * hander for save
   */
  onSave(edit, values) {

    const data = {
      pod_name: values.UIName,
      pod_type: values.pod_type,
    }

    const service ={
      cloud_lookup_id: values.UICloudLookUpId,
      lb_method: values.UILbMethod,
      local_as: parseInt(values.UILocalAS),
      request_fwd_type: values.UIRequestFwdType,
      provider_weight: values.UIProviderWeight
    }

    if (values.UIDiscoveryMethod === 'BGP') {
      service.sp_bgp_router_ip = values.UIBGP.sp_bgp_router_ip
      service.sp_bgp_router_as = values.UIBGP.sp_bgp_router_as
      service.sp_bgp_router_password = values.UIBGP.sp_bgp_router_password

      data.footprints = []
    } else {
      // service.sp_bgp_router_ip = ''
      // service.sp_bgp_router_as = 0
      // service.sp_bgp_router_password = 0

      //TODO: assemple footprints array
      data.footprints = []
    }

    data.services = [ service ]

    const params = {
      brand: 'udn',
      account: this.props.accountId,
      group: this.props.groupId,
      network: this.props.networkId,
      pop: this.props.popId,
      payload: data
    }

    if (edit) params.id = values.pod_name

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
  onDelete(podId) {
    const params = {
      brand: 'udn',
      account: this.props.accountId,
      group: this.props.groupId,
      network: this.props.networkId,
      pop: this.props.popId,
      id: podId
    }

    return this.props.onDelete(params)
      .then( (resp) => {
        if (resp.error) {
          // Throw error => will be shown inside form
          throw new SubmissionError({'_error': resp.error.data.message})
        }

        //Close modal
        this.props.onCancel();
      })
  }

  checkforNodes() {
    //TODO: this should check weather the current POD has Nodes or not
    // and return a boolean
    return false
  }

  onAddFootprintModal() {
    this.setState({ showFootprintModal: true })
  }

  onCancelFootprintModal() {
      this.setState({ showFootprintModal: false, initialValues: Map() })
  }

  render() {
    const {
      account,
      brand,
      group,
      network,
      pop,
      podId,
      initialValues,
      onCancel,
      onDelete
    } = this.props

    const edit = !!initialValues.pod_name

    const title = edit ? <FormattedMessage id="portal.network.podForm.editPod.title"/> :
      <FormattedMessage id="portal.network.podForm.newPod.title"/>

    const subTitle = `${group.get('name')} / ${network.get('name')} / ${pop.get('name')} ${edit ? ' / ' + initialValues.pod_name : ''}`

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
            onDelete={() => this.onDelete(podId)}
            onSave={(values) => this.onSave(edit, values)}

            onAddFootprintModal={this.onAddFootprintModal}

          />

        </SidePanel>


        {this.state.showFootprintModal &&
          <FootprintFormContainer
            show={true}
            editing={!this.state.initialValues.isEmpty()}
            initialValues={this.state.initialValues}
            onCancel={this.onCancelFootprintModal}
            onSubmit={this.onSubmitFootprintModal}
          />
        }

      </div>
    )
  }
}

PodFormContainer.displayName = "PodFormContainer"

PodFormContainer.propTypes = {
  initialValues: PropTypes.object,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
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

  const initialValues = edit && pod ? { ...pod.toJS() } : {}

  return {
    account: ownProps.accountId && getAccountById(state, ownProps.accountId),
    group: ownProps.groupId && getGroupById(state, ownProps.groupId),
    network: ownProps.networkId && getNetworkById(state, ownProps.networkId),
    pop,
    pod,

    initialValues
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCreate: (params, data) => dispatch( podActions.create( {...params, data } )),
    onUpdate: (params, data) => dispatch( podActions.update( {...params, data } )),
    onDelete: (params) => dispatch( podActions.remove( {...params } )),

    onCreateFootprint: (params, data) => dispatch( footprintActions.create({ ...params, data }) ),
    onUpdateFootprint: (params, data) => dispatch( footprintActions.update({ ...params, data }) ),
    onDeleteFootprint: (params) => dispatch( footprintActions.remove({ ...params }) ),

    fetchAccount: (params) => dispatch( accountActions.fetchOne(params) ),
    fetchGroup: (params) => dispatch( groupActions.fetchOne(params) ),
    fetchNetwork: (params) => dispatch( networkActions.fetchOne(params) ),
    fetchPop: (params) => dispatch( popActions.fetchOne(params) ),
    fetchPod: (params) => dispatch( podActions.fetchOne(params) ),
    fetchFootprints: (params) => dispatch( footprintActions.fetchAll(params) )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  PodFormContainer
)
