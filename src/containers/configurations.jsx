import React from 'react'
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
                <tr>
                  <td>modernfamily.com</td>
                  <td>01/01/2016, 12:12pm</td>
                  <td>John Doe</td>
                  <td>Production</td>
                  <td>Disney / ABC</td>
                  <td><a href="#">purge</a> <a href="#">edit</a></td>
                </tr>
                <tr>
                  <td>modernfamily.com</td>
                  <td>01/01/2016, 12:12pm</td>
                  <td>John Doe</td>
                  <td>Production</td>
                  <td>Disney / ABC</td>
                  <td><a href="#">purge</a> <a href="#">edit</a></td>
                </tr>
                <tr>
                  <td>modernfamily.com</td>
                  <td>01/01/2016, 12:12pm</td>
                  <td>John Doe</td>
                  <td>Production</td>
                  <td>Disney / ABC</td>
                  <td><a href="#">purge</a> <a href="#">edit</a></td>
                </tr>
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
  fetching: React.PropTypes.bool
}

export default Configurations
