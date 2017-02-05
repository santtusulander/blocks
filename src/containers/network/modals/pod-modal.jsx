import React, { PropTypes } from 'react'

import { Map } from 'immutable'
import { connect } from 'react-redux'
import { /*formValueSelector,*/ SubmissionError, formValueSelector } from 'redux-form'

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
import { getById as getFootprintById} from '../../../redux/modules/entities/footprints/selectors'
import { getByAccount as getFootprintsByAccount} from '../../../redux/modules/entities/footprints/selectors'

import SidePanel from '../../../components/side-panel'

import PodForm from '../../../components/network/forms/pod-form'
import FootprintFormContainer from './footprint-modal'
import RoutingDaemonFormContainer from './routing-daemon-modal'

class PodFormContainer extends React.Component {
  constructor(props) {
    super(props)

    this.checkforNodes = this.checkforNodes.bind(this)

    this.showFootprintModal = this.showFootprintModal.bind(this)
    this.hideFootprintModal = this.hideFootprintModal.bind(this)

    this.showRoutingDaemonModal = this.showRoutingDaemonModal.bind(this)
    this.hideRoutingDaemonModal = this.hideRoutingDaemonModal.bind(this)


    this.onEditFootprint = this.onEditFootprint.bind(this)
    this.handleFootprintSaveResponse = this.handleFootprintSaveResponse.bind(this)

    this.onAddFootprintModal = this.onAddFootprintModal.bind(this)
    this.onEditFootprintModal = this.onEditFootprintModal.bind(this)
    this.onCancelFootprintModal = this.onCancelFootprintModal.bind(this)

    this.state = {
      showFootprintModal: false,
      showRoutingDaemonModal: false,
      footprintId: null
    }
  }

  componentWillMount() {
    const { brand, accountId, groupId, networkId, popId, podId } = this.props

    //If editing => fetch data from API
    accountId && this.props.fetchAccount({ brand, id: accountId })
    groupId && this.props.fetchGroup({ brand, account: accountId, id: groupId })
    networkId && this.props.fetchNetwork({ brand, account: accountId, group: groupId, id: networkId })
    popId && this.props.fetchPop({ brand, account: accountId, group: groupId, network: networkId, id: popId })

    // Pod is embeded in POP
    // podId && this.props.fetchPod({
    //   brand,
    //   account: accountId,
    //   group: groupId,
    //   network: networkId,
    //   pop: popId,
    //   id: podId
    // })

    this.props.fetchFootprints({ brand, account: accountId })

  }

  componentWillReceiveProps(nextProps) {
    const { brand, accountId } = nextProps

    if (this.props.accountId !== nextProps.accountId)
      this.props.fetchFootprints({ brand, account: accountId })
  }

  onEditFootprint(footprintId) {
    this.setState({ footprintId, showFootprintModal: true })
  }

  handleFootprintSaveResponse(res) {
    this.hideFootprintModal()
    // TODO: do something with the response
    // dispatch(arrayPush)
  }

  showFootprintModal() {
    this.setState({ showFootprintModal: true })
  }

  hideFootprintModal() {
    this.setState({ showFootprintModal: false, footprintId: null })
  }

  showRoutingDaemonModal() {
    this.setState({ showRoutingDaemonModal: true })
  }

  hideRoutingDaemonModal() {
    this.setState({ showRoutingDaemonModal: false})
  }


