import React from 'react'
import Immutable from 'immutable'
import moment from 'moment'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {Table} from 'react-bootstrap'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import PageHeader from '../components/layout/page-header'

export class Configurations extends React.Component {
  render() {
    if(this.props.fetching) {
      return <p>Loading...</p>
    }
    return (
      <PageContainer className="configurations-container">
        <Content>
          <PageHeader>
            <h1>242 Properties</h1>

            <div className="pull-right">
              Search | Filter
            </div>
          </PageHeader>

          <div className="container-fluid">
            <Table striped={true}>
              <thead>
                <tr>
                  <th>Hostname</th>
                  <th>Last Edited</th>
                  <th>By</th>
                  <th>Status</th>
                  <th>Belongs To</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.props.properties.map((property, i) => {
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
                      <td>
                        {propertyAccount ? propertyAccount.get('name') : ''}
                        &nbsp;/&nbsp;
                        {propertyGroup ? propertyGroup.get('name') : ''}
                      </td>
                      <td>
                        {property.get('status') === 'production' ?
                          <a href="#">
                            purge
                          </a>
                        : ''} <a href="#">
                          edit
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        </Content>
      </PageContainer>
    );
  }
}

Configurations.displayName = 'Configurations'
Configurations.propTypes = {
  accounts: React.PropTypes.instanceOf(Immutable.List),
  fetching: React.PropTypes.bool,
  groups: React.PropTypes.instanceOf(Immutable.List),
  properties: React.PropTypes.instanceOf(Immutable.List)
}

function mapStateToProps(state) {
  return {
    accounts: state.content.get('accounts'),
    fetching: state.content.get('fetching'),
    groups: state.content.get('groups'),
    properties: state.content.get('properties')
  };
}

export default connect(mapStateToProps)(Configurations);
