import * as API from 'app-api'

import * as types from '../constants/qualityListTypes'

// 删除草稿
export function deleteData(qcState, inspectId, inspectionType, qualityCheckpointId = 0, qualityCheckpointName = '') {
  return dispatch => {
    API.createDeleteInspection(storage.loadProject(), inspectionType, inspectId)
      .then(data => {
        __fetchData(qcState, 0, new Map(), dispatch, qualityCheckpointId, qualityCheckpointName)
      }).catch(error => {
        dispatch(_loadError(error, qcState, 0, qualityCheckpointId, qualityCheckpointName));
      });
  }
}
export function submitData(qcState, inspectId, inspectionType, qualityCheckpointId = 0, qualityCheckpointName = '') {
  return dispatch => {
    let props = {};
    API.editSubmitInspection(storage.loadProject(), inspectId, inspectionType, props)
      .then(data => {
        __fetchData(qcState, 0, new Map(), dispatch, qualityCheckpointId, qualityCheckpointName)
      }).catch(error => {
        dispatch(_loadError(error, qcState, page, qualityCheckpointId, qualityCheckpointName));
      });
  }
}

// 获取数据
export function fetchData(qcState, page, dataMapIn, qualityCheckpointId = 0, qualityCheckpointName = '') {
  return dispatch => {
    __fetchData(qcState, page, dataMapIn, dispatch, qualityCheckpointId, qualityCheckpointName)
  }
}

// 获取数据
function __fetchData(qcState, page, dataMapIn, dispatch, qualityCheckpointId = 0, qualityCheckpointName = '') {

  if (page == 0) {
    dispatch(_loading(qcState, page, qualityCheckpointId, qualityCheckpointName));
  }
  if (page < 0) {
    page = 0;
  }
  API.getQualityInspectionAll(storage.loadProject(), qcState, page, 35, qualityCheckpointId, qualityCheckpointName).then(
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
        item.qcStateShow = "" + API.toQcStateShow(item.qcState);
        if (item.files && item.files.size > 0) {
          item.url = item.files[0].url;
          // console.log(item.url);
        }
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
      dispatch(_loadSuccess(sectionLob, dataMap, qcState, page, hasMore, qualityCheckpointId, qualityCheckpointName));
      data = null;
      dataBlob = null;
      sectionLob = null;
      dataMap = null;
    }
  ).catch(error => {
    dispatch(_loadError(error, qcState, page, qualityCheckpointId, qualityCheckpointName));
  });

}
export function reset(qcState, qualityCheckpointId = 0, qualityCheckpointName = '') {
  return dispatch => {
    dispatch(_reset(qcState, qualityCheckpointId, qualityCheckpointName))
  }
}

function _loading(qcState, page, qualityCheckpointId = 0, qualityCheckpointName = '') {
  return {
    type: types.QUALITY_LIST_DOING,
    qcState: qcState,
    page: page,
    qualityCheckpointId:qualityCheckpointId
  }
}

function _loadSuccess(data, dataMap, qcState, page, hasMore, qualityCheckpointId = 0, qualityCheckpointName = '') {
  return {
    type: types.QUALITY_LIST_DONE,
    data: data,
    dataMap: dataMap,
    qcState: qcState,
    page: page,
    hasMore: hasMore,
    qualityCheckpointId:qualityCheckpointId
  }
}

function _reset(qcState, qualityCheckpointId = 0, qualityCheckpointName = '') {
  return {
    type: types.QUALITY_LIST_INIT,
    qcState: qcState,
    qualityCheckpointId:qualityCheckpointId
  }
}
function _loadError(error, qcState, page, qualityCheckpointId = 0, qualityCheckpointName = '') {
  return {
    type: types.QUALITY_LIST_ERROR,
    error: error,
    qcState: qcState,
    page: page,
    qualityCheckpointId:qualityCheckpointId
  }
}
