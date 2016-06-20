import React from 'react'

import Icon from '../icon.jsx'

class IconArrowLeft extends React.Component {
  render() {
    return (
      <Icon width="14" height="18">
        <g>
          <polygon points="0,9 14,0 14,18"/>
        </g>
      </Icon>
    );
  }
}

IconArrowLeft.displayName = 'IconArrowLeft'
IconArrowLeft.propTypes = {
  className: React.PropTypes.string
}

module.exports = IconArrowLeft
