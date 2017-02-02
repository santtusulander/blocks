import React, { PropTypes } from 'react';
import classnames from 'classnames'
import { FormattedMessage } from 'react-intl'
import ActionButtons from '../action-buttons'
import { Button } from 'react-bootstrap'

const ActionItem = ({ input: { value, onChange },label, editAction }) => {
  return (
    <div className={classnames('action', {removed: value})}>
      <div className="action-name">{`${label}`}</div>
      {value ?
        <Button bsStyle="link" onClick={() => onChange(!value)} className="btn-undo pull-right">
          <FormattedMessage id="portal.common.button.undo" />
        </Button> :
        <ActionButtons
          className="secondary pull-right"
          onEdit={editAction}
          onRemove={() => onChange(!value)}
          removeDisabled={false} />}
    </div>
  )
}

ActionItem.displayName = 'ActionItem'

ActionItem.propTypes = {
  editAction: PropTypes.func,
  input: PropTypes.object,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
}

export default ActionItem
