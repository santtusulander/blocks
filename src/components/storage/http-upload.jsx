import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Map } from 'immutable'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'

import * as uiActionCreators from '../../redux/modules/ui'
import * as userActionCreators from '../../redux/modules/user'

import FileUploader from '../../redux/modules/http-file-upload/uploader/file-uploader'
import selectors from '../../redux/modules/http-file-upload/selectors'
import UploadStatusContainer from './file-upload-status-container'

/**
 * Represents file upload dropZone
 */
class HTTPUpload extends Component {
  constructor(props) {
    super(props)

    this.state = {
      accessKey: null,
      dropZoneActive: false,
      dropZoneInvalid: false,
      fileUploader: null
    }

    this.initFileUploader = this.initFileUploader.bind(this)
    this.getEventsHandlersMap = this.getEventsHandlersMap.bind(this)
    this.bindEventsHandlers = this.bindEventsHandlers.bind(this)
    this.openFileDialog = this.openFileDialog.bind(this)
  }

  componentDidMount() {
    const { brand, account, group, storage } = this.props.params

    this.props.userActions.getStorageAccessKey(brand, account, group, storage).then((res) => {
      if (res.error) {
        /* TODO - show error message */
      } else {
        this.setState({
          accessKey: res.payload
        }, this.initFileUploader)
      }
    })
  }

  componentWillUnmount() {
    this.props.uiActions.setHttpUploadInstance({
      httpInitialized: false,
      openFileDialog: null
    })
  }
  /**
   * Initialize File Uploader
   * @param action {object} - action with type and payload
   */
  initFileUploader() {
    const { gatewayHostname, uploadHandlers, uploadPath } = this.props

    this.setState({
      fileUploader: FileUploader.initialize(this.state.accessKey, gatewayHostname, uploadHandlers, uploadPath)
    })

    this.props.uiActions.setHttpUploadInstance({
      httpInitialized: true,
      openFileDialog: this.openFileDialog
    })
  }

  openFileDialog() {
    return this.state.fileUploader.openFileDialog()
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
          this.state.fileUploader.processFiles(e.dataTransfer.files, this.props.uploadPath)
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
      { "drag-active": this.state.dropZoneActive && this.props.highlightZoneOnDrag },
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
            <div className={dropZoneClassNames} data-drop-zone={true}>
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

HTTPUpload.displayName = "HTTPUpload"
HTTPUpload.propTypes = {
  children: React.PropTypes.object,
  gatewayHostname: React.PropTypes.string,
  highlightZoneOnDrag: React.PropTypes.bool,
  onDragEnter: React.PropTypes.func,
  onDragLeave: React.PropTypes.func,
  onDragOver: React.PropTypes.func,
  onDrop: React.PropTypes.func,
  params: React.PropTypes.object,
  renderDropZone: React.PropTypes.bool,
  uiActions: React.PropTypes.object,
  uploadHandlers: PropTypes.object,
  uploadPath: React.PropTypes.string,
  uploads: PropTypes.instanceOf(Map),
  userActions: React.PropTypes.object
}

function mapDispatchToProps(dispatch) {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    userActions: bindActionCreators(userActionCreators, dispatch)
  }
}

export default connect(selectors, mapDispatchToProps)(HTTPUpload)
