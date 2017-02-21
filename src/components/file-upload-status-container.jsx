import React, { PropTypes } from 'react'
import IconHeaderCaret from './icons/icon-header-caret'
import StatusItem from './file-upload-status-item'

const FileUploadStatus = ({uploads}) => {
  return (
    <div className='file-upload-status-wrapper'>
      <div className='file-upload-status-header'>
        <span>{`Uploading ${uploads.length} items`}</span>
        <div className='file-upload-status-header-caret'>
          <IconHeaderCaret />
        </div>
      </div>
      <div className='file-upload-status-body'>
        {uploads.map(data => <StatusItem {...data} />)}
      </div>
    </div>
  )
}

FileUploadStatus.displayName = "FileUploadStatus"
FileUploadStatus.propTypes = {
  uploads: PropTypes.array
}

export default FileUploadStatus
