import React from 'react'
import IconHeaderCaret from './icons/icon-header-caret'

const FileUploadStatus = () => {
  return (
    <div className='file-upload-status-wrapper'>
      <div className='file-upload-status-header'>
        <span>Uploading...</span>
        <span className='file-upload-status-header-caret'>
          <IconHeaderCaret />
        </span>
      </div>
    </div>
  )
}

FileUploadStatus.displayName = "FileUploadStatus"

export default FileUploadStatus
