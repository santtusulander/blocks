import React from 'react'
import classNames from 'classnames'

const SectionContainer = ({ className, children }) => {
  const customClassName = className || '';
  const finalClassName = classNames(
    'section-container',
    customClassName
  );

  return (
    <div className={finalClassName}>
      {children}
    </div>
  )
}

SectionContainer.displayName = 'SectionContainer'
SectionContainer.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string
};

export default SectionContainer
