import * as API from 'app-api'

import * as types from '../constants/equipmentListTypes'
import * as searchTypes from "./../constants/searchTypes";

import * as UpdateDataAction from "./updateDataAction";

// 删除草稿
export function deleteData(id) {
  return dispatch => {
    API.equipmentDelete(storage.loadProject(), id)
        .then((responseData) => {
            dispatch(UpdateDataAction.updateData());
        }).catch(error => {
            console.log(error);
        })
    }
}

export function submitData(id) {
  return dispatch => {
    API.equipmentDetail(storage.loadProject(), id).then((responseData) => {
        let params = responseData.data;
        API.equipmentEditSubmit(storage.loadProject(), id, JSON.stringify(params))
        .then((responseData) => {
            dispatch(UpdateDataAction.updateData());
        }).catch(error => {
            console.log(error);
        })
    }).catch(error => {
        console.log(error)
    });
   
  }
}

// 获取数据
export function fetchData(qcState, page, dataMapIn) {
  return dispatch => {
    __fetchData(qcState, page, dataMapIn, dispatch)
  }
}

export function searchData(keywords, page, qcState, dataMapIn) {
    return dispatch => {
        if (page == 0) {
            saveHistory(keywords, dispatch);
            dispatch(_loading(qcState, page));
        }
        if (page < 0) {
            page = 0;
        }
        API.searchEquipmentData(storage.loadProject(), keywords, page, 20)
            .then((responseData) => {

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
                dispatch(_loadSuccess(sectionLob, dataMap, qcState, page, hasMore));
                data = null;
                dataBlob = null;
                sectionLob = null;
                dataMap = null;

            }).catch(error => {
                dispatch(_loadError(error, qcState, page));
            });
    }
}

function saveHistory(keywords, dispatch) {
    let history = storage.loadSearchHistory();
    let items = [];
    if (history && history.length > 0) {
        items = history.split(",")
    }
    let index = items.findIndex((value) => {
        return keywords === value;
    });
    if (index >= 0) {
        items.splice(index, 1)
    }
    items.unshift(keywords);
    if (items.length > 20) {
        items.pop();
    }
    let newHistory = items.join(",");
    storage.setSearchHistory(newHistory);
    dispatch(loadHistoryDone(items))
}

function loadHistoryDone(items) {
    return {
        type: searchTypes.LOAD_SEARCH_HISTORY,
        searchHistory: items,
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
  API.equipmentList(storage.loadProject(), qcState, page, 20,'updateTime,desc').then(
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
        let ts = new Date().getTime();
        dataBlob.push({
          key: item.id + "-" + ts,
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
