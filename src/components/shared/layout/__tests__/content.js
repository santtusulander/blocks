import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../content.jsx')
import Content from '../content.jsx'

describe('Content layout', () => {
  let subject = null

  beforeEach(() => {
    subject = (className = 'test', child = (<div></div>)) => {
      return shallow(<Content className={className}> {child} </Content>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBeTruthy()
  })

  it('can be passed a custom css class', () => {
    expect(subject('className').find('.className').length).toBeTruthy()
  })

  it('renders a child', () => {
    expect(subject('', (<span className="test"></span>)).find('.test').length).toBeTruthy()
  })
})
