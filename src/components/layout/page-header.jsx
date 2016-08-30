import React from 'react'

class PageHeader extends React.Component {
  render() {
    let className = 'page-header-container';
    if(this.props.className) {
      className = className + ' ' + this.props.className;
    }
    if(this.props.secondaryPageHeader){
      className = className + ' secondary-page-header'
    }
    return (
      <div className={className}>
        {this.props.pageSubTitle && <h5>{this.props.pageSubTitle}</h5>}
        <div className="page-header-layout">
          {this.props.children}
        </div>
        {this.props.pageHeaderDetails &&
          <p className="text-sm">
            {this.props.pageHeaderDetails.map(function(detail){
              return (
                <span className="right-separator">
                  {detail}
                </span>
              )
            })}
          </p>
        }
      </div>
    );
  }
}
PageHeader.displayName = 'PageHeader'
PageHeader.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  pageHeaderDetails: React.PropTypes.array,
  pageSubTitle: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.node
  ]),
  secondaryPageHeader: React.PropTypes.bool
};

module.exports = PageHeader
