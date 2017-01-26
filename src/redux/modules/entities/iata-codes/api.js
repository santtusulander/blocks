import axios from 'axios'

export const fetch = () => axios.get('/assets/iata-codes/iata-codes.json')
