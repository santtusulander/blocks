import { findDOMNode } from 'react-dom'
import React, { Component, PropTypes, cloneElement } from 'react'
import { Tooltip, ButtonToolbar } from 'react-bootstrap'
import { reduxForm, getValues } from 'redux-form'

import UDNButton from './button'
import IconClose from './icons/icon-close'

const InlineAdd = ({ save, inputs, fields, invalid, values, unmount }) =>
      <tr className="inline-add-row">
        {inputs.map((cell, index) =>
          <td key={index} colSpan={index === inputs.length - 1 ? 2 : 1}>
            {cell.map(({ input, positionClass }, index) =>
              <div className={positionClass} key={index}>
                {cloneElement(input, { ...fields[input.props.id] })}
                {fields[input.props.id] && fields[input.props.id].error &&
                  <Tooltip placement="bottom" className="in" id="tooltip-bottom">
                    {fields[input.props.id].error}
                  </Tooltip>}
              </div>
            )}
            {index === inputs.length - 1 &&
              <ButtonToolbar className="pull-right">
                <UDNButton disabled={invalid} onClick={() => save(values)}>
                  SAVE
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
  save: PropTypes.func,
  unmount: PropTypes.func,
  values: PropTypes.object
}

export default reduxForm({ form: 'inlineAdd' }, state => { values: getValues(state.form.inlineAdd) })(InlineAdd)
