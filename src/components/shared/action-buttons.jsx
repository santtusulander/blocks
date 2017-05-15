import React, { Component, PropTypes } from 'react'
import {Button} from 'react-bootstrap'
import classNames from 'classnames'

import IsAllowed from '../shared/permission-wrappers/is-allowed'
import IconEdit from './icons/icon-edit.jsx'
import IconTrash from './icons/icon-trash.jsx'
import IconClose from './icons/icon-close.jsx'
import IconArrowUp from './icons/icon-arrow-up.jsx'
import IconArrowDown from './icons/icon-arrow-down.jsx'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Confirmation from './page-elements/confirmation'
import { FormattedMessage, injectIntl } from 'react-intl'

import { ALLOW_ALWAYS } from '../../constants/permissions'

class ActionButtons extends Component {
  constructor(props) {
    super(props)

    this.state = {
      handleConfirm: '',
      showConfirmation: false
    }
  }

  render() {
    const { arrowDownDisabled,
            arrowUpDisabled,
            className,
            deleteDisabled,
            removeDisabled,
            editDisabled,
            onArrowDown,
            onArrowUp,
            onEdit,
            onDelete,
            onRemove,
            permissions,
            intl,
            showConfirmation } = this.props

    const finalClassName = classNames(
      'action-buttons',
      {
        'primary': !className
      },
      className
    );

    return (
      <div className={finalClassName}>
        {onArrowUp &&
        <Button
          onClick={onArrowUp}
          className="btn btn-icon arrow-down-button"
          disabled={arrowUpDisabled}>
          <IconArrowUp />
        </Button>
        }

        {onArrowDown &&
        <Button
          onClick={onArrowDown}
          className="btn btn-icon arrow-up-button"
          disabled={arrowDownDisabled}>
          <IconArrowDown />
        </Button>
        }

        {onEdit &&
        <IsAllowed to={permissions ? permissions.modify : ALLOW_ALWAYS}>
          <Button
            onClick={onEdit}
            disabled={editDisabled}
            className="btn btn-icon edit-button">
            <IconEdit />
          </Button>
        </IsAllowed>
        }

        {onDelete &&
        <IsAllowed to={permissions ? permissions.delete : ALLOW_ALWAYS}>
          <Button
            onClick={showConfirmation
              ? () => this.setState({
                handleConfirm: onDelete,
                showConfirmation: true
              })
              : onDelete}
            className="btn btn-icon delete-button"
            disabled={deleteDisabled}>
            <IconTrash/>
          </Button>
        </IsAllowed>
        }

        {onRemove &&
        <IsAllowed to={permissions ? permissions.remove : ALLOW_ALWAYS}>
          <Button
            onClick={showConfirmation
              ? () => this.setState({
                handleConfirm: onRemove,
                showConfirmation: true
              })
              : onRemove}
            className="btn btn-icon remove-button"
            disabled={removeDisabled}>
            <IconClose/>
          </Button>
        </IsAllowed>
        }

        {showConfirmation &&
          <ReactCSSTransitionGroup
            component="div"
            className="confirmation-transition"
            transitionName="confirmation-transition"
            transitionEnterTimeout={10}
            transitionLeaveTimeout={500}
            transitionAppear={true}
            transitionAppearTimeout={10}>
            {this.state.showConfirmation &&
            <Confirmation
              cancelText={intl.formatMessage({id: 'portal.button.no'})}
              confirmText={intl.formatMessage({id: 'portal.button.yes'})}
              handleConfirm={this.state.handleConfirm}
              handleCancel={() => this.setState({ showConfirmation: false })}>
              <FormattedMessage id="portal.common.delete.disclaimer.text"/>
            </Confirmation>}
          </ReactCSSTransitionGroup>
        }
      </div>
    )
  }
}

ActionButtons.displayName = "ActionButtons"
ActionButtons.propTypes = {
  arrowDownDisabled: PropTypes.bool,
  arrowUpDisabled: PropTypes.bool,
  className: PropTypes.string,
  deleteDisabled: PropTypes.bool,
  editDisabled: PropTypes.bool,
  intl: PropTypes.object,
  onArrowDown: PropTypes.func,
  onArrowUp: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
  permissions: PropTypes.object,
  removeDisabled: PropTypes.bool,
  showConfirmation: PropTypes.bool
}

export default injectIntl(ActionButtons)
