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

  toggleUploadMehtod(asperaUpload) {
    this.setState({ asperaUpload })
  }

  render() {
    const { currentUser, params } = this.props

    return (
      <Content>
        <StorageHeader
          currentUser={currentUser}
          params={params}
        />

        <PageContainer>
          <StorageKPI
            chartData={[
            {bytes: 45000, timestamp: new Date('Thu May 26 2016 11:17:01 GMT-0700 (PDT)')},
            {bytes: 65000, timestamp: new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)')},
            {bytes: 45000, timestamp: new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)')},
            {bytes: 105000, timestamp: new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)')},
            {bytes: 115000, timestamp: new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)')},
            {bytes: 190000, timestamp: new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)')},
            {bytes: 125000, timestamp: new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)')},
            {bytes: 155000, timestamp: new Date('Thu May 26 2016 18:17:01 GMT-0700 (PDT)')}
            ]}
            chartDataKey='bytes'
            currentValue={112}
            gainPercentage={0.2}
            locations={['San Jose', 'Frankfurt']}
            peakValue={120}
            referenceValue={100}
            valuesUnit='tb'
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
  currentUser: React.PropTypes.instanceOf(Map),
  params: PropTypes.object
}

function mapStateToProps(state) {
  return {
    currentUser: state.user.get('currentUser')
  }
}

export default connect(mapStateToProps, null)(Storage)
