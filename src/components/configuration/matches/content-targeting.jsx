import React from 'react'
import { Button, ButtonToolbar, Modal } from 'react-bootstrap'
import Immutable from 'immutable'
import { FormattedMessage } from 'react-intl'

import country_list from '../../../constants/country-list'
import Typeahead from '../../../components/typeahead'

class ContentTargeting extends React.Component {
  constructor(props) {
    super(props);

    this.handleIncludeChange = this.handleIncludeChange.bind(this)
    this.handleExcludeChange = this.handleExcludeChange.bind(this)
    this.saveChanges = this.saveChanges.bind(this)

    this.state = {
      includes: [],
      includeOptions: country_list,
      excludes: [],
      excludeOptions: country_list
    }
  }

  handleIncludeChange() {
    return includes => {
      const excludeOptions = country_list.filter(country => includes.indexOf(country) < 0)
      this.setState({
        includes,
        excludeOptions
      })
    }
  }

  handleExcludeChange() {
    return excludes => {
      const includeOptions = country_list.filter(country => excludes.indexOf(country) < 0)
      this.setState({
        excludes,
        includeOptions
      })
    }
  }

  saveChanges() {
    const includes = this.state.includes.map(country => {
      return {
        in: [country.id],
        response: {
          code: 200
        }
      }
    })
    const excludes = this.state.excludes.map(country => {
      return {
        in: [country.id],
        response: {
          code: 401
        }
      }
    })
    const countries = includes.concat(excludes)

    this.props.changeValue(this.props.path, Immutable.fromJS({value: countries}))
    this.props.activateMatch(null)
  }

  render() {
    const {
      includes,
      excludes
    } = this.state

    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.matchesSelection.contentTargeting.text" /></h1>
          <p><FormattedMessage id="portal.policy.edit.policies.matchContentTargeting.text" /></p>
        </Modal.Header>
        <Modal.Body>

          <label><FormattedMessage id="portal.policy.edit.policies.matchContentTargeting.include.text" /></label>
          <Typeahead
            multiple={true}
            onChange={this.handleIncludeChange()}
            selected={includes}
            options={this.state.includeOptions}/>

          <label><FormattedMessage id="portal.policy.edit.policies.matchContentTargeting.exclude.text" /></label>
          <Typeahead
            className="exclude"
            multiple={true}
            onChange={this.handleExcludeChange()}
            selected={excludes}
            options={this.state.excludeOptions}/>

          <hr />

          <ButtonToolbar className="text-right">
            <Button className="btn-secondary" onClick={this.props.close}>
              <FormattedMessage id="portal.policy.edit.policies.cancel.text" />
            </Button>
            <Button bsStyle="primary"
              onClick={this.saveChanges}
              disabled={this.state.includes.length === 0 && this.state.excludes.length === 0}>
              <FormattedMessage id="portal.policy.edit.policies.saveMatch.text" />
            </Button>
          </ButtonToolbar>

        </Modal.Body>
      </div>
    )
  }
}

ContentTargeting.displayName = 'ContentTargeting'
ContentTargeting.propTypes = {
  activateMatch: React.PropTypes.func,
  changeValue: React.PropTypes.func,
  close: React.PropTypes.func,
  path: React.PropTypes.instanceOf(Immutable.List)
}

module.exports = ContentTargeting
