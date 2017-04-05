import React from 'react'
import { FormattedMessage } from 'react-intl'

const CopyrightNotice = () => {
  return (
    <p className="text-sm login-copyright">
      <FormattedMessage id="portal.login.copyright.text"/><br/>
      <FormattedMessage id="portal.login.termsOfUse.text"/><a href="https://www.ericsson.com/legal"><FormattedMessage id="portal.footer.termsOfUse.text"/></a>
    </p>
  )
}

CopyrightNotice.displayName = "CopyrightNotice"

export default CopyrightNotice
