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

export class Configurations extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePurge: null,
      activeFilter: 'all',
      sortBy: 'last_edited',
      sortDir: -1
    }

    this.activatePurge = this.activatePurge.bind(this)
    this.changeSort = this.changeSort.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.saveActivePurge = this.saveActivePurge.bind(this)
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
  changeSort(column, direction) {
    this.setState({
      sortBy: column,
      sortDir: direction
    })
  }
  handleSelectChange() {
    return value => {
      this.setState({
        activeFilter: value
      })
    }
  }
  saveActivePurge() {
    const purgeProperty = this.props.properties.get(this.state.activePurge)
    this.props.purgeActions.createPurge(
      this.props.params.brand,
      purgeProperty.get('account_id'),
      purgeProperty.get('group_id'),
      purgeProperty.get('property'),
      this.props.activePurge.toJS()
    ).then(() => this.setState({activePurge: null}))
  }
  render() {
    if(this.props.fetching) {
      return <p>Loading...</p>
    }
    const ConfigSorter = ({column, children, reversed}) => <TableSorter
        column={column}
        reversed={reversed}
        activateSort={this.changeSort}
        activeColumn={this.state.sortBy}
        activeDirection={this.state.sortDir}>
        {children}
      </TableSorter>
    const sortedProperties = this.props.properties.sort((a, b) => {
      if(a.get(this.state.sortBy) < b.get(this.state.sortBy)) {
        return -1 * this.state.sortDir
      }
      else if(a.get(this.state.sortBy) > b.get(this.state.sortBy)) {
        return 1 * this.state.sortDir
      }
      return 0
    })
    return (
      <PageContainer className="configurations-container">
        <Content>
          <PageHeader>
            <ButtonToolbar className="pull-right">
              <Input className="search" type="text" placeholder="Search" />
              <Button bsStyle="primary" className="btn-icon add-btn">
                <IconAdd width="30" height="30" />
              </Button>
              <Select onSelect={this.handleSelectChange()}
                value={this.state.activeFilter}
                options={[
                  ['all', 'Show all properties'],
                  ['1', 'Filter 1'],
                  ['2', 'Filter 2']]}/>
            </ButtonToolbar>

            <p>CONFIGURE</p>
            <h1>{this.props.properties.size} Properties</h1>
          </PageHeader>

          <div className="container-fluid">
            <Table striped={true}>
              <thead>
                <tr>
                  <ConfigSorter column="property">
                    Hostname
                  </ConfigSorter>
                  <ConfigSorter column="last_edited" reversed={true}>
                    Last Edited
                  </ConfigSorter>
                  <th>
                    By
                  </th>
                  <ConfigSorter column="status">
                    Status
                  </ConfigSorter>
                  <th>
                    Active Version
                  </th>
                  <th>
                    Belongs To
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sortedProperties.map((property, i) => {
                  const propertyAccount = this.props.accounts.find(account => {
                    return account.get('account_id') == property.get('account_id')
                  })
                  const propertyGroup = this.props.groups.find(group => {
                    return group.get('group_id') == property.get('group_id')
                  })
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
                      <td>
                        {propertyAccount ? propertyAccount.get('name') : ''}
                        &nbsp;/&nbsp;
                        {propertyGroup ? propertyGroup.get('name') : ''}
                      </td>
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
  activePurge: React.PropTypes.instanceOf(Immutable.Map),
  fetching: React.PropTypes.bool,
  groups: React.PropTypes.instanceOf(Immutable.List),
  params: React.PropTypes.object,
  properties: React.PropTypes.instanceOf(Immutable.List),
  purgeActions: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
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
