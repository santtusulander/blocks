import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Map } from 'immutable'

import Content from '../../components/layout/content'
import PageContainer from '../../components/layout/page-container'

import StorageHeader from '../../components/storage/storage-header'
import StorageKPI from '../../components/storage/storage-kpi'
import StorageDropzone from '../../components/storage/storage-dropzone'

class Storage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      asperaUpload: false
    }

    this.toggleUploadMehtod = this.toggleUploadMehtod.bind(this)
  }

  componentWillMount() {
    this.props.fetchStorageMetrics()
  }

  toggleUploadMehtod(asperaUpload) {
    this.setState({ asperaUpload })
  }

  render() {
    const {
      currentUser,
      params,
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

          <StorageDropzone
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
  fetchStorageMetrics: PropTypes.func,
  params: PropTypes.object,
  storageMetrics: PropTypes.object
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

function mapStateToProps(state) {
  return {
    currentUser: state.user.get('currentUser'),
    storageMetrics: getMockMetrics()
  }
}

function mapDispatchToProps() {
  return {
    fetchStorageMetrics: () => {}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Storage)
