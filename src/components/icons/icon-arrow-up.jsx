import React from 'react'

import Icon from '../icon.jsx'

class IconArrowUp extends React.Component {
  render() {
    return (
      <Icon width="18" height="14">
        <g>
          <polygon points="0,14 9,0 18,14"/>
        </g>
      </Icon>
    );
  }
}

IconArrowUp.displayName = 'IconArrowUp'
IconArrowUp.propTypes = {
  className: React.PropTypes.string
}

module.exports = IconArrowUp
