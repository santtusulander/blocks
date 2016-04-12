import React from 'react'
import Hls from 'hls.js'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import Select from '../components/select'

export class PlaybackDemo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeVideo: '/elephant/169ar/elephant_master.m3u8'
    }

    this.handleVideoChange = this.handleVideoChange.bind(this)
    this.playVideo = this.playVideo.bind(this)
  }
  componentDidMount() {
    this.playVideo()
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevState.activeVideo !== this.state.activeVideo) {
      this.playVideo()
    }
  }
  playVideo() {
    if(Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource('http://video.demo.cdx-stag.unifieddeliverynetwork.net'+this.state.activeVideo)
      hls.attachMedia(this.refs.player)
      hls.on(Hls.Events.MANIFEST_PARSED, () => this.refs.player.play())
    }
  }
  handleVideoChange(newVideo) {
    this.setState({activeVideo: newVideo})
  }
  render() {
    return (
      <PageContainer className="playback-demo-container">
        <Content>
          <div className="container-fluid">
            <h1>Video Playback Demo</h1>
            <Select
              onSelect={this.handleVideoChange}
              value={this.state.activeVideo}
              options={[
                ['/elephant/169ar/elephant_master.m3u8', '/elephant/169ar/elephant_master.m3u8'],
                ['/elephant/43ar/elephant_master.m3u8', '/elephant/43ar/elephant_master.m3u8'],
                ['/sintel/169ar/sintel_master.m3u8', '/sintel/169ar/sintel_master.m3u8'],
                ['/sintel/43ar/sintel_master.m3u8', '/sintel/43ar/sintel_master.m3u8'],
                ['/bbb/169ar/bbb_master.m3u8', '/bbb/169ar/bbb_master.m3u8'],
                ['/bbb/43ar/bbb_master.m3u8', '/bbb/43ar/bbb_master.m3u8']]}/>
              <video ref="player" controls={true}></video>
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
