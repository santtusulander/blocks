import React from 'react'
import { FormattedMessage } from 'react-intl'

import Select from '../../../components/shared/form-elements/select'

const FilterVideo = (props) => {
  return (
    <div>
      <h5><FormattedMessage id="portal.analysis.filters.video.title"/></h5>
      <div className="sidebar-content">
        <Select className="btn-block"
          onSelect={props.changeVideo}
          value={props.value}
          options={[
            ['/elephant/169ar/elephant_master.m3u8', 'Elephants Dream'],
            ['/sintel/169ar/sintel_master.m3u8', 'Sintel'],
            ['/bbb/169ar/bbb_master.m3u8', 'Big Buck Bunny']]}/>
      </div>
    </div>
  )
}

FilterVideo.displayName = 'FilterVideo'
FilterVideo.propTypes = {
  changeVideo: React.PropTypes.func,
  value: React.PropTypes.string
}

export default FilterVideo
