import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export class ContentTransition extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>

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
