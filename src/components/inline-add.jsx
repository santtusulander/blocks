import React, { PropTypes, cloneElement } from 'react'
import { Tooltip, ButtonToolbar } from 'react-bootstrap'
import { reduxForm, getValues } from 'redux-form'

import UDNButton from './button'
import IconClose from './icons/icon-close'

import { FormattedMessage } from 'react-intl'

/**
 * When to display errorTooltip
 * @param attributes
 * @returns {*|boolean}
 */
const displayTooltipRules = (attributes) => {
  return attributes &&
        attributes.error &&
        attributes.touched  &&
        attributes.active &&
        (
          attributes.name !== 'password' && attributes.name !== 'confirmPw' || attributes.error !== 'Required'
        )
}

/**
 * When to add `has-error`-classname to input
 * @param attributes
 * @returns {*|boolean}
 */
const errorClassnameRules = (attributes) => {
  return attributes &&
        attributes.error &&
        attributes.touched &&
        (
          attributes.name !== 'password' && attributes.name !== 'confirmPw' || attributes.error !== 'Required'
        )
}

const ErrorToolTip = attributes =>
  displayTooltipRules(attributes) &&
  <Tooltip placement="bottom" className="in" id="tooltip-bottom">
    {attributes.error}
  </Tooltip>

const generateBsClasses = (attributes, input) => {
  if (errorClassnameRules(attributes)) {
    let errorStyle;
    if (input.props.bsStyle) {
      errorStyle = `${input.props.bsStyle} error`
    } else {
      errorStyle = 'error'
    }

    return { bsStyle: errorStyle }
  }

  return input.props.bsStyle ? { bsStyle: input.props.bsStyle } : {}
}

const InlineAdd = ({save, inputs, fields, invalid, passwordValid, values, unmount}) =>
  <tr className="inline-add-row">
    {inputs.map((cell, index) =>
      <td key={index} colSpan={index === inputs.length - 1 ? 2 : 1}>
        {cell.map(({input, positionClass}, index) => {
          const bsClasses = generateBsClasses(fields[input.props.id], input);
          return (
            <div className={positionClass} key={index}>
              {cloneElement(input, {...bsClasses, ...fields[input.props.id]})}
              {ErrorToolTip(fields[input.props.id])}
            </div>
          )
        })}
        {index === inputs.length - 1 &&
        <ButtonToolbar className="pull-right">
          <UDNButton disabled={invalid || !passwordValid} onClick={() => save(values)}>
            <FormattedMessage id="portal.button.SAVE"/>
          </UDNButton>
          <UDNButton bsStyle="primary" onClick={unmount} icon={true}>
            <IconClose/>
          </UDNButton>
        </ButtonToolbar>}
      </td>
    )}
  </tr>

InlineAdd.propTypes = {
  fields: PropTypes.object,
  inputs: PropTypes.array,
  invalid: PropTypes.bool,
  passwordValid: PropTypes.bool,
  save: PropTypes.func,
  unmount: PropTypes.func,
  values: PropTypes.object
}

export default reduxForm({form: 'inlineAdd'}, state => {
  values: getValues(state.form.inlineAdd)
})(InlineAdd)
