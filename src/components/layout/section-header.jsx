import React from 'react'
import classNames from 'classnames'

const SectionHeader = ({ className, headerId, sectionHeaderTitle, subHeaderId, sectionSubHeaderTitle, children }) => {
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
        <div className="section-header-actions">
          {children}
        </div>
      </div>
    </div>
  );
}

SectionHeader.displayName = 'SectionHeader'
SectionHeader.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  headerId: React.PropTypes.string,
  sectionHeaderTitle:  React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.node
  ]),
  sectionSubHeaderTitle:  React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.node
  ]),
  subHeaderId: React.PropTypes.string
};

export default SectionHeader
