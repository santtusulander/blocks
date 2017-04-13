import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../matcher.jsx')
import Matcher from '../matcher.jsx'

const fakeConfig = Immutable.fromJS({
  type: 'equals',
  value: '123'
})

const fakePath = Immutable.List(['foo', 'bar'])

describe('Matcher', () => {
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
      match: fakeConfig,
      path: fakePath
    }

    component = shallow(<Matcher {...props} />)
  })
  it('should exist', () => {
    expect(component).toBeDefined()
  })

  //TODO-2277

  // it('should update the state as changes happen', () => {
  //   let changeValue = jest.fn()
  //   let matcher = shallow(
  //     <Matcher
  //       changeValue={changeValue}
  //       match={fakeConfig}
  //       path={fakePath}/>
  //   )
  //   let inputs = matcher.find('FormControl')
  //   inputs.at(0).simulate('change', { target: { value: 'new' } })
  //   expect(matcher.state('val')).toEqual('new')
  // })

  // it('should update the parameters as select change happens', () => {
  //   let changeValue = jest.fn()
  //   let matcher = shallow(
  //     <Matcher
  //       changeValue={changeValue}
  //       match={fakeConfig}
  //       path={fakePath}/>
  //   )
  //   expect(matcher.state('activeFilter')).toBe('exists')
  //   matcher.instance().handleMatchesChange('foo')
  //   expect(matcher.state('activeFilter')).toBe('foo')
  // })

  // it('should save changes', () => {
  //   const changeValue = jest.fn()
  //   const close = jest.fn()
  //   let matcher = shallow(
  //     <Matcher
  //       changeValue={changeValue}
  //       match={fakeConfig}
  //       path={fakePath}
  //       close={close}/>
  //   )
  //   matcher.setState({
  //     val: 'aaa'
  //   })
  //   matcher.instance().saveChanges()
  //   expect(close.mock.calls.length).toBe(1)
  //   expect(changeValue.mock.calls[0][0]).toEqual(Immutable.List(['foo', 'bar']))
  //   expect(changeValue.mock.calls[0][1]).toEqual(Immutable.fromJS({
  //     "cases": [["aaa", undefined]]
  //   }))
  // })

  // it('should include the rule selector by default', () => {
  //   const changeValue = jest.fn()
  //   const close = jest.fn()
  //   const matcher = shallow(
  //     <Matcher
  //       changeValue={changeValue}
  //       match={fakeConfig}
  //       path={fakePath}
  //       close={close}/>
  //   )
  //   const inputSelects = matcher.find('Select')
  //   expect(inputSelects.length).toEqual(1)
  // })

  // it('should be able to hide the rule selector', () => {
  //   const changeValue = jest.fn()
  //   const close = jest.fn()
  //   const matcher = shallow(
  //     <Matcher
  //       changeValue={changeValue}
  //       match={fakeConfig}
  //       path={fakePath}
  //       close={close}
  //       disableRuleSelector={true}/>
  //   )
  //   const inputSelects = matcher.find('Select')
  //   expect(inputSelects.length).toEqual(0)
  // })

  // it('should validate for "exists" matches', () => {
  //   const changeValue = jest.fn()
  //   const close = jest.fn()
  //   const matcher = shallow(
  //     <Matcher
  //       changeValue={changeValue}
  //       match={fakeConfig}
  //       path={fakePath}
  //       close={close}
  //       disableRuleSelector={true}/>
  //   )
  //   matcher.instance().handleMatchesChange('exists')
  //   expect(matcher.instance().validate()).toBe(true)
  // })

  // it('should validate for "contains" matches', () => {
  //   const changeValue = jest.fn()
  //   const close = jest.fn()
  //   const matcher = shallow(
  //     <Matcher
  //       changeValue={changeValue}
  //       match={fakeConfig}
  //       path={fakePath}
  //       close={close}
  //       disableRuleSelector={true}/>
  //   )

  //   matcher.instance().handleMatchesChange('contains')
  //   expect(matcher.instance().validate()).toBe(false)
  //   matcher.instance().handleValChange({ target: { value: 'aaa' } })
  //   matcher.instance().handleContainsValChange({ target: { value: 'bbb' } })
  //   expect(matcher.instance().validate()).toBe(true)

  //   matcher.instance().handleContainsValChange({ target: { } })
  //   matcher.instance().handleMatchesChange('does_not_contain')
  //   expect(matcher.instance().validate()).toBe(false)
  //   matcher.instance().handleValChange({ target: { value: 'ccc' } })
  //   matcher.instance().handleContainsValChange({ target: { value: 'ddd' } })
  //   expect(matcher.instance().validate()).toBe(true)
  // })
})
