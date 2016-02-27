import React from 'react'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'

export class Security extends React.Component {
  render() {
    return (
      <PageContainer>
        <Content>
          <div className="container-fluid">
            <h1>Security</h1>
          </div>
        </Content>
      </PageContainer>
    )
  }
}

Security.displayName = 'Security'
Security.propTypes = {
}

module.exports = Security
