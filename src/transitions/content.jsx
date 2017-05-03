import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

const ContentTransition = (props) => {
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
      {React.cloneElement(props.children, {
        key: props.location.pathname
      })}
    </ReactCSSTransitionGroup>
  )
}

ContentTransition.displayName = 'ContentTransition'
ContentTransition.propTypes = {
  children: React.PropTypes.node,
  location: React.PropTypes.object
}

export default ContentTransition
