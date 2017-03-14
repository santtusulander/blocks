import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import { withRouter } from 'react-router'

import * as uiActionCreators from '../../redux/modules/ui'
import storageActions from '../../redux/modules/entities/CIS-ingest-points/actions'

import { getById as getStorageById } from '../../redux/modules/entities/CIS-ingest-points/selectors'

import { buildReduxId } from '../../redux/util'

import StorageFormContainer from './modals/storage-modal.jsx'

import Content from '../../components/layout/content'
import PageContainer from '../../components/layout/page-container'
import StorageWrapper from './storage-wrapper'

import StorageHeader from '../../components/storage/storage-header'
import StorageKPI from '../../components/storage/storage-kpi'
import StorageContents from '../../components/storage/storage-contents'

import { EDIT_STORAGE } from '../../constants/account-management-modals.js'

import { getContentUrl } from '../../util/routes.js'

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
      router,
      storage,
      storageContents,
      gatewayHostname,
      storageMetrics: {
        chartData,
        values,
        gain,
        locations
      }} = this.props

    return (
      <StorageWrapper params={params} router={router}>
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
              currentValue={values.current}
              gainPercentage={gain}
              locations={locations}
              peakValue={values.peak}
              referenceValue={values.reference}
              valuesUnit={values.unit}
            />

            <StorageContents
              storageId={params.storage}
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
      </StorageWrapper>
    )
  }
}

Storage.displayName = 'Storage'

Storage.propTypes = {
  account: PropTypes.instanceOf(Map),
  accountManagementModal: PropTypes.string,
  asperaInstanse: PropTypes.instanceOf(Map),
  currentUser: PropTypes.instanceOf(Map),
  fetchStorage: PropTypes.func,
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
  storageMetrics: {
    chartData: {
      data: [],
      key: ''},
    values: {
      current: 0,
      peak: 0,
      referenceValue: 0,
      unit: ''
    },
    gain: 0,
    locations: []
  }
}

const getMockMetrics = () => ({
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
  values: {
    current: 112,
    peak: 120,
    reference: 100,
    unit: 'tb'
  },
  gain: 0.2,
  locations: ['San Jose', 'Frankfurt']
})

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

const mapStateToProps = (state, ownProps) => {
  const asperaInstanse = state.ui.get('asperaUploadInstanse')
  let storageId = null
  let storage = null

  if (ownProps.params.storage && ownProps.params.group) {
    storageId = buildReduxId(ownProps.params.group, ownProps.params.storage)
    storage = getStorageById(state, storageId)
  }

  const gateway = storage && storage.get('gateway')
  const gatewayHostname = gateway && gateway.get('hostname')

  return {
    account: state.account.get('activeAccount'),
    accountManagementModal: state.ui.get('accountManagementModal'),
    gatewayHostname,
    asperaInstanse: asperaInstanse.get('asperaInitialized') ? asperaInstanse : new Map(),
    currentUser: state.user.get('currentUser'),
    group: state.group.get('activeGroup'),
    storage: getStorageById(state, buildReduxId(ownProps.params.group, ownProps.params.storage)),
    storageContents: getMockContents(ownProps.params.storage),
    storageMetrics: getMockMetrics()
  }
}

const mapDispatchToProps = (dispatch) => {
  const uiActions = bindActionCreators(uiActionCreators, dispatch)

  return {
    fetchStorage: (params) => dispatch( storageActions.fetchOne(params) ),
    toggleModal: uiActions.toggleAccountManagementModal
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Storage))
