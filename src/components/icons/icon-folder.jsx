import React from 'react'
import Icon from '../icon.jsx'

const IconFolder = (props) => {
  const {className, height, width} = props
  return (
    <Icon className={className} width={width} height={height} viewbox="0 0 36 36">
      <g>
        <symbol  id="Icon_BG_1" viewBox="-40 -40 80 80">
          <rect id="XMLID_4080_" x="-40" y="-40" opacity="0" width="80" height="80"/>
        </symbol>
        <symbol  id="Icon_BG_2" viewBox="-40 -40 80 80">
          <g id="XMLID_4088_">
            <rect id="XMLID_4089_" x="-40" y="-40" opacity="0" width="80" height="80"/>
          </g>
          <circle id="XMLID_572_" opacity="0.2" cx="0" cy="0" r="15"/>
        </symbol>
        <symbol  id="Icon_Delete_1" viewBox="-40 -40 80 80">
          <use xlinkHref="#Icon_BG_1"  width="80" height="80" id="XMLID_4084_" x="-40" y="-40" overflow="visible"/>
          <g id="XMLID_330_">
              <line id="XMLID_555_" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeMiterlimit="10" x1="-5.3" y1="-5.3" x2="5.3" y2="5.3"/>
              <line id="XMLID_4081_" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeMiterlimit="10" x1="5.3" y1="-5.3" x2="-5.3" y2="5.3"/>
          </g>
        </symbol>
        <g id="Caret-Down" />
        <g>
          <path fill="none" d="M28.5,15h-21c-0.6,0-1,0.4-1,1v3v6.9c0,0.6,0.4,1,1,1h21c0.6,0,1-0.4,1-1V19v-3C29.5,15.4,29.1,15,28.5,15z"/>
          <path fill="none" d="M7.5,13h21c0.4,0,0.7,0.1,1,0.2V12c0-0.6-0.4-1-1-1H15.9c-0.5,0-1.1-0.2-1.4-0.6L13.1,9H7.5c-0.6,0-1,0.4-1,1
            v3.1C6.8,13,7.1,13,7.5,13z"/>
          <path d="M28.5,9H15.9l-1.3-1.4C14.2,7.2,13.6,7,13.1,7H7.5c-1.7,0-3,1.3-3,3v6v3v6.9c0,1.7,1.3,3,3,3h21c1.7,0,3-1.3,3-3V19v-3v-4
            C31.5,10.3,30.2,9,28.5,9z M7.5,9h5.6l1.3,1.4c0.4,0.4,0.9,0.6,1.4,0.6h12.6c0.6,0,1,0.4,1,1v1.1c-0.3-0.1-0.6-0.2-1-0.2h-21
            c-0.4,0-0.7,0.1-1,0.2V10C6.5,9.4,6.9,9,7.5,9z M29.5,25.9c0,0.6-0.4,1-1,1h-21c-0.6,0-1-0.4-1-1V19v-3c0-0.6,0.4-1,1-1h21
            c0.6,0,1,0.4,1,1v3V25.9z"/>
        </g>
      </g>
    </Icon>
  )
}

IconFolder.displayName = "IconFolder"
IconFolder.propTypes = {
  className: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
}

export default IconFolder
