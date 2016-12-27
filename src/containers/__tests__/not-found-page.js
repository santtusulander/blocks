import React from 'react';
import { shallow } from 'enzyme'
import { FormattedMessage } from 'react-intl'

jest.unmock('../not-found-page.jsx');
import NotFoundPage from '../not-found-page.jsx'

function intlMaker() {
  return {
   formatMessage: jest.fn()
  }
}

describe('NotFoundPage', function() {
  let subject = null
  const history = {}

  beforeEach(() => {
    subject = () => {
      return shallow(<NotFoundPage history={history} intl={intlMaker()}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should have a page not found message', () => {
    expect(subject().contains(<FormattedMessage id="portal.notFound.pageNotFound.text"/>));
  })

  it('should have a button', () => {
    expect(subject().find('button.primary').contains(<FormattedMessage id="portal.button.goBack"/>));
  })
})
