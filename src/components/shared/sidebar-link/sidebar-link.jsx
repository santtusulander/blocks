import React, { PropTypes } from 'react'

export function SidebarLink({ active, activate, label }) {
  return (
    <li>
      <a
        className={active ? 'active version-link' : 'version-link'}
        onClick={e => {
          e.stopPropagation()
          activate() 
        }}>
        <div className="version-title">
          {label}
        </div>
      </a>
    </li>
  )
}

SidebarLink.displayName = 'SidebarLink'
SidebarLink.propTypes = {
  activate: PropTypes.func,
  active: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}
