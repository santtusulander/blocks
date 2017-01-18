import React from 'react'
import { Button, ButtonToolbar, ControlLabel, FormGroup, Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import Typeahead from 'react-bootstrap-typeahead'
import Immutable from 'immutable'

import {
  FILE_EXTENSION_CASE_START,
  FILE_EXTENSION_CASE_END
} from '../../../util/policy-config'

class FileExtension extends React.Component {
  constructor(props) {
    super(props)

    this.handleExtensionsChange = this.handleExtensionsChange.bind(this)
    this.saveChanges = this.saveChanges.bind(this)

    const extensions = this.extensionsFromMatchCase(props.match)

    this.state = {
      extensions,
      isValid: this.validate(extensions)
    }
  }
  extensionsFromMatchCase(match) {
    const matchCase = match.getIn(['cases', 0, 0])
    const rawExtensionList = matchCase.substring(
      FILE_EXTENSION_CASE_START.length,
      matchCase.length - FILE_EXTENSION_CASE_END.length
    )
    return rawExtensionList.split('|').map(extension => { return { id: extension, label: extension } })
  }
  matchCaseFromExtensions(extensions) {
    const rawExtensions = extensions.map(extension => extension.label)
    return FILE_EXTENSION_CASE_START + rawExtensions.join('|') + FILE_EXTENSION_CASE_END
  }
  handleExtensionsChange() {
    return extensions => {
      this.setState({
        extensions,
        isValid: this.validate(extensions)
      })
    }
  }
  validate(extensions) {
    if (!extensions || !(extensions instanceof Array)) {
      return false
    }

    if (extensions.length === 0) {
      return false
    }

    // extensions should not include the . at the beginning, this is included in the regex
    const invalidInput = extensions.filter(extension => extension.label.substring(0, 1) === '.')

    if (invalidInput.length > 0) {
      return false
    }

    return true
  }
  saveChanges() {
    const matchCase = this.matchCaseFromExtensions(this.state.extensions)
    let newMatch = this.props.match
    newMatch = newMatch.setIn(['cases', 0, 0], matchCase)

    this.props.changeValue(this.props.path, newMatch)
    this.props.close()
  }
  render() {
    const {
      extensions,
      isValid
    } = this.state

    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.fileExtension.header"/></h1>
          <p><FormattedMessage id="portal.policy.edit.fileExtension.disclaimer.text"/></p>
        </Modal.Header>
        <Modal.Body>

          <FormGroup controlId="matches_file-extension">
            <ControlLabel>
              <FormattedMessage id="portal.policy.edit.fileExtension.fileExtension.text" />
            </ControlLabel>
            <Typeahead
              allowNew={true}
              multiple={true}
              onChange={this.handleExtensionsChange()}
              options={[]}
              selected={extensions}
            />
          </FormGroup>

          <ButtonToolbar className="text-right">
            <Button className="btn-secondary" onClick={this.props.close}>
              <FormattedMessage id="portal.policy.edit.policies.cancel.text" />
            </Button>
            <Button bsStyle="primary" onClick={this.saveChanges} disabled={!isValid}>
              <FormattedMessage id="portal.policy.edit.policies.saveMatch.text" />
            </Button>
          </ButtonToolbar>

        </Modal.Body>
      </div>
    )
  }
}

FileExtension.displayName = 'FileExtension'
FileExtension.propTypes = {
  changeValue: React.PropTypes.func,
  close: React.PropTypes.func,
  match: React.PropTypes.instanceOf(Immutable.Map),
  path: React.PropTypes.array
}

module.exports = FileExtension
