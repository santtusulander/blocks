import React from 'react'

import Icon from '../icon.jsx'

class IconEye extends React.Component {
  render() {
    return (
      <Icon width="30" height="20">
        <g>
          <path d="M15,17.5c-4.2,0-7.5-3.3-7.5-7.5s3.3-7.5,7.5-7.5s7.5,3.3,7.5,7.5S19.2,17.5,15,17.5z M29.7,9.1
            C29.4,8.7,23.2,0,15,0S0.6,8.7,0.3,9.1c-0.4,0.6-0.4,1.1,0,1.7C0.6,11.3,6.8,20,15,20s14.4-8.7,14.7-9.1
             C30.1,10.3,30.1,9.7,29.7,9.1z"/>
          <circle cx="15" cy="10" r="4"/>
        </g>
      </Icon>
    );
  }
}

IconEye.displayName = 'IconEye'
IconEye.propTypes = {
  className: React.PropTypes.string
}

module.exports = IconEye
