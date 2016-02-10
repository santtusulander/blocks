import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export class ContentTransition extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ReactCSSTransitionGroup
        component="div"
        transitionName="content-transition"
        transitionEnterTimeout={1}
        transitionLeaveTimeout={1}
      >
        {React.cloneElement(this.props.children, {
          key: this.props.location.pathname
        })}
      </ReactCSSTransitionGroup>
    )
  }
}

ContentTransition.displayName = 'ContentTransition'
ContentTransition.propTypes = {
  children: React.PropTypes.node,
  location: React.PropTypes.object
}

module.exports = ContentTransition
