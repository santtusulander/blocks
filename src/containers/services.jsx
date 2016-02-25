import React from 'react'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'

export class Services extends React.Component {
  render() {
    return (
      <PageContainer>
        <Content>
          <div className="container-fluid">
            <h1>Services</h1>
          </div>
        </Content>
      </PageContainer>
    )
  }
}

Services.displayName = 'Services'
Services.propTypes = {
}

module.exports = Services
