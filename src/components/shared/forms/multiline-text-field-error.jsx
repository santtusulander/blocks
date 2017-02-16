import React from 'react'
import { FormattedMessage } from 'react-intl'
import { FORM_TEXT_FIELD_DEFAULT_MIN_LEN,
         FORM_TEXT_FIELD_DEFAULT_MAX_LEN } from '../../../constants/common'

const MultilineTextFieldError = ({fieldLabel, minValue, maxValue, footprintTextValidation}) => {
  return (
    <div>
      <FormattedMessage id="portal.common.invalid" /> <FormattedMessage id={fieldLabel} />
      <div className="multiline-tex-field-error">
        <FormattedMessage id="portal.common.textFieldMultilineValidation.line1.text" />
        <ul>
          <li>
            <FormattedMessage id="portal.common.textFieldMultilineValidation.line2.text" values={{ minValue, maxValue }}/>
          </li>
          { !footprintTextValidation &&
            <li><FormattedMessage id="portal.common.textFieldMultilineValidation.line3.text" /></li>
          }
          { footprintTextValidation &&
            <li><FormattedMessage id="portal.common.textFieldMultilineValidation.line4.text" /></li>
          }
        </ul>
      </div>
    </div>
  )
}

MultilineTextFieldError.displayName = "MultilineTextFieldError"
MultilineTextFieldError.propTypes = {
  fieldLabel: React.PropTypes.string,
  footprintTextValidation: React.PropTypes.bool,
  maxValue: React.PropTypes.number,
  minValue: React.PropTypes.number
}

MultilineTextFieldError.defaultProps = {
  maxValue: FORM_TEXT_FIELD_DEFAULT_MAX_LEN,
  minValue: FORM_TEXT_FIELD_DEFAULT_MIN_LEN,
  footprintTextValidation: false
}

export default MultilineTextFieldError
