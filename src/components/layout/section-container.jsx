import React from 'react'

class SectionContainer extends React.Component {
  render() {
    let className = 'section-container';
    if(this.props.className) {
      className = className + ' ' + this.props.className
    }

    return (
      <div className={className}>
        {this.props.children}
      </div>
    )
  }
}

SectionContainer.displayName = 'SectionContainer'
SectionContainer.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string
};

module.exports = SectionContainer
