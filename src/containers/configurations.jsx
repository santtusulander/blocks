import React from 'react'
import Immutable from 'immutable'
import moment from 'moment'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table, Input, Button, ButtonToolbar} from 'react-bootstrap'
import { Link } from 'react-router'

import * as purgeActionCreators from '../redux/modules/purge'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import PageHeader from '../components/layout/page-header'
import PurgeModal from '../components/purge-modal'
import IconAdd from '../components/icons/icon-add.jsx'
import Select from '../components/select'
import TableSorter from '../components/table-sorter'

import { FormattedMessage } from 'react-intl'

export class Configurations extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePurge: null,
      activeFilter: 'all',
      sortBy: 'last_edited',
      sortDir: -1,
      sortFunc: ''
    }

    this.activatePurge = this.activatePurge.bind(this)
    this.changeSort = this.changeSort.bind(this)
    this.sortedData = this.sortedData.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.saveActivePurge = this.saveActivePurge.bind(this)
    this.getPropertyParents = this.getPropertyParents.bind(this)
  }
  activatePurge(property) {
    return e => {
      if(e) {
        e.preventDefault()
      }
      this.setState({activePurge: property})
      this.props.purgeActions.resetActivePurge()
    }
  }
  changeSort(column, direction, sortFunc) {
    this.setState({
      sortBy: column,
      sortDir: direction,
      sortFunc: sortFunc
    })
  }
  sortedData(data, sortBy, sortDir) {
    let sortFunc = ''
    if(this.state.sortFunc === 'parents') {
      sortFunc = data.sort((a, b) => {
        sortBy = sortBy.toString().split(',')
        if(this.getPropertyParents(a) < this.getPropertyParents(b)) {
          return -1 * sortDir
        }
        else if(this.getPropertyParents(a) > this.getPropertyParents(b)) {
          return 1 * sortDir
        }
        return 0
      })
    } else {
      sortFunc = data.sort((a, b) => {
        if(a.get(sortBy) < b.get(sortBy)) {
          return -1 * sortDir
        }
        else if(a.get(sortBy) > b.get(sortBy)) {
          return 1 * sortDir
        }
        return 0
      })
    }
    return sortFunc
  }
  handleSelectChange() {
    return value => {
      this.setState({
        activeFilter: value
      })
    }
  }
  saveActivePurge() {
    const purgeProperty = this.props.properties.find(property => property === this.state.activePurge)
    if(purgeProperty) {
      this.props.purgeActions.createPurge(
        this.props.params.brand,
        this.props.activeAccount.get('id'),
        this.props.activeGroup.get('id'),
        this.state.activePurge,
        this.props.activePurge.toJS()
      ).then(() => this.setState({activePurge: null}))
    }
  }
  getPropertyParents(property) {
    const propertyAccount = this.props.accounts.find(account => {
      return account.get('account_id') == property.get('account_id')
    })
    const propertyGroup = this.props.groups.find(group => {
      return group.get('group_id') == property.get('group_id')
    })
    let parents = (propertyAccount ? propertyAccount.get('name') : '')
    parents = parents + ' / '
    parents = parents + (propertyGroup ? propertyGroup.get('name') : '')
    return parents
  }
  render() {
    if(this.props.fetching) {
      return <p>Loading...</p>
    }
    const sorterProps = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }
    const sortedProperties = this.sortedData(this.props.properties, this.state.sortBy, this.state.sortDir)
    return (
      <PageContainer className="configurations-container">
        <Content>
          <PageHeader>
            <ButtonToolbar className="pull-right">
              <Button bsStyle="primary" className="btn-icon add-btn">
                <IconAdd width="30" height="30" />
              </Button>
              <Input className="search" type="text" placeholder="Search" />
              <Select onSelect={this.handleSelectChange()}
                value={this.state.activeFilter}
                options={[
                  ['all', <FormattedMessage id="portal.configurationList.showAll.text"/>],
                  ['1', <FormattedMessage id="portal.configurationList.filter1.text"/>],
                  ['2', <FormattedMessage id="portal.configurationList.filter2.text"/>]]}/>
            </ButtonToolbar>

            <p><FormattedMessage id="portal.configurationList.configure.text"/></p>
            <h1>{this.props.properties.size} Properties</h1>
          </PageHeader>

          <div className="container-fluid">
            <Table striped={true}>
              <thead>
                <tr>
                  <TableSorter {...sorterProps} column="property">
                    <FormattedMessage id="portal.configurationList.hostname.text"/>
                  </TableSorter>
                  <TableSorter {...sorterProps} column="last_edited" reversed={true}>
                    <FormattedMessage id="portal.configurationList.lastEdited.text"/>
                  </TableSorter>
                  <TableSorter {...sorterProps} column="last_editor">
                    <FormattedMessage id="portal.configurationList.by.text"/>
                  </TableSorter>
                  <TableSorter {...sorterProps} column="status">
                    <FormattedMessage id="portal.configurationList.status.text"/>
                  </TableSorter>
                  <TableSorter {...sorterProps} column="active_version">
                    <FormattedMessage id="portal.configurationList.activeVersion.text"/>
                  </TableSorter>
                  <TableSorter {...sorterProps} column="parents" sortFunc="parents">
                    <FormattedMessage id="portal.configurationList.belongsTo.text"/>
                  </TableSorter>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sortedProperties.map((property, i) => {
                  return (
                    <tr key={i}>
                      <td>{property.get('property')}</td>
                      <td>
                        {moment(property.get('last_edited'), 'X')
                          .format('MM/DD/YYYY, h:mm a')}
                      </td>
                      <td>{property.get('last_editor')}</td>
                      <td>{property.get('status')}</td>
                      <td>{property.get('active_version')}</td>
                      <td>{this.getPropertyParents(property)}</td>
                      <td>
                        {property.get('status') === 'production' ?
                          <a href="#" onClick={this.activatePurge(property.get('property'))}>
                            purge
                          </a>
                        : ''}
                        <Link to={`/content/configuration/${this.props.params.brand}/${property.get('account_id')}/${property.get('group_id')}/${property.get('property')}`}>
                          edit
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        </Content>
        {this.state.activePurge !== null ?
          <PurgeModal
            activePurge={this.props.activePurge}
            changePurge={this.props.purgeActions.updateActivePurge}
            hideAction={this.activatePurge(null)}
            savePurge={this.saveActivePurge}/> : ''}
      </PageContainer>
    );
  }
}

Configurations.displayName = 'Configurations'
Configurations.propTypes = {
  accounts: React.PropTypes.instanceOf(Immutable.List),
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  activePurge: React.PropTypes.instanceOf(Immutable.Map),
  fetching: React.PropTypes.bool,
  groups: React.PropTypes.instanceOf(Immutable.List),
  params: React.PropTypes.object,
  properties: React.PropTypes.instanceOf(Immutable.List),
  purgeActions: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    accounts: state.content.get('accounts'),
    activePurge: state.purge.get('activePurge'),
    fetching: state.content.get('fetching'),
    groups: state.content.get('groups'),
    properties: state.content.get('properties')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    purgeActions: bindActionCreators(purgeActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Configurations);
