import React, { PropTypes } from 'react'
import { ProgressBar, Button } from 'react-bootstrap'
import TruncatedTitle from '../truncated-title'
import IconFolder from '../shared/icons/icon-folder'
import IconClose from '../shared/icons/icon-close'
import IconFile from '../shared/icons/icon-file'
import classNames from 'classnames'

const FileUploadStatusItem = ({ name, progress, error, type, cancel }) => {
  return (
    <div className={classNames('file-upload-status-item', { error })}>
      <div className='file-upload-status-type-icon'>
        {(type === 'file') && <IconFile />}
        {(type === 'directory') && <IconFolder />}
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
        onClick={cancel}>
        <IconClose />
      </Button>
    </div>
  )
}

FileUploadStatusItem.displayName = "FileUploadStatusItem"
FileUploadStatusItem.propTypes = {
  cancel: PropTypes.func,
  error: PropTypes.bool,
  name: PropTypes.string,
  progress: PropTypes.number,
  type: PropTypes.oneOf(["file", "directory"])
}

export default FileUploadStatusItem
