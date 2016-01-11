import React from 'react'
import {Button, Input, Row, Col, Table} from 'react-bootstrap'
import Immutable from 'immutable'

class ConfigurationCache extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }
  handleChange(path) {
    return e => this.props.changeValue(path, e.target.checked)
  }
  handleSave(e) {
    e.preventDefault()
    this.props.saveChanges()
  }
  render() {
    let config = this.props.config;
    if(!config || !config.size) {
      return (
        <div className="container">Loading...</div>
      )
    }
    let policyPath = Immutable.List([
      'response_policies',
      config.get('response_policies')
        .findIndex(policyGroup => policyGroup.has('defaults')),
      'defaults',
      'policies']);
    let policyPaths = {
      honor_origin_cache_policies: policyPath
        .push(
          config.getIn(policyPath)
            .findIndex(policy => policy.has('honor_origin_cache_policies')),
            'honor_origin_cache_policies'),
      ignore_case: policyPath
        .push(
          config.getIn(policyPath)
            .findIndex(policy => policy.has('ignore_case')),
            'ignore_case'),
      honor_etags: policyPath
        .push(
          config.getIn(policyPath)
            .findIndex(policy => policy.has('honor_etags')),
            'honor_etags')
    };
    return (
      <form className="configuration-cache" onSubmit={this.handleSave}>

        {/* Origin Cache Control */}

        <h2>Origin Cache Control</h2>

        <Row>
          <Col xs={12}>

            { /* Honor Origin Cache Control */}

            <Input type="checkbox" label="Honor Origin Cache Control"
              checked={config.getIn(policyPaths.honor_origin_cache_policies)}
              onChange={this.handleChange(policyPaths.honor_origin_cache_policies)}/>

            { /* Ignore case from origin */}

            <Input type="checkbox" label="Ignore case from origin"
              checked={config.getIn(policyPaths.ignore_case)}
              onChange={this.handleChange(policyPaths.ignore_case)}/>

            { /* Enable e-Tag support */}

            <Input type="checkbox" label="Enable e-Tag support"
              checked={config.getIn(policyPaths.honor_etags)}
              onChange={this.handleChange(policyPaths.honor_etags)}/>

          </Col>
        </Row>

        <Button type="submit">Done</Button>


        {/* Edge Cache Control */}

        <h2>Edge Cache Control</h2>


        {/* Default Cache Rules */}

        <h3>Default Cache Rules</h3>

        <Row>
          <Col xs={8}>
            <Table striped={true} bordered={true} hover={true}>
              <thead>
                <tr>
                  <th>Rule Type</th>
                  <th>TTL Value</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>DEFAULT</td>
                  <td>no-store</td>
                  <td><a href="#">edit</a></td>
                </tr>
                <tr>
                  <td>Error Response</td>
                  <td>10 s</td>
                  <td><a href="#">edit</a></td>
                </tr>
                <tr>
                  <td>Redirect</td>
                  <td>no-store</td>
                  <td><a href="#">edit</a></td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>


        {/* CDN Cache Rules */}

        <h3>CDN Cache Rules</h3>

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
      </form>
    )
  }
}

ConfigurationCache.displayName = 'ConfigurationCache'
ConfigurationCache.propTypes = {
  changeValue: React.PropTypes.func,
  config: React.PropTypes.instanceOf(Immutable.Map),
  saveChanges: React.PropTypes.func
}

module.exports = ConfigurationCache
