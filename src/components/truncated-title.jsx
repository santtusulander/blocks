import React from 'react';
import { Overlay, Tooltip } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

class TruncatedTitle extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isTitleTruncated: false
    }

    this.measureContainers = this.measureContainers.bind(this)
    this.resetTooltip = this.resetTooltip.bind(this)
  }

  measureContainers() {
    this.setState({
      isTitleTruncated: this.refs.truncatedTitle.scrollWidth > this.refs.truncatedTitle.clientWidth
    })
  }

  resetTooltip() {
    this.setState({
      isTitleTruncated: false
    })
  }

  render() {
    let className = 'truncated-title'
    if(this.props.className) {
      className += ' ' + this.props.className
    }
    const tooltip = (
      <Tooltip
        id="truncated-title-tooltip"
        className="display-long-name-tooltip">
        <h3>{this.props.content}</h3>
      </Tooltip>
    )
    return (
      <div
        className={className}
        ref="truncatedTitle"
        onMouseOver={this.measureContainers}
        onMouseOut={this.resetTooltip}>
        {this.props.content}
        <Overlay
          placement={this.props.tooltipPlacement || 'top'}
          show={this.state.isTitleTruncated}
          target={() => this.refs.truncatedTitle}>
          {tooltip}
        </Overlay>
      </div>
    );
  }
}

TruncatedTitle.displayName = 'TruncatedTitle'

const contentPropTypeValidator = (props, propName, componentName) => {
  componentName = componentName || TruncatedTitle.displayName

  if (props[propName]) {
    const value = props[propName]

    if (typeof value !== 'string' && value.type !== FormattedMessage) {
      return new Error(propName + ' in ' + componentName + ' is not a string or a FormattedMessage')
    }
  }

  return null
}

TruncatedTitle.propTypes = {
  className: React.PropTypes.string,
  content: contentPropTypeValidator,
  tooltipPlacement: React.PropTypes.string
};

module.exports = TruncatedTitle;
