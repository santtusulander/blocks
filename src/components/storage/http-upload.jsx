import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import classnames from 'classnames'

import selectors from '../../redux/modules/http-file-upload/selectors'
import actions from '../../redux/modules/http-file-upload/actions'

const DROP_ZONE_ID = 'file-drop-zone'
const DRAGENTER = 'dragenter'
const DRAGOVER = 'dragover'
const DRAGLEAVE = 'dragleave'
const DROP = 'drop'

class HTTPUpload extends Component {
  static get displayName() {
    return 'HTTPUpload'
  }

  static get events() {
    return [DRAGENTER, DRAGOVER, DRAGLEAVE, DROP]
  }

  getEventHandlers() {
    const defaultHandler = (e) => {
      e.stopPropagation();
      e.preventDefault();
    }

    const processFiles = (e) => {
      const files = e.dataTransfer.files
      defaultHandler(e);
      this.props.processFiles(files)
    }

    return {
      [DRAGENTER]: defaultHandler,
      [DRAGOVER]: defaultHandler,
      [DRAGLEAVE]: defaultHandler,
      [DROP]: processFiles
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      dropZoneActive: false,
      dropZoneInvalid: false
    }

    this.getEventHandlers = this.getEventHandlers.bind(this)
    this.bindEventsHandlers = this.bindEventsHandlers.bind(this)
    this.getDropZoneMessage = this.getDropZoneMessage.bind(this)
  }

  bindEventsHandlers(container) {
    if (container === null) return

    HTTPUpload.events.forEach(e => {
      container.addEventListener(e, this.getEventHandlers()[e], false)
    })
  }

  getDropZoneMessage() {

  }


  render() {
    const classNames = classnames(
      "filedrop-area",
      { "drag-active": this.state.dropZoneActive },
      { "error": this.state.dropZoneInvalid }
    )

    return (
      <div
        ref={this.bindEventsHandlers}
        id={DROP_ZONE_ID}
        className="filedrop-container"
        onClick={console.info}
      >
        <div className={classNames}>
          <div className="welcome-text">
            {/*{ this.displayInsideDropZone() }*/}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(selectors, actions)(HTTPUpload)
