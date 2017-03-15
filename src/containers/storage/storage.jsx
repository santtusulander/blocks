import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import { withRouter } from 'react-router'

import * as uiActionCreators from '../../redux/modules/ui'

import storageActions from '../../redux/modules/entities/CIS-ingest-points/actions'
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

import { getContentUrl } from '../../util/routes.js'
import { buildAnalyticsOpts, formatBytesToUnit, formatBytes, separateUnit } from '../../util/helpers'

class Storage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      asperaUpload: false
    }

    this.toggleUploadMehtod = this.toggleUploadMehtod.bind(this)

    this.editStorage = this.editStorage.bind(this)
    this.onModalCancel = this.onModalCancel.bind(this)
  }

  componentWillMount() {
    if (this.props.params.storage && this.props.params.group) {
      this.props.fetchStorage({
        group: this.props.params.group,
        id: this.props.params.storage
      })

      const { params, filters } = this.props
      const fetchOpts = buildAnalyticsOpts(params, filters, {pathname: 'storage'})
      this.props.fetchStorageMetrics({start: fetchOpts.startDate, end: fetchOpts.endDate, ...fetchOpts})

      this.props.fetchClusters({})
    }
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
            storageId={params.storage}
            groupId={params.group}
            gatewayHostname={gatewayHostname}
            asperaInstanse={asperaInstanse}
            contents={storageContents}
            asperaUpload={this.state.asperaUpload}
            onMethodToggle={this.toggleUploadMehtod}
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
          />
        }
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
  fetchStorage: PropTypes.func,
  fetchStorageMetrics: PropTypes.func,
  filters: PropTypes.instanceOf(Map),
  gatewayHostname: PropTypes.string,
  group: PropTypes.instanceOf(Map),
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
  const current = formatBytesToUnit(storage.get('usage'), unit)
  const peak = formatBytesToUnit(storageMetrics.getIn(['totals', storageType, 'peak']), unit)
  const gain = storageMetrics.getIn(['totals', storageType, 'percent_change'])
  const locations = storage.get('clusters').map(cluster => (
    getClusterById(state, cluster).get('description').split(',')[0]
  )).toJS()
  return {
    chartData: {
      data: [
        {bytes: 45000, timestamp: new Date('Thu May 26 2016 11:17:01 GMT-0700 (PDT)')},
        {bytes: 65000, timestamp: new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)')},
        {bytes: 45000, timestamp: new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)')},
        {bytes: 105000, timestamp: new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)')},
        {bytes: 115000, timestamp: new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)')},
        {bytes: 190000, timestamp: new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)')},
        {bytes: 125000, timestamp: new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)')},
        {bytes: 155000, timestamp: new Date('Thu May 26 2016 18:17:01 GMT-0700 (PDT)')}
      ],
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
    storageMetrics = getMetricsByStorageId(state, ownProps.params.stroge)
  }

  const gateway = storage && storage.get('gateway')
  const gatewayHostname = gateway && gateway.get('hostname')
  const filters = state.filters.get('filters')

  return {
    account: state.account.get('activeAccount'),
    accountManagementModal: state.ui.get('accountManagementModal'),
    gatewayHostname,
    asperaInstanse: asperaInstanse.get('asperaInitialized') ? asperaInstanse : new Map(),
    currentUser: state.user.get('currentUser'),
    filters,
    group: state.group.get('activeGroup'),
    storage,
    storageContents: getMockContents(ownProps.params.storage),
    storageMetrics: storageMetrics && prepareStorageMetrics(state, storage, storageMetrics, filters.get('storageType'))
  }
}

const mapDispatchToProps = (dispatch) => {
  const uiActions = bindActionCreators(uiActionCreators, dispatch)

  return {
    fetchClusters: (params) => dispatch( clusterActions.fetchAll(params) ),
    fetchStorage: (params) => dispatch( storageActions.fetchOne(params) ),
    fetchStorageMetrics: (params) => dispatch(fetchMetrics(params)),
    toggleModal: uiActions.toggleAccountManagementModal
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Storage))
