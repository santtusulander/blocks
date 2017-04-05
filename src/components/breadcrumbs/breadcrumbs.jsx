import React from 'react';
import { Link } from 'react-router'

import TruncatedTitle from '../shared/page-elements/truncated-title'

export const Breadcrumbs = props => {
  const links = props.links
  const lastLink = links && links.length - 1

  return (
    <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
      {links.map((link, index) => {
        const active = index === lastLink ? { className: 'active' } : null
        return (
          <li {...active} key={index}>
            {link.url ? <Link to={link.url}><TruncatedTitle content={link.label} tooltipPlacement="bottom" className="truncated-breadcrumb-title"/></Link>
          : <span><TruncatedTitle content={link.label} tooltipPlacement="bottom" className="truncated-breadcrumb-title"/></span>}
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
