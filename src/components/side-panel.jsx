import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Modal } from 'react-bootstrap'
import classNames from 'classnames'

import * as uiActionCreators from '../redux/modules/ui'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import keyStrokeSupport from '../decorators/key-stroke-decorator'
import Notification from '../components/notification'

const modalClassDim = 'side-panel--dim'
const overlappingClass = 'side-panel--overlapping'

class SidePanelComponent extends Component {
  constructor(props) {
    super(props)

    this.hideNotification = this.hideNotification.bind(this)
  }

  hideNotification() {
    this.props.uiActions.changeSidePanelNotification()
  }

  render() {
    const { children, className, dim, overlapping, show, subTitle, subSubTitle, title, notification } = this.props
    let subTitleElements = ''
    let dialogClassName = classNames(
      'side-panel',
      className,
      dim ? modalClassDim : null,
      overlapping ? overlappingClass : null
    )

    if (subTitle && subSubTitle) {
      subTitleElements = (
        <div className="sub-title-two-line">
          <div className="sub-title">{subTitle}</div>
          <div className="sub-sub-title">
            {subSubTitle}
          </div>
        </div>
      )
    } else if (subTitle) {
      subTitleElements = <p>{subTitle}</p>
    }

    return (
      <Modal show={show} dialogClassName={dialogClassName}>
        <div className="side-panel__veil" />
        <Modal.Header>
          <h1>{title}</h1>
          {subTitleElements}
        </Modal.Header>

        <Modal.Body>
          {children}
        </Modal.Body>

        <ReactCSSTransitionGroup
          component="div"
          className="notification-transition"
          transitionName="notification-transition"
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={500}
          transitionAppear={true}
          transitionAppearTimeout={1000}>
          {notification ?
            <Notification handleClose={this.hideNotification}>
              {notification}
            </Notification>
            : ''
          }
        </ReactCSSTransitionGroup>
      </Modal>
    )
  }
}

SidePanelComponent.displayName = 'SidePanel'
SidePanelComponent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  dim: PropTypes.bool,
  notification: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.node]),
  overlapping: PropTypes.bool,
  show: PropTypes.bool,
  subSubTitle: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.node
  ]),
  subTitle: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.node
  ]),
  title: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.node
  ]),
  uiActions: PropTypes.object
}

export const SidePanel = keyStrokeSupport(SidePanelComponent)


function mapStateToProps(state) {
  return {
    notification: state.ui.get('sidePanelNotification')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SidePanel);
