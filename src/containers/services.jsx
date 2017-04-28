import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { getById as getAccountById } from '../redux/modules/entities/accounts/selectors'

import Content from '../components/shared/layout/content'
import ServicesPageHeader from '../components/services/services-page-header'

const Services = ({ activeAccount, params }) => {

  return (
    <Content>
      <ServicesPageHeader
        params={params}
        activeAccount={activeAccount.get ('name')}/>
      <p className='text-center'>
        <FormattedMessage tagName="tspan" id="portal.services.comingSoon.text"/>
      </p>
    </Content>
  )
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
    activeAccount: getAccountById(state, ownProps.params.account)
  }
}

export default connect (mapStateToProps, null) (Services)
