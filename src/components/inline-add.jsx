import React, { PropTypes, cloneElement } from 'react'
import { Tooltip, ButtonToolbar } from 'react-bootstrap'
import { reduxForm, propTypes as reduxFormPropTypes, getFormValues, getFormSyncErrors } from 'redux-form'
import { connect } from 'react-redux'

import UDNButton from './button'
import IconClose from './icons/icon-close'

import { FormattedMessage } from 'react-intl'

/**
 * When to display errorTooltip
 * @param meta
 * @returns {*|boolean}
 */
const displayTooltipRules = (meta) => {
  return meta &&
        meta.error &&
        meta.touched  &&
        meta.active &&
        (
          meta.error !== 'Required'
        )
}

/**
 * When to add `has-error`-classname to input
 * @param meta
 * @returns {*|boolean}
 */
const errorClassnameRules = (meta) => {
  return meta &&
        meta.error &&
        meta.touched &&
        (
          meta.error !== 'Required'
        )
}

const ErrorToolTip = (meta) =>
  displayTooltipRules(meta) &&
  <Tooltip placement="bottom" className="in" id="tooltip-bottom">
    {meta.error}
  </Tooltip>

const generateBsClasses = (meta, bsStyle) => {
  if (errorClassnameRules(meta)) {
    let errorStyle;
    if (bsStyle) {
      errorStyle = `${bsStyle} error`
    } else {
      errorStyle = 'error'
    }

    return { bsStyle: errorStyle }
  }

  return bsStyle ? { bsStyle } : {}
}

const InlineAdd = ({ inputs, invalid, unmount, values, save, getMetaData }) =>
  <tr className="inline-add-row">

      {inputs.map((cell, index) =>
        <td key={index} colSpan={index === inputs.length - 1 ? 2 : 1}>

          {cell.map(
            ({input, positionClass}, index) => {

              const fieldName = input.props.name
              const bsClasses = generateBsClasses(getMetaData(fieldName), input.props.bsStyle);
              return (
                <div className={positionClass} key={index}>
                  {cloneElement(input, { ...bsClasses })}
                  {ErrorToolTip(getMetaData(fieldName))}
                  {/* <ErrorToolTip meta={input.props.meta}/> */}
                </div>
              )
            })
          }

          {index === inputs.length - 1 &&
          <ButtonToolbar className="pull-right">
            <UDNButton disabled={invalid} onClick={() => save(values)}>
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
  inputs: PropTypes.array.isRequired,
  invalid: PropTypes.bool,
  onSubmit: PropTypes.func,
  unmount: PropTypes.func,
  values: PropTypes.object,
  ...reduxFormPropTypes
}

export default connect(
  state => {
    const errors = getFormSyncErrors('inlineAdd')(state) || {}
    const form = state.form.inlineAdd || {}
    const metaData = form.fields || {}
    return {
      values: getFormValues('inlineAdd')(state),
      getMetaData: fieldName => ({ ...metaData[fieldName], error: errors[fieldName] })
    }
  }
)(reduxForm({ form: 'inlineAdd' })(InlineAdd))
