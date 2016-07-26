import React from 'react'

import Icon from '../icon.jsx'

class IconChart extends React.Component {
  render() {
    return (
      <Icon width="18" height="16">
        <g>
          <path d="M3.2,8.2C3.2,8.2,3.3,8.2,3.2,8.2l0.1,8.2c0,0-0.1,0-0.1,0H0V8.2c0,0,0.1,0,0.1,0L3.2,8.2
            L3.2,8.2z M7.5,0C7.4,0,7.4,0,7.5,0L7.4,16.3c0,0,0.1,0,0.1,0h3.1c0,0,0.1,0,0.1,0V0c0,0-0.1,0-0.1,0L7.5,0L7.5,0z M14.8,4.1
            C14.8,4.1,14.8,4.1,14.8,4.1l-0.1,12.3c0,0,0.1,0,0.1,0h3.1c0,0,0.1,0,0.1,0V4.1c0,0-0.1,0-0.1,0L14.8,4.1L14.8,4.1z"/>
        </g>
      </Icon>
    );
  }
}

IconChart.displayName = 'IconChart'
IconChart.propTypes = {
  className: React.PropTypes.string
}

module.exports = IconChart
