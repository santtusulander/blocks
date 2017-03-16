import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import { withRouter } from 'react-router'

import * as uiActionCreators from '../../redux/modules/ui'
import storageActions from '../../redux/modules/entities/CIS-ingest-points/actions'
import { getStorageAccessKey } from '../../redux/modules/user'

import { UPLOAD_FILE } from '../../redux/modules/http-file-upload/actionTypes'
import actions from '../../redux/modules/http-file-upload/actions'

import FileUploader from '../../redux/modules/http-file-upload/uploader/file-uploader'
import * as groupActionCreators from '../../redux/modules/group'
import { hasService } from '../../util/helpers'

import { getById as getStorageById } from '../../redux/modules/entities/CIS-ingest-points/selectors'

import clusterActions from '../../redux/modules/entities/CIS-clusters/actions'
import { getById as getClusterById } from '../../redux/modules/entities/CIS-clusters/selectors'

import { fetchMetrics } from '../../redux/modules/entities/storage-metrics/actions'
import { getByStorageId as getMetricsByStorageId } from '../../redux/modules/entities/storage-metrics/selectors'

import { buildReduxId } from '../../redux/util'

import StorageFormContainer from './modals/storage-modal.jsx'

import Content from '../../components/layout/content'
import PageContainer from '../../components/layout/page-container'

import StorageHeader from '../../components/storage/storage-header'
import StorageKPI from '../../components/storage/storage-kpi'
import StorageContents from '../../components/storage/storage-contents'

import { EDIT_STORAGE } from '../../constants/account-management-modals.js'
import { STORAGE_SERVICE_ID } from '../../constants/service-permissions'

import { getContentUrl } from '../../util/routes.js'
import { buildAnalyticsOpts, formatBytesToUnit, formatBytes, separateUnit } from '../../util/helpers'

class Storage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      asperaUpload: false
    }

    this.fileUploader = null

    this.toggleUploadMehtod = this.toggleUploadMehtod.bind(this)

    this.editStorage = this.editStorage.bind(this)
    this.onModalCancel = this.onModalCancel.bind(this)
    this.initFileUploader = this.initFileUploader.bind(this)
  }

  componentWillMount() {
    if (this.props.params.storage && this.props.params.group) {
      this.props.fetchStorage({
        brand: this.props.params.brand,
        account: this.props.params.account,
        group: this.props.params.group,
        id: this.props.params.storage
      })

      const { params, filters } = this.props
      const fetchOpts = buildAnalyticsOpts(params, filters, {pathname: 'storage'})
      this.props.fetchStorageMetrics({start: fetchOpts.startDate, end: fetchOpts.endDate, ...fetchOpts})

      this.props.fetchClusters({})
    }
    //fetch Active group if there is none in redux
    if (!this.props.group && this.props.params) this.props.fetchGroupData(this.props.params)
  }

  componentDidMount() {
    const { brand, account, group, storage } = this.props.params
    this.props.initStorageAccessKey(brand, account, group, storage).then(this.initFileUploader)
  }

  componentWillReceiveProps ({ group, hasStorageService, params}) {
    if (group && !hasStorageService) {
      //redirect when the group doesn't have storage service
      this.props.router.push(getContentUrl('group', params.group, params))
    }
  }

  /**
   * Initialize File Uploader
   * @param action {object} - action with type and payload
   */
  initFileUploader(action) {
    const { gatewayHostname, initUploadProgressHandler } = this.props
    this.fileUploader = FileUploader.initialize(action.payload, gatewayHostname, initUploadProgressHandler)
  }

  toggleUploadMehtod(asperaUpload) {
    this.setState({ asperaUpload })
  }

  editStorage(storageId, groupId) {
    this.setState({ storageToEdit: storageId, storageGroup: groupId });
    this.props.toggleModal(EDIT_STORAGE);
  }

  onModalCancel() {
    if (!this.props.storage) {
      const { params, router } = this.props
      router.push(getContentUrl('group', params.group, params))
    }
    this.props.toggleModal()
  }

  render() {
    const {
      account,
      accountManagementModal,
      asperaInstanse,
      currentUser,
      group,
      hasStorageService,
      params,
      storage,
      storageContents,
      gatewayHostname,
      storageMetrics: {
        chartData,
        usage,
        gain,
        locations
      }} = this.props

    return (
      <Content>
        {group && hasStorageService &&
          <div>
            <StorageHeader
              currentUser={currentUser}
              params={params}
              toggleConfigModal={() => {this.editStorage(storage.get('ingest_point_id'), storage.get('parentId'))}}
            />

            <PageContainer>
              <StorageKPI
                chartData={chartData.data}
                chartDataKey={chartData.key}
                currentValue={usage.current}
                gainPercentage={gain}
                locations={locations}
                peakValue={usage.peak}
                referenceValue={usage.estimated}
                valuesUnit={usage.unit}
              />

              <StorageContents
                brandId={params.brand}
                accountId={params.account}
                storageId={params.storage}
                groupId={params.group}
                gatewayHostname={gatewayHostname}
                asperaInstanse={asperaInstanse}
                contents={storageContents}
                asperaUpload={this.state.asperaUpload}
                onMethodToggle={this.toggleUploadMehtod}
                fileUploader={this.fileUploader}
              />
            </PageContainer>

            {(accountManagementModal === EDIT_STORAGE) &&
              <StorageFormContainer
                show={true}
                brand={account.get('brand_id')}
                accountId={account.get('id')}
                storageId={(accountManagementModal === EDIT_STORAGE) ? this.state.storageToEdit : ''}
                groupId={(accountManagementModal === EDIT_STORAGE) ? this.state.storageGroup : group.get('id')}
                fetching={false}
                onCancel={this.onModalCancel}
              />}
          </div> }
      </Content>
    )
  }
}

