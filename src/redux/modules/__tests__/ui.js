import { fromJS, is } from 'immutable'

jest.unmock('../ui.js')
jest.unmock('../../../constants/status-codes.js')

import {
  accountManagementModalToggled,
  analysisStatusCodeToggled,
  themeChanged,
  chartViewToggled,
  notificationChanged,
  analysisServiceTypeToggled,
  analysisOnOffNetChartChanged,
  analysisSPChartChanged,
  contentItemSorted,
  errorDialogShown,
  errorDialogHidden,
  defaultUI,
  docBody
} from '../ui.js'

describe('UI Module', () => {
  let state = null;
  beforeEach(() => {
    state = defaultUI
  })

  it('should handle account management modal toggled', () => {
    const newState = accountManagementModalToggled(state, { payload: 'modal1' });
    expect(newState.get('accountManagementModal')).toBe('modal1');
  });

  it('should handle status code toggled in analysis', () => {
    let newState = analysisStatusCodeToggled(state, { payload: 404 });
    expect(newState.get('analysisErrorStatusCodes').includes(404)).toBeFalsy();
  });

  it('should handle theme change', () => {
    const newState = themeChanged(state, { payload: 'light' });
    expect(docBody.className).toBe('light-theme');
    expect(newState.get('theme')).toBe('light');
  });

  it('should handle chart view toggle', () => {
    const newState = chartViewToggled(state);
    expect(newState.get('viewingChart')).toBeFalsy();
  });

  it('should handle notification change', () => {
    const newState = notificationChanged(state, { payload: 'test' });
    expect(newState.get('notification')).toBe('test');
  });

  it('should handle on/off net chart type change in analysis', () => {
    const newState = analysisOnOffNetChartChanged(state, {payload: 'foo' });
    expect(newState.get('analysisOnOffNetChartType')).toBe('foo');
  });

  it('should handle service type change in analysis', () => {
    const newState = analysisServiceTypeToggled(state, { payload: 'aaa' });
    expect(newState.get('analysisServiceTypes').includes('aaa')).toBeTruthy();
  });

  it('should handle SP chart change in analysis', () => {
    const newState = analysisSPChartChanged(state, {payload: 'foo' });
    expect(newState.get('analysisSPChartType')).toBe('foo');
  });

  it('should handle content item sorting', () => {
    const newState = contentItemSorted(state, {payload: { direction: 0, valuePath: ['foo', 'bar'] } });
    expect(is(newState.get('contentItemSortValuePath'), fromJS(['foo', 'bar']))).toBeTruthy();
    expect(newState.get('contentItemSortDirection')).toBe(0);
  });

  it('should handle showing error dialog', () => {
    const newState = errorDialogShown(state);
    expect(newState.get('showErrorDialog')).toBeTruthy();
  });

  it('should handle hiding error dialog', () => {
    const newState = errorDialogHidden(state);
    expect(newState.get('showErrorDialog')).toBeFalsy();
  });
});
