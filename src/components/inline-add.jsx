import { findDOMNode } from 'react-dom'
import React, { Component, PropTypes, cloneElement } from 'react'
import { Tooltip, ButtonToolbar } from 'react-bootstrap'
import { reduxForm, getValues } from 'redux-form'

import UDNButton from './button'
import IconClose from './icons/icon-close'

class InlineAdd extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  componentDidMount() {
    document.addEventListener('click', this.handleClick, false)
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false)
  }
  handleClick(e) {
    // This is for checking if the event target is a menu item inside a bootstrap dropdown.
    // We need to have a special case for the dropdowns,
    // because for some weird reason the dropdown menu is not inside this component after menu item is clicked.
    const checkIfDropdownMenuItem = element =>
      element.getAttribute('role') === 'menuitem' &&
      element.parentNode &&
      element.parentNode.parentNode &&
      element.parentNode.parentNode.className.search('dropdown') > -1 ? true : false
    !findDOMNode(this).contains(e.target) && !checkIfDropdownMenuItem(e.target) && this.props.unmount()
  }
  render() {
    const { save, cancel, inputs, fields, invalid, values } = this.props
    return (
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
                <UDNButton bsStyle="primary" onClick={cancel} icon={true}>
                  <IconClose/>
                </UDNButton>
              </ButtonToolbar>}
          </td>
        )}
      </tr>
    )
  }
}

InlineAdd.propTypes = {
  cancel: PropTypes.func,
  fields: PropTypes.object,
  inputs: PropTypes.array,
  invalid: PropTypes.bool,
  save: PropTypes.func,
  unmount: PropTypes.func,
  values: PropTypes.object
}

export default reduxForm({ form: 'inlineAdd' }, state => { values: getValues(state.form.inlineAdd) })(InlineAdd)