  /**
   * hander for save
   */
  onSave(edit, values) {

    const data = {
      pod_name: values.UIName,
      pod_type: values.pod_type
    }

    const service = {
      cloud_lookup_id: values.UICloudLookUpId,
      lb_method: values.UILbMethod,
      local_as: parseInt(values.UILocalAS),
      request_fwd_type: values.UIRequestFwdType,
      provider_weight: values.UIProviderWeight
      //TODO:find out if Ip List is needed
      //ip_list: values.UIIpList.map( ip => ip.label )
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

      //Get footprint IDs
      data.footprints = values.UIFootprints.filter( fp => !fp.removed || fp.removed === false ).map( fp => fp.id )
    }

    data.services = [service]

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
      .then((resp) => {
        if (resp.error) {
          // Throw error => will be shown inside form
          throw new SubmissionError({ '_error': resp.error.data.message })
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
      .then((resp) => {
        if (resp.error) {
          // Throw error => will be shown inside form
          throw new SubmissionError({ '_error': resp.error.data.message })
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

  onEditFootprintModal(id){
    console.log('onFootprintEdit', id);
    this.setState({ showFootprintModal: true })
  }

  onCancelFootprintModal() {
    this.setState({ showFootprintModal: false })
  }

  render() {
    const {
      initialValues,
      onCancel,
      UIFootprints,
      UIDiscoveryMethod,
      pop,
      podId,

      group,
      account,
      network,
      footprints

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
            footprints={footprints}
            hasNodes={this.checkforNodes()}
            initialValues={initialValues}

            onSave={(values) => this.onSave(edit, values)}
            onDelete={() => this.onDelete(podId)}
            onCancel={onCancel}

            onDeleteFootprint={this.onDeleteFootprint}
            onEditFootprint={this.onEditFootprint}
            onShowFootprintModal={this.showFootprintModal}

            onAddFootprintModal={this.onAddFootprintModal}
            onEditFootprintModal={this.onEditFootprintModal}

            onShowRoutingDaemonModal={this.showRoutingDaemonModal}

            UIFootprints={UIFootprints}
            UIDiscoveryMethod={UIDiscoveryMethod}

          />

        </SidePanel>

        {this.state.showFootprintModal &&
        <FootprintFormContainer
          accountId={this.props.accountId}
          footprintId={this.state.footprintId}
          location={pop.get('iata').toLowerCase()}
          onCancel={this.hideFootprintModal}
          onDelete={this.onDeleteFootprint}
          onSave={this.onSaveFootprint}
          show={true}
        />
        }

        {this.state.showRoutingDaemonModal &&
        <RoutingDaemonFormContainer
          onCancel={this.hideRoutingDaemonModal}
          onDelete={this.onDeleteFootprint}
          onSave={this.onSaveFootprint}
          show={true}
        />
        }

      </div>
    )
  }
}

PodFormContainer.displayName = "PodFormContainer"

PodFormContainer.propTypes = {
  account: PropTypes.instanceOf(Map),
  accountId: PropTypes.string,
  group: PropTypes.instanceOf(Map),
  initialValues: PropTypes.object,
  network: PropTypes.instanceOf(Map),
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  //pod: PropTypes.instanceOf(Map),
  podId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pop: PropTypes.instanceOf(Map)
}

PodFormContainer.defaultProps = {
  account: Map(),
  group: Map(),
  network: Map(),
  pop: Map(),
  pod: Map(),
  UIFootprints: []
}

const mapStateToProps = (state, ownProps) => {

  const selector = formValueSelector('pod-form')
  const UIDiscoveryMethod = selector(state, 'UIDiscoveryMethod')
  const UIFootprints = selector(state, 'UIFootprints')

  const edit = !!ownProps.podId
  const pop = ownProps.popId && getPopById(state, ownProps.popId)
  const pod = ownProps.podId && pop && getPodById(state, `${pop.get('name')}-${ownProps.podId}`)
  const initialValues = edit && pod ? { ...pod.toJS() } : {}

  const inititalUIFootprints = edit && /*formFootprints && formFootprints.length > 0
    ? formFootprints
    : */
    initialValues
      && initialValues.footprints
      && initialValues.footprints.map(id => {
        const fp = getFootprintById(state)(id)
        return fp.toJS()
      })
  initialValues.UIFootprints = inititalUIFootprints ? inititalUIFootprints : []

  return {
    account: ownProps.accountId && getAccountById(state, ownProps.accountId),
    fetching: state.entities.fetching,
    group: ownProps.groupId && getGroupById(state, ownProps.groupId),
    network: ownProps.networkId && getNetworkById(state, ownProps.networkId),
    footprints: ownProps.accountId && getFootprintsByAccount(state)(ownProps.accountId).toJS(),
    pop,
    pod,

    UIFootprints,
    UIDiscoveryMethod,

    initialValues
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCreate: (params, data) => dispatch(podActions.create({ ...params, data })),
    onUpdate: (params, data) => dispatch(podActions.update({ ...params, data })),
    onDelete: (params) => dispatch(podActions.remove({ ...params })),

    fetchAccount: (params) => dispatch(accountActions.fetchOne(params)),
    fetchGroup: (params) => dispatch(groupActions.fetchOne(params)),
    fetchNetwork: (params) => dispatch(networkActions.fetchOne(params)),
    fetchPop: (params) => dispatch(popActions.fetchOne(params)),
    fetchPod: (params) => dispatch(podActions.fetchOne(params)),
    fetchFootprints: (params) => dispatch(footprintActions.fetchAll(params))

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  PodFormContainer
)
