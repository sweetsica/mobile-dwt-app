import axios from 'axios';
import queryString from 'query-string';
import AsyncStorage from '@react-native-async-storage/async-storage';
const apiUrl = 'https://dwt-be.tbht.vn/api/v1';
const apiTestUrl = 'https://dwt-test-be.tbht.vn/';
const axiosClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async config => {
  // // Handle token here ...
  // // get access token from async storage
  const accessToken = await AsyncStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  response => {
    if (response && response.data) {
      return response.data;
    }

    return response;
  },
  error => {
    // Handle errors
    const errorMessage = 'Something went wrong!';

    console.log(error)
    if (error.response.data) {
      throw error.response.data;
    }
    throw errorMessage;
  },
);

export default axiosClient;
