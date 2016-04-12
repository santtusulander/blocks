import React from 'react'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'

export class PlaybackDemo extends React.Component {
  render() {
    return (
      <PageContainer className="playback-demo-container">
        <Content>
          <div className="container-fluid">
            <h1>Video Playback Demo</h1>
          </div>
        </Content>
      </PageContainer>
    )
  }
}

PlaybackDemo.displayName = 'PlaybackDemo'
PlaybackDemo.propTypes = {
}

module.exports = PlaybackDemo
