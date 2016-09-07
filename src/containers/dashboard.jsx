import React from 'react'
import { Input, Image } from 'react-bootstrap'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import PageHeader from '../components/layout/page-header'
import SelectWrapper from '../components/select-wrapper'

import '../assets/img/temp-ibc-dashboard.png'

export class Dashboard extends React.Component {
  constructor(props) {
    super (props);
  }

  render() {
    return (
      <Content>
        <PageHeader pageSubTitle="Dashboard">
          <h1>Datafone Inc.</h1>
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
            src="../../assets/img/temp-ibc-dashboard.png"/>
        </PageContainer>
      </Content>
    )
  }
}

Dashboard.displayName = 'Dashboard'
Dashboard.propTypes = {
}

export default Dashboard
