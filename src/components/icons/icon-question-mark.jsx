import React from 'react'
import Icon from '../icon.jsx'

class IconQuestionMark extends React.Component {
  render() {
    return (
      <Icon width="13" height="20">
        <g>
          <path d="M3.9,14.2c-0.1-0.9,0.1-1.9,0.6-2.7C5,10.6,5.8,9.9,6.6,9.3c0.6-0.5,1.1-1,1.5-1.7c0.4-0.6,0.6-1.3,0.6-2
            C8.7,5,8.5,4.3,8,3.7C7.5,3.3,6.9,3,6.2,3.1C5.6,3,5,3.2,4.5,3.6C4,4.1,3.8,4.7,3.8,5.4H0V5.3c-0.1-1.5,0.5-3,1.7-3.9
            C3,0.4,4.6-0.1,6.2,0c1.7-0.1,3.4,0.4,4.7,1.5c1.1,1,1.8,2.6,1.7,4.1c0,1.1-0.3,2.2-1,3.1c-0.7,1-1.5,1.8-2.5,2.4
            c-0.5,0.3-0.8,0.8-1.1,1.3c-0.2,0.6-0.3,1.1-0.2,1.7L3.9,14.2L3.9,14.2z M7.8,19.7H3.9v-3.3h3.9V19.7z"/>
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
