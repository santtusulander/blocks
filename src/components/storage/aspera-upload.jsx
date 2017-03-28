import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Aspera, AW4 } from '../../util/aspera-helpers.js'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { ASPERA_DEFAULT_PORT, ASPERA_DEFAULT_HOST,
         ASPERA_DEFAULT_PATH, ASPERA_DEFAULT_DESTINATION_ROOT
       } from '../../constants/storage'

import * as uiActionCreators from '../../redux/modules/ui'
import * as userActionCreators from '../../redux/modules/user'

import { ASPERA_STATUS_TRANSFER_ERROR,
         ASPERA_STATUS_ACCESS_CODE_ERROR
       } from './aspera-notification'

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
      isAsperaInitialized: false,
      accessKey: null,
      asperaError: null,
      transferUuids: []
    }

    this.aspera = null
    this.notificationTimeout = null

    this.initAspera = this.initAspera.bind(this)
    this.startTransfer = this.startTransfer.bind(this)
    this.asperaListener = this.asperaListener.bind(this)
    this.displayInsideDropZone = this.displayInsideDropZone.bind(this)

    this.onFileUploadClick = this.onFileUploadClick.bind(this)
    this.onDirectoryUploadClick = this.onDirectoryUploadClick.bind(this)

    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.onDrop = this.onDrop.bind(this)

    this.showNotification = this.showNotification.bind(this)
  }

  componentWillMount() {
    const { brandId, accountId, groupId, storageId } = this.props

    this.props.userActions.getStorageAccessKey(brandId, accountId, groupId, storageId).then((res) => {
      if (res.error) {
        this.setState({
          asperaError: res.payload.data.message,
          accessKey: null
        })

        this.showNotification(ASPERA_STATUS_ACCESS_CODE_ERROR)
      } else {
        this.setState({
          asperaError: null,
          accessKey: res.payload
        }, this.initAspera)
      }
    })
  }

  componentWillUnmount(){
    if (this.state.isAsperaInitialized) {
      this.aspera.asperaDeInitConnect()
    }
    clearTimeout(this.notificationTimeout)
    this.props.uiActions.changeAsperaNotification('')
    this.props.uiActions.setAsperaUploadInstanse({
      asperaInitialized: false,
      asperaShowSelectFileDialog: null,
      asperaShowSelectFolderDialog: null
    })
  }

  initAspera() {
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

    this.setState({ isAsperaInitialized: true })
  }

  showNotification(code) {
    clearTimeout(this.notificationTimeout)

    this.props.uiActions.changeAsperaNotification(code)

    if ((this.state.isAsperaInitialized) && (code === AW4.Connect.STATUS.RUNNING)) {
      this.notificationTimeout = setTimeout(this.props.uiActions.changeAsperaNotification, 10000)

      this.props.uiActions.setAsperaUploadInstanse({
        asperaInitialized: true,
        asperaShowSelectFileDialog: this.onFileUploadClick,
        asperaShowSelectFolderDialog: this.onDirectoryUploadClick
      })
    }
  }

  startTransfer(files) {
    const connectSettings = {}
    const transferSpec = {
      "paths": [],
      "remote_host": this.props.asperaGetaway,
      "remote_user": this.state.accessKey,
      "remote_password": this.state.accessKey,
      "direction": ASPERA_DEFAULT_PATH,
      "destination_root": ASPERA_DEFAULT_DESTINATION_ROOT,
      "ssh_port": ASPERA_DEFAULT_PORT
    }

    const callbacks = {
      success: (data) => {
        const transferUuids = this.state.transferUuids.slice()
        transferUuids.push(data.transfer_specs[0].uuid)

        this.setState({
          transferUuids: transferUuids,
          asperaError: null
        })
      },
      error: (res) => {
        this.setState({
          asperaError: res.error.internal_message
        })

        this.showNotification(ASPERA_STATUS_TRANSFER_ERROR)
      }
    }

    this.aspera.asperaStartTransfer(transferSpec, connectSettings, callbacks, files)
  }

  onFileUploadClick(e) {
    if (e) {
      e.stopPropagation()
    }

    this.aspera.asperaShowSelectFileDialog({
      success: (data) => {
        const files = data.dataTransfer.files
        if (files.length > 0) {
          this.startTransfer(files)
        }
      },
      error: (res) => {
        this.setState({
          asperaError: res.error.internal_message
        })

        this.showNotification(ASPERA_STATUS_TRANSFER_ERROR)
      }
    }, {
      allowMultipleSelection: this.props.multiple
    })
  }

  onDirectoryUploadClick(e) {
    if (e) {
      e.stopPropagation()
    }

    this.aspera.asperaShowSelectFolderDialog({
      success: (data) => {
        const files = data.dataTransfer.files
        if (files.length > 0) {
          this.startTransfer(files)
        }
      },
      error: (res) => {
        this.setState({
          asperaError: res.error.internal_message
        })

        this.showNotification(ASPERA_STATUS_TRANSFER_ERROR)
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

  displayInsideDropZone() {
    if (this.state.asperaError && (!this.state.isAsperaInitialized)) {
      return <FormattedMessage id="portal.aspera.error.access_code"/>
    } else {
      if (this.props.openUploadModalOnClick) {
        return <FormattedMessage id="portal.fileInput.dropFileOrClick.text"/>
      } else {
        return <FormattedMessage id="portal.fileInput.dropFile.text"/>
      }
    }
  }

  render() {
    const { openUploadModalOnClick } = this.props
    const classNames = classnames(
      "filedrop-area",
      { "drag-active": this.state.isDragActive },
      { "error": this.state.asperaError },
    )

    return (
      <div>
        <div id={ASPERA_DRAG_N_DROP_CONTAINER_ID}
             className="filedrop-container"
             onClick={openUploadModalOnClick ? this.onFileUploadClick : null} >

          <div className={classNames}>
            <div className="welcome-text" id={ASPERA_UPLOAD_CONTAINER_ID}>
              { this.displayInsideDropZone() }
            </div>
          </div>

        </div>
      </div>
    )
  }
}

AsperaUpload.displayName = 'AsperaUpload'
AsperaUpload.propTypes = {
  accountId: React.PropTypes.string,
  asperaGetaway: React.PropTypes.string,
  brandId: React.PropTypes.string,
  groupId: React.PropTypes.string,
  multiple: React.PropTypes.bool,
  openUploadModalOnClick: React.PropTypes.bool,
  storageId: React.PropTypes.string,
  uiActions: React.PropTypes.object,
  userActions: React.PropTypes.object
}

AsperaUpload.defaultProps = {
  asperaGetaway: ASPERA_DEFAULT_HOST,
  multiple: true,
  openUploadModalOnClick: false
}

function mapDispatchToProps(dispatch) {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    userActions: bindActionCreators(userActionCreators, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(AsperaUpload)
