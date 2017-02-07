import React, { PropTypes } from 'react'
import { injectIntl } from 'react-intl'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import { SubmissionError, formValueSelector, arrayPush, change, initialize } from 'redux-form'
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

    // Footprints
    this.showFootprintModal = this.showFootprintModal.bind(this)
    this.hideFootprintModal = this.hideFootprintModal.bind(this)

    // BGP
    this.showRoutingDaemonModal = this.showRoutingDaemonModal.bind(this)
    this.hideRoutingDaemonModal = this.hideRoutingDaemonModal.bind(this)

    this.showFootprintModal = this.showFootprintModal.bind(this)
    this.hideFootprintModal = this.hideFootprintModal.bind(this)

    this.addFootprintToPod = this.addFootprintToPod.bind(this)
    this.saveBGP = this.saveBGP.bind(this)
    this.clearBGP = this.clearBGP.bind(this)

    this.state = {
      showFootprintModal: false,
      showRoutingDaemonModal: false,
      footprintId: null
    }
  }

  componentWillMount() {
    const { brand, accountId, groupId, networkId, popId, initialValues, reinitForm } = this.props

    //If editing => fetch data from API
    accountId && this.props.fetchAccount({ brand, id: accountId })
    groupId && this.props.fetchGroup({ brand, account: accountId, id: groupId })
    networkId && this.props.fetchNetwork({ brand, account: accountId, group: groupId, id: networkId })
    popId && this.props.fetchPop({ brand, account: accountId, group: groupId, network: networkId, id: popId })

    /*
    Re-init form when footprints have been fetched.
    This is neede because we only get Footprint ids inside a POD
    */
    accountId && this.props.fetchFootprints({ brand, account: accountId })
      .then( () => {
        const UIFootprints = initialValues && initialValues.footprints && initialValues.footprints.map(id => {
          const fp = this.props.footprints.find(footp => footp.id === id)
          return fp ? fp : { id: 'unknown', name: 'UNKNOWN'}
        })

        reinitForm({
          ...initialValues,
          UIFootprints
        })
      })
  }

  componentWillReceiveProps(nextProps) {
    const { brand, accountId } = nextProps

    if (this.props.accountId !== nextProps.accountId)
      this.props.fetchFootprints({ brand, account: accountId })
  }

  addFootprintToPod(footprint) {
    const {pushFormVal} = this.props

    this.hideFootprintModal()

    if (footprint) (pushFormVal('UIFootprints', footprint))

  }

  saveBGP(values) {
    const { setFormVal } = this.props
    this.hideRoutingDaemonModal()
    const { bgp_router_ip, bgp_as_number, bgp_password } = values
    if (bgp_router_ip) setFormVal('UIsp_bgp_router_ip', bgp_router_ip)
    if (bgp_as_number) setFormVal('UIsp_bgp_router_as', bgp_as_number)
    if (bgp_password) setFormVal('UIsp_bgp_router_password', bgp_password)
  }

  clearBGP() {
    const { setFormVal } = this.props
    setFormVal('UIDiscoveryMethod', '')
    setFormVal('UIsp_bgp_router_ip', '')
    setFormVal('UIsp_bgp_router_as', '')
    setFormVal('UIsp_bgp_router_password', '')
  }

  showFootprintModal(footprintId = null) {
    this.setState({ showFootprintModal: true, footprintId })
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
      service.sp_bgp_router_ip = values.UIsp_bgp_router_ip
      service.sp_bgp_router_as = parseInt(values.UIsp_bgp_router_as) || 0
      service.sp_bgp_router_password = values.UIp_bgp_router_password

      data.footprints = []
    } else {
      service.sp_bgp_router_ip = undefined
      service.sp_bgp_router_as = undefined
      service.sp_bgp_router_password = undefined

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

  render() {
    const {
      initialValues,
      onCancel,
      UIFootprints,
      UIDiscoveryMethod,
      pop,
      podId,

      group,
      //account,
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

            //onDeleteFootprint={this.onDeleteFootprint}
            onEditFootprint={this.showFootprintModal}
            onShowFootprintModal={this.showFootprintModal}

            onShowRoutingDaemonModal={this.showRoutingDaemonModal}
            onDeleteRoutingDaemon={this.clearBGP}

            UIFootprints={UIFootprints}
            UIDiscoveryMethod={UIDiscoveryMethod}

          />

        </SidePanel>

        {this.state.showFootprintModal &&
        <FootprintFormContainer
          accountId={Number(this.props.accountId)}
          footprintId={this.state.footprintId}
          location={pop.get('iata').toLowerCase()}
          onCancel={this.hideFootprintModal}
          onDelete={this.onDeleteFootprint}
          onSave={this.onSaveFootprint}
          show={true}

          addFootprintToPod={this.addFootprintToPod}
        />
        }

        {this.state.showRoutingDaemonModal &&
        <RoutingDaemonFormContainer
          onCancel={this.hideRoutingDaemonModal}
          onSave={this.saveBGP}
          show={true}
        />
        }

      </div>
    )
  }
}

PodFormContainer.displayName = "PodFormContainer"

PodFormContainer.propTypes = {
  UIDiscoveryMethod: PropTypes.string,
  UIFootprints: PropTypes.array,

  accountId: PropTypes.string,
  brand: PropTypes.string,
  fetchAccount: PropTypes.func,
  fetchFootprints: PropTypes.func,
  fetchGroup: PropTypes.func,
  fetchNetwork: PropTypes.func,
  fetchPop: PropTypes.func,
  footprints: PropTypes.array,
  getFootprintData: PropTypes.func,
  group: PropTypes.instanceOf(Map),
  groupId: PropTypes.string,
  initialValues: PropTypes.object,
  network: PropTypes.instanceOf(Map),
  networkId: PropTypes.string,
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  podId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pop: PropTypes.instanceOf(Map),
  popId: PropTypes.string,
  pushFormVal: PropTypes.func,
  reinitForm: PropTypes.func,
  setFormVal: PropTypes.func
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
  const initialValues = edit && pod ? pod.toJS() : {}

  const inititalUIFootprints = edit && /*formFootprints && formFootprints.length > 0
    ? formFootprints
    : */
    initialValues
      && initialValues.footprints
      && initialValues.footprints.map(id => {
        return {
          id: `${ownProps.intl.formatMessage({ id: 'portal.common.loading.text' })}_${ +id}`,
          name: ownProps.intl.formatMessage({ id: 'portal.common.loading.text' })
        }
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
    fetchFootprints: (params) => dispatch(footprintActions.fetchAll(params)),

    pushFormVal: (field, val) => dispatch(arrayPush('pod-form', field, val)),
    setFormVal: (field, val) => dispatch(change('pod-form', field, val)),
    reinitForm: (initialValues) => dispatch(initialize('pod-form', initialValues))
  }
}

// && initialValues.footprints.map(id => {
//   const fp = getFootprintById(state)(id)
//   return fp ? fp.toJS() : { id: 'loading', label: 'loading ...'}
// })


export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(
  PodFormContainer
))
