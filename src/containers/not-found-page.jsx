import React from 'react'
import { Button } from 'react-bootstrap'

import './not-found-page.scss'

const NotFoundPage = ({ history }) => {

  return (
    <div className="main-content downtime-content not-found-page-container">
      <div className="text-center">
        <div className="not-found-img"></div>
        <p>We couldn&rsquo;t find the page you<br />were looking for</p>
        <Button className="btn-save" onClick={history.goBack}>GO BACK</Button>
      </div>
    </div>
  )
}

NotFoundPage.displayName = 'NotFoundPage'
NotFoundPage.propTypes = {
  history: React.PropTypes.object
}

export default NotFoundPage
