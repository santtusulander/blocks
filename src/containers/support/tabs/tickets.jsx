import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { List } from 'immutable'

import * as supportActionCreators from '../../../redux/modules/support'

import IconAdd from '../../../components/icons/icon-add'
import UDNButton from '../../../components/button.js'
import SupportTicketPanel from '../../../components/support/support-ticket-panel'

class SupportTabTickets extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { account } = this.props.params
    this.props.supportActions.fetchTickets(account)
  }

  render() {
    return (
      <div className="account-support-tickets">
        <div className="account-support-tickets__filters">
          <UDNButton bsStyle="success"
                     pageHeaderBtn={true}
                     icon={true}
                     addNew={true}
                     onClick={() => {}}>
            <IconAdd/>
          </UDNButton>
        </div>
        {this.props.tickets.map((ticket, i) => {
          return <SupportTicketPanel key={`ticket-${i}`}
            type={ticket.get('type')}
            assignee="Pending"
            body={ticket.get('description')}
            comments={ticket.get('comment_count')}
            number={ticket.get('id')}
            status={ticket.get('status')}
            title={ticket.get('subject')}
            priority={ticket.get('priority')} />
        })}
      </div>
    )
  }
}

SupportTabTickets.propTypes = {
  supportActions: PropTypes.object,
}

SupportTabTickets.defaultProps = {
  tickets: List()
}


function mapStateToProps(state) {
  return {
    tickets: state.support.get('allTickets')
  };
}

function mapDispatchToProps(dispatch) {
  const supportActions = bindActionCreators(supportActionCreators, dispatch)

  return {
    supportActions: supportActions
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SupportTabTickets)
