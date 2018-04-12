import { combineReducers } from 'redux'
import loginIn from '../login/reducers/loginReducer'

const rootReducer = combineReducers({
  loginIn,
})

export default rootReducer
