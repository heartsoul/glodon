import * as API from 'app-api'

import * as types from '../constants/qualityListTypes'
import * as searchTypes from "./../constants/searchTypes";

import * as updateAction from './updateDataAction'
import { BimFileEntry, AuthorityManager } from "app-entry";

// 删除草稿
export function deleteData(qcState, inspectId, inspectionType, qualityCheckpointId = 0, qualityCheckpointName = '') {
    return dispatch => {
        API.createDeleteInspection(storage.loadProject(), inspectionType, inspectId)
            .then(data => {
                dispatch(updateAction.updateData())
            }).catch(error => {
                dispatch(_loadError(error, qcState, 0, qualityCheckpointId, qualityCheckpointName));
            });
    }
}
export function submitData(qcState, inspectId, inspectionType, qualityCheckpointId = 0, qualityCheckpointName = '') {
    return dispatch => {
        BimFileEntry.submitInspectionFromList(inspectId, (data) => {
            // data { res: "error", data: err } { res: "success", data: "" }
            if (data.res === "success") {
                dispatch(updateAction.updateData())
            } else {
                dispatch(_loadError(data.data, qcState, 0, qualityCheckpointId, qualityCheckpointName));
            }
        })
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
        API.searchQualityData(storage.loadProject(), keywords, page, 20)
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
        qualityCheckpointId: qualityCheckpointId
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
        qualityCheckpointId: qualityCheckpointId
    }
}

function _reset(qcState, qualityCheckpointId = 0, qualityCheckpointName = '') {
    return {
        type: types.QUALITY_LIST_INIT,
        qcState: qcState,
        qualityCheckpointId: qualityCheckpointId
    }
}
function _loadError(error, qcState, page, qualityCheckpointId = 0, qualityCheckpointName = '') {
    return {
        type: types.QUALITY_LIST_ERROR,
        error: error,
        qcState: qcState,
        page: page,
        qualityCheckpointId: qualityCheckpointId
    }
}
