import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { ButtonToolbar, Button, Image, Nav } from 'react-bootstrap'
import classNames from 'classnames'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import PageHeader from '../components/layout/page-header'
import IconTrash from '../components/icons/icon-trash.jsx'

import '../assets/img/temp-network-start.png'
import '../assets/img/temp-network.png'
import '../assets/img/temp-network-config.png'

export class Network extends React.Component {
  constructor(props) {
    super (props);

    this.state = {
      page: 1
    }
  }
  componentWillReceiveProps() {
    this.setState({ page: 1 })
  }
  render() {
    return (
      <Content>
        <PageHeader pageSubTitle="Network">
          {this.state.page !== 3 ?
            <h1>{this.props.activeAccount ? this.props.activeAccount.get('name') : 'Account'}</h1>
          :
            <div className="header-toggle">
              <h1>ASN1.SYD.Tel.foothill</h1>
              <span className="caret"></span>
            </div>
          }
          {this.state.page === 3 &&
            <ButtonToolbar>
              <Button bsStyle="danger"
                className="btn-icon">
                <IconTrash/>
              </Button>
              <Button bsStyle="primary">PUBLISH</Button>
            </ButtonToolbar>
          }
        </PageHeader>
        {this.state.page === 3 && <Nav bsStyle="tabs">
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
        <PageContainer>
          <Image
            className={classNames('center-block', {'hidden': this.state.page !== 1})}
            onClick={() => this.setState({page: 2})}
            responsive={true}
            src="../../assets/img/temp-network-start.png"/>
          <Image
            className={classNames('center-block', {'hidden': this.state.page !== 2})}
            onClick={() => this.setState({page: 3})}
            responsive={true}
            src="../../assets/img/temp-network.png"/>
          <Image
            className={classNames({'hidden': this.state.page !== 3})}
            onClick={() => this.setState({page: 1})}
            responsive={true}
            src="../../assets/img/temp-network-config.png"/>
        </PageContainer>
      </Content>
    )
  }
}

Network.displayName = 'Network'
Network.propTypes = {
  activeAccount: React.PropTypes.instanceOf(Immutable.Map)
}
Network.defaultProps = {
  activeAccount: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount')
  }
}

export default connect(mapStateToProps)(Network)
