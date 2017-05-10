import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { withRouter, Link } from 'react-router'
import { getById as getAccountById } from '../../redux/modules/entities/accounts/selectors'
import { getById as getGroupById } from '../../redux/modules/entities/groups/selectors'

import TruncatedTitle from '../../components/shared/page-elements/truncated-title'
import IconCaretDown from '../../components/shared/icons/icon-caret-down'

import Content from '../../components/shared/layout/content'
import PageHeader from '../../components/shared/layout/page-header'
import PageContainer from '../../components/shared/layout/page-container'
import Tabs from '../../components/shared/page-elements/tabs'

import AccountSelector from '../../components/global-account-selector/account-selector-container'
import { getUrl, getRoute, getSecurityUrl } from '../../util/routes'

class Services extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      params,
      activeAccount,
      activeGroup,
      router
    } = this.props

    const baseUrl = getSecurityUrl(this.props.params)

    return (
      <Content>
        <PageHeader pageSubTitle={<FormattedMessage id="portal.services.header.text"/>}>
          <AccountSelector
            params={params}
            levels={[ 'brand', 'account' ]}
            onItemClick={(entity) => {
              const { nodeInfo, idKey = 'id' } = entity
              router.push(`${getUrl(getRoute('services'), nodeInfo.entityType, entity[idKey], nodeInfo.parents)}`)
            }}
          >
            <div className="btn btn-link dropdown-toggle header-toggle">
              <h1>
                <TruncatedTitle
                  content={activeGroup.get('name') || activeAccount.get('name') || <FormattedMessage id="portal.accountManagement.noActiveAccount.text"/>}
                  tooltipPlacement="bottom"
                  className="account-property-title"
                />
              </h1>
              <IconCaretDown />
            </div>
          </AccountSelector>
        </PageHeader>

        {activeGroup &&
          <Tabs activeKey={'logDelivery'}>
            <li data-eventKey="logDelivery">
              <Link
                to={baseUrl + '/logDelivery'}
                activeClassName="active"
              >
                <FormattedMessage id="portal.services.tab.logDelivery.text"/>
              </Link>
            </li>
          </Tabs>
        }

        <PageContainer className="tab-bodies">
          {this.props.children && React.cloneElement(this.props.children, {})}
        </PageContainer>
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
    activeAccount: getAccountById(state, ownProps.params.account),
    activeGroup: getGroupById(state, ownProps.params.group) || Map()
  }
}

export default connect (mapStateToProps, null) (withRouter(Services))
