import React from 'react';
import { Link } from 'react-router'

class Breadcrumbs extends React.Component {
  render() {
    return (
      <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
        {this.props.links.map((link, index) => {
          return (
            <li>
              {link.url ? <Link key={index} to={link.url}>{link.label}</Link> : link.label}
            </li>
          )
        })}
      </ol>
    )
  }
}
Breadcrumbs.displayName = 'Breadcrumbs'
Breadcrumbs.propTypes = {
  links: React.PropTypes.array
};

module.exports = Breadcrumbs
