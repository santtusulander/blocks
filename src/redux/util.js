export const urlBase = ''
export const topoBase = 'http://localhost:3000/assets/topo'
export const analyticsBase = 'http://localhost:3000/analytics'

export const parseResponseData = response => response ? response.data : null

export function mapReducers(next, err) {
  if(!next || !err) {
    throw Error('Expects next and throw functions.')
  }
  return {next, throw: err}
}
