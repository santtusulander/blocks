import React, { PropTypes } from 'react'
import IconHeaderCaret from './icons/icon-header-caret'
import StatusItem from './file-upload-status-item'
import { Button } from 'react-bootstrap'
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
        <div className='file-upload-status-cancel-link'>
          <Button
            bsStyle="link"
            onClick={() => {}}>
            <FormattedMessage id="portal.storage.uploadContent.cancel.text" />
          </Button>
        </div>
        {uploads.map((data, index) => <StatusItem key={index} {...data} />)}
      </div>
    </div>
  )
}

FileUploadStatus.displayName = "FileUploadStatus"
FileUploadStatus.propTypes = {
  uploads: PropTypes.array
}

export default FileUploadStatus
