import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, FormControl } from 'react-bootstrap'

import { formatDate, formatBytes } from '../../util/helpers'

const mockUrls = [
  "http://pub_name1/path3/path6",
  "http://pub_name1/path4"
]

const StorageItemProperties = ({
  copyToClipboard,
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
      {!isDirectory &&
        <div className='storage-item-properties-column'>
          <div className='info'>
            <FormattedMessage id='portal.storage.summaryPage.itemProperties.size.label' />
            <div className='text'>{formatBytes(size)}</div>
          </div>
          <div className='info'>
            <FormattedMessage id='portal.storage.summaryPage.itemProperties.url.label' />
            {mockUrls.map((url, index) => (
                <div key={index} className='url'>
                  <div className='url-text'>
                    {url}
                  </div>
                  <Button
                    className='url-copy-button'
                    bsStyle="link"
                    onClick={() => copyToClipboard(url)}>
                    <FormattedMessage id="portal.storage.summaryPage.itemProperties.copyLink.label" />
                  </Button>
                </div>
              ))
            }
          </div>
        </div>
      }
    </div>
  )
}

StorageItemProperties.displayName = "StorageItemProperties"
StorageItemProperties.propTypes = {
  copyToClipboard: PropTypes.func,
  created: PropTypes.number,
  dateFormat: PropTypes.string,
  isDirectory: PropTypes.bool,
  lastModified: PropTypes.number,
  location: PropTypes.string,
  size: PropTypes.number
}

export default StorageItemProperties
