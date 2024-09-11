// reducers/index.js
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import externalBankReducer from './externalBankReducer'; 
const rootReducer = combineReducers({
  auth: authReducer,
  externalBank: externalBankReducer,
  // other reducers
});

export default rootReducer;
