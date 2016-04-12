import React from 'react'
import Hls from 'hls.js'
import Immutable from 'immutable'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import Select from '../components/select'

export class PlaybackDemo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeVideo: '/elephant/169ar/elephant_master.m3u8',
      events: Immutable.List(),
      fragMaxKbps: 0,
      ttfp: 0
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
      this.refs.player.addEventListener('loadedmetadata', () => {
        this.setState({ttfp: ((new Date()) - this.state.videoStartPlayTime)})
      });
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.refs.player.play()
        this.setState({videoStartPlayTime: new Date()})
      });
      this.refs.player.play()
      hls.on(Hls.Events.FRAG_BUFFERED, (event, data) => {
        const bitrate = Math.round(8 * data.stats.length / (data.stats.tbuffered - data.stats.tfirst));
        event = Immutable.fromJS({
          type: "fragment",
          id: data.frag.level,
          id2: data.frag.sn,
          timestamp: new Date(),
          latency: data.stats.tfirst - data.stats.trequest,
          load: data.stats.tload - data.stats.tfirst,
          parsing: data.stats.tparsed - data.stats.tload,
          buffer: data.stats.tbuffered - data.stats.tparsed,
          duration: data.stats.tbuffered - data.stats.tfirst,
          bw: bitrate,
          size: data.stats.length
        });
        this.setState({
          events: this.state.events.push(event),
          fragMaxKbps:Math.max(data.stats.fragMaxKbps, bitrate)
        })
      })
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
            <p>
              Client Buffer Events: {this.state.events.size}
            </p>
            <p>
              Time to First Play: {this.state.ttfp}ms
            </p>
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
            <br/>
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
