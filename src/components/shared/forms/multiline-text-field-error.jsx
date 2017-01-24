import React from 'react'
import { FormattedMessage } from 'react-intl'

const MultilineTextFieldError = ({fieldLabel}) => {
  return (
    <div>
      <FormattedMessage id="portal.common.invalid" /> <FormattedMessage id={fieldLabel} />
      <div className="multiline-tex-field-error">
        <FormattedMessage id="portal.common.textFieldMultilineValidation.line1.text" />
        <ul>
          <li><FormattedMessage id="portal.common.textFieldMultilineValidation.line2.text" /></li>
          <li><FormattedMessage id="portal.common.textFieldMultilineValidation.line3.text" /></li>
        </ul>
      </div>
    </div>
  )
}

MultilineTextFieldError.displayName = "MultilineTextFieldError"
MultilineTextFieldError.propTypes = {
  fieldLabel: React.PropTypes.string
}

export default MultilineTextFieldError
