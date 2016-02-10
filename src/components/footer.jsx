import React from 'react'

class Footer extends React.Component {
  render() {
    let className = '';
    if(this.props.className) {
      className = className + ' ' + this.props.className;
    }
    return (
      <footer className={className}>
        Footer
      </footer>
    );
  }
}

Footer.displayName = 'Footer'
Footer.propTypes = {
  className: React.PropTypes.string
}

module.exports = Footer
