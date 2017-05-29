import React, { PropTypes } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import { Image } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'

import PageHeader from '../components/shared/layout/page-header'
import Content from '../components/shared/layout/content'
import TruncatedTitle from '../components/shared/page-elements/truncated-title'

import { getById as getAccountById} from '../redux/modules/entities/accounts/selectors'

import { ACCOUNT_TYPE_CLOUD_PROVIDER } from '../constants/account-management-options'

import '../../src/assets/img/dashboard-content.png'
import '../../src/assets/img/dashboard-content-with-tooltip.png'

export class BrandDashboardImg extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showMarker: false
    }

    this.toggleImage = this.toggleImage.bind(this)
  }

  toggleImage() {
    this.setState({showMarker: !this.state.showMarker})
  }

  render() {
    const { activeAccount, intl } = this.props

    return (
      <Content>
        <PageHeader pageSubTitle={<FormattedMessage id="portal.navigation.dashboard.text"/>}>
          <h1>
            <TruncatedTitle
              content={activeAccount.get('name') || intl.formatMessage({id: 'portal.account.manage.selectAccount.text'})}
              tooltipPlacement="bottom"
              className="account-property-title"/>
          </h1>
        </PageHeader>
        <div onClick={() => this.toggleImage()}>
          <Image
            responsive={true}
            src={this.state.showMarker
                ? '/assets/img/dashboard-content-with-tooltip.png'
                : '/assets/img/dashboard-content.png'
            }
          />
        </div>
      </Content>
    )
  }
}

BrandDashboardImg.displayName = 'BrandDashboardImg'
BrandDashboardImg.propTypes = {
  activeAccount: PropTypes.instanceOf(Map),
  intl: PropTypes.object
}

BrandDashboardImg.defaultProps = {
  activeAccount: Map({
    id: 1,
    name: <FormattedMessage id="portal.content.property.topBar.brand.label" />,
    provider_type: ACCOUNT_TYPE_CLOUD_PROVIDER
  })
}

/* istanbul ignore next */
const mapStateToProps = (state, { params: { account } }) => {
  return {
    activeAccount: getAccountById(state, account)
  }
}

export default withRouter(connect(mapStateToProps)(injectIntl(BrandDashboardImg)))
