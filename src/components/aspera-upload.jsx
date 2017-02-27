import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Aspera, AW4 } from '../util/aspera-helpers.js'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as uiActionCreators from '../redux/modules/ui'

const DROP_EVENT_NAME = 'drop'
const DRAG_OVER_EVENT_NAME = 'dragover'
const DRAG_ENTER_EVENT_NAME = 'dragenter'
const DRAG_LEAVE_EVENT_NAME = 'dragleave'
const ASPERA_UPLOAD_CONTAINER_ID = 'asperaUploadArea'
const ASPERA_DRAG_N_DROP_CONTAINER_ID = 'asperaDragNDropArea'
const IS_DRAG_N_DROP_ENABLED = true

class AsperaUpload extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isDragActive: false,
      transferUuids: []
    }

    this.aspera = null
    this.notificationTimeout = null

    this.startTransfer = this.startTransfer.bind(this)
    this.asperaListener = this.asperaListener.bind(this)

    this.onClick = this.onClick.bind(this)
    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.onDrop = this.onDrop.bind(this)

    this.showNotification = this.showNotification.bind(this)
  }

  componentDidMount() {
    const statusFunctions = {
      showLaunching: () => {
        return this.showNotification(AW4.Connect.STATUS.INITIALIZING)
      },
      showDownload: () => {
        return this.showNotification(AW4.Connect.STATUS.FAILED)
      },
      showUpdate: () => {
        return this.showNotification(AW4.Connect.STATUS.OUTDATED)
      },
      connected: () => {
        return this.showNotification(AW4.Connect.STATUS.RUNNING)
      }
    }

    this.aspera = new Aspera(ASPERA_UPLOAD_CONTAINER_ID, IS_DRAG_N_DROP_ENABLED)

    this.aspera.asperaInitConnect(statusFunctions)

    this.aspera.asperaDragAndDropSetup(`#${ASPERA_DRAG_N_DROP_CONTAINER_ID}`,
                                       this.asperaListener)
  }

  componentWillUnmount(){
    this.aspera.asperaDeInitConnect()
    clearTimeout(this.notificationTimeout)
  }

  showNotification(code) {
    clearTimeout(this.notificationTimeout)

    this.props.uiActions.changeAsperaNotification(code)
    if (code === AW4.Connect.STATUS.RUNNING) {
      this.notificationTimeout = setTimeout(this.props.uiActions.changeAsperaNotification, 10000)
    }
  }

  startTransfer(files) {
    const connectSettings = {}
    const transferSpec = {
      "paths": [],
      "remote_host": "demo.asperasoft.com",
      "remote_user": "aspera",
      "remote_password": "demoaspera",
      "direction": "send",
      "target_rate_kbps" : 5000,
      "resume" : "sparse_checksum",
      "destination_root": "Upload"
    }

    const callbacks = {
      success: (data) => {
        const transferUuids = this.state.transferUuids.slice()
        transferUuids.push(data.transfer_specs[0].uuid)

        this.setState({
          transferUuids
        })
      },
      error: () => {
        /* TODO: error handling */
      }
    }

    this.aspera.asperaStartTransfer(transferSpec, connectSettings, callbacks, files)
  }

  onClick(e) {
    e.stopPropagation();
    this.aspera.asperaShowSelectFileDialog({
      success: (data) => {
        const files = data.dataTransfer.files
        if (files.length > 0) {
          this.startTransfer(files)
        }
      },
      error: () => {
        /* TODO: error handling */
      }
    }, {
      allowMultipleSelection: this.props.multiple
    })
  }

  onDragEnter() {
    this.setState({
      isDragActive: true
    })
  }

  onDragLeave() {
    this.setState({
      isDragActive: false
    })
  }

  onDragOver() {
    this.setState({
      isDragActive: true
    })
  }

  onDrop(event, data) {
    this.setState({
      isDragActive: false
    })

    this.startTransfer(data.dataTransfer.files)
  }

  asperaListener({event, files}) {
    switch (event.type) {
      case DRAG_ENTER_EVENT_NAME:
        this.onDragEnter()
        break;

      case DRAG_LEAVE_EVENT_NAME:
        this.onDragLeave()
        break;

      case DRAG_OVER_EVENT_NAME:
        this.onDragOver()
        break;

      case DROP_EVENT_NAME:
        this.onDrop(event, files)
        break;

      default:
        break;
    }
  }

  render() {
    const { openUploadModalOnClick } = this.props
    const classNames = classnames(
      "filedrop-area",
      { "drag-active": this.state.isDragActive }
    )

    return (
      <div id={ASPERA_UPLOAD_CONTAINER_ID}>
        <div id={ASPERA_DRAG_N_DROP_CONTAINER_ID} className="filedrop-container"
             onClick={openUploadModalOnClick ? this.onClick : null} >

          <div className={classNames}>
            <div className="welcome-text">
              { openUploadModalOnClick
                ? <FormattedMessage id="portal.fileInput.dropFileOrClick.text"/>
                : <FormattedMessage id="portal.fileInput.dropFile.text"/>
              }
            </div>
          </div>

        </div>
      </div>
    );
  }
}

AsperaUpload.displayName = 'AsperaUpload'
AsperaUpload.propTypes = {
  multiple: React.PropTypes.bool,
  openUploadModalOnClick: React.PropTypes.bool,
  uiActions: React.PropTypes.object
}
AsperaUpload.defaultProps = {
  multiple: true,
  openUploadModalOnClick: false
}


function mapDispatchToProps(dispatch) {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(AsperaUpload)
