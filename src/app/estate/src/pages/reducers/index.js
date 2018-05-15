import { combineReducers } from 'redux'
import loginIn from '../login/reducers/loginReducer'
import forgot from '../login/reducers/forgotReducer'
import checkPointList from '../app/reducers/checkPointListReducer'
import qualityInfo from '../app/reducers/qualityInfoReducer'
import qualityList from '../app/reducers/qualityListReducer'
import transformInfo from '../app/reducers/transformInfoReducer'
import updateData from '../app/reducers/updateDataReducer'
import reviewRepair from '../app/reducers/reviewRepairReducer'
import equipmentList from '../app/reducers/equipmentListReducer'
import equipmentInfo from '../app/reducers/equipmentInfoReducer'
import equipmentNew from '../app/reducers/equipmentNewReducer'
import projectList from '../app/reducers/projectReducer'
import search from '../app/reducers/searchReducer'
import newQuality from '../app/reducers/newQualityReducer'
const rootReducer = combineReducers({
    loginIn,
    forgot,
    checkPointList,
    qualityInfo,
    qualityList,
    equipmentList,
    transformInfo,
    updateData,
    transformInfo,
    reviewRepair,
    equipmentInfo,
    projectList,
    equipmentNew,
    search,
    newQuality,
})

export default rootReducer
