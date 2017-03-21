import React from 'react'
import { Button, ButtonToolbar, Modal } from 'react-bootstrap'
import Immutable from 'immutable'

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
    // this.props.changeValue(
    //   this.props.path,
    //   this.state.updatedSet
    // )
    this.props.saveAction(this.props.path, this.props.setKey, this.state.updatedSet)

  }
  updateSet(set) {
    this.setState({ updatedSet: set })
  }
  render() {
    return (
      <div>
        <Modal.Header>
          <h1>Cache Key - Query String</h1>
        </Modal.Header>
        <Modal.Body>

          <CacheKeyQueryStringForm
            intl={this.props.intl}
            set={this.state.updatedSet}
            updateSet={this.updateSet}/>

          <ButtonToolbar className="text-right">
            <Button className="btn-secondary" id="close-button" onClick={this.props.close}>
              <FormattedMessage id="portal.button.cancel"/>
            </Button>
            <Button bsStyle="primary" id="save-button" onClick={this.saveChanges}>
              <FormattedMessage id="portal.button.saveAction"/>
            </Button>
          </ButtonToolbar>

        </Modal.Body>
      </div>
    )
  }
}

CacheKeyQueryString.displayName = 'CacheKeyQueryString'
CacheKeyQueryString.propTypes = {
  changeValue: React.PropTypes.func,
  close: React.PropTypes.func,
  intl: React.PropTypes.object,
  path: React.PropTypes.instanceOf(Immutable.List),
  set: React.PropTypes.instanceOf(Immutable.Map)
}

export default injectIntl(CacheKeyQueryString)
