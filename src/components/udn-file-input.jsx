import React from 'react'
import { FormGroup, ControlLabel, FormControl, InputGroup } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

const UDNFileInput = (props) => {

  const { addonAfter, ...otherProps } = props

  return (
    <div className='udn-file-input'>
      <FormGroup>
        <ControlLabel className='file-input-label'><FormattedMessage id="portal.fileInput.chooseFile.text"/></ControlLabel>
        <InputGroup>
          <FormControl
            type='file'
            {...otherProps}
            value=''
            onChange={() => {
              // no-op
            }}
          />
          <InputGroup.Addon>{addonAfter}</InputGroup.Addon>
        </InputGroup>
      </FormGroup>
    </div>
  )
}

UDNFileInput.displayName = "UDNFileInput"
UDNFileInput.propTypes = {
  addonAfter: React.PropTypes.string,
  id: React.PropTypes.string.isRequired
}

export default UDNFileInput
