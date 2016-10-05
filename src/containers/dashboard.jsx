import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { Input, Image } from 'react-bootstrap'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import PageHeader from '../components/layout/page-header'
import SelectWrapper from '../components/select-wrapper'

import '../assets/img/temp-dashboard.png'

export class Dashboard extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Content>
        <PageHeader pageSubTitle="Dashboard">
          <h1>{this.props.activeAccount ? this.props.activeAccount.get('name') : 'Account'}</h1>
        </PageHeader>
        <PageHeader secondaryPageHeader={true}>
          <div className="action">
            <h5>Date Range</h5>
            <SelectWrapper options={[[1, 'Today'], [2, 'Yesterday']]} value={1}/>
          </div>
          <div className="action">
            <h5>Services</h5>
            <SelectWrapper options={[[1, 'Media Delivery'], [2, 'UDN Network Partner - On-Net']]} value={1}/>
          </div>
          <div className="action">
            <h5>Traffic</h5>
            <div className="form-inline">
              <Input type="checkbox" label="HTTP" checked={true}/>
              <Input type="checkbox" label="HTTPS"/>
            </div>
          </div>
        </PageHeader>
        <PageContainer>
          <Image
            className="center-block"
            responsive={true}
            src="../../assets/img/temp-dashboard.png"/>
        </PageContainer>
      </Content>
    )
  }
}

Dashboard.displayName = 'Dashboard'
Dashboard.propTypes = {
  activeAccount: React.PropTypes.instanceOf(Immutable.Map)
}
Dashboard.defaultProps = {
  activeAccount: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount')
  };
}

export default connect(mapStateToProps)(Dashboard)
