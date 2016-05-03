import React, { PropTypes } from 'react'
import { Button } from 'react-bootstrap'
import classNames from 'classnames'

export const ButtonWrapper = props => {
  return <Button {...removeProps(props, ['hidden'])} className={createButtonClassName(props)}/>
}

const bsStyles = ['primary', 'success', 'warning', 'info', 'danger', 'link']
ButtonWrapper.propTypes = {
  addNew: PropTypes.bool,
  bsStyle: PropTypes.oneOf(bsStyles),
  hidden: PropTypes.bool,
  icon: PropTypes.bool,
  toggleView: PropTypes.bool
}

function createButtonClassName(props){
  return classNames({
    'btn-icon': props.icon,
    'btn-add-new': props.addNew,
    'hidden': props.hidden,
    'toggle-view': props.toggleView
  })
}

/**
 * Removes properties from the given object.
 * This method is used for removing valid attributes from component props prior to rendering.
 *
 * @param {Object} object
 * @param {Array} remove
 * @returns {Object}
 */
export function removeProps(object, remove) {
  const result = {}

  for (const property in object) {
    if (object.hasOwnProperty(property) && remove.indexOf(property) === -1) {
      result[property] = object[property];
    }
  }

  return result
}