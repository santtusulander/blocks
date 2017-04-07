import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import Immutable from 'immutable'

import FormFooterButtons from '../../shared/form-elements/form-footer-buttons'
import CacheKeyQueryStringForm from './cache-key-query-string-form'

import {FormattedMessage, injectIntl} from 'react-intl'

class CacheKeyQueryString extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      updatedSet: props.set
    }

    this.saveChanges = this.saveChanges.bind(this)
    this.updateSet = this.updateSet.bind(this)
  }
  saveChanges() {
    this.props.saveAction(this.props.path, this.props.setKey, this.state.updatedSet)
  }
  updateSet(set) {
    this.setState({ updatedSet: set })
  }
  render() {
    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.defaults.cacheKeyQueryString.text"/></h1>
        </Modal.Header>
        <Modal.Body>

          <CacheKeyQueryStringForm
            intl={this.props.intl}
            set={this.state.updatedSet}
            updateSet={this.updateSet}/>

          <FormFooterButtons>
            <Button className="btn-secondary" id="close-button" onClick={this.props.close}>
              <FormattedMessage id="portal.button.cancel"/>
            </Button>
            <Button bsStyle="primary" id="save-button" onClick={this.saveChanges}>
              <FormattedMessage id="portal.button.saveAction"/>
            </Button>
          </FormFooterButtons>

        </Modal.Body>
      </div>
    )
  }
}

CacheKeyQueryString.displayName = 'CacheKeyQueryString'
CacheKeyQueryString.propTypes = {
  close: React.PropTypes.func,
  intl: React.PropTypes.object,
  path: React.PropTypes.instanceOf(Immutable.List),
  saveAction: React.PropTypes.func,
  set: React.PropTypes.instanceOf(Immutable.Map),
  setKey: React.PropTypes.string
}

export default injectIntl(CacheKeyQueryString)
