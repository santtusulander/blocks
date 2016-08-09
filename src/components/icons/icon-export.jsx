import React from 'react'

import Icon from '../icon.jsx'

class IconExport extends React.Component {
  render() {
    return (
      <Icon width="22" height="29" className="icon-export">
        <g>
          <polygon points="10,3.9 10,16 12,16 12,3.9 15.1,7 16.6,5.5 11,0 5.4,5.5 6.8,7 "/>
          <path d="M19.2,9.7h-3.5v2.1h3.5c0.4,0,0.7,0.3,0.7,0.7v13.6c0,0.4-0.3,0.7-0.7,0.7H2.7c-0.4,0-0.7-0.3-0.7-0.7V12.5 c0-0.4,0.3-0.7,0.7-0.7H6V9.7H2.7C1.2,9.7,0,10.9,0,12.4v0v13.6c0,1.5,1.2,2.7,2.7,2.7l0,0h16.5c1.5,0,2.7-1.2,2.7-2.7v0V12.5 C21.9,11,20.7,9.7,19.2,9.7z"/>
        </g>
      </Icon>
    );
  }
}

IconExport.displayName = 'IconExport'
IconExport.propTypes = {
  className: React.PropTypes.string
}

module.exports = IconExport
