import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Modal, Button, ButtonToolbar, BreadcrumbItem, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import * as hostActionCreators from '../redux/modules/host'
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
  {timestamp: new Date("2016-01-01"), bytes: 49405, requests: 943},
  {timestamp: new Date("2016-01-02"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-01-03"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-01-04"), bytes: 44336, requests: 345},
  {timestamp: new Date("2016-01-05"), bytes: 43456, requests: 567},
  {timestamp: new Date("2016-01-06"), bytes: 46756, requests: 244},
  {timestamp: new Date("2016-01-07"), bytes: 45466, requests: 455},
  {timestamp: new Date("2016-01-08"), bytes: 43456, requests: 233},
  {timestamp: new Date("2016-01-09"), bytes: 47454, requests: 544},
  {timestamp: new Date("2016-01-10"), bytes: 54766, requests: 546},
  {timestamp: new Date("2016-01-11"), bytes: 54675, requests: 435},
  {timestamp: new Date("2016-01-12"), bytes: 54336, requests: 456},
  {timestamp: new Date("2016-01-13"), bytes: 53456, requests: 567},
  {timestamp: new Date("2016-01-14"), bytes: 56756, requests: 244},
  {timestamp: new Date("2016-01-15"), bytes: 55466, requests: 455},
  {timestamp: new Date("2016-01-16"), bytes: 43456, requests: 456},
  {timestamp: new Date("2016-01-17"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-01-18"), bytes: 53456, requests: 233},
  {timestamp: new Date("2016-01-19"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-01-20"), bytes: 54766, requests: 546},
  {timestamp: new Date("2016-01-21"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-01-22"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-01-23"), bytes: 23456, requests: 567},
  {timestamp: new Date("2016-01-24"), bytes: 26756, requests: 244},
  {timestamp: new Date("2016-01-25"), bytes: 25466, requests: 455},
  {timestamp: new Date("2016-01-26"), bytes: 23456, requests: 456},
  {timestamp: new Date("2016-01-27"), bytes: 27454, requests: 544},
  {timestamp: new Date("2016-01-28"), bytes: 23456, requests: 456},
  {timestamp: new Date("2016-01-29"), bytes: 27454, requests: 544},
  {timestamp: new Date("2016-01-30"), bytes: 23456, requests: 233},
  {timestamp: new Date("2016-01-31"), bytes: 24675, requests: 435},
  {timestamp: new Date("2016-02-01"), bytes: 34766, requests: 546},
  {timestamp: new Date("2016-02-02"), bytes: 34766, requests: 546},
  {timestamp: new Date("2016-02-03"), bytes: 34675, requests: 435},
  {timestamp: new Date("2016-02-04"), bytes: 34336, requests: 345},
  {timestamp: new Date("2016-02-05"), bytes: 33456, requests: 567},
  {timestamp: new Date("2016-02-06"), bytes: 36756, requests: 244},
  {timestamp: new Date("2016-02-07"), bytes: 35466, requests: 455},
  {timestamp: new Date("2016-02-08"), bytes: 33456, requests: 233},
  {timestamp: new Date("2016-02-09"), bytes: 37454, requests: 544},
  {timestamp: new Date("2016-02-10"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-02-11"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-02-12"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-02-13"), bytes: 53456, requests: 567},
  {timestamp: new Date("2016-02-14"), bytes: 56756, requests: 244},
  {timestamp: new Date("2016-02-15"), bytes: 55466, requests: 455},
  {timestamp: new Date("2016-02-16"), bytes: 53456, requests: 456},
  {timestamp: new Date("2016-02-17"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-02-18"), bytes: 53456, requests: 233},
  {timestamp: new Date("2016-02-19"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-02-20"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-02-21"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-02-22"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-02-23"), bytes: 43456, requests: 567},
  {timestamp: new Date("2016-02-24"), bytes: 46756, requests: 244},
  {timestamp: new Date("2016-02-25"), bytes: 45466, requests: 455},
  {timestamp: new Date("2016-02-26"), bytes: 43456, requests: 456},
  {timestamp: new Date("2016-02-27"), bytes: 37454, requests: 544},
  {timestamp: new Date("2016-02-28"), bytes: 33456, requests: 456}
]

const fakeAverageData = [
  {timestamp: new Date("2016-01-01"), bytes: 39405, requests: 943},
  {timestamp: new Date("2016-01-02"), bytes: 34766, requests: 546},
  {timestamp: new Date("2016-01-03"), bytes: 34675, requests: 435},
  {timestamp: new Date("2016-01-04"), bytes: 34336, requests: 345},
  {timestamp: new Date("2016-01-05"), bytes: 33456, requests: 567},
  {timestamp: new Date("2016-01-06"), bytes: 36756, requests: 244},
  {timestamp: new Date("2016-01-07"), bytes: 35466, requests: 455},
  {timestamp: new Date("2016-01-08"), bytes: 33456, requests: 233},
  {timestamp: new Date("2016-01-09"), bytes: 37454, requests: 544},
  {timestamp: new Date("2016-01-10"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-01-11"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-01-12"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-01-13"), bytes: 53456, requests: 567},
  {timestamp: new Date("2016-01-14"), bytes: 56756, requests: 244},
  {timestamp: new Date("2016-01-15"), bytes: 55466, requests: 455},
  {timestamp: new Date("2016-01-16"), bytes: 53456, requests: 456},
  {timestamp: new Date("2016-01-17"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-01-18"), bytes: 53456, requests: 233},
  {timestamp: new Date("2016-01-19"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-01-20"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-01-21"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-01-22"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-01-23"), bytes: 43456, requests: 567},
  {timestamp: new Date("2016-01-24"), bytes: 46756, requests: 244},
  {timestamp: new Date("2016-01-25"), bytes: 45466, requests: 455},
  {timestamp: new Date("2016-01-26"), bytes: 43456, requests: 456},
  {timestamp: new Date("2016-01-27"), bytes: 37454, requests: 544},
  {timestamp: new Date("2016-01-28"), bytes: 33456, requests: 456},
  {timestamp: new Date("2016-01-29"), bytes: 37454, requests: 544},
  {timestamp: new Date("2016-01-30"), bytes: 33456, requests: 233},
  {timestamp: new Date("2016-01-31"), bytes: 34675, requests: 435},
  {timestamp: new Date("2016-02-01"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-02-02"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-02-03"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-02-04"), bytes: 44336, requests: 345},
  {timestamp: new Date("2016-02-05"), bytes: 43456, requests: 567},
  {timestamp: new Date("2016-02-06"), bytes: 46756, requests: 244},
  {timestamp: new Date("2016-02-07"), bytes: 45466, requests: 455},
  {timestamp: new Date("2016-02-08"), bytes: 43456, requests: 233},
  {timestamp: new Date("2016-02-09"), bytes: 47454, requests: 544},
  {timestamp: new Date("2016-02-10"), bytes: 54766, requests: 546},
  {timestamp: new Date("2016-02-11"), bytes: 54675, requests: 435},
  {timestamp: new Date("2016-02-12"), bytes: 54336, requests: 456},
  {timestamp: new Date("2016-02-13"), bytes: 53456, requests: 567},
  {timestamp: new Date("2016-02-14"), bytes: 56756, requests: 244},
  {timestamp: new Date("2016-02-15"), bytes: 55466, requests: 455},
  {timestamp: new Date("2016-02-16"), bytes: 43456, requests: 456},
  {timestamp: new Date("2016-02-17"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-02-18"), bytes: 53456, requests: 233},
  {timestamp: new Date("2016-02-19"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-02-20"), bytes: 54766, requests: 546},
  {timestamp: new Date("2016-02-21"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-02-22"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-02-23"), bytes: 23456, requests: 567},
  {timestamp: new Date("2016-02-24"), bytes: 26756, requests: 244},
  {timestamp: new Date("2016-02-25"), bytes: 25466, requests: 455},
  {timestamp: new Date("2016-02-26"), bytes: 23456, requests: 456},
  {timestamp: new Date("2016-02-27"), bytes: 27454, requests: 544},
  {timestamp: new Date("2016-02-28"), bytes: 23456, requests: 456}
]

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
            <h1>Group Name</h1>
          </PageHeader>

          <div className="container-fluid body-content">
            <Breadcrumb>
              <BreadcrumbItem>Account Name</BreadcrumbItem>
              <BreadcrumbItem active={true}>Group Name</BreadcrumbItem>
            </Breadcrumb>

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
                        name={host} description="Desc"
                        delete={this.deleteHost}
                        primaryData={fakeRecentData}
                        secondaryData={fakeAverageData}
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
  fetching: React.PropTypes.bool,
  hostActions: React.PropTypes.object,
  hosts: React.PropTypes.instanceOf(Immutable.List),
  params: React.PropTypes.object,
  uiActions: React.PropTypes.object,
  viewingChart: React.PropTypes.bool
}

function mapStateToProps(state) {
  return {
    hosts: state.host.get('allHosts'),
    fetching: state.host.get('fetching'),
    viewingChart: state.ui.get('viewingChart')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hostActions: bindActionCreators(hostActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Hosts);
