import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'
import { shallow } from 'enzyme'
import Select from '../../../select'

jest.unmock('../matcher.jsx')
jest.unmock('../../../../util/policy-config.js')
const Matcher = require('../matcher.jsx')

const fakeConfig = Immutable.fromJS({
  "cases": [["foo"]]
})

const fakePath = Immutable.List(['foo', 'bar'])

describe('Matcher', () => {
  it('should exist', () => {
    let matcher = shallow(
      <Matcher
        match={fakeConfig}
        path={fakePath}/>
    )
    expect(TestUtils.isCompositeComponent(matcher)).toBeTruthy()
  })

  it('should update the state as changes happen', () => {
    let changeValue = jest.fn()
    let matcher = TestUtils.renderIntoDocument(
      <Matcher
        changeValue={changeValue}
        match={fakeConfig}
        path={fakePath}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(matcher, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(matcher.state.val).toEqual('new')
  })

  it('should update the parameters as select change happens', () => {
    let changeValue = jest.fn()
    let matcher = shallow(
      <Matcher
        changeValue={changeValue}
        match={fakeConfig}
        path={fakePath}/>
    )
    expect(matcher.state('activeFilter')).toBe('exists')
    matcher.instance().handleMatchesChange('foo')
    expect(matcher.state('activeFilter')).toBe('foo')
  })

  it('should save changes', () => {
    const changeValue = jest.fn()
    const close = jest.fn()
    let matcher = shallow(
      <Matcher
        changeValue={changeValue}
        match={fakeConfig}
        path={fakePath}
        close={close}/>
    )
    matcher.setState({
      val: 'aaa'
    })
    matcher.instance().saveChanges()
    expect(close.mock.calls.length).toBe(1)
    expect(changeValue.mock.calls[0][0]).toEqual(Immutable.List(['foo', 'bar']))
    expect(changeValue.mock.calls[0][1]).toEqual(Immutable.fromJS({
      "cases": [["aaa", undefined]]
    }))
  })

  it('should be able to hide the rule selector', () => {
    const changeValue = jest.fn()
    const close = jest.fn()
    const matcher = shallow(
      <Matcher
        changeValue={changeValue}
        match={fakeConfig}
        path={fakePath}
        close={close}
        disableRuleSelector={true}/>
    )
    const inputSelects = matcher.find('#input-select')
    expect(inputSelects.length).toEqual(0)
  })
})
