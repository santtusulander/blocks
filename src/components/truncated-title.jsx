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
    const tooltip = (<Tooltip id="truncated-title-tooltip" className="content-item-chart-tooltip display-long-name-tooltip" ref="tooltip"><h3>{this.props.content}</h3></Tooltip>)
    return (
      <div>
        {this.state.isTitleTruncated ?
          <OverlayTrigger placement={this.props.tooltipPlacement} overlay={tooltip}>
            <div className={this.props.className} ref="contentItemName">{this.props.content}</div>
          </OverlayTrigger> :
          <div className={this.props.className} ref="contentItemName">{this.props.content}</div>
        }
      </div>
    );
  }
}

TruncatedTitle.displayName = 'TruncatedTitle'
TruncatedTitle.propTypes = {
  className: React.PropTypes.string,
  content: React.PropTypes.string,
  tooltipPlacement: React.PropTypes.string
};

module.exports = TruncatedTitle;
