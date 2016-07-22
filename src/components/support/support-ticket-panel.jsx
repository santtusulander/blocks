import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import classNames from 'classnames'
import { List } from 'immutable'

import IconComments from '../icons/icon-comments'
import IconIncident from '../icons/icon-incident'
import IconIntegration from '../icons/icon-integration'
import IconProblem from '../icons/icon-problem'
import IconQuestion from '../icons/icon-question'
import IconTask from '../icons/icon-task'

import './support-ticket-panel.scss'

export class SupportTicketPanel extends React.Component {

  constructor(props) {
    super(props);
    const closedClassNames = List(['closed', 'resolved']);
    this.isClosed = closedClassNames.includes(this.props.status.toLowerCase());
  }

  /**
   * Return an icon component based on a provided type string.
   *
   * @param  {string} type      The type of the ticket.
   * @return {React.Component}  The icon component or null if a matching component wasn't found.
   */
  createTypeIcon(type) {
    let iconTypeComponents = {
      'task'        : IconTask,
      'problem'     : IconProblem,
      'question'    : IconQuestion,
      'integration' : IconIntegration,
      'incident'    : IconIncident
    }

    return iconTypeComponents[type] || null;
  }

  render() {
    const TicketTypeIcon = this.createTypeIcon(this.props.type);
    const priorityClass = (this.isClosed) ? 'normal' : this.props.priority;
    const priorityClassNames = classNames('support-ticket-panel-priority', priorityClass);
    const statusClassNames = classNames({'support-ticket-panel': true, 'closed': this.isClosed});

    return (
      <div className={statusClassNames}>
        <div className={priorityClassNames}></div>
        <Grid componentClass="header" fluid={true}>
          <Row>
            <Col xs={6}>
              <span className="support-ticket-panel-type">
                {TicketTypeIcon && <TicketTypeIcon />}
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
                  <IconComments count={this.props.comments} />
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
  assignee: '',
  body: '',
  comments: '',
  number: '',
  priority: 'normal',
  status: '',
  title: '',
  type: ''
}

SupportTicketPanel.propTypes = {
  assignee: React.PropTypes.string,
  body: React.PropTypes.string,
  comments: React.PropTypes.string,
  number: React.PropTypes.string,
  priority: React.PropTypes.string,
  status: React.PropTypes.string,
  title: React.PropTypes.string,
  type: React.PropTypes.string
}

module.exports = SupportTicketPanel
