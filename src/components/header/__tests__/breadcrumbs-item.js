import React from 'react';
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../breadcrumbs-item.jsx')
import BreadcrumbsItem from '../breadcrumbs-item.jsx'

describe('BreadcrumbsItem', function() {
  let subject = null

  const defaultUser = new Immutable.Map()

  beforeEach(() => {
    subject = (props) => {
      let defaultProps = {
        user: defaultUser
      }

      const finalProps = Object.assign({}, defaultProps, props)
      return shallow(<BreadcrumbsItem {...finalProps}/>)
    }
  })

  it('should exist', () => {
    const component = subject()
    expect(component).toBeDefined()
  })
})
