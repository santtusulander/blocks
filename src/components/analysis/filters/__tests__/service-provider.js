import React from 'react'
import {shallow} from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../service-provider.jsx')
import ServiceProvider from '../service-provider.jsx'

const fakeOptions = Immutable.List([
  Immutable.Map({
    id: 1,
    name: 'foo'
  })
])

describe('FilterServiceProvider', () => {
  it('should exist', () => {
    const filter = shallow(<ServiceProvider visibleFields={['service-provider']} options={fakeOptions}/>)
    expect(filter.length).toBe(1)
  })
})
