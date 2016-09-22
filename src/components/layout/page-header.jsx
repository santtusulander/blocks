import React, { PropTypes } from 'react'
import classNames from 'classnames'

const PageHeader = ({ className, secondaryPageHeader, distributedColumns, pageSubTitle, pageHeaderDetails, children }) => {
  let customClassName = className || ''
  let finalClassName = classNames(
    'page-header-container',
    {
      'secondary-page-header': secondaryPageHeader,
      'distributed-columns': distributedColumns
    },
    customClassName
  );

  return (
    <div className={finalClassName}>
      {pageSubTitle && <h5>{pageSubTitle}</h5>}
      <div className="page-header-layout">
        {children}
      </div>
      {pageHeaderDetails &&
        <p className="text-sm">
          {pageHeaderDetails.map((detail, index) =>
              <span key={index} id={'detail-' + index} className="right-separator">
                {detail}
              </span>
          )}
        </p>
      }
    </div>
  );
}

PageHeader.displayName = 'PageHeader'
PageHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  distributedColumns: PropTypes.bool,
  pageHeaderDetails: PropTypes.array,
  pageSubTitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  secondaryPageHeader: PropTypes.bool
};

export default PageHeader
