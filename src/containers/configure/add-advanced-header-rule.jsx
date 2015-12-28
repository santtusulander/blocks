import React from 'react'

// React-Bootstrap
// ===============

import {
  Button,
  ButtonToolbar,
  Input,
  Panel,
} from 'react-bootstrap';


class AddAdvancedHeaderRule extends React.Component {
  onSubmit() {
    alert('form submitted');
  }
  render() {
    return (
      <div className="container">

        <h1 className="page-header">Configure - Add Advanced Header Rule</h1>

          <form onSubmit={this.onSubmit}>

            <Panel>


            {/* Add Match */}

            <Input type="checkbox" id="configure__edge__add-advanced-header-rule__add-match" label="Add Match" />


            {/* Match Action */}

            <Input type="select" id="configure__edge__add-advanced-header-rule__match-action" label="Match Action">
              <option value="1">Add</option>
              <option value="2">Delete</option>
              <option value="3">Modify</option>
            </Input>


            {/* Match */}

            <Input type="select" id="configure__edge__add-advanced-header-rule__match" label="Match">
              <option value="1">Client IP</option>
              <option value="2">Hostname</option>
              <option value="3">Path</option>
              <option value="4">Query String</option>
              <option value="5">Response Header</option>
              <option value="6">Response Code</option>
              <option value="7">User-Agent</option>
            </Input>


            {/* Match Condition */}

            <Input type="select" id="configure__edge__add-advanced-header-rule__match-condition" label="Match Condition">
              <option value="1">Matches</option>
              <option value="2">Does not Match</option>
            </Input>


            {/* Match Value */}

            <Input type="text" id="configure__edge__add-advanced-header-rule__match-value" label="Match Value" />


            {/* Value */}

            <Input type="text" id="configure__edge__add-advanced-header-rule__value" label="Value" />


            {/* Action buttons */}

            <ButtonToolbar className="text-center">
              <Button>Cancel</Button>
              <Button type="submit" bsStyle="primary">Add</Button>
            </ButtonToolbar>

          </Panel>


          {/* Action buttons */}

          <ButtonToolbar>
            <Button>Save</Button>
            <Button>Cancel</Button>
            <Button type="submit" bsStyle="primary">Publish</Button>
          </ButtonToolbar>

        </form>

      </div>
    );
  }
}

AddAdvancedHeaderRule.displayName = 'AddAdvancedHeaderRule'
AddAdvancedHeaderRule.propTypes = {}

module.exports = AddAdvancedHeaderRule
