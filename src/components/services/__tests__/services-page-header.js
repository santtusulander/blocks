import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../services-page-header.jsx')
import ServicesPageHeader from '../services-page-header.jsx'

function intlMaker() {
  return {
   formatMessage: jest.fn()
  }
}

describe('ServicesPageHeader', () => {
  let subject, error, props = null

  beforeEach(() => {
     subject = () => {
       props = {
         intl: intlMaker()
       }
       return shallow(<ServicesPageHeader {...props}/>)
     }
   })

   it('should exist', () => {
     expect(subject().length).toBe(1)
   })
})
