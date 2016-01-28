import React from 'react'
import {Table, Button} from 'react-bootstrap'

class ConfigurationCacheRules extends React.Component {
  render() {
    return (
      <div className="configuration-default-policies">
        <Table striped={true} bordered={true} hover={true}>
          <thead>
            <tr>
              <th>Rule Priority</th>
              <th>Rule Type</th>
              <th>Rule</th>
              <th>TTL Value</th>
              <th>Match Condition</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>extension</td>
              <td>gif</td>
              <td>1 day</td>
              <td>positive</td>
              <td><a href="#">edit</a> <a href="#">delete</a></td>
            </tr>
            <tr>
              <td>2</td>
              <td>directory</td>
              <td>/wp-content</td>
              <td>no-store</td>
              <td>positive</td>
              <td><a href="#">edit</a> <a href="#">delete</a></td>
            </tr>
            <tr>
              <td>3</td>
              <td>MIME-type</td>
              <td>text/html</td>
              <td>15 min</td>
              <td>positive</td>
              <td><a href="#">edit</a> <a href="#">delete</a></td>
            </tr>
          </tbody>
        </Table>

        <Button bsStyle="primary">Add Cache Rule</Button>
      </div>
    )
  }
}

ConfigurationCacheRules.displayName = 'ConfigurationCacheRules'
ConfigurationCacheRules.propTypes = {}

module.exports = ConfigurationCacheRules
