import React, { PropTypes } from 'react'
import IconHeaderCaret from './icons/icon-header-caret'
import StatusItem from './file-upload-status-item'
import { FormattedMessage } from 'react-intl'

const FileUploadStatus = ({uploads}) => {
  return (
    <div className='file-upload-status-wrapper'>
      <div className='file-upload-status-header'>
        <FormattedMessage
          id="portal.storage.uploadContent.uploading.text"
          values={{number: uploads.length}} />
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
