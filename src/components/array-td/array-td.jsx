import React from 'react';

import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import './array-td.scss';

const ArrayTd = ( props ) => {
  let classNames = 'array-td'
  if(props.className) {
    classNames += ' ' + props.className
  }
  const maxItemsShown = props.maxItemsShown || 3
  const shownItems = props.items.slice(0,maxItemsShown).join(', ')
  const hiddenItems = props.items.slice(maxItemsShown)
  return (
    <td className={classNames}>
      {shownItems}
      {hiddenItems.length !== 0 ?
        <OverlayTrigger placement="bottom"
          overlay={
            <Tooltip id="hidden-items" className="array-td-tooltip">
              {hiddenItems.map((item, i) => {
                return <p key={i}>{item}</p>
              })}
            </Tooltip>
          }>
          <a className="array-td-more-link">
            +{hiddenItems.length}
          </a>
        </OverlayTrigger>
      : null}
    </td>
  )
}
ArrayTd.displayName = 'ArrayTd'
ArrayTd.propTypes = {
  className: React.PropTypes.string,
  items: React.PropTypes.array,
  maxItemsShown: React.PropTypes.number
};

export default ArrayTd;
