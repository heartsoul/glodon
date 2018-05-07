import * as API from "app-api";
import * as types from "./../constants/searchTypes";
import { Toast } from 'antd-mobile';

export function search(keywords) {
    return dispatch => {
        loadingToast();
        saveHistory(keywords, dispatch);
        dispatch(searchStart());
        API.searchQualityData(storage.loadProject(), keywords, 0, 3)
            .then((responseData) => {
                let data = responseData.data;
                let content = data.content;
                let total = data.totalElements;
                dispatch(searchQualityDone(content, total, keywords));
                Toast.hide();
            }).catch(error => {
                Toast.hide();
            });
        API.searchEquipmentData(storage.loadProject(), keywords, 0, 3)
            .then((responseData) => {
                Toast.hide();
                let data = responseData.data;
                let content = data.content;
                let total = data.totalElements;
                dispatch(searchEquipmentDone(content, total, keywords));
            }).catch(error => {
                Toast.hide();
            });
    }
}

/**
 * 加载搜索历史
 * @param {*} items 
 */
export function loadHistory(items) {
    return dispatch => {
        let history = storage.loadSearchHistory();
        let items = [];
        if (history && history.length > 0) {
            items = history.split(",")
        }
        dispatch(loadHistoryDone(items));
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


function loadingToast() {
    Toast.loading('加载中...', 0, null, true);
}


export function searchStart() {
    return {
        type: types.SEARCH_QUALITY_START,
    }
}

export function searchError() {
    return {
        type: types.SEARCH_QUALITY_START,
    }
}

function searchQualityDone(qualityList, totalQuality, keywords) {
    return {
        type: types.SEARCH_QUALITY_DONE,
        qualityList: qualityList,
        totalQuality: totalQuality,
        keywords: keywords,
    }
}

function searchEquipmentDone(equipmentList, totalEquipment, keywords) {
    return {
        type: types.SEARCH_EQUIPMENT_DONE,
        equipmentList: equipmentList,
        totalEquipment: totalEquipment,
        keywords: keywords,
    }
}
function loadHistoryDone(items) {
    return {
        type: types.LOAD_SEARCH_HISTORY,
        searchHistory: items,
    }
}