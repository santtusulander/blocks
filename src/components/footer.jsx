import React from 'react'

import { FormattedMessage } from 'react-intl'

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
            <FormattedMessage id="portal.footer.poweredBy.text"/> <a href="http://www.ericsson.com"
            target="_blank">Ericsson</a> (v {VERSION}). <a href="#"><FormattedMessage id="portal.footer.termsOfUse.text"/></a>
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
