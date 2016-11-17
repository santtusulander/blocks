jest.unmock('../page-header.jsx')
jest.unmock('classnames')

import React from 'react'
import { shallow } from 'enzyme'
import PageHeader from '../page-header.jsx'


describe('Page Header layout', () => {
  let subject = null
  beforeEach(() => {
    subject = (distCols, secPageHeader, pageSubTitle) => {
      let props = {
        children: [<div key='child' id='child'/>],
        className: 'aa',
        distributedColumns: distCols || false,
        pageHeaderDetailsUpdated: ['a', 'b', 'c'],
        pageHeaderDetailsDeployed: ['a', 'b', 'c'],
        pageSubTitle,
        secondaryPageHeader: secPageHeader || false
      }
      return shallow(<PageHeader {...props}/>)
    }
  })
  it('should exist', () => {
    expect(subject().length).toBe(1)
  });

  it('can be passed a custom css class', () => {
    expect(subject().find('.aa').length).toBe(1)
  });

  it('can be passed a custom additional classes', () => {
    expect(subject(true, true).find('.secondary-page-header .distributed-columns').length).toBe(1)
  });

  it('renders page header updated details', () => {
    const component = subject()
    expect(component.find('#updated-0').length).toBe(1)
    expect(component.find('#updated-1').length).toBe(1)
    expect(component.find('#updated-2').length).toBe(1)
  });

  it('renders page header deployed details', () => {
    const component = subject()
    expect(component.find('#deployed-0').length).toBe(1)
    expect(component.find('#deployed-1').length).toBe(1)
    expect(component.find('#deployed-2').length).toBe(1)
  });

  it('renders a child', () => {
    expect(subject().find('#child').length).toBe(1)
  });
})
