/* eslint-disable no-undef */
import React from 'react'

import { FormattedMessage } from 'react-intl'

class Footer extends React.Component {
  render() {
    let className = 'footer'
    if (this.props.className) {
      className += ' ' + this.props.className
    }
    return (
      <footer className={className}>
        <div className="footer-content">
          <p className="text-center">
            <FormattedMessage id="portal.footer.poweredBy.text"/>
            <a href="http://www.ericsson.com" target="_blank"><FormattedMessage id="portal.footer.ericsson.text"/></a>
            <FormattedMessage id="portal.footer.version.text" values={{VERSION: VERSION}}/>
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
