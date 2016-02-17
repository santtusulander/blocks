import React from 'react'

class Footer extends React.Component {
  render() {
    let className = 'footer'
    if(this.props.className) {
      className += ' ' + this.props.className
    }
    return (
      <footer className={className}>
        <div className="footer-content">
          <p>v <!-- @echo PACKAGE_VERSION --></p>
        </div>
      </footer>
    );
  }
}

Footer.displayName = 'Footer'
Footer.propTypes = {
  className: React.PropTypes.string
}

module.exports = Footer
