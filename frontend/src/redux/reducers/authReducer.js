import {
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAILURE,
    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,
  } from '../actions/Useractions';
  
  const initialState = {
    user: null,
    loading: false,
    error: null,
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case REGISTER_USER_REQUEST:
      case LOGIN_USER_REQUEST:
        return { ...state, loading: true, error: null };
      
      case REGISTER_USER_SUCCESS:
      case LOGIN_USER_SUCCESS:
        return { ...state, loading: false, user: action.payload };
  
      case REGISTER_USER_FAILURE:
      case LOGIN_USER_FAILURE:
        return { ...state, loading: false, error: action.payload };
      
      default:
        return state;
    }
  };
  
  export default authReducer;
  