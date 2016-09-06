import React from 'react'
import { ButtonToolbar, Button, Image, Nav } from 'react-bootstrap'
import classNames from 'classnames'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import PageHeader from '../components/layout/page-header'
import IconTrash from '../components/icons/icon-trash.jsx'

import '../assets/img/temp-ibc-network.png'
import '../assets/img/temp-ibc-network-config.png'

export class Network extends React.Component {
  constructor(props) {
    super (props);

    this.state = {
      page: 1
    }
  }

  render() {
    return (
      <PageContainer className="account-management">
        <div className="account-management-system-users">
          <PageHeader pageSubTitle="Network">
            {this.state.page === 1 ?
              <h1>Datafone Inc.</h1>
            :
              <div className="header-toggle">
                <h1>ASN1.SYD.Tel.foo.bar</h1>
                <span className="caret"></span>
              </div>
            }
            {this.state.page === 2 &&
              <ButtonToolbar>
                <Button bsStyle="danger"
                  className="btn-icon">
                  <IconTrash/>
                </Button>
                <Button bsStyle="primary">PUBLISH</Button>
              </ButtonToolbar>
            }
          </PageHeader>
          {this.state.page === 2 && <Nav bsStyle="tabs">
            <li className="navbar">
              <a className="active">Edge</a>
            </li>
            <li className="navbar">
              <a>Logging</a>
            </li>
            <li className="navbar">
              <a>Purge</a>
            </li>
          </Nav>}
          <Content className="tab-bodies">
          <Image
            className={classNames('center-block', {'hidden': this.state.page !== 1})}
            onClick={() => this.setState({page: 2})}
            responsive={true}
            src="../../assets/img/temp-ibc-network.png"/>
          <Image
            className={classNames({'hidden': this.state.page !== 2})}
            onClick={() => this.setState({page: 1})}
            responsive={true}
            src="../../assets/img/temp-ibc-network-config.png"/>
          </Content>
        </div>
      </PageContainer>
    )
  }
}

Network.displayName = 'Network'
Network.propTypes = {
}

export default Network
