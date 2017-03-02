import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import { SubmissionError, formValueSelector, arrayPush, change, initialize } from 'redux-form'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import accountActions from '../../../redux/modules/entities/accounts/actions'
import groupActions from '../../../redux/modules/entities/groups/actions'
import networkActions from '../../../redux/modules/entities/networks/actions'
import popActions from '../../../redux/modules/entities/pops/actions'
import podActions from '../../../redux/modules/entities/pods/actions'
import footprintActions from '../../../redux/modules/entities/footprints/actions'
import { changeNotification } from '../../../redux/modules/ui'

import { getById as getNetworkById } from '../../../redux/modules/entities/networks/selectors'
import { getById as getAccountById } from '../../../redux/modules/entities/accounts/selectors'
import { getById as getGroupById } from '../../../redux/modules/entities/groups/selectors'
import { getById as getPopById } from '../../../redux/modules/entities/pops/selectors'
import { getById as getPodById } from '../../../redux/modules/entities/pods/selectors'
import { getByAccount as getFootprintsByAccount} from '../../../redux/modules/entities/footprints/selectors'
import { getByPod as getNodesByPod } from '../../../redux/modules/entities/nodes/selectors'

import { buildReduxId } from '../../../redux/util'

import SidePanel from '../../../components/side-panel'
import ModalWindow from '../../../components/modal'
import PodForm from '../../../components/network/forms/pod-form'
import FootprintFormContainer from './footprint-modal'
import RoutingDaemonFormContainer from './routing-daemon-modal'

import { STATUS_VALUE_DEFAULT } from '../../../constants/network'

class PodFormContainer extends React.Component {
  constructor(props) {
    super(props)
    this.notificationTimeout = null

    // Footprints
    this.showFootprintModal = this.showFootprintModal.bind(this)
    this.hideFootprintModal = this.hideFootprintModal.bind(this)

    // BGP
    this.showRoutingDaemonModal = this.showRoutingDaemonModal.bind(this)
    this.hideRoutingDaemonModal = this.hideRoutingDaemonModal.bind(this)

    this.showFootprintModal = this.showFootprintModal.bind(this)
    this.hideFootprintModal = this.hideFootprintModal.bind(this)

    this.initFootprints = this.initFootprints.bind(this)
    this.addFootprintToPod = this.addFootprintToPod.bind(this)
    this.refreshFootprints = this.refreshFootprints.bind(this)

    this.saveBGP = this.saveBGP.bind(this)
    this.clearBGP = this.clearBGP.bind(this)

    this.state = {
      showFootprintModal: false,
      showRoutingDaemonModal: false,
      footprintId: null,
      showDeleteModal : false
    }
  }

  componentWillMount() {
    const { brand, accountId, groupId, networkId, popId } = this.props

    //If editing => fetch data from API
    accountId && this.props.fetchAccount({ brand, id: accountId })
    groupId && this.props.fetchGroup({ brand, account: accountId, id: groupId })
    networkId && this.props.fetchNetwork({ brand, account: accountId, group: groupId, id: networkId })
    popId && this.props.fetchPop({ brand, account: accountId, group: groupId, network: networkId, id: popId })

    /*
    Re-init form when footprints have been fetched.
    This is neede because we only get Footprint ids inside a POD
    */
    accountId && this.initFootprints()
  }

  componentWillReceiveProps(nextProps) {
    const { brand, accountId } = nextProps

    if (this.props.accountId !== nextProps.accountId)
      this.props.fetchFootprints({ brand, account: accountId })
  }

  initFootprints() {
    const { brand, accountId, initialValues, reinitForm, fetchFootprints, intl } = this.props
    const unknown = intl.formatMessage({id: "portal.common.unknown"});

    return fetchFootprints({ brand, account: accountId })
      .then(() => {
        const UIFootprints = initialValues && initialValues.footprints && initialValues.footprints.map(id => {
          const fp = this.props.footprints.find(footp => footp.id === id)
          return fp ? fp : { id: `unknown-${id}`, name: unknown }
        })

        reinitForm({
          ...initialValues,
          UIFootprints
        })
      });
  }

