import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Modal, Button, ButtonToolbar, BreadcrumbItem, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router'

import * as groupActionCreators from '../redux/modules/group'
import * as uiActionCreators from '../redux/modules/ui'
import EditGroup from '../components/edit-group'
import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import PageHeader from '../components/layout/page-header'
import ContentItemList from '../components/content-item-list'
import ContentItemChart from '../components/content-item-chart'
import Select from '../components/select'
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

export class Groups extends React.Component {
  constructor(props) {
    super(props);

    this.changeActiveGroupValue = this.changeActiveGroupValue.bind(this)
    this.saveActiveGroupChanges = this.saveActiveGroupChanges.bind(this)
    this.cancelActiveGroupChanges = this.cancelActiveGroupChanges.bind(this)
    this.toggleActiveGroup = this.toggleActiveGroup.bind(this)
    this.createNewGroup = this.createNewGroup.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.state = {
      activeFilter: 'traffic_high_to_low'
    }
  }
  componentWillMount() {
    this.props.groupActions.startFetching()
    this.props.groupActions.fetchGroups(
      this.props.params.brand,
      this.props.params.account
    )
  }
  toggleActiveGroup(id) {
    return () => {
      if(this.props.activeGroup && this.props.activeGroup.get('group_id') === id){
        this.props.groupActions.changeActiveGroup(null)
      }
      else {
        this.props.groupActions.fetchGroup(
          this.props.params.brand,
          this.props.params.account,
          id
        )
      }
    }
  }
  changeActiveGroupValue(valPath, value) {
    this.props.groupActions.changeActiveGroup(
      this.props.activeGroup.setIn(valPath, value)
    )
  }
  saveActiveGroupChanges() {
    this.props.groupActions.updateGroup(
      this.props.params.brand,
      this.props.params.account,
      this.props.activeGroup.toJS()
    )
  }
  cancelActiveGroupChanges() {
    this.props.groupActions.changeActiveGroup(null)
  }
  createNewGroup() {
    this.props.groupActions.createGroup(
      this.props.params.brand,
      this.props.params.account
    )
  }
  deleteGroup(id) {
    this.props.groupActions.deleteGroup(
      this.props.params.brand,
      this.props.params.account,
      id
    )
  }
  handleSelectChange() {
    return value => {
      this.setState({
        activeFilter: value
      })
    }
  }
  render() {
    const activeGroup = this.props.activeGroup
    return (
      <PageContainer className='groups-container content-subcontainer'>
        <Content>
          <PageHeader>
            <ButtonToolbar className="pull-right">
              <Button bsStyle="success" className="btn-icon">
                <Link to={`/analysis/`}>
                  <IconChart/>
                </Link>
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

            <p>ACCOUNT CONTENT SUMMARY</p>
            <h1>Account Name</h1>
          </PageHeader>

          <div className="container-fluid body-content">
            <Breadcrumb>
              <BreadcrumbItem active={true}>Account Name</BreadcrumbItem>
            </Breadcrumb>
            {this.props.fetching ? <p>Loading...</p> : (
              this.props.viewingChart ?
                <div className="content-item-grid">
                  {this.props.groups.map((group, i) =>
                    <ContentItemChart key={i} id={group}
                      linkTo={`/content/hosts/${this.props.params.brand}/${this.props.params.account}/${group}`}
                      name="Name" description="Desc"
                      delete={this.deleteGroup}
                      primaryData={fakeRecentData}
                      secondaryData={fakeAverageData}
                      barWidth="1"
                      chartWidth="560"
                      barMaxHeight="80" />
                  )}
                </div> :
                this.props.groups.map((group, i) =>
                  <ContentItemList key={i} id={group}
                    linkTo={`/content/hosts/${this.props.params.brand}/${this.props.params.account}/${group}`}
                    name="Name" description="Desc"
                    delete={this.deleteGroup}
                    primaryData={fakeRecentData}
                    secondaryData={fakeAverageData}/>
                )
            )}

            {activeGroup ?
              <Modal show={true} dialogClassName="configuration-sidebar"
                backdrop={false}
                onHide={this.toggleActiveGroup(activeGroup.get('group_id'))}>
                <Modal.Header>
                  <h1>Edit Group</h1>
                  <p>Lorem ipsum dolor</p>
                </Modal.Header>
                <Modal.Body>
                  <EditGroup group={activeGroup}
                    changeValue={this.changeActiveGroupValue}
                    saveChanges={this.saveActiveGroupChanges}
                    cancelChanges={this.toggleActiveGroup(activeGroup.get('group_id'))}/>
                </Modal.Body>
              </Modal> : null
            }
          </div>
        </Content>
      </PageContainer>
    );
  }
}

Groups.displayName = 'Groups'
Groups.propTypes = {
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  fetching: React.PropTypes.bool,
  groupActions: React.PropTypes.object,
  groups: React.PropTypes.instanceOf(Immutable.List),
  params: React.PropTypes.object,
  uiActions: React.PropTypes.object,
  viewingChart: React.PropTypes.bool
}

function mapStateToProps(state) {
  return {
    activeGroup: state.group.get('activeGroup'),
    groups: state.group.get('allGroups'),
    fetching: state.group.get('fetching'),
    viewingChart: state.ui.get('viewingChart')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    groupActions: bindActionCreators(groupActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
