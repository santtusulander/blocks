import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import { List } from 'immutable'
import classNames from 'classnames'

import IconComments from '../icons/icon-comments'

import {
  getTicketPriorities,
  getTicketStatuses,
  getClosedTicketStatuses,
  getTicketTypeIcon
} from '../../util/support-helper'

import './support-ticket-panel.scss'

class SupportTicketPanel extends React.Component {
  constructor(props) {
    super(props);
    this.closedStatuses = List(getClosedTicketStatuses());
  }

  render() {
    const isClosed = this.closedStatuses.includes(this.props.status.toLowerCase());
    const ticketTypeIcon = getTicketTypeIcon(this.props.type);
    const priorityClass = (isClosed) ? 'normal' : this.props.priority;
    const priorityClassNames = classNames('support-ticket-panel-priority', priorityClass);
    const statusClassNames = classNames({ 'support-ticket-panel': true, 'closed': isClosed });

    return (
      <div className={statusClassNames} onClick={() => {this.props.openTicket()}}>
        <div className={priorityClassNames} />
        <Grid componentClass="header" fluid={true}>
          <Row>
            <Col xs={6}>
              <span className="support-ticket-panel-type">
                {ticketTypeIcon}
              </span>
              <span className="support-ticket-panel-number">{this.props.number}</span>
            </Col>
            <Col xs={6} className="text-right">
              <div className="support-ticket-panel-workflow">{this.props.status}</div>
            </Col>
          </Row>
        </Grid>

        <div className="support-ticket-panel-body">
          <h2>{this.props.title}</h2>
          <p>{this.props.body}</p>
        </div>

        <footer>
          <Grid componentClass="header" fluid={true}>
            <Row>
              <Col xs={6}>
                <div className="support-ticket-panel-assignee">
                  Assignee: <span className="support-ticket-panel-assignee-value">{this.props.assignee}</span>
                </div>
              </Col>
              <Col xs={6} className="text-right">
                <span className="support-ticket-panel-comments">
                  <IconComments count={this.props.comments}/>
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
SupportTicketPanel.defaultProps = {
  assignee: 'Pending',
  priority: 'normal',
  status: 'open',
  openTicket: () => {
    // no-op
  }
}

SupportTicketPanel.propTypes = {
  assignee: React.PropTypes.string,
  body: React.PropTypes.string,
  comments: React.PropTypes.string,
  number: React.PropTypes.string,
  openTicket: React.PropTypes.func,
  priority: React.PropTypes.oneOf(getTicketPriorities()),
  status: React.PropTypes.oneOf(getTicketStatuses()),
  title: React.PropTypes.string,
  type: React.PropTypes.string
}

export default SupportTicketPanel
