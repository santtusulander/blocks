import React, { PropTypes } from 'react'
import { ProgressBar, Button } from 'react-bootstrap'
import TruncatedTitle from '../truncated-title'
import IconClose from '../icons/icon-close'
import IconFile from '../icons/icon-file'

const FileUploadStatusItem = ({name, progress, type}) => {
  return (
    <div className='file-upload-status-item'>
      <div className='file-upload-status-type-icon'>
        {(type === 'file') && <IconFile />}
        {(type === 'directory') && <IconFile />}
      </div>
      <div className='file-update-status-item-info'>
        <TruncatedTitle className='file-upload-status-item-name' content={name} />
        <ProgressBar
          className='file-upload-status-progress'
          now={progress} />
      </div>
      <Button
        bsStyle='link'
        className='file-update-status-remove-icon'
        onClick={() => {}}>
        <IconClose />
      </Button>
    </div>
  )
}

FileUploadStatusItem.displayName = "FileUploadStatusItem"
FileUploadStatusItem.propTypes = {
  name: PropTypes.string,
  progress: PropTypes.number,
  type: PropTypes.string
}

export default FileUploadStatusItem
