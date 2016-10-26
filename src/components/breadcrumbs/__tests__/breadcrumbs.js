import React from 'react'
import { render } from 'enzyme'

jest.unmock('../breadcrumbs.jsx')
import { Breadcrumbs } from '../breadcrumbs.jsx'
const fakeLinks = [{
  label: 'aaa',
  url: 'bbb'
}]

describe('Breadcrumbs', () => {
  it('should exist', () => {
    const breadcrumbs = render(<Breadcrumbs links={fakeLinks}/>);
    expect(breadcrumbs).toBeDefined();
  });

  it('can be passed links', () => {
    const breadcrumbs = render(<Breadcrumbs links={fakeLinks}/>);
    expect(breadcrumbs.find('li').length).toBe(1)
  });

  it('should have last link active', () => {
    const breadcrumbs = render(<Breadcrumbs links={fakeLinks}/>);
    expect(breadcrumbs.find('li')[0].attribs.class).toBe('active')
  });
})
