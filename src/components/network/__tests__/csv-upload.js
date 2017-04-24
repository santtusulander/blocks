import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../csv-upload')
import CsvUploadArea from '../csv-upload'

describe('CsvUploadArea', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = (className) => {
      props = {
        className: className,
        contentValidation: jest.fn(),
        onDropCompleted: jest.fn(),
        acceptFileTypes: ["text/csv"],
        uploadModalOnClick: true
      }

      return shallow(
        <CsvUploadArea {...props} />
      )
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should reflect class name', () => {
    expect(subject('className').find('.className').length).toBe(1)
  })

  it('should show welcome-text by default ', () => {
    expect(subject('className').find('.welcome-text').length).toBe(1)
  })

  it('should not show welcome-text when there are files ', () => {
    const wrapper = subject('className')
    wrapper.setState({ validFiles: [{name: 'bar', size: 123, lastModified: 123}] })

    expect(wrapper.find('.welcome-text').length).toBe(0)
  })

  it('should render files ', () => {
    const wrapper = subject('className')
    wrapper.setState({ validFiles: [{name: 'bar', size: 123, lastModified: 123}] })

    expect(wrapper.find('.file-detail').length).toBe(1)
  })

  it('should render delete button ', () => {
    const wrapper = subject('className')
    wrapper.setState({ validFiles: [{name: 'bar', size: 123, lastModified: 123}] })

    expect(wrapper.find('IconClose').length).toBe(1)
  })

  it('should render small loading-spinner if validation in progress ', () => {
    const wrapper = subject('className')
    wrapper.setState({ validFiles: [{name: 'bar', size: 123, lastModified: 123}], isValidationInProgress: true })

    expect(wrapper.find('LoadingSpinnerSmall').length).toBe(1)
  })


  it('should not render small loading-spinner if validation is not in progress ', () => {
    const wrapper = subject('className')
    wrapper.setState({ validFiles: [{name: 'bar', size: 123, lastModified: 123}], isValidationInProgress: false })

    expect(wrapper.find('LoadingSpinnerSmall').length).toBe(0)
  })
})
