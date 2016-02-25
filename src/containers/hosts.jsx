import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Modal, Button, ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import * as hostActionCreators from '../redux/modules/host'
import * as groupActionCreators from '../redux/modules/group'
import * as accountActionCreators from '../redux/modules/account'
import * as uiActionCreators from '../redux/modules/ui'
import AddHost from '../components/add-host'
import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import PageHeader from '../components/layout/page-header'
import ContentItemList from '../components/content-item-list'
import ContentItemChart from '../components/content-item-chart'
import Select from '../components/select'
import IconAdd from '../components/icons/icon-add.jsx'
import IconChart from '../components/icons/icon-chart.jsx'
import IconItemList from '../components/icons/icon-item-list.jsx'
import IconItemChart from '../components/icons/icon-item-chart.jsx'

const fakeRecentData = [
  {timestamp: new Date("2016-01-01T00:00:00"), bytes: 49405, requests: 943},
  {timestamp: new Date("2016-01-02T00:00:00"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-01-03T00:00:00"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-01-04T00:00:00"), bytes: 44336, requests: 345},
  {timestamp: new Date("2016-01-05T00:00:00"), bytes: 43456, requests: 567},
  {timestamp: new Date("2016-01-06T00:00:00"), bytes: 46756, requests: 244},
  {timestamp: new Date("2016-01-07T00:00:00"), bytes: 45466, requests: 455},
  {timestamp: new Date("2016-01-08T00:00:00"), bytes: 43456, requests: 233},
  {timestamp: new Date("2016-01-09T00:00:00"), bytes: 47454, requests: 544},
  {timestamp: new Date("2016-01-10T00:00:00"), bytes: 54766, requests: 546},
  {timestamp: new Date("2016-01-11T00:00:00"), bytes: 54675, requests: 435},
  {timestamp: new Date("2016-01-12T00:00:00"), bytes: 54336, requests: 456},
  {timestamp: new Date("2016-01-13T00:00:00"), bytes: 53456, requests: 567},
  {timestamp: new Date("2016-01-14T00:00:00"), bytes: 56756, requests: 244},
  {timestamp: new Date("2016-01-15T00:00:00"), bytes: 55466, requests: 455},
  {timestamp: new Date("2016-01-16T00:00:00"), bytes: 43456, requests: 456},
  {timestamp: new Date("2016-01-17T00:00:00"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-01-18T00:00:00"), bytes: 53456, requests: 233},
  {timestamp: new Date("2016-01-19T00:00:00"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-01-20T00:00:00"), bytes: 54766, requests: 546},
  {timestamp: new Date("2016-01-21T00:00:00"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-01-22T00:00:00"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-01-23T00:00:00"), bytes: 23456, requests: 567},
  {timestamp: new Date("2016-01-24T00:00:00"), bytes: 26756, requests: 244},
  {timestamp: new Date("2016-01-25T00:00:00"), bytes: 25466, requests: 455},
  {timestamp: new Date("2016-01-26T00:00:00"), bytes: 23456, requests: 456},
  {timestamp: new Date("2016-01-27T00:00:00"), bytes: 27454, requests: 544},
  {timestamp: new Date("2016-01-28T00:00:00"), bytes: 23456, requests: 456},
  {timestamp: new Date("2016-01-29T00:00:00"), bytes: 27454, requests: 544},
  {timestamp: new Date("2016-01-30T00:00:00"), bytes: 23456, requests: 233},
  {timestamp: new Date("2016-01-31T00:00:00"), bytes: 24675, requests: 435},
  {timestamp: new Date("2016-02-01T00:00:00"), bytes: 34766, requests: 546},
  {timestamp: new Date("2016-02-02T00:00:00"), bytes: 34766, requests: 546},
  {timestamp: new Date("2016-02-03T00:00:00"), bytes: 34675, requests: 435},
  {timestamp: new Date("2016-02-04T00:00:00"), bytes: 34336, requests: 345},
  {timestamp: new Date("2016-02-05T00:00:00"), bytes: 33456, requests: 567},
  {timestamp: new Date("2016-02-06T00:00:00"), bytes: 36756, requests: 244},
  {timestamp: new Date("2016-02-07T00:00:00"), bytes: 35466, requests: 455},
  {timestamp: new Date("2016-02-08T00:00:00"), bytes: 33456, requests: 233},
  {timestamp: new Date("2016-02-09T00:00:00"), bytes: 37454, requests: 544},
  {timestamp: new Date("2016-02-10T00:00:00"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-02-11T00:00:00"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-02-12T00:00:00"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-02-13T00:00:00"), bytes: 53456, requests: 567},
  {timestamp: new Date("2016-02-14T00:00:00"), bytes: 56756, requests: 244},
  {timestamp: new Date("2016-02-15T00:00:00"), bytes: 55466, requests: 455},
  {timestamp: new Date("2016-02-16T00:00:00"), bytes: 53456, requests: 456},
  {timestamp: new Date("2016-02-17T00:00:00"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-02-18T00:00:00"), bytes: 53456, requests: 233},
  {timestamp: new Date("2016-02-19T00:00:00"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-02-20T00:00:00"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-02-21T00:00:00"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-02-22T00:00:00"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-02-23T00:00:00"), bytes: 43456, requests: 567},
  {timestamp: new Date("2016-02-24T00:00:00"), bytes: 46756, requests: 244},
  {timestamp: new Date("2016-02-25T00:00:00"), bytes: 45466, requests: 455},
  {timestamp: new Date("2016-02-26T00:00:00"), bytes: 43456, requests: 456},
  {timestamp: new Date("2016-02-27T00:00:00"), bytes: 37454, requests: 544},
  {timestamp: new Date("2016-02-28T00:00:00"), bytes: 33456, requests: 456}
]

const fakeAverageData = [
  {timestamp: new Date("2016-01-01T00:00:00"), bytes: 39405, requests: 943},
  {timestamp: new Date("2016-01-02T00:00:00"), bytes: 34766, requests: 546},
  {timestamp: new Date("2016-01-03T00:00:00"), bytes: 34675, requests: 435},
  {timestamp: new Date("2016-01-04T00:00:00"), bytes: 34336, requests: 345},
  {timestamp: new Date("2016-01-05T00:00:00"), bytes: 33456, requests: 567},
  {timestamp: new Date("2016-01-06T00:00:00"), bytes: 36756, requests: 244},
  {timestamp: new Date("2016-01-07T00:00:00"), bytes: 35466, requests: 455},
  {timestamp: new Date("2016-01-08T00:00:00"), bytes: 33456, requests: 233},
  {timestamp: new Date("2016-01-09T00:00:00"), bytes: 37454, requests: 544},
  {timestamp: new Date("2016-01-10T00:00:00"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-01-11T00:00:00"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-01-12T00:00:00"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-01-13T00:00:00"), bytes: 53456, requests: 567},
  {timestamp: new Date("2016-01-14T00:00:00"), bytes: 56756, requests: 244},
  {timestamp: new Date("2016-01-15T00:00:00"), bytes: 55466, requests: 455},
  {timestamp: new Date("2016-01-16T00:00:00"), bytes: 53456, requests: 456},
  {timestamp: new Date("2016-01-17T00:00:00"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-01-18T00:00:00"), bytes: 53456, requests: 233},
  {timestamp: new Date("2016-01-19T00:00:00"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-01-20T00:00:00"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-01-21T00:00:00"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-01-22T00:00:00"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-01-23T00:00:00"), bytes: 43456, requests: 567},
  {timestamp: new Date("2016-01-24T00:00:00"), bytes: 46756, requests: 244},
  {timestamp: new Date("2016-01-25T00:00:00"), bytes: 45466, requests: 455},
  {timestamp: new Date("2016-01-26T00:00:00"), bytes: 43456, requests: 456},
  {timestamp: new Date("2016-01-27T00:00:00"), bytes: 37454, requests: 544},
  {timestamp: new Date("2016-01-28T00:00:00"), bytes: 33456, requests: 456},
  {timestamp: new Date("2016-01-29T00:00:00"), bytes: 37454, requests: 544},
  {timestamp: new Date("2016-01-30T00:00:00"), bytes: 33456, requests: 233},
  {timestamp: new Date("2016-01-31T00:00:00"), bytes: 34675, requests: 435},
  {timestamp: new Date("2016-02-01T00:00:00"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-02-02T00:00:00"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-02-03T00:00:00"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-02-04T00:00:00"), bytes: 44336, requests: 345},
  {timestamp: new Date("2016-02-05T00:00:00"), bytes: 43456, requests: 567},
  {timestamp: new Date("2016-02-06T00:00:00"), bytes: 46756, requests: 244},
  {timestamp: new Date("2016-02-07T00:00:00"), bytes: 45466, requests: 455},
  {timestamp: new Date("2016-02-08T00:00:00"), bytes: 43456, requests: 233},
  {timestamp: new Date("2016-02-09T00:00:00"), bytes: 47454, requests: 544},
  {timestamp: new Date("2016-02-10T00:00:00"), bytes: 54766, requests: 546},
  {timestamp: new Date("2016-02-11T00:00:00"), bytes: 54675, requests: 435},
  {timestamp: new Date("2016-02-12T00:00:00"), bytes: 54336, requests: 456},
  {timestamp: new Date("2016-02-13T00:00:00"), bytes: 53456, requests: 567},
  {timestamp: new Date("2016-02-14T00:00:00"), bytes: 56756, requests: 244},
  {timestamp: new Date("2016-02-15T00:00:00"), bytes: 55466, requests: 455},
  {timestamp: new Date("2016-02-16T00:00:00"), bytes: 43456, requests: 456},
  {timestamp: new Date("2016-02-17T00:00:00"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-02-18T00:00:00"), bytes: 53456, requests: 233},
  {timestamp: new Date("2016-02-19T00:00:00"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-02-20T00:00:00"), bytes: 54766, requests: 546},
  {timestamp: new Date("2016-02-21T00:00:00"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-02-22T00:00:00"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-02-23T00:00:00"), bytes: 23456, requests: 567},
  {timestamp: new Date("2016-02-24T00:00:00"), bytes: 26756, requests: 244},
  {timestamp: new Date("2016-02-25T00:00:00"), bytes: 25466, requests: 455},
  {timestamp: new Date("2016-02-26T00:00:00"), bytes: 23456, requests: 456},
  {timestamp: new Date("2016-02-27T00:00:00"), bytes: 27454, requests: 544},
  {timestamp: new Date("2016-02-28T00:00:00"), bytes: 23456, requests: 456}
]

const fakeDifferenceData = [0, 0, 1, -1, 0, 0, 1, -1, -1, 1]

export class Hosts extends React.Component {
  constructor(props) {
    super(props);

    this.createNewHost = this.createNewHost.bind(this)
    this.deleteHost = this.deleteHost.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.toggleAddHost = this.toggleAddHost.bind(this)
    this.state = {
      activeFilter: 'traffic_high_to_low',
      addHost: false
    }
  }
  componentWillMount() {
    this.props.hostActions.startFetching()
    this.props.hostActions.fetchHosts(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group
    )
    this.props.accountActions.fetchAccount(
      this.props.params.brand,
      this.props.params.account
    )
    this.props.groupActions.fetchGroup(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group
    )
  }
  createNewHost(id) {
    this.props.hostActions.createHost(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      id
    )
    this.toggleAddHost()
  }
  deleteHost(id) {
    this.props.hostActions.deleteHost(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      id
    )
  }
  toggleAddHost() {
    this.setState({
      addHost: !this.state.addHost
    })
  }
  handleSelectChange() {
    return value => {
      this.setState({
        activeFilter: value
      })
    }
  }
  render() {
    return (
      <PageContainer className='hosts-container content-subcontainer'>
        <Content>
          <PageHeader>
            <ButtonToolbar className="pull-right">
              <Button bsStyle="success" className="btn-icon">
                <Link to={`/analysis`}><IconChart /></Link>
              </Button>

              <Button bsStyle="primary" className="btn-icon btn-add-new"
                onClick={this.toggleAddHost}>
                <IconAdd />
              </Button>

              <Select
                onSelect={this.handleSelectChange()}
                value={this.state.activeFilter}
                options={[
                  ['traffic_high_to_low', 'Traffic High to Low'],
                  ['traffic_low_to_high', 'Traffic Low to High']]}/>

              <Button bsStyle="primary" className={'btn-icon btn-round toggle-view' +
                (this.props.viewingChart ? ' hidden' : '')}
                onClick={this.props.uiActions.toggleChartView}>
                <IconItemChart/>
              </Button>
              <Button bsStyle="primary" className={'btn-icon toggle-view' +
                (!this.props.viewingChart ? ' hidden' : '')}
                onClick={this.props.uiActions.toggleChartView}>
                <IconItemList/>
              </Button>
            </ButtonToolbar>

            <p>GROUP CONTENT SUMMARY</p>
            <h1>
              {this.props.activeGroup ?
                this.props.activeGroup.get('name')
                : 'Loading...'}
            </h1>
          </PageHeader>

          <div className="container-fluid body-content">
            <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
              <li>
                <Link to={`/content/groups/udn/${this.props.params.account}`}>
                  {this.props.activeAccount ?
                    this.props.activeAccount.get('name')
                    : 'Loading...'}
                </Link>
              </li>
                <li className="active">
                {this.props.activeGroup ?
                  this.props.activeGroup.get('name')
                  : 'Loading...'}
              </li>
            </ol>

            {this.props.fetching ? <p>Loading...</p> : (
              <ReactCSSTransitionGroup
                component="div"
                className="content-transition"
                transitionName="content-transition"
                transitionEnterTimeout={400}
                transitionLeaveTimeout={500}>
                {this.props.viewingChart ?
                  <div className="content-item-grid">
                    {this.props.hosts.map((host, i) =>
                      <ContentItemChart key={i} id={host}
                        linkTo={`/property/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${encodeURIComponent(host).replace(/\./g, "%2e")}`}
                        configurationLink={`/configuration/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${encodeURIComponent(host).replace(/\./g, "%2e")}`}
                        analyticsLink={`/analytics/property/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${encodeURIComponent(host).replace(/\./g, "%2e")}`}
                        name={host} description="Desc"
                        delete={this.deleteHost}
                        primaryData={fakeRecentData}
                        secondaryData={fakeAverageData}
                        differenceData={fakeDifferenceData}
                        barWidth="1"
                        chartWidth="480"
                        barMaxHeight="80" />
                    )}
                  </div> :
                  <div className="content-item-lists" key="lists">
                    {this.props.hosts.map((host, i) =>
                      <ContentItemList key={i} id={host}
                        linkTo={`/property/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${encodeURIComponent(host).replace(/\./g, "%2e")}`}
                        configurationLink={`/configuration/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${encodeURIComponent(host).replace(/\./g, "%2e")}`}
                        name={host} description="Desc"
                        primaryData={fakeRecentData}
                        secondaryData={fakeAverageData}/>
                    )}
                  </div>
                }
              </ReactCSSTransitionGroup>
            )}

            {this.state.addHost ?
              <Modal show={true} dialogClassName="configuration-sidebar"
                backdrop={false}
                onHide={this.toggleAddHost}>
                <Modal.Header>
                  <h1>Add Property</h1>
                  <p>Lorem ipsum dolor</p>
                </Modal.Header>
                <Modal.Body>
                  <AddHost createHost={this.createNewHost}
                    cancelChanges={this.toggleAddHost}/>
                </Modal.Body>
              </Modal> : null
            }
          </div>
        </Content>
      </PageContainer>
    );
  }
}

Hosts.displayName = 'Hosts'
Hosts.propTypes = {
  accountActions: React.PropTypes.object,
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  fetching: React.PropTypes.bool,
  groupActions: React.PropTypes.object,
  hostActions: React.PropTypes.object,
  hosts: React.PropTypes.instanceOf(Immutable.List),
  params: React.PropTypes.object,
  uiActions: React.PropTypes.object,
  viewingChart: React.PropTypes.bool
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    hosts: state.host.get('allHosts'),
    fetching: state.host.get('fetching'),
    viewingChart: state.ui.get('viewingChart')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    groupActions: bindActionCreators(groupActionCreators, dispatch),
    hostActions: bindActionCreators(hostActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Hosts);
