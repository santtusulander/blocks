import React from 'react'

// React-Bootstrap
// ===============

import {
  Button,
  ButtonToolbar,
  Input,
  Panel
} from 'react-bootstrap';


class Purge extends React.Component {
  onSubmit() {
    alert('form submitted');
  }
  render() {
    return (
      <div className="container">

        <h1 className="page-header">Configure - Purge</h1>

        <form onSubmit={this.onSubmit}>


          {/* SECTION - What do you want to remove? */}

          <Panel>

            <h2>What do you want to remove?</h2>


            {/* A URL */}

            <Input type="textarea" id="configure__purge__url" label="A URL"
              placeholder="http://www.foo.com/logo.gif"
              help="List of up to 100 URLs that need to be purged. Separated by space or comma." />


            {/* A directory */}

            <Input type="text" id="configure__purge__directory"
              label="A directory" placeholder="/images/*" />

          </Panel>


          {/* SECTION - Content Removal Method */}

          <Panel>

            <h2>Content Removal Method</h2>


            {/* Invalidate content on platform */}

            <Input type="radio" name="configure__purge__content-removal-method"
              label="Invalidate content on platform" />


            {/* Delete content from platform */}

            <Input type="radio" name="configure__purge__content-removal-method"
              label="Delete content from platform" />

          </Panel>


          {/* SECTION - Notification */}

          <Panel>

            <h2>Notification</h2>


            {/* Don't send me any notification upon completion */}

            <Input type="radio" name="configure__purge__notification"
              label="Don't send me any notification upon completion" />


            {/* Send me an email when the purge is completed */}

            <Input type="radio" name="configure__purge__notification"
              label="Send me an email when the purge is completed" />


            {/* Email Address */}

            <Input type="text" id="configure__purge__email-address"
              label="Email Address" />

          </Panel>


          {/* Action buttons */}

          <ButtonToolbar className="text-center">
            <Button>Clear Form</Button>
            <Button type="submit" bsStyle="primary">Submit</Button>
          </ButtonToolbar>

        </form>

      </div>
    );
  }
}

Purge.displayName = 'Purge'
Purge.propTypes = {}

module.exports = Purge
