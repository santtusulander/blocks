import React from 'react'

import Icon from '../icon.jsx'

class IconEmail extends React.Component {
  render() {
    return (
      <Icon width="30" height="22">
        <g>
          <polygon points="20,13.1 15,16.9 10,13.1 0,20.6 0,22.5 30,22.5 30,20.6 "/>
          <polygon points="30,18.8 30,5.6 21.3,12.2 "/>
          <polygon points="8.7,12.2 0,5.6 0,18.8 "/>
          <polygon points="0,3.8 15,15 30,3.8 30,0 0,0 "/>
        </g>
      </Icon>
    );
  }
}

IconEmail.displayName = 'IconEmail'
IconEmail.propTypes = {
  className: React.PropTypes.string
}

module.exports = IconEmail
