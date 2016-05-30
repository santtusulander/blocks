import React, { PropTypes, Component } from 'react'
import { Button } from 'react-bootstrap'
import classNames from 'classnames'

import { removeProps } from '../util/helpers'

export class ButtonWrapper extends Component {
  render() {
    return <Button {...removeProps(this.props, ['hidden'])} className={createButtonClassName(this.props)}/>
  }
}

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

