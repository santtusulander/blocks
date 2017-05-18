import React from 'react'
import { FormattedMessage } from 'react-intl'

import IconFolder from '../shared/icons/icon-folder'
import TruncatedTitle from '../shared/page-elements/truncated-title'

const UploadDestinationStatus = ({folderName}) => {
  return (
    <div className="storage-contents-upload-destination">
      <FormattedMessage id='portal.storage.uploadContent.destination.text'>
        {(formattedTitle) => (
          <span className="storage-contents-upload-destination-text">{formattedTitle}</span>
        )}
      </FormattedMessage>
      <div className="storage-contents-upload-destination-folder">
        <IconFolder />
        <TruncatedTitle content={folderName} />
      </div>
    </div>
  )
}

UploadDestinationStatus.displayName = "UploadDestinationStatus"
UploadDestinationStatus.propTypes = {
  folderName: React.PropTypes.string
}

export default UploadDestinationStatus
