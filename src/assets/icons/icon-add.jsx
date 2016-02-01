import React from 'react'

import Icon from './icon.jsx'

class IconAdd extends React.Component {
  render() {
    return (
      <Icon width="30" height="30">
        <g>
          <line x1="15" y1="30" x2="15" y2="0"
            strokeWidth="2" strokeMiterlimit="10"/>
          <line x1="30" y1="15" x2="0" y2="15"
            strokeWidth="2" strokeMiterlimit="10"/>
        </g>
      </Icon>
    );
  }
}

IconAdd.displayName = 'IconAdd'
IconAdd.propTypes = {
  className: React.PropTypes.string
}

module.exports = IconAdd
