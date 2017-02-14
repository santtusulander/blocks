import React, { PropTypes } from 'react'
import classNames from 'classnames'

const SectionHeader = ({ className, headerId, sectionHeaderTitle, subHeaderId, sectionSubHeaderTitle, children, addonAfter }) => {
  let customClassName = className || '';
  let finalClassName = classNames(
    'section-header-container',
    customClassName
  );

  return (
    <div className={finalClassName}>
      <div className="section-header-layout">
        {sectionHeaderTitle && <h3 id={headerId}>{sectionHeaderTitle}</h3>}
        {sectionSubHeaderTitle && <h4 id={subHeaderId}>{sectionSubHeaderTitle}</h4>}
        {addonAfter &&
          <span className="section-header-addon">
            {addonAfter}
          </span>
        }
        <div className="section-header-actions">
          {children}
        </div>
      </div>
    </div>
  );
}

SectionHeader.displayName = 'SectionHeader'
SectionHeader.propTypes = {
  addonAfter: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  children: PropTypes.node,
  className: PropTypes.string,
  headerId: PropTypes.string,
  sectionHeaderTitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  sectionSubHeaderTitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  subHeaderId: PropTypes.string
};

export default SectionHeader
