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
        delete={deleteItem}
        barWidth="1" />
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
  itemProps: React.PropTypes.object,
  scaledWidth: React.PropTypes.number
}

module.exports = ContentItem
