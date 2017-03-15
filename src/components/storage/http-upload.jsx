import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import classnames from 'classnames'

import selectors from '../../redux/modules/http-file-upload/selectors'
import actions from '../../redux/modules/http-file-upload/actions'

const DROP_ZONE_ID = 'file-drop-zone'
const DRAG_ENTER = 'dragenter'
const DRAG_OVER = 'dragover'
const DRAG_LEAVE = 'dragleave'
const DROP = 'drop'

/**
 * Represents file upload dropZone
 */
class HTTPUpload extends Component {
  static get displayName() {
    return 'HTTPUpload'
  }

  /**
   * Events list to be tracked with dropZone
   */
  static get events() {
    return [DRAG_ENTER, DRAG_OVER, DRAG_LEAVE, DROP]
  }

  constructor(props) {
    super(props)

    this.state = {
      dropZoneActive: false,
      dropZoneInvalid: false
    }

    this.getEventHandlers = this.getEventHandlers.bind(this)
    this.bindEventsHandlers = this.bindEventsHandlers.bind(this)
  }

  /**
   * Events handlers map
   */
  getEventHandlers() {
    const muteEvent = (e) => { e.stopPropagation(); e.preventDefault(); }
    return {
      [DRAG_ENTER]: (e) => {
        muteEvent(e)
        this.setState({ dropZoneActive: true })
      },
      [DRAG_OVER]: (e) => {
        muteEvent(e)
        this.setState({ dropZoneActive: true })
      },
      [DRAG_LEAVE]: (e) => {
        muteEvent(e)
        this.setState({ dropZoneActive: false })
      },
      [DROP]: (e) => {
        muteEvent(e)
        this.setState({ dropZoneActive: false })
        this.props.processFiles(e.dataTransfer.files)
      }
    }
  }

  bindEventsHandlers(container) {
    if (container === null) return

    HTTPUpload.events.forEach(e => {
      container.addEventListener(e, this.getEventHandlers()[e])
    })
  }

  render() {
    const classNames = classnames(
      "filedrop-area",
      { "drag-active": this.state.dropZoneActive },
      { "error": this.state.dropZoneInvalid }
    )
    const message = <FormattedMessage id="portal.fileInput.dropFile.text"/>

    return (
      <div
        ref={this.bindEventsHandlers}
        id={DROP_ZONE_ID}
        className="filedrop-container"
        onClick={this.props.openFileDialog}
      >
        <div className={classNames}>
          <div className="welcome-text">{message}</div>
        </div>
      </div>
    )
  }
}

export default connect(selectors, actions)(HTTPUpload)
