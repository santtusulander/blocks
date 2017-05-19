import React from 'react'
import { shallow } from 'enzyme'
import { Map } from 'immutable'

import Services from '../services.jsx'

const MockedChild = () => {
  return (<div>{'Mocked Child'}</div>)
}

jest.unmock('../services.jsx')

function fakeRouterMaker() {
  return {
    isActive: jest.fn()
  }
}

function fakeChildrenMaker() {
  return <li>{'Child1'}</li>
}

let params = {
  group: 'group'
}

const subject = () => {
  return shallow(
    <Services
      params={params}
      activeAccount={Map()}
      activeGroup={Map()}
      router={fakeRouterMaker()}
     >
      <MockedChild route={{ path: 'asd' }}/>
    </Services>)
}

describe('Services', () => {
  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
