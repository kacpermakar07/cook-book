import axios from 'axios'

export const RECIPES_BASE_URL = 'https://dummyjson.com'

export const axiosClient = axios.create({
  baseURL: RECIPES_BASE_URL,
})
