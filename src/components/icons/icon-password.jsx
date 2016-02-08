import React from 'react'

import Icon from '../icon.jsx'

class IconPassword extends React.Component {
  render() {
    return (
      <Icon width="30" height="30">
        <g>
          <path d="M28.5,22.9L18.3,12.7c-0.3,0.7-0.6,1.3-1,1.9l7,7l-0.7,0.7l-6.9-6.9c-1,1.2-2.3,2.2-3.8,2.8l0.1,0.1v3.2h4.2
            v4.2h4.2l0.7,3.5l6.4,0.7C30.5,28,30.5,24.9,28.5,22.9z"/>
          <path d="M16,14.6c0.2-0.3,0.4-0.5,0.6-0.8c0.4-0.6,0.7-1.2,0.9-1.9C17.8,11,18,10,18,9c0-5-4-9-9-9S0,4,0,9c0,5,4,9,9,9
            c1.1,0,2.2-0.2,3.1-0.6C13.7,16.9,15,15.9,16,14.6z M7,13c-2.8,0-5-2.2-5-5c0-2.4,1.7-4.4,3.9-4.9C6.3,3,6.6,3,7,3
            c0.7,0,1.4,0.2,2.1,0.5c1.1,0.5,2,1.4,2.5,2.5C11.8,6.6,12,7.3,12,8c0,0.4,0,0.7-0.1,1.1c-0.1,0.4-0.2,0.7-0.4,1
            c-0.7,1.5-2.1,2.6-3.9,2.8C7.4,13,7.2,13,7,13z"/>
        </g>
      </Icon>
    );
  }
}

IconPassword.displayName = 'IconPassword'
IconPassword.propTypes = {
  className: React.PropTypes.string
}

module.exports = IconPassword
