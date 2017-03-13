import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Map } from 'immutable'

import Content from '../../components/layout/content'
import PageContainer from '../../components/layout/page-container'

import StorageHeader from '../../components/storage/storage-header'
import StorageKPI from '../../components/storage/storage-kpi'
import StorageContents from '../../components/storage/storage-contents'

class Storage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      asperaUpload: false
    }

    this.toggleUploadMehtod = this.toggleUploadMehtod.bind(this)
  }

  toggleUploadMehtod(asperaUpload) {
    this.setState({ asperaUpload })
  }

  render() {
    const {
      currentUser,
      params,
      storageContents,
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
  return {
    currentUser: state.user.get('currentUser'),
    storageContents: getMockContents(ownProps.params.storage),
    storageMetrics: getMockMetrics()
  }
}

export default connect(mapStateToProps, null)(Storage)
