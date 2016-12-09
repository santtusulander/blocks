import React from 'react'

import ContentItemList from './content-item-list'
import ContentItemChart from './content-item-chart'

const ContentItem = ({
  deleteItem,
  isChart,
  itemProps
}) => {
  if(isChart) {
    return (
      <ContentItemChart
        {...itemProps}
        delete={deleteItem} />
    )
  }
  else {
    return (
      <ContentItemList
        {...itemProps}/>
    )
  }
}

ContentItem.displayName = 'ContentItem'
ContentItem.propTypes = {
  deleteItem: React.PropTypes.func,
  isChart: React.PropTypes.bool,
  itemProps: React.PropTypes.object
}

module.exports = ContentItem
