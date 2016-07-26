import React from 'react'
import Icon from '../icon.jsx'

class IconQuestionMark extends React.Component {
  render() {
    return (
      <Icon width="9" height="14">
        <g>
          <path d="M4679.06,401.22a4,4,0,0,1,.41-2,6.71,6.71,0,0,1,1.58-1.54,5.15,5.15,0,0,0,1.11-1.22,2.68,2.68,0,0,0,.42-1.46,2,2,0,0,0-.47-1.41,1.76,1.76,0,0,0-1.35-.51,1.82,1.82,0,0,0-1.23.43,1.59,1.59,0,0,0-.51,1.26h-2.77l0-.06a3.37,3.37,0,0,1,1.24-2.87,5.17,5.17,0,0,1,3.3-1,5,5,0,0,1,3.43,1.11,3.83,3.83,0,0,1,1.25,3,4,4,0,0,1-.73,2.29,6.5,6.5,0,0,1-1.82,1.77,2.33,2.33,0,0,0-.78.92,3.52,3.52,0,0,0-.19,1.27h-2.84Zm2.86,4h-2.87v-2.44h2.87v2.44Z" transform="translate(-4676.21 -390.84)"/>
        </g>
      </Icon>
    );
  }
}

IconQuestionMark.displayName = 'IconQuestionMark'
IconQuestionMark.propTypes = {
  className: React.PropTypes.string
}

module.exports = IconQuestionMark
