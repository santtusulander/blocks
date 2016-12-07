import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'

const PageHeader = ({ className, secondaryPageHeader, distributedColumns, pageSubTitle, pageHeaderDetailsDeployed, pageHeaderDetailsUpdated, children }) => {
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
      <div className="page-header-details">
        {pageHeaderDetailsUpdated &&
          <div>
            <h5><FormattedMessage id="portal.configuration.updated.text"/>: </h5>
            <p className="text-sm right-separator">
              {pageHeaderDetailsUpdated.map((detail, index) =>
                <span key={index} id={'updated-' + index}>
                  {detail}
                </span>
              )}
            </p>
          </div>
        }
        {pageHeaderDetailsDeployed &&
          <div>
            <h5><FormattedMessage id="portal.configuration.deployed.text"/>: </h5>
            <p className="text-sm right-separator">
              {pageHeaderDetailsDeployed.map((detail, index) =>
                <span key={index} id={'deployed-' + index}>
                  {detail}
                </span>
              )}
            </p>
          </div>
        }
      </div>
    </div>
  );
}

PageHeader.displayName = 'PageHeader'
PageHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  distributedColumns: PropTypes.bool,
  pageHeaderDetailsDeployed: PropTypes.array,
  pageHeaderDetailsUpdated: PropTypes.array,
  pageSubTitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  secondaryPageHeader: PropTypes.bool
};

export default PageHeader
