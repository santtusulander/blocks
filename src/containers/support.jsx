import React from 'react'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import SupportPageHeader from '../components/support/support-page-header'

export class Support extends React.Component {
  render() {
    return (
      <PageContainer>
        
        <Content>
          <div className="container-fluid">
            <h1>Support</h1>
          </div>
        </Content>
      </PageContainer>
    )
  }
}

Support.displayName = 'Support'
Support.propTypes = {
}

module.exports = Support
