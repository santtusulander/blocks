import axios from 'axios'

export const fetch = () => axios.get(`${process.env.PUBLIC_URL}assets/iata-codes/iata-codes.json`)
