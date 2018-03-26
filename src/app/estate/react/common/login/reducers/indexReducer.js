import { combineReducers } from 'redux';
import userReducer from './loginReducer';

export default combineReducers({
	userStore: userReducer,
});