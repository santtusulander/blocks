import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../pagination-hoc.jsx')
import WithPagination from '../pagination-hoc'

const WrappedComponent = () => (<FakeComponent />);
const WithPaginationComponent = WithPagination(WrappedComponent)

let subject = null;

describe('WithPaginationComponent', () => {
  beforeEach(() => {
    subject = (props) => shallow(<WithPaginationComponent {...{props}} />);
  });

  it('should exist', () => expect(subject().length).toBe(1));
});

describe('WithPaginationDecorator', () => {
  beforeEach(() => {
    subject = (config = {}) => WithPagination(WrappedComponent, config)
  })

  it('should accept config object as second parameter', () => {
    expect(subject({}).defaultProps).toBeDefined();
  })

  it('config should be merged with default props', () => {
    const config = {fields: ['a', 'b', 'c']};
    expect(subject(config).defaultProps.fields).toEqual(config.fields);
  })
});

