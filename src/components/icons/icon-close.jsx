import React from 'react'

import Icon from '../icon.jsx'

class IconClose extends React.Component {
  render() {
    let width = this.props.width ? this.props.width : '12'
    let height = this.props.height ? this.props.height : '12'
    return (
      <Icon width={width} height={height}>
        <g>
          <line x1="0" y1="0" x2={width} y2={height} strokeWidth="2"/>
          <line x1="0" y1={height} x2={width} y2="0" strokeWidth="2"/>
        </g>
      </Icon>
    );
  }
}

IconClose.displayName = 'IconClose'
IconClose.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.string,
  width: React.PropTypes.string
}

export default IconClose
