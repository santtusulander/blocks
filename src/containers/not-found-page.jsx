import React from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import Content from '../components/shared/layout/content'

const NotFoundPage = ({ history }) => {

  return (
    <Content>
      <div className="main-content downtime-content not-found-page-container">
        <div className="text-center">
          <div className="not-found-img" />
          <h2><FormattedMessage id="portal.notFound.pageNotFound.text"/></h2>
          <Button bsStyle="primary" onClick={history.goBack}><FormattedMessage id="portal.button.goBack"/></Button>
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
