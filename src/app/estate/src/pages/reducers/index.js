import { combineReducers } from 'redux'
import loginIn from '../login/reducers/loginReducer'
import checkPointList from '../app/reducers/checkPointListReducer' 
import qualityInfo from '../app/reducers/qualityInfoReducer' 
import transformInfo from '../app/reducers/transformInfoReducer' 

const rootReducer = combineReducers({
  loginIn,
  checkPointList,
  qualityInfo,
  transformInfo
})

export default rootReducer
