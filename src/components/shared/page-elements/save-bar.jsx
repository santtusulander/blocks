import React, { PropTypes } from 'react'
import { Button, ButtonToolbar } from 'react-bootstrap'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import Dialog from './../layout/dialog'

import { FormattedMessage } from 'react-intl'

const SaveBar = (props) => {
  const {children, invalid, onCancel, onSave, saving, show} = props
  return (
    <ReactCSSTransitionGroup
      component="div"
      className="dialog-transition"
      transitionName="dialog-transition"
      transitionEnterTimeout={10}
      transitionLeaveTimeout={350}
      transitionAppear={true}
      transitionAppearTimeout={10}>
      {show &&
        <Dialog className="configuration-diff-bar">
          <ButtonToolbar className="pull-right">
            <Button
              className="btn-secondary"
              onClick={onCancel}>
              <FormattedMessage id="portal.button.CANCEL"/>
            </Button>
            <Button
              bsStyle="primary"
              type='submit'
              onClick={onSave}
              disabled={saving||invalid}>
              {saving ? <FormattedMessage id="portal.button.saving"/> : <FormattedMessage id="portal.button.SAVE"/>}
            </Button>
          </ButtonToolbar>
          <div className="configuration-dialog-content">
            {children}
          </div>
        </Dialog>
      }
    </ReactCSSTransitionGroup>
  )
}

SaveBar.displayName = "SaveBar"
SaveBar.propTypes = {
  children: PropTypes.node,
  invalid: React.PropTypes.bool,
  onCancel: PropTypes.func,
  onSave: React.PropTypes.func,
  saving: React.PropTypes.bool,
  show: React.PropTypes.bool
}

export default SaveBar
