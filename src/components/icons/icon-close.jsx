import React from 'react'

import Icon from '../icon.jsx'

class IconClose extends React.Component {
  render() {
    return (
      <Icon width="12" height="12">
        <g>
          <line x1="0" y1="0" x2="12" y2="12" strokeWidth="2"/>
          <line x1="0" y1="12" x2="12" y2="0" strokeWidth="2"/>
        </g>
      </Icon>
    );
  }
}

IconClose.displayName = 'IconClose'
IconClose.propTypes = {
  className: React.PropTypes.string
}

module.exports = IconClose
