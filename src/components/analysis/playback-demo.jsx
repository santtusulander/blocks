import React from 'react'
import Hls from 'hls.js'
import Immutable from 'immutable'
import numeral from 'numeral'
import { isSafari } from '../../util/validators'
import AnalysisByKey from './by-key'

import { FormattedMessage } from 'react-intl'

export class PlaybackDemo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hls: (Hls.isSupported() && !isSafari()) ? new Hls() : null,
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
    this.destroyVideo = this.destroyVideo.bind(this)
    this.measureContainers = this.measureContainers.bind(this)

    this.measureContainersTimeout = null
  }
  componentDidMount() {
    this.playVideo()
    this.measureContainers()
    // TODO: remove this timeout as part of UDNP-1426
    this.measureContainersTimeout = setTimeout(() => {this.measureContainers()}, 500)
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
    clearTimeout(this.measureContainersTimeout)
    this.destroyVideo()
  }
  measureContainers() {
    this.setState({
      chartWidth: this.refs.chartHolder.clientWidth
    })
  }
  playVideo() {
    if(this.state.hls) {
      this.state.hls.loadSource('https://origin.udn.global'+this.props.activeVideo)
      this.state.hls.attachMedia(this.refs.player)
      this.refs.player.addEventListener('loadedmetadata', () => {
        this.setState({ttfp: ((new Date()) - this.state.videoStartPlayTime)})
      });
      this.state.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        this.refs.player.play()
        const bitrates = Immutable.fromJS(data.levels).map(level => level.get('bitrate'))
        this.setState({
          bitrates: bitrates,
          videoStartPlayTime: new Date()
        })
      });
      this.state.hls.on(Hls.Events.FRAG_BUFFERED, (event, data) => {
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
      this.state.hls.on(Hls.Events.FPS_DROP, (event, data) => {
        this.setState({droppedFrames: data.totalDroppedFrames})
      });
      this.state.hls.on(Hls.Events.ERROR, (event, data) => {
        if(data.type == "mediaError" && data.details === "bufferStalledError") {
          this.setState({bufferErrors: this.state.bufferErrors + 1})
        }
      });
    }
  }

  destroyVideo(){
    if(this.state.hls) {
      this.state.hls.destroy();
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
            <h4><FormattedMessage id="portal.analytics.demoPlayback.ttfp.text"/></h4>
            <div className="stat">
              {this.state.ttfp} <span className="unit"><FormattedMessage id="portal.units.ms"/></span>
            </div>
          </div>
          <div className="summary-stat">
            <h4><FormattedMessage id="portal.analytics.demoPlayback.dominantBitrate.text"/></h4>
            <div className="stat">
              {numeral(dominantBitrate / 1000000).format('0,0.00')}
              <span className="unit"> <FormattedMessage id="portal.units.Mbs"/></span>
            </div>
          </div>
          <div className="summary-stat">
            <h4><FormattedMessage id="portal.analytics.demoPlayback.clientBufferEvents.text"/></h4>
            <div className="stat">
              {0/*this.state.bufferErrors*/}
            </div>
          </div>
          <div className="summary-stat">
            <h4><FormattedMessage id="portal.analytics.demoPlayback.droppedFrames.text"/></h4>
            <div className="stat">
              {this.state.droppedFrames}
            </div>
          </div>
        </div>
        <div className="container-fluid container-fluid-video text-center">
          {!isSafari() ? <video ref="player" controls={true} /> : <p className="video-error-msg"><FormattedMessage id="portal.analytics.demoPlayback.safariNotSupported.text'"/></p>}
        </div>
        <div className="container-fluid low-pad">
          <div className="chart-row" ref="chartHolder">
            <AnalysisByKey width={this.state.chartWidth} height={200}
              padding={0} axes={false} area={false}
              primaryData={this.state.events.toJS()}
              xKey="index" yKey="bitrate"/>
            <div className="title">
              <FormattedMessage id="portal.analytics.demoPlayback.bitrateBySegment.text"/>
            </div>
            <div className="stat">
              {this.state.events.size ?
                numeral(this.state.events.last().get('bitrate') / 1000000).format('0,0.00')
                : 0}
              <span className="unit"> <FormattedMessage id="portal.units.Mbs"/></span>
            </div>
          </div>
          <div className="chart-row">
            <AnalysisByKey width={this.state.chartWidth} height={200}
              padding={0} axes={false} area={false}
              primaryData={this.state.events.toJS()}
              xKey="index" yKey="bandwidth"/>
            <div className="title">
              <FormattedMessage id="portal.analytics.demoPlayback.bandwidthBySegment.text"/>
            </div>
            <div className="stat">
              {this.state.events.size ?
                numeral(this.state.events.last().get('bandwidth') / 1000).format('0,0')
                : 0}
              <span className="unit"> <FormattedMessage id="portal.units.Kbs"/></span>
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
