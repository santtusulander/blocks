import React from 'react'

import Icon from '../icon.jsx'

class IconSelectCaret extends React.Component {
  render() {
    return (
      <Icon width="10" height="15">
        <g>
          <polygon points="0,10 5,15 10,10"/>
          <polygon points="10,5 5,0 0,5"/>
        </g>
      </Icon>
    );
  }
}

IconSelectCaret.displayName = 'IconSelectCaret'
IconSelectCaret.propTypes = {
  className: React.PropTypes.string
}

export default IconSelectCaret
