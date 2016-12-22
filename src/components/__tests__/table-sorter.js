import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../table-sorter')
import TableSorter from '../table-sorter'

const subject = shallow(
  <TableSorter />
)

describe('TableSorter', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
