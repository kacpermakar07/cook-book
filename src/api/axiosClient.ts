import Constants from 'expo-constants';
import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: Constants.expoConfig?.extra?.API_URL,
});
