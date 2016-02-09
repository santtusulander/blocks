import React from 'react'

import Icon from '../icon.jsx'

class IconItemChart extends React.Component {
  render() {
    return (
      <Icon width="27" height="26">
        <g>
          <circle cx="22" cy="21" r="5"/>
          <circle cx="5" cy="21" r="5"/>
          <circle cx="22" cy="5" r="5"/>
          <circle cx="5" cy="5" r="5"/>
        </g>
      </Icon>
    );
  }
}

IconItemChart.displayName = 'IconItemChart'
IconItemChart.propTypes = {
  className: React.PropTypes.string
}

module.exports = IconItemChart
