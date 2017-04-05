import React from 'react';
import { Overlay, Tooltip } from 'react-bootstrap'

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
    if (this.props.className) {
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
TruncatedTitle.propTypes = {
  className: React.PropTypes.string,
  content: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object
  ]),
  tooltipPlacement: React.PropTypes.string
};

module.exports = TruncatedTitle;
