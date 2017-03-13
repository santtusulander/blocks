import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'

import * as actionTypes from '../../../redux/modules/http-file-upload/actionTypes'
import selectors from '../../../redux/modules/http-file-upload/selectors'
import actions from '../../../redux/modules/http-file-upload/actions'
import * as api from '../../../redux/modules/http-file-upload/api'

import FileDialog from './file-dialog'


class HTTPUpload extends Component {
  static get displayName() {
    return 'HTTPUpload'
  }

  constructor(props) {
    super(props)

    this.uploadFile = null

    this.initialize = this.initialize.bind(this)
    this.processFiles = this.processFiles.bind(this)
    this.trackUploadProgress = this.trackUploadProgress.bind(this)
  }

  /**
   * Fetch upload access key and initiate file uploader
   */
  initialize() {
    this.props[actionTypes.GET_ACCESS_KEY](this.props.iPointId)
      .then(({ payload }) => {
        this.uploadFile = api.initFileUploader(payload, this.trackUploadProgress)
        console.info('initialized uploader: ', !!this.uploadFile)
      })
  }

  /**
   * Get progress of file upload process in '%'
   * @param e {event} - 'progress' event
   * @returns {string}
   */
  trackUploadProgress(e) {
    const { lengthComputable, loaded, total } = e
    console.info(`PROGRESS: ${Math.round((loaded / total) * 100)}%`)
    return lengthComputable ? `${Math.round((loaded / total) * 100)}%` : `zero %`
  }

  /**
   * Read and upload files if file uploader initiated
   * @param files {[]} - files to read and upload
   */
  processFiles(files) {
    if (!this.uploadFile) return new Error('File Uploader not initialized');
    [...files].forEach(file => api.readFile(file).then(this.uploadFile))
  }

  componentWillMount() {
    this.initialize()
  }

  render() {
    const test = () => FileDialog.open().then(this.processFiles)

    return (
      <div style={{position: 'fixed', top: '40%', left: '40%'}}>
        <Button className='btn-success' onClick={test} >Choose File</Button>
      </div>
    )
  }
}

export default connect(selectors, actions)(HTTPUpload)
