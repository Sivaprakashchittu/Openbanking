import axios from 'axios';
import { setItem } from '../../utils/sessionStorageUtil';
export const REGISTER_USER_REQUEST = 'REGISTER_USER_REQUEST';
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE';

export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';

axios.defaults.baseURL =process.env.REACT_APP_SERVER_DOMAIN;

// Register User Action
export const registerUser = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_USER_REQUEST });
  try {
    console.log("dfsf",process.env.REACT_APP_SERVER_DOMAIN)
    console.log("dfsf1",process.env.HH)
    const response = await axios.post(`/api/auth/register`, userData);
  
    dispatch({ type: REGISTER_USER_SUCCESS, payload: response.data });
  } catch (error) { 
    dispatch({ type: REGISTER_USER_FAILURE, payload: error.response.data });
  }
};

// Login User Action
export const loginUser = (userData) => async (dispatch) => {
  dispatch({ type: LOGIN_USER_REQUEST });
  try {
    const response = await axios.post(`/api/auth/login`, userData);
    console.log("hhe",response);
    setItem('user', response.data.id);
    dispatch({ type: LOGIN_USER_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: LOGIN_USER_FAILURE, payload: error.response.data });
  }
};
