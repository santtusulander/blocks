import React from 'react'

import Icon from '../icon.jsx'

class IconChart extends React.Component {
  render() {
    return (
      <Icon width="22" height="20">
        <g>
          <path d="M3.9,10C4,10,4,10,3.9,10L4,20c0,0,0,0-0.1,0H0.1C0,20,0,20,0,20l0-10c0,0,0,0,0.1,0H3.9z"/>
          <path d="M12.9,0C13,0,13,0,13,0V20c0,0,0,0-0.1,0H9.1C9,20,9,20,9,20V0c0,0,0,0,0.1,0L12.9,0z"/>
          <path d="M21.9,5C22,5,22,5,22,5V20c0,0,0,0-0.1,0h-3.8C18,20,18,20,18,20V5c0,0,0,0,0.1,0H21.9z"/>
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
