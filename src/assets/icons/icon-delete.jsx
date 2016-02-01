import React from 'react'

import Icon from './icon.jsx'

class IconDelete extends React.Component {
  render() {
    return (
      <Icon width="30" height="2">
        <g>
          <line x1="30" y1="1" x2="0" y2="1"
            strokeWidth="2" strokeMiterlimit="10"/>
        </g>
      </Icon>
    );
  }
}

IconDelete.displayName = 'IconAdd'
IconDelete.propTypes = {
  className: React.PropTypes.string
}

module.exports = IconDelete
