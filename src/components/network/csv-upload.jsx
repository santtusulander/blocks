import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import Dropzone from 'react-dropzone'
import moment from 'moment'

import IconClose from '../icons/icon-close'
import IconFile from '../icons/icon-file'
import LoadingSpinnerSmall from '../loading-spinner/loading-spinner-sm'

class CsvUploadArea extends Component {
  constructor(props) {
    super(props)

    this.state = {
      validFiles: [],
      rejectedFiles: [],
      isDropzoneActive: false,
      isValidationInProgress: false
    }

    this.onDrop = this.onDrop.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.renderFileList = this.renderFileList.bind(this)
    this.isValidFileType = this.isValidFileType.bind(this)
    this.validationCallback = this.validationCallback.bind(this)
  }

  isValidFileType(fileType) {
    const { acceptFileTypes } = this.props

    return (acceptFileTypes.indexOf(fileType) >= 0) ? true : false
  }

  onDrop(acceptedFiles) {
    const { asyncValidation, contentValidation, maxSize } = this.props
    let validatedFiles = []
    let rejectedFiles = []

    if (this.state.validFiles.length > 0) {
      // Don't allow upload additional files
      return
    }

    this.setState({
      isDropzoneActive: false,
      isValidationInProgress: true
    })

    acceptedFiles.map((file) => {
      // Include custom validation flags, so parent component can identify errors
      file.isFileContentValid = contentValidation ? contentValidation(file, (asyncValidation ? this.validationCallback : null)) : true
      file.isFileTypeValid = this.isValidFileType(file.type)
      file.isFileSizeValid = (file.size > maxSize) ? false : true

      if (file.isFileContentValid && file.isFileTypeValid && file.isFileSizeValid) {
        validatedFiles.push(file)
      } else {
        rejectedFiles.push(file)
      }

      return false
    })

    this.setState({
      validFiles: validatedFiles,
      rejectedFiles: rejectedFiles
    })

    if (!asyncValidation) {
      this.setState({ isValidationInProgress: false })
      this.props.onDropCompleted(validatedFiles, rejectedFiles)
    }
  }

  // Callback for async validation
  validationCallback(files) {
    let validatedFiles = this.state.validFiles.slice()
    let rejectedFiles = this.state.rejectedFiles.slice()

    // Expect one or more files here
    if (!(files instanceof Array)) {
      files = [files]
    }

    files.map((file) => {
      // Process files after async validation and
      // remove invalid files from validFiles array
      if (!file.isFileContentValid) {
        const indexToRemove = validatedFiles.findIndex((validFile) => {
          return validFile.preview === file.preview
        })

        if (indexToRemove !== -1) {
          validatedFiles.splice(indexToRemove, 1);
          rejectedFiles.push(file)
        }
      }

      return false
    })

    this.setState({
      validFiles: validatedFiles,
      rejectedFiles: rejectedFiles,
      isValidationInProgress: false
    })

    this.props.onDropCompleted(validatedFiles, rejectedFiles)
  }

  onDelete(fileName) {
    let newFiles = []

    this.state.validFiles.map((file) => {
      if (file.name !== fileName) {
        newFiles.push(file)
      }

      return false
    })

    this.setState({
      validFiles: newFiles
    })

    this.props.onDeleteCompleted(newFiles)
  }

  renderFileList(filesCount) {
    if (filesCount > 0) {
      return this.state.validFiles.map((file) => {
        if (this.state.isValidationInProgress) {
          return (
            <div key={file.name} className="file-item">
              <div className="file-block">
                <LoadingSpinnerSmall />
              </div>
              <div className="file-block details">
                <span className="validation"><FormattedMessage id="portal.fileInput.validation.text"/></span>
              </div>
            </div>)
        } else {
          return (
            <div key={file.name} className="file-item">
              <div className="file-block">
                <IconFile />
              </div>
              <div className="file-block details">
                <span className="file-name">{file.name}</span>
                <br />
                <span className="file-detail">
                  <span>{moment(file.lastModified).format("L")} </span>
                  <span><FormattedMessage id="portal.fileInput.bytes.text" values={{size: file.size}}/></span>
                </span>
              </div>
              <div className="delete-file" onClick={() => this.onDelete(file.name)}>
                <IconClose />
              </div>
            </div>)
        }
      })
    } else {
      return (
        <div className="welcome-text">
          {
            this.props.uploadModalOnClick ?
              <FormattedMessage id="portal.fileInput.dropFileOrClick.text"/> :
              <FormattedMessage id="portal.fileInput.dropFile.text"/>
          }
        </div>
      )
    }
  }

  render() {
    const { activeClassName, className, maxSize, multiple, uploadModalOnClick } = this.props
    const filesCount = this.state.validFiles.length
    const classNameProp = (filesCount > 0) ? (className + " files-inside")  : className

    return (
      <div className="filedrop-container">
        <Dropzone
          onDrop={this.onDrop}
          onDragOver={() => this.setState({isDropzoneActive: true})}
          multiple={multiple}
          maxSize={maxSize}
          disableClick={(filesCount > 0) ? true : !uploadModalOnClick}
          className={classNameProp}
          activeClassName={(filesCount > 0) ? '' : activeClassName}
        >

          {this.renderFileList(filesCount)}

        </Dropzone>
      </div>
    );
  }
}

CsvUploadArea.displayName = 'CsvUploadArea'
CsvUploadArea.propTypes = {
  acceptFileTypes: React.PropTypes.array,
  activeClassName: React.PropTypes.string,
  asyncValidation: React.PropTypes.bool,
  className: React.PropTypes.string,
  contentValidation: React.PropTypes.func,
  maxSize: React.PropTypes.number,
  multiple: React.PropTypes.bool,
  onDeleteCompleted: React.PropTypes.func,
  onDropCompleted: React.PropTypes.func,
  uploadModalOnClick: React.PropTypes.bool
}
CsvUploadArea.defaultProps = {
  acceptFileTypes: ["text/csv"],
  activeClassName: "drag-active",
  asyncValidation: false,
  className: "filedrop-area",
  maxSize: Infinity,
  multiple: true,
  uploadModalOnClick: false
}

export default CsvUploadArea
