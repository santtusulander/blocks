import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import { buildReduxId } from '../../redux/util'

import Content from '../../components/layout/content'
import PageContainer from '../../components/layout/page-container'

import StorageHeader from '../../components/storage/storage-header'
import StorageKPI from '../../components/storage/storage-kpi'
import StorageContents from '../../components/storage/storage-contents'

import { getById as getStorageById } from '../../redux/modules/entities/CIS-ingest-points/selectors'
import storageActions from '../../redux/modules/entities/CIS-ingest-points/actions'

class Storage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      asperaUpload: false
    }

    this.toggleUploadMehtod = this.toggleUploadMehtod.bind(this)
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

  render() {
    const {
      asperaInstanse,
      currentUser,
      params,
      storageContents,
      gatewayHostname,
      storageMetrics: {
        chartData,
        values,
        gain,
        locations
      }} = this.props
    return (
      <Content>
        <StorageHeader
          currentUser={currentUser}
          params={params}
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
      </Content>
    )
  }
}

Storage.displayName = 'Storage'

Storage.propTypes = {
  asperaInstanse: PropTypes.instanceOf(Map),
  currentUser: PropTypes.instanceOf(Map),
  fetchStorage: PropTypes.func,
  gatewayHostname: PropTypes.string,
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
    gatewayHostname,
    asperaInstanse: asperaInstanse.get('asperaInitialized') ? asperaInstanse : new Map(),
    currentUser: state.user.get('currentUser'),
    storageContents: getMockContents(ownProps.params.storage),
    storageMetrics: getMockMetrics()
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    fetchStorage: (params) => dispatch( storageActions.fetchOne(params) )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Storage)
