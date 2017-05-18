import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Map, fromJS } from 'immutable'
import classNames from 'classnames'

import selectors from '../../redux/modules/http-file-upload/selectors'
import UploadStatusContainer from './file-upload-status-container'

/**
 * Represents file upload dropZone
 */
class HTTPUpload extends Component {
  static get displayName() {
    return 'HTTPUpload'
  }

  constructor(props) {
    super(props)

    this.state = {
      dropZoneActive: false,
      dropZoneInvalid: false
    }

    this.getEventsHandlersMap = this.getEventsHandlersMap.bind(this)
    this.bindEventsHandlers = this.bindEventsHandlers.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(nextProps.uploads === this.props.uploads && nextProps.children === this.props.children && fromJS(this.state).equals(fromJS(nextState)))
  }

  /**
   * Returns map of event and eventHandlers
   * @returns {Immutable.Map}
   */
  getEventsHandlersMap() {
    /**
     * High-order function (wrapper) - mutes event before invoking original eventHandler
     * @param handler {function} - eventHandler
     * @returns {function(*=)}
     */
    function muteEventHandler(handler) {
      return (e) => {
        e.stopPropagation()
        e.preventDefault()
        handler(e)
      }
    }

    return Map([
      [
        'dragenter',
        muteEventHandler(() => {
          this.props.onDragEnter(event)
          this.setState({dropZoneActive: true})
        })
      ], [
        'dragover',
        muteEventHandler(() => {
          this.props.onDragOver(event)
          this.setState({dropZoneActive: true})
        })
      ], [
        'dragleave',
        muteEventHandler(() => {
          this.props.onDragLeave(event)
          this.setState({dropZoneActive: false})
        })
      ], [
        'drop',
        muteEventHandler((e) => {
          this.props.onDrop(event)
          this.setState({ dropZoneActive: false })
          this.props.processFiles(e.dataTransfer.files)
        })
      ]
    ])
  }

  /**
   * Attach eventHandlers to drop-zone container
   * @param container {DOMElement}
   */
  bindEventsHandlers(container) {
    if (container === null) {
      return
    }

    for (const [e, h] of this.getEventsHandlersMap()) {
      container.addEventListener(e, h, false)
    }
  }

  render() {
    const dropZoneClassNames = classNames(
      "filedrop-area",
      { "drag-active": this.state.dropZoneActive },
      { "error": this.state.dropZoneInvalid }
    );

    const uploads = !this.props.uploads.size ?
      [] :
      this.props.uploads.map((stats, name) => ({
        name,
        type: 'file',
        progress: stats.get('progress', 0),
        error: stats.get('error', false),
        cancel: stats.get('cancelUpload')
      })).toArray()

    const cancelAll = () => uploads.forEach(u => u.cancel())

    return (
      <div>
        <div
          className="filedrop-container"
          ref={this.bindEventsHandlers}
        >
          {this.props.children}
          {this.props.renderDropZone &&
            <div className={dropZoneClassNames}>
              <div className="welcome-text">
                <FormattedMessage id="portal.fileInput.dropFile.text"/>
              </div>
            </div>
          }
        </div>
        <UploadStatusContainer
          cancelAll={cancelAll}
          uploads={uploads}
          inlineStyle={{'display': this.props.uploads.size ? 'block' : 'none'}}
        />
      </div>
    )
  }
}

HTTPUpload.propTypes = {
  processFiles: PropTypes.func,
  uploads: PropTypes.instanceOf(Map)
}

export default connect(selectors)(HTTPUpload)
