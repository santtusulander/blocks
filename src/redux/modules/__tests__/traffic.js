jest.unmock('../traffic.js')
jest.unmock('moment')

import Immutable from 'immutable'
import {
  totalsFetchSuccess,
  totalsFetchFailure,
  trafficByTimeSuccess,
  trafficByTimeFailure,
  trafficByCountrySuccess,
  trafficByCountryFailure,
  trafficOnOffNetSuccess,
  trafficOnOffNetFailure,
  trafficOnOffNetTodaySuccess,
  trafficOnOffNetTodayFailure,
  trafficServiceProvidersSuccess,
  trafficServiceProvidersFailure,
  trafficStorageSuccess,
  trafficStorageFailure,
  trafficStartFetch,
  trafficFinishFetch
  } from '../traffic.js'

describe('Traffic Module', () => {
    let state, timestamp;


    beforeEach( () => {
      timestamp = new Date().toISOString();

      state = Immutable.fromJS({
        traffic: [],
        byTime: [],
        byCountry: [],
        onOffNet: [],
        onOffNetToday: [],
        serviceProviders: [],
        storage: [],
      });
    })

    it('should handle totalsFetchSuccess', () => {
      const newState = totalsFetchSuccess(state, {payload: {data:  [{account: 1, totals: [{avg_fbl: '0 ms'}] }] }})

      expect(newState.get('totals').count() ).toBe(1);
    })

    it('should handle totalsFetchFailure', () => {
      const newState = totalsFetchFailure(state, {payload: {data:  [{value: 'test', timestamp: timestamp}] } })

      expect(newState.get('traffic').count() ).toBe(0);
    })

    it('should handle trafficByTimeSuccess', () => {
      const newState = trafficByTimeSuccess(state, {payload: {data: {totals: {}, details: [{value: 'test', timestamp: timestamp}] }} })

      expect(newState.get('byTime').count() ).toBe(2);
    })

    it('should handle trafficByTimeFailure', () => {
      const newState = trafficByTimeFailure(state, {payload: {data:  [{value: 'test', timestamp: timestamp}] } })

      expect(newState.get('byTime').count() ).toBe(0);
    })

    it('should handle trafficByCountrySuccess', () => {
      const newState = trafficByCountrySuccess(state, {payload: {data:  { countries: [{value: 'test'} ] } }})

      expect(newState.get('byCountry').count() ).toBe(1);

    })

    it('should handle trafficByCountryFailure', () => {
      const newState = trafficByCountryFailure(state, {payload: {data:  { countries: [{value: 'test'} ] } }})

      expect(newState.get('byCountry').count() ).toBe(0);

    })

    it('should handle trafficOnOffNetSuccess', () => {
      const newState = trafficOnOffNetSuccess(state, {payload: {data:  {detail: [{value: 'test', timestamp: timestamp}] } }} )

      expect(newState.get('onOffNet').count() ).toBe(1);

    })
    it('should handle trafficOnOffNetFailure', () => {
      const newState = trafficOnOffNetFailure(state, {payload: {data:  {detail: [{value: 'test', timestamp: timestamp}] } }} )

      expect(newState.get('onOffNet').count() ).toBe(0);

    })
    it('should handle trafficOnOffNetTodaySuccess', () => {
      const newState = trafficOnOffNetTodaySuccess(state, {payload: {data:  [{value: 'test', timestamp: timestamp}] } })

      expect(newState.get('onOffNetToday').count() ).toBe(1);

    })
    it('should handle trafficOnOffNetTodayFailure', () => {
      const newState = trafficOnOffNetTodayFailure(state, {payload: {data:  [{value: 'test', timestamp: timestamp}] } })

      expect(newState.get('onOffNetToday').count() ).toBe(0);

    })
    it('should handle trafficServiceProvidersSuccess', () => {
      const newState = trafficServiceProvidersSuccess(state, {payload: {data:  [{value: 'test', timestamp: timestamp}] } })
      expect(newState.get('contribution').count() ).toBe(1);

    })
    it('should handle trafficServiceProvidersFailure', () => {
      const newState = trafficServiceProvidersFailure(state, {payload: {data:  [{value: 'test', timestamp: timestamp}] } })

      expect(newState.get('serviceProviders').count() ).toBe(0);

    })
    it('should handle trafficStorageSuccess', () => {
      const newState = trafficStorageSuccess(state, {payload: {data:  [{value: 'test', timestamp: timestamp}] } })

      expect(newState.get('storage').count() ).toBe(1);

    })
    it('should handle trafficStorageFailure', () => {
      const newState = trafficStorageFailure(state, {payload: {data:  [{value: 'test', timestamp: timestamp}] } })

      expect(newState.get('storage').count() ).toBe(0);

    })
    it('should handle trafficStartFetch', () => {
      const newState = trafficStartFetch(state)
      expect(newState.get('fetching')).toBeTruthy();

    })
    it('should handle trafficFinishFetch', () => {
      const newState = trafficFinishFetch(state)
      expect(newState.get('fetching')).toBeFalsy();

    })
})
