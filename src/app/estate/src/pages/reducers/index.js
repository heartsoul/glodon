import { combineReducers } from 'redux'
import loginIn from '../login/reducers/loginReducer'
import checkPointList from '../app/reducers/checkPointListReducer' 

const rootReducer = combineReducers({
  loginIn,
  checkPointList,
})

export default rootReducer
