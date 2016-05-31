import React, { PropTypes } from 'react'

export const SidebarLink = props =>
    <li>
      <a
        className={props.active ? 'active version-link' : 'version-link'}
        onClick={e => { e.stopPropagation(); props.activate() }}>
        <div className="version-title">
          {props.label}
        </div>
      </a>
    </li>

SidebarLink.propTypes = {
  activate: PropTypes.func,
  active: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

