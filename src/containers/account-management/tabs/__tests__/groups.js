import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../groups.jsx')
import Groups from '../groups.jsx'

jest.unmock('../../../__mocks__/promisify');
import { promisify } from '../../../__mocks__/promisify'

jest.unmock('../../../__mocks__/router');
import { Router as routerMock } from '../../../__mocks__/router'

const genAsyncMock = jest.genMockFn().mockReturnValue(promisify('whateva'))

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

const fakeGroups = Immutable.fromJS([
  {id: 3, name: 'bbb', created: new Date().getTime()  - 1},
  {id: 1, name: 'aaa', created: new Date().getTime()},
  {id: 2, name: 'ccc', created: new Date().getTime()  + 1},
])

const groupsElem =
  <Groups
    groups={fakeGroups}
    params={{}}
    userActions={{
      fetchUsers: genAsyncMock
    }}
    groupActions={{
      fetchGroups: genAsyncMock
    }}
    router= { routerMock }
    intl={intlMaker()}
  />

describe('AccountManagementAccountGroups', () => {
  it('should exist', () => {
    const groups = shallow(
      groupsElem
    )
    expect(groups.length).toBe(1)
  })

  it('should show groups', () => {
    const groups = shallow(
      groupsElem
    )
    expect(groups.find('tr').length).toBe(4)
  })

  it('should set sort values for table', () => {
    const groups = shallow(
      groupsElem
    )

    groups.instance().changeSort('name', -1)
    expect(groups.state('sortBy')).toBe('name')
    expect(groups.state('sortDir')).toBe(-1)

  })

  it('should sort data by name', () =>{
    const groups = shallow(
      groupsElem
    )

    const sortedData = groups.instance().sortedData(fakeGroups, 'name', 1)
    expect(sortedData.first().get('name')).toBe('aaa')
    const sortedData2 = groups.instance().sortedData(fakeGroups, 'name', -1)
    expect(sortedData2.first().get('name')).toBe('ccc')

  })

  it('should sort date by date', () => {
    const groups = shallow(
      groupsElem
    )
    const sortedData = groups.instance().sortedData(fakeGroups, 'created', 1)
    expect(sortedData.first().get('name')).toBe('bbb')
    const sortedData2 = groups.instance().sortedData(fakeGroups, 'created', -1)
    expect(sortedData2.first().get('name')).toBe('ccc')

  })

  it('should save an added group', () => {
    const addGroup = jest.genMockFn().mockReturnValue(promisify('whateva'))
    const groups = shallow(
      <Groups
        groups={fakeGroups}
        params={{}}
        userActions={{
          fetchUsers: genAsyncMock
        }}
        groupActions={{
          fetchGroups: genAsyncMock
        }}
        router= { routerMock }
        addGroup={ addGroup }
        intl={intlMaker()}
      />
    )

    groups.instance().saveNewGroup({name: 'zzz'})
    expect(addGroup).toBeCalledWith('zzz')
  })

  it('should save an edited group', () => {
    const editGroup = jest.genMockFn().mockReturnValue(promisify('whateva'))
    const groups = shallow(
      <Groups
        groups={fakeGroups}
        params={{}}
        userActions={{
          fetchUsers: genAsyncMock
        }}
        groupActions={{
          fetchGroups: genAsyncMock
        }}
        router= { routerMock }
        editGroup={ editGroup }
        intl={intlMaker()}
      />)

    groups.instance().saveEditedGroup(1)('zzz')
    expect(editGroup.mock.calls[0][0]).toBe(1)
    expect(editGroup.mock.calls[0][1]).toBe('zzz')
  })

  it('should search groups', () => {
    const groups = shallow(
      groupsElem
    )

    const filteredData = groups.instance().filteredData('a')
    expect(filteredData.count()).toBe(1)
    expect(filteredData.first().get('name')).toBe('aaa')
<<<<<<< HEAD
=======

>>>>>>> develop
  })
})
