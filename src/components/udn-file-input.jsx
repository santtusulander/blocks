import React, { Component } from 'react'
import {Input } from 'react-bootstrap'

import './udn-file-input.scss'

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

      <label htmlFor={props.id} className='file-input-label'>Choose file</label>
      <span>{addonAfter}</span>
    </div>
  )
}

UDNFileInput.propTypes = {
  id: React.PropTypes.string.isRequired
}

export default UDNFileInput
