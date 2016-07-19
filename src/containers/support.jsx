import React from 'react'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import SupportPageHeader from '../components/support/support-page-header'

const activeTicket = {name: "Test ticket"};

export class Support extends React.Component {
  render() {
    return (
      <PageContainer>
        <div className="account-management-system-users">
         <SupportPageHeader
           activeTicket={activeTicket.get('name')}/>
       </div>
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
