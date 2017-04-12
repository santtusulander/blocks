import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../cache.jsx')
import Cache from '../cache.jsx'

const fakeConfig = Immutable.fromJS({
  "value": [["foo"]]
})

const fakePath = Immutable.fromJS(['foo', 'bar'])

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('Cache', () => {
  let handleSubmit, close, change, component

  beforeEach(() => {
    handleSubmit = jest.fn()
    close = jest.fn()
    change = jest.fn()

    let props = {
      change,
      handleSubmit,
      close,
      invalid: false,
      set: Immutable.Map(),
      intl: intlMaker(),
      saveAction: jest.fn()
    }

    component = shallow(<Cache {...props} />)
  })

  it('should exist', () => {
    expect(component).toBeTruthy();
  })

//TODO-2277

  // it('should update the state as changes happen', () => {
  //   let changeValue = jest.genMockFunction()
  //   let cache = shallow(
  //     <Cache changeValue={changeValue} set={fakeConfig} path={fakePath}
  //       intl={intlMaker()}/>
  //   )
  //   const inputs = cache.find('FormControl')
  //   inputs.at(0).simulate('change', {target: {value: 'new'}})
  //   expect(cache.state('maxAge')).toEqual('new')
  // })

  // it('should save changes', () => {
  //   const changeValue = jest.genMockFunction()
  //   const close = jest.genMockFunction()
  //   const expectedSave = Immutable.fromJS({
  //     cases: [[ "foo" ]],
  //     check_etag: 'aaa',
  //     honor_origin: 'bbb',
  //     max_age: 123,
  //     no_store: 'ddd'
  //   })
  //   let cache = shallow(
  //     <Cache changeValue={changeValue} set={fakeConfig} path={fakePath}
  //       close={close} intl={intlMaker()}/>
  //   )
  //   cache.setState({
  //     checkEtag: 'aaa',
  //     honorOrigin: 'bbb',
  //     maxAge: '123',
  //     noStore: 'ddd'
  //   })
  //   cache.instance().saveChanges()
  //   expect(changeValue.mock.calls[0][0].toJS()).toEqual(['foo', 'bar'])
  //   expect(Immutable.is(changeValue.mock.calls[0][1], expectedSave)).toBeTruthy()
  //   expect(close.mock.calls.length).toBe(1)
  // })
})
