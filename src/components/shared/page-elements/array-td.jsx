import React from 'react';

import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

const ArrayTd = (props) => {
  let classNames = 'array-td'
  if (props.className) {
    classNames += ' ' + props.className
  }
  const maxItemsShown = props.maxItemsShown || 3
  const shownItems = props.items.slice(0,maxItemsShown).join(', ')
  const hiddenItems = props.items.slice(maxItemsShown)
  const moreLink = props.customText ? props.customText : <FormattedMessage id='portal.plusWithCount' values={{count: hiddenItems.length}}/>

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
            {moreLink}
          </a>
        </OverlayTrigger>
      : null}
    </td>
  )
}
ArrayTd.displayName = 'ArrayTd'

ArrayTd.propTypes = {
  className: React.PropTypes.string,
  customText: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
  items: React.PropTypes.array,
  maxItemsShown: React.PropTypes.number
};

export default ArrayTd;
