import React from 'react'
import { FormattedMessage } from 'react-intl'

import { formatDate, formatBytes } from '../../util/helpers'

const StorageItemProperties = ({
  created,
  dateFormat,
  isDirectory,
  lastModified,
  location,
  size
}) => {
  return (
    <div className='storage-item-properties-container'>
      <div className='storage-item-properties-column left'>
        <div className='info'>
          <FormattedMessage id='portal.storage.summaryPage.itemProperties.created.label' />
          <div className='text'>{formatDate(created, dateFormat)}</div>
        </div>
        <div className='info'>
          <FormattedMessage id='portal.storage.summaryPage.itemProperties.lastModified.label' />
          <div className='text'>{formatDate(lastModified, dateFormat)}</div>
        </div>
        <div className='info'>
          {isDirectory
            ?
              <FormattedMessage id='portal.storage.summaryPage.itemProperties.location.folder.label' />
            :
              <FormattedMessage id='portal.storage.summaryPage.itemProperties.location.file.label' />
          }
          <div className='text'>{location}</div>
        </div>
      </div>
      <div className='storage-item-properties-column'>
        <div className='info'>
          <FormattedMessage id='portal.storage.summaryPage.itemProperties.size.label' />
          <div className='text'>{formatBytes(size)}</div>
        </div>
        <div className='info'>
          <FormattedMessage id='portal.storage.summaryPage.itemProperties.url.label' />
          <div className='text'>Yesterday</div>
          <div className='text'>Yesterday</div>
          <div className='text'>Yesterday</div>
        </div>
      </div>
    </div>
  )
}

StorageItemProperties.displayName = "StorageItemProperties"

export default StorageItemProperties

