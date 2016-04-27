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
          <p className="text-center">
            Powered By <a href="http://www.ericsson.com"
            target="_blank">Ericsson</a> (v {VERSION}). <a href="#">Terms of Use</a>
          </p>
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
