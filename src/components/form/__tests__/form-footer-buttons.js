import React from 'react';
import { shallow } from 'enzyme'

jest.unmock('../form-footer-buttons.jsx');
import FormFooterButtons from '../form-footer-buttons.jsx'

describe('FormFooterButtons', function() {
  let subject = null

  beforeEach(() => {
    subject = (autoAlign = true, children = [<div className="test" key="test">test</div>]) => {
      const props = {
        autoAlign: autoAlign
      }
      
      return shallow(
        <FormFooterButtons {...props}>
          {children}
        </FormFooterButtons>
      )
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should render div', () => {
    expect(subject().find('.test').length).toBe(1)
  })

  it('should render div with pull-right by default', () => {
    expect(subject().find('.pull-right').length).toBe(1)
  })

  it('should render div without pull-right when autoAlign is false', () => {
    expect(subject(false).find('.pull-right').length).toBe(0)
  })

});
