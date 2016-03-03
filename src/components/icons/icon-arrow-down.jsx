import React from 'react'

import Icon from '../icon.jsx'

class IconArrowDown extends React.Component {
  render() {
    return (
      <Icon width="18" height="14">
        <g>
          <polygon points="0,0 18,0 9,14"/>
        </g>
      </Icon>
    );
  }
}

IconArrowDown.displayName = 'IconArrowDown'
IconArrowDown.propTypes = {
  className: React.PropTypes.string
}

module.exports = IconArrowDown
