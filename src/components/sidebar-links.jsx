import React, { PropTypes } from 'react'

export const SidebarLinks = props => {
  const { items, activate, tag, emptyMsg } = props
  const name = `${tag}_name`
  const id = `${tag}_id`
  return (
    <ul className="version-list">
      {items && items[0] ? items.map((item, index) =>
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
  items: PropTypes.array,
  tag: PropTypes.string
}

export const SidebarLink = props => {
  return (
    <li>
      <a
        className={props.active ? 'active version-link' : 'version-link'}
        onClick={e => { e.stopPropagation(); props.activate() }}>
        <div className="version-title">
          {props.label}
        </div>
      </a>
    </li>
  )
}

SidebarLink.propTypes = {
  activate: PropTypes.func,
  active: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