Storage.displayName = 'Storage'

Storage.propTypes = {
  account: PropTypes.instanceOf(Map),
  accountManagementModal: PropTypes.string,
  asperaInstanse: PropTypes.instanceOf(Map),
  currentUser: PropTypes.instanceOf(Map),
  fetchClusters: PropTypes.func,
  fetchGroupData: PropTypes.func,
  fetchStorage: PropTypes.func,
  fetchStorageMetrics: PropTypes.func,
  filters: PropTypes.instanceOf(Map),
  gatewayHostname: PropTypes.string,
  group: PropTypes.instanceOf(Map),
  hasStorageService: PropTypes.bool,
  initStorageAccessKey: PropTypes.func,
  initUploadProgressHandler: PropTypes.func,
  params: PropTypes.object,
  router: PropTypes.object,
  storage: PropTypes.instanceOf(Map),
  storageContents: PropTypes.array,
  storageMetrics: PropTypes.object,
  toggleModal: PropTypes.func
}

Storage.defaultProps = {
  filters: Map(),
  storageMetrics: {
    chartData: {
      data: [],
      key: ''},
    usage: {
      current: 0,
      estimated: 0,
      peak: 0,
      unit: ''
    },
    gain: 0,
    locations: []
  }
}

const getMockContents = (storage) => (
  storage === 'with-contents'
  ?
  [
    {
      type: 'file',
      lastModified: new Date('Thu March 9 2017 11:17:01 GMT-0700 (PDT)'),
      status: 'In Progress'
    },
    {
      type: 'file',
      lastModified: new Date('Thu March 9 2017 11:17:01 GMT-0700 (PDT)'),
      status: 'In Progress'
    },
    {
      type: 'directory',
      lastModified: new Date('Thu March 9 2017 11:17:01 GMT-0700 (PDT)'),
      status: 'Completed',
      noOfFiles: 1000
    },
    {
      type: 'directory',
      lastModified: new Date('Thu March 9 2017 11:17:01 GMT-0700 (PDT)'),
      status: 'Failed',
      noOfFiles: 800
    }
  ]
  :
    []
  )

const prepareStorageMetrics = (state, storage, storageMetrics, storageType) => {
  const { value: estimated, unit } = separateUnit(formatBytes(storage.get('estimated_usage')))
  const average = storageMetrics.getIn(['totals', storageType, 'average'])
  const current = formatBytesToUnit(average, unit)
  const peak = formatBytesToUnit(storageMetrics.getIn(['totals', storageType, 'peak']), unit)
  const gain = storageMetrics.getIn(['totals', storageType, 'percent_change'])

  const locations = storage.get('clusters').map(cluster => (
    getClusterById(state, cluster).get('description').split(',')[0]
  )).toJS()

  const lineChartData = storageMetrics.get('detail').toJS().map(data => ({bytes: 0, ...data}))

  return {
    chartData: {
      data: lineChartData,
      key: 'bytes'
    },
    usage: {
      current,
      estimated: parseFloat(estimated),
      peak,
      unit
    },
    gain,
    locations
  }}

const mapStateToProps = (state, ownProps) => {
  const asperaInstanse = state.ui.get('asperaUploadInstanse')
  let storageId = null
  let storage = null
  let storageMetrics = null

  if (ownProps.params.storage && ownProps.params.group) {
    storageId = buildReduxId(ownProps.params.group, ownProps.params.storage)
    storage = getStorageById(state, storageId)
    storageMetrics = getMetricsByStorageId(state, ownProps.params.storage)
  }

  const gateway = storage && storage.get('gateway')
  const gatewayHostname = gateway && gateway.get('hostname')
  const filters = state.filters.get('filters')

  const group = state.group.get('activeGroup')
  const hasStorageService = hasService(group, STORAGE_SERVICE_ID)

  return {
    account: state.account.get('activeAccount'),
    accountManagementModal: state.ui.get('accountManagementModal'),
    gatewayHostname,
    asperaInstanse: asperaInstanse.get('asperaInitialized') ? asperaInstanse : new Map(),
    currentUser: state.user.get('currentUser'),
    storageAccessToken: state.user.get('storageAccessToken'),
    filters,
    group: state.group.get('activeGroup'),
    hasStorageService,
    storage,
    storageContents: getMockContents(ownProps.params.storage),
    storageMetrics: storageMetrics && prepareStorageMetrics(state, storage, storageMetrics, filters.get('storageType'))
  }
}

const mapDispatchToProps = (dispatch) => {
  const uiActions = bindActionCreators(uiActionCreators, dispatch)
  const groupActions = bindActionCreators(groupActionCreators, dispatch)
  return {
    fetchClusters: (params) => dispatch( clusterActions.fetchAll(params) ),
    fetchGroupData: ({brand, account, group}) => groupActions.fetchGroup(brand, account, group),
    fetchStorage: (params) => dispatch( storageActions.fetchOne(params) ),
    initStorageAccessKey: bindActionCreators(getStorageAccessKey, dispatch),
    initUploadProgressHandler: (name) => (params) => dispatch(actions[UPLOAD_FILE](name, params)),
    fetchStorageMetrics: (params) => dispatch(fetchMetrics({include_history: true, ...params})),
    toggleModal: uiActions.toggleAccountManagementModal
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Storage))
