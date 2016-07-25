import React from 'react'
import { Map } from 'immutable'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import SupportPageHeader from '../components/support/support-page-header'
import SupportTicketPanel from '../components/support/support-ticket-panel'

const activeTicket = Map({name: "Test ticket"});


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
            <SupportTicketPanel
              type="task"
              assignee="Pending"
              body="My end user in Tokyo is complaining about a slow streaming start. Lorem ipsum dolor sit amet, consectur rom..."
              comments="3"
              number="#1-5424"
              status="open"
              title="Poor Performance"
              priority="high" />

            <SupportTicketPanel
              type="task"
              assignee="Pending"
              body="My end user in Tokyo is complaining about a slow streaming start. Lorem ipsum dolor sit amet, consectur rom..."
              comments="3"
              number="#1-5424"
              status="closed"
              title="Poor Performance"
              priority="high" />
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
