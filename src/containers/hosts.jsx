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
  {bytes: 25287}, {bytes: 75693}, {bytes: 56217}, {bytes: 37567}, {bytes: 68967},
  {bytes: 59482}, {bytes: 39528}, {bytes: 44277}, {bytes: 23870}, {bytes: 38097},
  {bytes: 34104}, {bytes: 34667}, {bytes: 45348}, {bytes: 75675}, {bytes: 31596},
  {bytes: 72447}, {bytes: 40786}, {bytes: 48403}, {bytes: 37584}, {bytes: 20450},
  {bytes: 29754}, {bytes: 25254}, {bytes: 76117}, {bytes: 62423}, {bytes: 21843},
  {bytes: 36684}, {bytes: 63311}, {bytes: 62746}, {bytes: 25277}, {bytes: 77866},
  {bytes: 63733}, {bytes: 63783}, {bytes: 67777}, {bytes: 27648}, {bytes: 52272},
  {bytes: 55867}, {bytes: 25465}, {bytes: 39901}, {bytes: 76743}, {bytes: 33717},
  {bytes: 39363}, {bytes: 49430}, {bytes: 44985}, {bytes: 22980}, {bytes: 57023},
  {bytes: 29188}, {bytes: 77510}, {bytes: 47095}, {bytes: 22737}, {bytes: 46752},
  {bytes: 74066}, {bytes: 69258}, {bytes: 22229}, {bytes: 71488}, {bytes: 78918}
]

const fakeAverageData = [
  {bytes: 34667}, {bytes: 45348}, {bytes: 75675}, {bytes: 31596}, {bytes: 72447},
  {bytes: 40786}, {bytes: 48403}, {bytes: 52272}, {bytes: 55867}, {bytes: 25465},
  {bytes: 39901}, {bytes: 77866}, {bytes: 59482}, {bytes: 39528}, {bytes: 44277},
  {bytes: 37584}, {bytes: 20450}, {bytes: 22980}, {bytes: 57023}, {bytes: 29188},
  {bytes: 67777}, {bytes: 27648}, {bytes: 76743}, {bytes: 33717}, {bytes: 39363},
  {bytes: 78918}, {bytes: 66433}, {bytes: 77510}, {bytes: 47095}, {bytes: 22737},
  {bytes: 29754}, {bytes: 25254}, {bytes: 76117}, {bytes: 46752}, {bytes: 74066},
  {bytes: 69258}, {bytes: 22229}, {bytes: 62423}, {bytes: 21843}, {bytes: 36684},
  {bytes: 63311}, {bytes: 62746}, {bytes: 25277}, {bytes: 23870}, {bytes: 38097},
  {bytes: 63733}, {bytes: 63783}, {bytes: 25287}, {bytes: 49430}, {bytes: 44985},
  {bytes: 71488}, {bytes: 75693}, {bytes: 56217}, {bytes: 37567},{bytes: 68967}
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
                        configurationLink={`/configuration/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/${encodeURIComponent(host).replace(/\./g, "%2e")}`}
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
