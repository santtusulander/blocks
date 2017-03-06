import React from 'react'

import ContentItemList from './content-item-list'
import ContentItemChart from './content-item-chart'
import StorageItemList from './storage/storage-item-list'

const ContentItem = ({ deleteItem, isChart, isStorage, itemProps }) => {
  if (isChart) {
    return (
      <ContentItemChart {...itemProps} delete={deleteItem} />
    )
  } else {
    if (isStorage) {
      return (
        <StorageItemList {...itemProps}/>
      )
    } else {
      return (
        <ContentItemList {...itemProps}/>
      )
    }
  }
}

ContentItem.displayName = 'ContentItem'
ContentItem.propTypes = {
  deleteItem: React.PropTypes.func,
  isChart: React.PropTypes.bool,
  isStorage: React.PropTypes.bool,
  itemProps: React.PropTypes.object
}

module.exports = ContentItem
