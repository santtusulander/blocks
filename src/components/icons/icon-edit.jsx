import React from 'react'

import Icon from '../icon.jsx'

const IconEdit = (props) => {
    return (
      <Icon width="30" height="30">
          <g>
            <line x1="15" y1="30" x2="15" y2="0"
              strokeWidth="2" strokeMiterlimit="10"/>
            <line x1="30" y1="15" x2="0" y2="15"
              strokeWidth="2" strokeMiterlimit="10"/>
          </g>
      </Icon>
    )
}

IconEdit.displayName = 'IconEdit'
IconEdit.propTypes = {
  className: React.PropTypes.string
}

module.exports = IconEdit
