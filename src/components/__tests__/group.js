import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../group.jsx')
import Group from '../group.jsx'

describe('Group', () => {
  it('should exist', () => {
    let group = TestUtils.renderIntoDocument(
      <table>
        <tbody>
          <Group group={Immutable.Map()}/>
        </tbody>
      </table>
    );
    let tr = group.getElementsByTagName('tr')
    expect(tr.length).toEqual(1);
  })
  it('should delete', () => {
    let deleteFunc = jest.genMockFunction()
    let deleteGroup = TestUtils.renderIntoDocument(
      <table>
        <tbody>
          <Group group={Immutable.Map()} delete={deleteFunc}/>
        </tbody>
      </table>
    )
    let links = deleteGroup.getElementsByTagName('a')
    TestUtils.Simulate.click(links[0])
    expect(deleteFunc.mock.calls.length).toEqual(1)
  })
  it('should toggle active', () => {
    let toggleActive = jest.genMockFunction()
    let group = TestUtils.renderIntoDocument(
      <table>
        <tbody>
          <Group group={Immutable.Map()} toggleActive={toggleActive}/>
        </tbody>
      </table>
    )
    let tr = group.getElementsByTagName('tr')
    TestUtils.Simulate.click(tr[0])
    expect(toggleActive.mock.calls.length).toEqual(1)
  })
})
