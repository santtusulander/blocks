import React from 'react';
import { Link } from 'react-router'

export const Breadcrumbs = props => {
  const amountOfLinks = props.links.length
  return (
    <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
      {props.links.map((link, index) => {
        const active = index === amountOfLinks - 1 ? { className: 'active' } : null
        return (
          <li { ...active }>
            {link.url ? <Link key={index} to={link.url}>{link.label}</Link> : link.label}
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

module.exports = Breadcrumbs
