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
        className="content-transition"
        transitionName="content-transition"
        transitionEnterTimeout={400}
        transitionLeaveTimeout={250}
        transitionAppear={true}
        transitionAppearTimeout={400}
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
