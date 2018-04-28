'use strict'

import * as types from '../constants/equipmentNewTypes'

export function featchData(item,editType) {
    return dispatch => {
        dispatch(_loadSuccess(item,editType));
    }
  }

  export function reset() {
    return dispatch => {
      dispatch(_reset())
    }
  }
  
  function _loading(editType) {
    return {
      type: types.EQUIPMENT_NEW_DOING,
      editType: editType,
    }
  }
  
  function _loadSuccess(data,editType) {
    return {
      type: types.EQUIPMENT_NEW_DONE,
      data: data,
      editType: editType,
    }
  }
  
  function _reset() {
    return {
      type: types.EQUIPMENT_MEW_INIT,
    }
  }
  function _loadError(error, editType) {
    return {
      type: types.EQUIPMENT_NEW_ERROR,
      error: error,
      editType: editType,
    }
  }
