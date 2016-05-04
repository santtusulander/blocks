import React from 'react'
import Hls from 'hls.js'
import Immutable from 'immutable'
import numeral from 'numeral'
import { isSafari } from '../../util/helpers'
import AnalysisByKey from './by-key'

const videoErrorMsgOnSafari = 'This demonstration page is not supported on Safari, please use Chrome, IE11, or Firefox'

export class PlaybackDemo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      bitrates: Immutable.List(),
      bufferErrors: 0,
      chartWidth: 400,
      droppedFrames: 0,
      events: Immutable.List(),
      fragMaxKbps: 0,
      ttfp: 0,
      videoStartPlayTime: null
    }

    this.playVideo = this.playVideo.bind(this)
    this.measureContainers = this.measureContainers.bind(this)
  }
  componentDidMount() {
    this.playVideo()
    this.measureContainers()
    setTimeout(() => {this.measureContainers()}, 500)
    window.addEventListener('resize', this.measureContainers)
  }
  componentWillUpdate(nextProps) {
    if(nextProps.activeVideo !== this.props.activeVideo) {
      this.setState({
        bitrates: Immutable.List(),
        bufferErrors: 0,
        droppedFrames: 0,
        events: Immutable.List(),
        fragMaxKbps: 0,
        ttfp: 0,
        videoStartPlayTime: null
      })
      this.playVideo()
    }
  }
  componentDidUpdate(prevProps) {
    if(prevProps.activeVideo !== this.props.activeVideo) {
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
    if(Hls.isSupported() && !isSafari()) {
      const hls = new Hls()
      hls.loadSource('http://video.origin.sjc.cdx-stag.unifieddeliverynetwork.net'+this.props.activeVideo)
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
      hls.on(Hls.Events.FPS_DROP, (event, data) => {
        this.setState({droppedFrames: data.totalDroppedFrames})
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        if(data.type == "mediaError" && data.details === "bufferStalledError") {
          this.setState({bufferErrors: this.state.bufferErrors + 1})
        }
      });
    }
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
      <div className="analysis-playback-demo">
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
              {numeral(dominantBitrate / 1000000).format('0,0.00')}
              <span className="unit"> Mb/s</span>
            </div>
          </div>
          <div className="summary-stat">
            <h4>Client Buffer Events</h4>
            <div className="stat">
              {0/*this.state.bufferErrors*/}
            </div>
          </div>
          <div className="summary-stat">
            <h4>Dropped Frames</h4>
            <div className="stat">
              {this.state.droppedFrames}
            </div>
          </div>
        </div>
        <div className="container-fluid container-fluid-video text-center">
          {!isSafari() ? <video ref="player" controls={true}></video> : <p className="video-error-msg">{videoErrorMsgOnSafari}</p>}
        </div>
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
                numeral(this.state.events.last().get('bitrate') / 1000000).format('0,0.00')
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
                numeral(this.state.events.last().get('bandwidth') / 1000).format('0,0')
                : 0}
              <span className="unit"> Kb/s</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

PlaybackDemo.displayName = 'PlaybackDemo'
PlaybackDemo.propTypes = {
  activeVideo: React.PropTypes.string
}

module.exports = PlaybackDemo
