import React from 'react'

import Select from '../../../components/select'

export class FilterVideo extends React.Component {
  render() {
    return (
      <div>
        <div className="sidebar-section-header">
          Video URL
        </div>
        <div className="sidebar-content">
          <Select className="btn-block"
            onSelect={this.props.changeVideo}
            value={this.props.value}
            options={[
              ['/elephant/169ar/elephant_master.m3u8', 'Elephants Dream'],
              ['/sintel/169ar/sintel_master.m3u8', 'Sintel'],
              ['/bbb/169ar/bbb_master.m3u8', 'Big Buck Bunny']]}/>
        </div>
      </div>
    );
  }
}

FilterVideo.displayName = 'FilterVideo'
FilterVideo.propTypes = {
  changeVideo: React.PropTypes.func,
  value: React.PropTypes.string
}

module.exports = FilterVideo
