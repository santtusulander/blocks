import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getById as getAccountById } from '../redux/modules/entities/accounts/selectors'

import Content from '../components/shared/layout/content'
import ServicesPageHeader from '../components/services/services-page-header'
import { FormattedMessage } from 'react-intl'

export class Services extends React.Component {
  constructor(props) {
    super (props);
  }

  render() {

    const {activeAccount } = this.props;

    return (
      <Content>
        <ServicesPageHeader
          params={this.props.params}
          activeAccount={activeAccount.get ('name')}/>
        {/*Not in 0.8.1*/}
        {/*{this.renderContent(certificateFormProps, sslListProps)}*/}
        <p className='text-center'>
          <FormattedMessage tagName="tspan" id="portal.services.comingSoon.text"/>
        </p>
      </Content>
    )
  }
}

Services.displayName = 'Services'

Services.propTypes = {
  activeAccount: PropTypes.instanceOf (Map),
  params: PropTypes.object
}

Services.defaultProps = {
  activeAccount: Map ()
}
function mapStateToProps(state, ownProps) {
  return {
    accounts: state.account.get ('allAccounts'),
    activeAccount: getAccountById(state, ownProps.params.account)
  };
}

export default connect (mapStateToProps, null) (Services)
