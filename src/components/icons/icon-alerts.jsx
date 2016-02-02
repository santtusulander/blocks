import React from 'react'

import Icon from '../icon.jsx'

class IconAdd extends React.Component {
  render() {
    return (
      <Icon width="18" height="25">
        <g>
          <path d="M4.3,21.7C5,23.6,6.9,25,9,25s4-1.4,4.7-3.3C11.4,22,9.1,22,9,22S6.6,22,4.3,21.7z"/>
          <path d="M15.7,9c0-3.3-1.8-5.1-3.6-6C11.6,4.2,10.4,5,9,5C7.6,5,6.4,4.2,5.9,3C4.1,3.9,2.3,5.7,2.3,9
            c0,9.4-2.3,7-2.2,9c0,0.9,2,1.4,4,1.7C6.4,20,9,20,9,20h0h0c0,0,2.6,0,5-0.3c2.1-0.3,4-0.8,4-1.7C18.1,16,15.7,18.4,15.7,9z"/>
          <path d="M9,0C8.2,0,7.5,0.7,7.5,1.5c0,0.3,0.1,0.5,0.2,0.8C8,2.7,8.5,3,9,3s1-0.3,1.3-0.7c0.1-0.2,0.2-0.5,0.2-0.8
            C10.5,0.7,9.8,0,9,0z"/>
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
