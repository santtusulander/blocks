import React, { PropTypes, Children, cloneElement } from 'react'
import { reduxForm, getValues } from 'redux-form'

import UDNButton from './button'
import IconClose from './icons/icon-close'

const EditableRow = ({ save, cancel, children, fields, invalid, values }) => {
  const onSave = () => save(values)
  return (
    <tr className="edit-row">
      {Children.map(children, child =>
        <td>
          {cloneElement(child, { ...fields[child.props.id] })}
          {fields[child.props.id].error && <div className="error-msg">{fields[child.props.id].error}</div>}
        </td>
      )}
      <td>
        <UDNButton bsStyle="primary" disabled={invalid} onClick={onSave}>
          SAVE
        </UDNButton>
        <UDNButton bsStyle="primary" onClick={cancel} icon={true}>
          <IconClose/>
        </UDNButton>
      </td>
    </tr>
  )
}

export default reduxForm({ form: 'inlineAdd' }, state => { values: getValues(state.form.inlineAdd) })(EditableRow)