  refreshFootprints(){
    const { UIFootprints, footprints, setFormVal } = this.props

    const footprintIDs = UIFootprints.map(fp => fp.id)
    const removedIDs = UIFootprints.filter(fp => fp.removed).map(fp => fp.id)

    const initialFootprints = footprints.filter(fp => footprintIDs.includes(fp.id))
    const newFootprints = initialFootprints.map(fp => {
      const removedFootprint = Object.assign({}, fp, { removed: true})
      return removedIDs.includes(fp.id) ? removedFootprint : fp
    })
    setFormVal('UIFootprints', newFootprints)
  }

  addFootprintToPod(footprint) {
    const { pushFormVal } = this.props
    if (footprint) {
      (pushFormVal('UIFootprints', footprint))
    }
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
    this.refreshFootprints()
    this.setState({ showFootprintModal: false, footprintId: null })
  }

  showRoutingDaemonModal() {
    this.setState({ showRoutingDaemonModal: true })
  }

  hideRoutingDaemonModal() {
    this.setState({ showRoutingDaemonModal: false})
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
      pod_name: values.UIName,
      pod_type: values.pod_type,
      status: values.status
    }

    const service = {
      lb_method: values.UILbMethod,
      local_as: parseInt(values.UILocalAS),
      request_fwd_type: values.UIRequestFwdType,
      provider_weight: parseFloat(values.UIProviderWeight),
      ip_list: values.UIIpList.map( ip => ip.label )
    }

