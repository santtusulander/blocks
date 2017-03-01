import React, { PropTypes, cloneElement } from 'react'
import { ButtonToolbar } from 'react-bootstrap'
import { reduxForm, propTypes as reduxFormPropTypes, getFormValues, getFormSyncErrors } from 'redux-form'
import { connect } from 'react-redux'
import classnames from 'classnames'

import UDNButton from './button'
import IconClose from './icons/icon-close'

import { FormattedMessage } from 'react-intl'

const getClassNames = (touched, error, className) =>
  classnames(className, { 'has-error': error && touched })

const InlineAdd = ({ inputs, invalid, unmount, formValues, save, handleSubmit, errors, getMetaData }) =>
  <tr className="inline-add-row">

      {inputs.map((cell, index) =>
        <td key={index} colSpan={index === inputs.length - 1 ? 2 : 1}>

          {cell.map(
            ({input, positionClass}, index) => {

              const fieldName = input.props.name
              const className = getClassNames(getMetaData(fieldName).touched, errors[fieldName], input.props.className);
              return (
                <div className={positionClass} key={index}>
                  {cloneElement(input, { className })}
                </div>
              )
            })
          }

          {index === inputs.length - 1 &&
          <ButtonToolbar className="pull-right">
            <UDNButton disabled={invalid} onClick={handleSubmit(() => save(formValues))}>
              <FormattedMessage id="portal.button.SAVE"/>
            </UDNButton>
            <UDNButton bsStyle="primary" onClick={unmount} icon={true}>
              <IconClose/>
            </UDNButton>
          </ButtonToolbar>}
        </td>
      )}
  </tr>

InlineAdd.displayName = "InlineAdd"
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
    //No selector exists to get a form's metadata
    const form = state.form.inlineAdd || {}
    const metaData = form.fields || {}

    return {
      errors: getFormSyncErrors('inlineAdd')(state) || {},
      formValues: getFormValues('inlineAdd')(state),
      getMetaData: fieldName => ({ ...metaData[fieldName] })
    }
  }
)(reduxForm({ form: 'inlineAdd' })(InlineAdd))
