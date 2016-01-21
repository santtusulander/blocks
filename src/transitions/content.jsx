import React from 'react'
import { Link } from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export class ContentTransition extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>

        {/* Hard coded links to click through the pages */}
        <br /><br /><br />
        <ul>
          <li><Link to="/content/accounts/udn">Accounts</Link></li>
          <li><Link to="/content/groups/udn/9">Groups</Link></li>
          <li><Link to="/content/hosts/udn/9/1">Hosts</Link></li>
        </ul>

        <ReactCSSTransitionGroup
          component="div"
          transitionName="content-transition"
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={500}
        >
          {React.cloneElement(this.props.children, {
            key: this.props.location.pathname
          })}
        </ReactCSSTransitionGroup>

      </div>
    )
  }
}

ContentTransition.displayName = 'ContentTransition'
ContentTransition.propTypes = {
  children: React.PropTypes.node,
  location: React.PropTypes.object
}

module.exports = ContentTransition
