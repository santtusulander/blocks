import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Map } from 'immutable'

import * as uiActionCreators from '../../redux/modules/ui'
import storageActions from '../../redux/modules/entities/CIS-ingest-points/actions'

import { getById as getStorageById } from '../../redux/modules/entities/CIS-ingest-points/selectors'

import { buildReduxId } from '../../redux/util'

import StorageFormContainer from './modals/storage-modal.jsx'

import Content from '../../components/layout/content'
import PageContainer from '../../components/layout/page-container'

import StorageHeader from '../../components/storage/storage-header'
import StorageKPI from '../../components/storage/storage-kpi'
import StorageContents from '../../components/storage/storage-contents'

import { EDIT_STORAGE } from '../../constants/account-management-modals.js'

class Storage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      asperaUpload: false
    }

    this.toggleUploadMehtod = this.toggleUploadMehtod.bind(this)

    this.editStorage = this.editStorage.bind(this)
  }

  componentWillMount() {
    this.props.fetchStorage(this.props.params)
  }

  toggleUploadMehtod(asperaUpload) {
    this.setState({ asperaUpload })
  }

  editStorage(storageId, groupId) {
    this.setState({ storageToEdit: storageId, storageGroup: groupId });
    this.props.toggleModal(EDIT_STORAGE);
  }

  render() {
    const {
      account,
      accountManagementModal,
      currentUser,
      group,
      params,
      storage,
      storageContents,
      storageMetrics: {
        chartData,
        values,
        gain,
        locations
      },
      toggleModal} = this.props

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
            currentValue={values.current}
            gainPercentage={gain}
            locations={locations}
            peakValue={values.peak}
            referenceValue={values.reference}
            valuesUnit={values.unit}
          />

          <StorageContents
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
            onCancel={() => toggleModal()}
          />
        }
      </Content>
    )
  }
}

Storage.displayName = 'Storage'

Storage.propTypes = {
  currentUser: PropTypes.instanceOf(Map),
  params: PropTypes.object,
  storageContents: PropTypes.array,
  storageMetrics: PropTypes.object
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
  const { params: { group, storage } } = ownProps
  return {
    account: state.account.get('activeAccount'),
    accountManagementModal: state.ui.get('accountManagementModal'),
    currentUser: state.user.get('currentUser'),
    group: state.group.get('activeGroup'),
    storage: getStorageById(state, buildReduxId(group, storage)),
    storageContents: getMockContents(ownProps.params.storage),
    storageMetrics: getMockMetrics()
  }
}

const mapDispatchToProps = (dispatch) => {
  const uiActions = bindActionCreators(uiActionCreators, dispatch)

  return {
    fetchStorage: (params) => dispatch(storageActions.fetchAll(params)),
    toggleModal: uiActions.toggleAccountManagementModal
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Storage)
