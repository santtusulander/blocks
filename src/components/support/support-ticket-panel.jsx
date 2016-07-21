import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import IconComments from '../icons/icon-comments'
import IconIncident from '../icons/icon-incident'
import IconIntegration from '../icons/icon-integration'
import IconProblem from '../icons/icon-problem'
import IconQuestion from '../icons/icon-question'
import IconTask from '../icons/icon-task'

import './support-ticket-panel.scss'

export class SupportTicketPanel extends React.Component {
  render() {
    return (
      <div className="support-ticket-panel">
        <div className="support-ticket-panel-priority"></div>
        <Grid componentClass="header" fluid={true}>
          <Row>
            <Col xs={6}>
              <span className="support-ticket-panel-type">
                <IconTask />
                {/*
                <IconQuestion />
                <IconProblem />
                <IconIntegration />
                <IconIncident />
                */}
              </span>
              <span className="support-ticket-panel-number">#1-5424</span>
            </Col>
            <Col xs={6} className="text-right">
              <div className="support-ticket-panel-workflow">Open</div>
            </Col>
          </Row>
        </Grid>

        <div className="support-ticket-panel-body">
          <h2>Poor Performance</h2>
          <p>My end user in Tokyo is complaining about a slow streaming start. Lorem ipsum dolor sit amet, consectur rom...</p>
        </div>

        <footer>
          <Grid componentClass="header" fluid={true}>
            <Row>
              <Col xs={6}>
                <div className="support-ticket-panel-assignee">
                  Assignee: <span className="support-ticket-panel-assignee-value">Pending</span>
              </div>
              </Col>
              <Col xs={6} className="text-right">
                <span className="support-ticket-panel-comments">
                  <IconComments count="3" />
                </span>
              </Col>
            </Row>
          </Grid>
        </footer>
      </div>
    )
  }
}

SupportTicketPanel.displayName = 'SupportTicketPanel'
SupportTicketPanel.propTypes = {
}

module.exports = SupportTicketPanel
