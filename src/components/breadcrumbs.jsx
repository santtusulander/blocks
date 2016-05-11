import React from 'react';
import { Link } from 'react-router'

export const Breadcrumbs = props => {
  const lastLink = props.links.length - 1
  return (
    <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
      {props.links.map((link, index) => {
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
Breadcrumbs.propTypes = {
  links: React.PropTypes.array
};

