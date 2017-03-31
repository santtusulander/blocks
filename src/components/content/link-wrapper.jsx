import React from 'react'
import { Link } from 'react-router'

// NOTE: this is temporary for the 1.0 release to disable
// drilling down into the property level for SP accounts
const LinkWrapper = props => {
  if (props.disableLinkTo) {
    return <div>{props.children}</div>
  }
  return (
    <Link className={props.className} to={props.linkTo}>
      {props.children}
    </Link>
  )
}

LinkWrapper.displayName = "LinkWrapper"
LinkWrapper.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  disableLinkTo: React.PropTypes.bool,
  linkTo: React.PropTypes.string
}

export default LinkWrapper
