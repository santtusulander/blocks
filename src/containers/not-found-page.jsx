import React from 'react'
import { Button } from 'react-bootstrap'

import Content from '../components/layout/content'

import './not-found-page.scss'

import { FormattedMessage } from 'react-intl'

const NotFoundPage = ({ history }) => {

  return (
    <Content>
      <div className="main-content downtime-content not-found-page-container">
        <div className="text-center">
          <div className="not-found-img"></div>
          <p><FormattedMessage id="portal.notFound.pageNotFound.text"/></p>
          <Button className="btn-save" onClick={history.goBack}><FormattedMessage id="portal.button.goBack"/></Button>
        </div>
      </div>
    </Content>
  )
}

NotFoundPage.displayName = 'NotFoundPage'
NotFoundPage.propTypes = {
  history: React.PropTypes.object
}

export default NotFoundPage
