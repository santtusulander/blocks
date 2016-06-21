import React from 'react'

import Icon from '../icon.jsx'

class IconTrash extends React.Component {
  render() {
    return (
      <Icon className={this.props.className} width="18" height="27">
        <g>
          <rect x="4" y="10" width="2" height="12"/>
          <rect x="8" y="10" width="2" height="12"/>
          <rect x="12" y="10" width="2" height="12"/>
          <rect y="2" width="18" height="2"/>
          <rect x="5" width="8" height="2"/>
          <path d="M16,8v16H2V8H16 M18,6H0v20h18V6L18,6z"/>
        </g>
      </Icon>
    );
  }
}

IconTrash.displayName = 'IconTrash'
IconTrash.propTypes = {
  className: React.PropTypes.string
}

module.exports = IconTrash
