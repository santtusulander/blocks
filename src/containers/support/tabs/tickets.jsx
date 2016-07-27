import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { List } from 'immutable'

import * as supportActionCreators from '../../../redux/modules/support'

import IconAdd from '../../../components/icons/icon-add'
import UDNButton from '../../../components/button.js'
import SupportTicketPanel from '../../../components/support/support-ticket-panel'
import SupportModal from '../../../components/support/support-ticket-form/modal'

class SupportTabTickets extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ticketToEdit: null,
      showModal: false
    }

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.saveTicket = this.saveTicket.bind(this);
  }

  componentWillMount() {
    const { account } = this.props.params
    this.props.supportActions.fetchTickets(account)
  }

  showModal(ticket = null) {
    this.setState({
      ticketToEdit: ticket,
      showModal: true
    })
  }

  hideModal() {
    this.setState({ showModal: false })
  }

  saveTicket() {

  }

  render() {
    return (
      <div className="account-support-tickets">
        <div className="account-support-tickets__filters">
          <UDNButton bsStyle="success"
                     pageHeaderBtn={true}
                     icon={true}
                     addNew={true}
                     onClick={() => { this.showModal() }}>
            <IconAdd/>
          </UDNButton>
        </div>
        {this.props.tickets.map((ticket, i) => {
          return <SupportTicketPanel key={`ticket-${i}`}
            type={ticket.get('type')}
            assignee="Pending"
            body={ticket.get('description')}
            comments={String(ticket.get('comment_count'))}
            number={String(ticket.get('id'))}
            status={ticket.get('status')}
            title={ticket.get('subject')}
            priority={ticket.get('priority')} />
        })}
        {this.state.showModal &&
          <SupportModal
            onSave={this.saveTicket}
            onCancel={this.hideModal}
            show={this.state.showModal}
          />
        }
      </div>
    )
  }
}

SupportTabTickets.propTypes = {
  params: PropTypes.object,
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
