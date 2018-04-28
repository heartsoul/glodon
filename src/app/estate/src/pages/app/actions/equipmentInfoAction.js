import * as API from 'app-api'
import * as types from '../constants/equipmentInfoTypes'

// 获取数据
export function fetchData(fieldId) {
  return dispatch => {
    // dispatch(_loading());
    API.equipmentDetail(storage.loadProject(), fieldId).then((responseData) => {
      dispatch(_loadSuccess(responseData.data));
    }).catch(err => {
      dispatch(_loadError(error));
    });
  }
}
export function reset() {
  return dispatch => {
    dispatch(_reset())
  }
}

function _loading() {
  return {
    type: types.EQUIPMENT_INFO_DOING,
  }
}

function _loadSuccess(data) {
  return {
    type: types.EQUIPMENT_INFO_DONE,
    data:data,
  }
}

function _reset() {
  return {
    type: types.EQUIPMENT_INFO_INIT,
  }
}
function _loadError(error) {
  return {
    type: types.EQUIPMENT_INFO_ERROR,
    error:error,
  }
}
