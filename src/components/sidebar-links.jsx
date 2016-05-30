import React, { PropTypes } from 'react'
import { List } from 'immutable'

import { SidebarLink } from './sidebar-link.jsx'

export const SidebarLinks = props => {
  const { items, activate, tag, emptyMsg } = props
  const name = `${tag}_name`
  const id = `${tag}_id`
  const hasContent = items && (items instanceof Array && items.length > 0 || items instanceof List && !items.isEmpty())
  return (
    <ul className="version-list">
      {hasContent ? items.map((item, index) =>
          <SidebarLink key={index}
            activate={() => activate(item.get(id))}
            active={item.get('active')}
            label={item.get(name) || item.get(id)}/>
       ) :
      <li className="empty-msg">{emptyMsg}</li>}
    </ul>
  )
}

SidebarLinks.propTypes = {
  activate: PropTypes.func,
  emptyMsg: PropTypes.string,
  items: PropTypes.oneOfType([PropTypes.instanceOf(List), PropTypes.array]),
  tag: PropTypes.string
}

