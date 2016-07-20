import React, { PropTypes, cloneElement } from 'react'
import { reduxForm, getValues } from 'redux-form'

import UDNButton from './button'
import IconClose from './icons/icon-close'

const InlineAdd = ({ save, cancel, inputs, fields, invalid, values }) => {
  return (
    <tr className="inline-add-row">
      {inputs.map((cell, index) =>
        <td key={index}>
          {cell.map(({input, style}, index) =>
            <div {...{ style }} key={index}>
              {cloneElement(input, { ...fields[input.props.id] })}
              {fields[input.props.id].error && <div className="error-msg">{fields[input.props.id].error}</div>}
            </div>
          )}
        </td>
      )}
      <td>
        <div className='action-links cell-text-center'>
          <UDNButton disabled={invalid} onClick={() => save(values)}>
            SAVE
          </UDNButton>
          <UDNButton bsStyle="primary" onClick={cancel} icon={true}>
            <IconClose/>
          </UDNButton>
        </div>
      </td>
    </tr>
  )
}

InlineAdd.propTypes = {
  cancel: PropTypes.func,
  fields: PropTypes.object,
  inputs: PropTypes.array,
  invalid: PropTypes.bool,
  save: PropTypes.func,
  values: PropTypes.object
}

export default reduxForm({ form: 'inlineAdd' }, state => { values: getValues(state.form.inlineAdd) })(InlineAdd)
