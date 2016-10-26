import React from 'react'
import { Input } from 'react-bootstrap'

import './udn-file-input.scss'

import { FormattedMessage } from 'react-intl'

const UDNFileInput = (props) => {

  const { addonAfter, ...otherProps } = props

  return (
    <div className='udn-file-input'>
      <Input
        type='file'
        {...otherProps}
        value=''
        onChange={() => {}}
      />

      <label htmlFor={props.id} className='file-input-label'><FormattedMessage id="portal.fileInput.chooseFile.text"/></label>
      <span>{addonAfter}</span>
    </div>
  )
}

UDNFileInput.propTypes = {
  addonAfter: React.PropTypes.string,
  id: React.PropTypes.string.isRequired
}

export default UDNFileInput
