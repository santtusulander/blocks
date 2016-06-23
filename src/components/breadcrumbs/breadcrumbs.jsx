import React from 'react';
import { Link } from 'react-router'

import './breadcrumbs.scss'

export const Breadcrumbs = props => {
  const links = props.links
  const lastLink = links && links.length - 1

  return (
    <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
      {links.map((link, index) => {
        const active = index === lastLink ? { className: 'active' } : null
        return (
          <li { ...active } key={index}>
            {link.url ? <Link to={link.url}>{link.label}</Link> : link.label}
          </li>
        )
      })}
    </ol>
  )
}
Breadcrumbs.displayName = 'Breadcrumbs'
Breadcrumbs.defaultProps = {
  links: []
}

Breadcrumbs.propTypes = {
  links: React.PropTypes.array
};

