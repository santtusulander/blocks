import React from 'react'

import Icon from '../icon.jsx'

class IconItemList extends React.Component {
  render() {
    return (
      <Icon width="30" height="30">
        <g>
          <path d="M0,24.1C0,24.1,0,24,0.1,24h29.9c0,0,0.1,0.1,0.1,0.1v5.7c0,0.1,0,0.1-0.1,0.1H0.1C0,30,0,29.9,0,29.9L0,24.1z"/>
          <path d="M0,12.1C0,12.1,0,12,0.1,12h29.9c0,0,0.1,0.1,0.1,0.1v5.7c0,0.1,0,0.1-0.1,0.1H0.1C0,18,0,17.9,0,17.9L0,12.1z"/>
          <path d="M0,0.2C0,0.1,0,0,0.1,0l29.9,0C30,0,30,0.1,30,0.2v5.7C30,5.9,30,6,29.9,6H0.1C0,6,0,5.9,0,5.8L0,0.2z"/>
        </g>
      </Icon>
    );
  }
}

IconItemList.displayName = 'IconItemList'
IconItemList.propTypes = {
  className: React.PropTypes.string
}

module.exports = IconItemList
