import * as API from 'app-api'

import * as types from '../constants/equipmentListTypes'

// 删除草稿
export function deleteData(qcState, id) {
  return dispatch => {
    API.equipmentDelete(storage.loadProject(), id)
      .then(data => {
        __fetchData(qcState, 0, new Map(), dispatch)
      }).catch(error => {
        dispatch(_loadError(error, qcState, 0));
      });
  }
}
export function submitData(qcState, id) {
  return dispatch => {
    BimFileEntry.submitEquipmentFromList(id, (data) => {
      // data { res: "error", data: err } { res: "success", data: "" }
      if(data.res === "success"){
          dispatch(updateAction.updateData())
      } else {
          dispatch(_loadError(data.data, qcState, 0));
      }
  })
  }
}

// 获取数据
export function fetchData(qcState, page, dataMapIn) {
  return dispatch => {
    __fetchData(qcState, page, dataMapIn, dispatch)
  }
}

// 获取数据
function __fetchData(qcState, page, dataMapIn, dispatch) {

  if (page == 0) {
    dispatch(_loading(qcState, page));
  }
  if (page < 0) {
    page = 0;
  }
  API.equipmentList(storage.loadProject(), qcState, page, 35,'').then(
    (responseData) => {
      let data = responseData.data.content;
      let hasMore = responseData.data.last == false;
      let dataBlob = [];
      let dataMap = new Map();
      let i = 0, j = 0;
      let sectionLob = [];
      if (page > 0 && dataMapIn) {
        dataMap = dataMapIn;
      }
      data.forEach(item => {
        item.showTime = "" + API.formatUnixtimestamp(item.updateTime);
        item.index = i;
        item.qcStateShow =  item.committed == true ? "" : "" + API.toQcStateShow(API.QC_STATE_STAGED);
        item.qcStateColor =  item.committed == true ? "#FFFFFF" : "" + API.toQcStateShowColor(API.QC_STATE_STAGED);
        let groupTime = item.showTime.substring(0, 10);
        let dataBlob = dataMap.get(groupTime);
        if (dataBlob == undefined) {
          dataBlob = [];
          dataMap.set(groupTime, dataBlob);
        }
        dataBlob.push({
          key: "" + item.id,
          value: item,
        });
        i++;
      });

      dataMap.forEach(function (value, key, map) {
        sectionLob.push({
          key: key,
          data: value,
        });
      });
      dispatch(_loadSuccess(sectionLob, dataMap, qcState, page, hasMore));
      data = null;
      dataBlob = null;
      sectionLob = null;
      dataMap = null;
    }
  ).catch(error => {
    dispatch(_loadError(error, qcState, page));
  });

}
export function reset(qcState) {
  return dispatch => {
    dispatch(_reset(qcState))
  }
}

function _loading(qcState, page) {
  return {
    type: types.EQUIPMENT_LIST_DOING,
    qcState: qcState,
    page: page,
  }
}

function _loadSuccess(data, dataMap, qcState, page, hasMore) {
  return {
    type: types.EQUIPMENT_LIST_DONE,
    data: data,
    dataMap: dataMap,
    qcState: qcState,
    page: page,
    hasMore: hasMore,
  }
}

function _reset(qcState) {
  return {
    type: types.EQUIPMENT_LIST_INIT,
    qcState: qcState,
  }
}
function _loadError(error, qcState, page) {
  return {
    type: types.EQUIPMENT_LIST_ERROR,
    error: error,
    qcState: qcState,
    page: page,
  }
}
