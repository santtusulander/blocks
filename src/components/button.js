import React, { PropTypes, Component } from 'react'
import { Button } from 'react-bootstrap'
import classNames from 'classnames'

import { removeProps } from '../util/helpers'

const ButtonWrapper = props =>
  <Button {...removeProps(props, ['hidden'])} className={createButtonClassName(props)}/>

const bsStyles = ['primary', 'success', 'warning', 'info', 'danger', 'link']
ButtonWrapper.propTypes = {
  addNew: PropTypes.bool,
  bsStyle: PropTypes.oneOf(bsStyles),
  hidden: PropTypes.bool,
  icon: PropTypes.bool,
  outLine: PropTypes.bool,
  toggleView: PropTypes.bool
}

function createButtonClassName(props){
  return classNames({
    'btn-outline': props.outLine,
    'btn-icon': props.icon,
    'btn-add-new': props.addNew,
    'hidden': props.hidden,
    'toggle-view': props.toggleView
  })
}

export default ButtonWrapper

