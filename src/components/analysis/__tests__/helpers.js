import { Map } from 'immutable'

jest.unmock('../helpers.js')
import { getTrafficByDateRangeLabel } from '../helpers.js'


const dateMap = Map({ startDate: 1234, endDate: 4321 })
const dateRangeLabel = "label"
const formatMessage = jest.fn()

describe('AnalysisHorizontalBar', () => {
  it('should exist', () => {
    expect(getTrafficByDateRangeLabel).toBeTruthy();
  })

  it('should not fail when all arguments is passed', () => {
    expect(getTrafficByDateRangeLabel(dateMap, dateRangeLabel, formatMessage)).toBeTruthy();
  })

  it('should not fail when dateRangeLabel is not passed', () => {
    expect(getTrafficByDateRangeLabel(dateMap, '', formatMessage)).toBeTruthy();
  })

  it('should not fail when dateMap is empty', () => {
    expect(getTrafficByDateRangeLabel(new Map, '', formatMessage)).toBeTruthy();
  })
})
