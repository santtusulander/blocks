import React from 'react'
import classNames from 'classnames'

class PageHeader extends React.Component {
  render() {
    let customClassName = this.props.className ? this.props.className : '';
    let finalClassName = classNames(
      'page-header-container',
      {
        'secondary-page-header': this.props.secondaryPageHeader,
        'distributed-columns': this.props.distributedColumns
      },
      customClassName
    );

    return (
      <div className={finalClassName}>
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
  distributedColumns: React.PropTypes.string,
  pageHeaderDetails: React.PropTypes.array,
  pageSubTitle: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.node
  ]),
  secondaryPageHeader: React.PropTypes.bool
};

module.exports = PageHeader
