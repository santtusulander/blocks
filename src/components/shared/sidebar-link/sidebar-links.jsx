import React, { PropTypes } from 'react'
import { List } from 'immutable'

import { SidebarLink } from './sidebar-link.jsx'

export function SidebarLinks({ items, activate, tag, emptyMsg, activeItem }) {
  const name = tag ? `${tag}_name` : 'name'
  const id = tag ? `${tag}_id` : 'id'
  const hasContent = items && (items instanceof Array && items.length > 0 || items instanceof List && !items.isEmpty())
  return (
    <ul className="version-list">
      {hasContent ? items.map((item, index) => {
        const itemID = item.get(id)
        return (
          <SidebarLink key={index}
            activate={() => activate(itemID)}
            active={activeItem === itemID ? true : item.get('active')}
            label={item.get(name) || itemID}/>
        )
      }) :
      <li className="empty-msg">{emptyMsg}</li>}
    </ul>
  )
}

SidebarLinks.displayName = 'SidebarLinks'
SidebarLinks.propTypes = {
  activate: PropTypes.func,
  activeItem: PropTypes.number,
  emptyMsg: PropTypes.string,
  items: PropTypes.oneOfType([PropTypes.instanceOf(List), PropTypes.array]),
  tag: PropTypes.string
}
