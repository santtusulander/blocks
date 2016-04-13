import React from 'react'
import Hls from 'hls.js'
import Immutable from 'immutable'
import { Row, Col } from 'react-bootstrap'
import numeral from 'numeral'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import Select from '../components/select'
import AnalysisByKey from '../components/analysis/by-key'

export class PlaybackDemo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeVideo: '/elephant/169ar/elephant_master.m3u8',
      bitrates: Immutable.List(),
      chartWidth: 400,
      events: Immutable.List(),
      fragMaxKbps: 0,
      ttfp: 0,
      videoStartPlayTime: null
    }

    this.handleVideoChange = this.handleVideoChange.bind(this)
    this.playVideo = this.playVideo.bind(this)
    this.measureContainers = this.measureContainers.bind(this)
  }
  componentDidMount() {
    this.playVideo()
    this.measureContainers()
    setTimeout(() => {this.measureContainers()}, 500)
    window.addEventListener('resize', this.measureContainers)
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevState.activeVideo !== this.state.activeVideo) {
      this.playVideo()
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers)
  }
  measureContainers() {
    this.setState({
      chartWidth: this.refs.chartHolder.clientWidth
    })
  }
  playVideo() {
    if(Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource('http://video.demo.cdx-stag.unifieddeliverynetwork.net'+this.state.activeVideo)
      hls.attachMedia(this.refs.player)
      this.refs.player.addEventListener('loadedmetadata', () => {
        this.setState({ttfp: ((new Date()) - this.state.videoStartPlayTime)})
      });
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        this.refs.player.play()
        const bitrates = Immutable.fromJS(data.levels).map(level => level.get('bitrate'))
        this.setState({
          bitrates: bitrates,
          videoStartPlayTime: new Date()
        })
      });
      hls.on(Hls.Events.FRAG_BUFFERED, (event, data) => {
        const bandwidth = Math.round(8 * data.stats.length / (data.stats.tbuffered - data.stats.tfirst));
        event = Immutable.fromJS({
          index: this.state.events.size,
          type: "fragment",
          id: data.frag.level,
          id2: data.frag.sn,
          latency: data.stats.tfirst - data.stats.trequest,
          load: data.stats.tload - data.stats.tfirst,
          parsing: data.stats.tparsed - data.stats.tload,
          buffer: data.stats.tbuffered - data.stats.tparsed,
          duration: data.stats.tbuffered - data.stats.tfirst,
          bitrate: this.state.bitrates.get(data.frag.level),
          bandwidth: bandwidth,
          size: data.stats.length
        });
        this.setState({
          events: this.state.events.push(event),
          fragMaxKbps: Math.max(data.stats.fragMaxKbps, bandwidth)
        })
      })
    }
  }
  handleVideoChange(newVideo) {
    this.setState({
      activeVideo: newVideo,
      bitrates: Immutable.List(),
      events: Immutable.List(),
      fragMaxKbps: 0,
      ttfp: 0,
      videoStartPlayTime: null
    })
  }
  render() {
    const dominantBitrate = this.state.events
      .reduce((totals, event) => {
        const bitrate = event.get('bitrate')
        return totals.set(bitrate, 1 + (totals.get(bitrate) || 0))
      }, Immutable.Map())
      .entrySeq()
      .reduce(
        (maxCount, total) => maxCount[1] < total[1] ? total : maxCount,
        [0, 0]
      )[0]
    return (
      <PageContainer className="playback-demo-container">
        <Content>
          <div className="container-fluid low-pad">
            <div className="summary-stat">
              <h4>Time to First Play</h4>
              <div className="stat">
                {this.state.ttfp} <span className="unit">ms</span>
              </div>
            </div>
            <div className="summary-stat">
              <h4>Dominant Bitrate</h4>
              <div className="stat">
                {numeral(dominantBitrate / 1000).format('0,0.00')}
                <span className="unit"> Mb/s</span>
              </div>
            </div>
            <div className="summary-stat">
              <h4>Client Buffer Events</h4>
              <div className="stat">
                {this.state.events.size}
              </div>
            </div>
          </div>
          <div className="video-holder">
            <div className="container-fluid">
              <video ref="player" controls={true}></video>
            </div>
          </div>
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
          <div className="container-fluid low-pad">
            <div className="chart-row" ref="chartHolder">
              <AnalysisByKey width={this.state.chartWidth} height={200}
                padding={0} axes={false} area={false}
                primaryData={this.state.events.toJS()}
                xKey="index" yKey="bitrate"/>
              <div className="title">
                Bitrate by Segment
              </div>
              <div className="stat">
                {this.state.events.size ?
                  numeral(this.state.events.last().get('bitrate') / 1000).format('0,0.00')
                  : 0}
                <span className="unit"> Mb/s</span>
              </div>
            </div>
            <div className="chart-row">
              <AnalysisByKey width={this.state.chartWidth} height={200}
                padding={0} axes={false} area={false}
                primaryData={this.state.events.toJS()}
                xKey="index" yKey="bandwidth"/>
              <div className="title">
                Bandwidth by Segment
              </div>
              <div className="stat">
                {this.state.events.size ?
                  numeral(this.state.events.last().get('bandwidth') / 1000).format('0,0.00')
                  : 0}
                <span className="unit"> Mb/s</span>
              </div>
            </div>
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
