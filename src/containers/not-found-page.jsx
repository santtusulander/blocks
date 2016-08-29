import React from 'react'
import { Button } from 'react-bootstrap'

import './not-found-page.scss'

import {FormattedMessage} from 'react-intl'

const NotFoundPage = ({ history }) => {

  return (
    <div className="main-content downtime-content not-found-page-container">
      <div className="text-center">
        <div className="not-found-img"></div>
        <p><FormattedMessage id="portal.notFound.pageNotFound.text"/></p>
        <Button className="btn-save" onClick={history.goBack}><FormattedMessage id="portal.button.goBack"/></Button>
      </div>
    </div>
  )
}

NotFoundPage.displayName = 'NotFoundPage'
NotFoundPage.propTypes = {
  history: React.PropTypes.object
}

export default NotFoundPage
