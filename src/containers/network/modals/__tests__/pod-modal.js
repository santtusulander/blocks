import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../pod-modal')
import PodFormContainer from '../pod-modal'

const subject = shallow(
  <PodFormContainer
    fetchFootprints={jest.fn()}
    initialValues={{}}
  />
)

describe('PodFormContainer', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
