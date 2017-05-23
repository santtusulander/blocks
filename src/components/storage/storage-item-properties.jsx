import React from 'react'
import { FormattedMessage } from 'react-intl'

const StorageItemProperties = () => {
  return (
    <div className='storage-item-properties-container'>
      <div className='storage-item-properties-column left'>
        <div className='info'>
          <FormattedMessage id='portal.storage.summaryPage.itemProperties.created.label' />
          <div className='text'>Yesterday</div>
        </div>
        <div className='info'>
          <FormattedMessage id='portal.storage.summaryPage.itemProperties.lastModified.label' />
          <div className='text'>Yesterday</div>
        </div>
        <div className='info'>
          <FormattedMessage id='portal.storage.summaryPage.itemProperties.location.label' />
          <div className='text'>Yesterday</div>
        </div>
      </div>
      <div className='storage-item-properties-column'>
        <div className='info'>
          <FormattedMessage id='portal.storage.summaryPage.itemProperties.size.label' />
          <div className='text'>Yesterday</div>
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

