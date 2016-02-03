import React from 'react'

import Icon from '../icon.jsx'

class IconHeaderCaret extends React.Component {
  render() {
    return (
      <Icon width="23" height="14" className="no-fill">
        <g>
          <polyline points="1.1,1.1 11.5,11.5 21.9,1.1" strokeWidth="3"/>
        </g>
      </Icon>
    );
  }
}

IconHeaderCaret.displayName = 'IconHeaderCaret'
IconHeaderCaret.propTypes = {
  className: React.PropTypes.string
}

module.exports = IconHeaderCaret
