import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

class TruncatedTitle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isTitleTruncated: false
    }

    this.measureContainers = this.measureContainers.bind(this)
  }

  componentDidMount() {
    this.measureContainers()
    window.addEventListener('resize', this.measureContainers)
  }

  componentWillReceiveProps(){
    this.measureContainers()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers)
  }

  measureContainers() {
    this.setState({
      isTitleTruncated: this.refs.contentItemName.scrollWidth > this.refs.contentItemName.clientWidth
    })
  }

  render() {
    let className = 'truncated-title'
    if(this.props.className) {
      className += ' ' + this.props.className
    }
    const tooltip = (<Tooltip id="truncated-title-tooltip" className="display-long-name-tooltip"><h3>{this.props.content}</h3></Tooltip>)
    return (
      this.state.isTitleTruncated ?
        <OverlayTrigger placement={this.props.tooltipPlacement || 'top'} overlay={tooltip}>
          <div className={className} ref="contentItemName">{this.props.content}</div>
        </OverlayTrigger>
      :
        <div className={className} ref="contentItemName">{this.props.content}</div>
    );
  }
}

TruncatedTitle.displayName = 'TruncatedTitle'
TruncatedTitle.propTypes = {
  className: React.PropTypes.string,
  tooltipPlacement: React.PropTypes.string
};

module.exports = TruncatedTitle;
