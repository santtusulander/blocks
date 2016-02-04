import React from 'react'

import Icon from '../icon.jsx'

class IconConfiguration extends React.Component {
  render() {
    return (
      <Icon width="22" height="22">
        <g>
          <path d="M21.7,9.6l-1.4-4.1L17,5.8c0,0,0,0,0-0.1l0.7-3.4l-3.9-1.9L11.6,3c0,0-0.1,0-0.1,0c0,0,0,0,0,0L9.6,0L5.4,1.4
            l0.3,3.4c0,0,0,0,0,0L2.3,4.1L0.4,8.1L3,10.2c0,0,0,0.1,0,0.1l-3,1.9l1.4,4.1l3.5-0.3c0,0,0,0,0,0l-0.7,3.5l3.9,1.9l2.3-2.7
            c0,0,0,0,0.1,0l2,3l4.1-1.4l-0.3-3.6l3.5,0.7l1.9-3.9L19,11.4L21.7,9.6z M10.9,15.5c-2.5,0-4.5-2-4.5-4.5c0-2.5,2-4.5,4.5-4.5
            c2.5,0,4.5,2,4.5,4.5C15.4,13.4,13.4,15.5,10.9,15.5z"/>
        </g>
      </Icon>
    );
  }
}

IconConfiguration.displayName = 'IconConfiguration'
IconConfiguration.propTypes = {
  className: React.PropTypes.string
}

module.exports = IconConfiguration
