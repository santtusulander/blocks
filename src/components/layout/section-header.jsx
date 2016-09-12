import React from 'react'
import classNames from 'classnames'

class SectionHeader extends React.Component {
  render() {
    let customClassName = this.props.className ? this.props.className : '';
    let finalClassName = classNames(
      'section-header-container',
      customClassName
    );

    return (
      <div className={finalClassName}>
        <div className="section-header-layout">
          <h3>{this.props.sectionHeaderTitle}</h3>
          <div className="section-header-actions">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

SectionHeader.displayName = 'SectionHeader'
SectionHeader.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  sectionHeaderTitle: React.PropTypes.string
};

module.exports = SectionHeader
