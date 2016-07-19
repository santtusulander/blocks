import React, { PropTypes, Children, cloneElement } from 'react'
import { reduxForm } from 'redux-form'

import UDNButton from './button'
import IconClose from './icons/icon-close'

let errors = {}
const EditableRow = ({ save, cancel, children, fields }) => {
  return (
    <tr className="edit-row">
      {Children.map(children, child =>
        <td>{cloneElement(child, { ...fields[child.props.id] })}</td>
        // <div>
        //   {cloneElement(child, { ...fields[child.props.id] })}
        //   <div>{fields[child.props.id].error}</div>
        //   {fields[child.props.id].error && <div className="error-msg">{fields[child.props.id].error}</div>}
        // </div>
      )}
      <td>
        <UDNButton bsStyle="primary" disabled={Object.keys(errors).length > 0} onClick={save}>
          SAVE
        </UDNButton>
        <UDNButton bsStyle="primary" onClick={cancel} icon={true}>
          <IconClose/>
        </UDNButton>
      </td>
    </tr>
  )
}

export default reduxForm({
  form: 'inline-add'
})(EditableRow)