    if (values.UIDiscoveryMethod === 'BGP') {
      service.sp_bgp_router_ip = values.UIsp_bgp_router_ip
      service.sp_bgp_router_as = parseInt(values.UIsp_bgp_router_as) || 0
      service.sp_bgp_router_password = values.UIsp_bgp_router_password

      data.footprints = []
    } else {
      service.sp_bgp_router_ip = undefined
      service.sp_bgp_router_as = undefined
      service.sp_bgp_router_password = undefined

      //Get footprint IDs
      const UIFootprints = values.UIFootprints || []
      data.footprints = UIFootprints.filter( fp => !fp.removed || fp.removed === false ).map( fp => fp.id )
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
      .then(() => {

        const message = edit ? <FormattedMessage id="portal.network.podForm.updatePod.status"/> :
         <FormattedMessage id="portal.network.podForm.createPod.status"/>
        this.showNotification(message)

        //Close modal
        this.props.onCancel();

      }).catch((resp) => {

        // Throw error => will be shown inside form
        throw new SubmissionError({ '_error': resp.data.message })

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
      .then(() => {
        // Unselect POD item
        if (this.props.selectedEntityId === podId) {
          this.props.handleSelectedEntity(podId)
        }
        
        this.showNotification(<FormattedMessage id="portal.network.podForm.deletePod.status"/>)

        //Close modal
        this.props.onCancel();
      },
    )
    .catch(resp => {
      throw new SubmissionError({ '_error': resp.data.message })
    })
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
      hasNodes,
      network,
      footprints,
      podPermissions,
      footprintPermissions
    } = this.props

    const {showDeleteModal} = this.state

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
            hasNodes={hasNodes}
            initialValues={initialValues}

            onSave={(values) => this.onSave(edit, values)}
            onDelete={() => this.onToggleDeleteModal(true)}
            onCancel={onCancel}

            //onDeleteFootprint={this.onDeleteFootprint}
            onEditFootprint={this.showFootprintModal}
            onShowFootprintModal={this.showFootprintModal}

            onShowRoutingDaemonModal={this.showRoutingDaemonModal}
            onDeleteRoutingDaemon={this.clearBGP}

            UIFootprints={UIFootprints}
            UIDiscoveryMethod={UIDiscoveryMethod}

            podPermissions={podPermissions}
            footprintPermissions={footprintPermissions}
          />

        </SidePanel>

        {this.state.showFootprintModal &&
        <FootprintFormContainer
          accountId={Number(this.props.accountId)}
          footprintId={this.state.footprintId}
          location={pop.get('iata').toLowerCase()}
          onCancel={this.hideFootprintModal}
          show={true}
          addFootprintToPod={this.addFootprintToPod}
          footprintPermissions={footprintPermissions}
        />
        }

        {this.state.showRoutingDaemonModal &&
        <RoutingDaemonFormContainer
          onCancel={this.hideRoutingDaemonModal}
          onSave={this.saveBGP}
          show={true}
        />
        }

        {edit && showDeleteModal &&
          <ModalWindow
            className='modal-window-raised'
            title={<FormattedMessage id="portal.network.podForm.deletePod.title"/>}
            verifyDelete={true}
            cancelButton={true}
            deleteButton={true}
            cancel={() => this.onToggleDeleteModal(false)}
            onSubmit={()=>{
              this.onToggleDeleteModal(false)
              this.onDelete(podId)
              onCancel()
            }}>
            <p>
             <FormattedMessage id="portal.network.podForm.deletePod.confirmation.text"/>
            </p>
          </ModalWindow>}

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
  footprintPermissions: PropTypes.object,
  footprints: PropTypes.array,
  group: PropTypes.instanceOf(Map),
  groupId: PropTypes.string,
  handleSelectedEntity: PropTypes.func,
  hasNodes: PropTypes.bool,
  initialValues: PropTypes.object,
  intl: intlShape.isRequired,
  network: PropTypes.instanceOf(Map),
  networkId: PropTypes.string,
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  podId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  podPermissions: PropTypes.object,
  pop: PropTypes.instanceOf(Map),
  popId: PropTypes.string,
  pushFormVal: PropTypes.func,
  reinitForm: PropTypes.func,
  selectedEntityId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setFormVal: PropTypes.func,
  showNotification: PropTypes.func

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
  const pop = ownProps.popId && getPopById(state, buildReduxId(ownProps.groupId, ownProps.networkId, ownProps.popId))
  const pod = ownProps.podId && pop && getPodById(state, buildReduxId(ownProps.groupId, ownProps.networkId, ownProps.popId, ownProps.podId))
  const defaultValues = {
    UIRequestFwdType: 'on_net',
    UILbMethod: 'gslb',
    pod_type: 'sp_edge',
    UIProviderWeight: 0.5
  }

  const initialValues = edit && pod ? pod.toJS() : defaultValues

  const inititalUIFootprints = edit
    && initialValues
    && initialValues.footprints
    && initialValues.footprints.map(id => {
      return {
        id: `${ownProps.intl.formatMessage({ id: 'portal.common.loading.text' })}_${ +id}`,
        name: ownProps.intl.formatMessage({ id: 'portal.common.loading.text' })
      }
    })

  initialValues.UIFootprints = inititalUIFootprints ? inititalUIFootprints : []
  initialValues.status = edit && pod ? pod.get('status') : STATUS_VALUE_DEFAULT
  initialValues.UIIpList = edit && pod && pod.get('UIIpList').map( ip => { return {id: ip, label: ip} } ).toJS() || []

  return {
    account: ownProps.accountId && getAccountById(state, ownProps.accountId),
    fetching: state.entities.fetching,
    group: ownProps.groupId && getGroupById(state, ownProps.groupId),
    hasNodes: pod && !getNodesByPod(state, buildReduxId(ownProps.groupId, ownProps.networkId, ownProps.popId, ownProps.podId)).isEmpty(),
    network: ownProps.networkId && getNetworkById(state, buildReduxId(ownProps.groupId, ownProps.networkId)),
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
    onDelete: (params) => dispatch(podActions.remove(params)),

    fetchAccount: (params) => dispatch(accountActions.fetchOne(params)),
    fetchGroup: (params) => dispatch(groupActions.fetchOne(params)),
    fetchNetwork: (params) => dispatch(networkActions.fetchOne(params)),
    fetchPop: (params) => dispatch(popActions.fetchOne(params)),
    fetchPod: (params) => dispatch(podActions.fetchOne(params)),
    fetchFootprints: (params) => dispatch(footprintActions.fetchAll(params)),

    pushFormVal: (field, val) => dispatch(arrayPush('pod-form', field, val)),
    setFormVal: (field, val) => dispatch(change('pod-form', field, val)),
    showNotification: (message) => dispatch( changeNotification(message) ),
    reinitForm: (initialValues) => dispatch(initialize('pod-form', initialValues))
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(
  PodFormContainer
))
