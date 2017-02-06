import axios from 'axios'

const iataCodeUrl = process.env.PUBLIC_URL || '/'

export const fetch = () => axios.get(`${iataCodeUrl}assets/iata-codes/iata-codes.json`)
