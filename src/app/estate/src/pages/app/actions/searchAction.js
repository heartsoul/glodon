import * as API from "app-api";
import * as types from "./../constants/searchTypes";
import { Toast } from 'antd-mobile';
import { SearchHistory } from "./../pages/search/SearchHistory"

export function search(keywords) {
    return dispatch => {
        loadingToast();
        saveHistory(SearchHistory.SEARCH_TYPE_GLOBAL, keywords, dispatch);
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

function parseQualityData(data, dataMapIn, page) {
    let dataBlob = [];
    let dataMap = new Map();
    let i = 0;
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
    return {
        sectionLob: sectionLob,
        dataMap: dataMap,
    }
}

/**
 * 加载搜索历史
 * @param {*} items 
 */
export function loadHistory(type) {
    return dispatch => {
        dispatch(loadHistoryDone(SearchHistory.loadSearchHistory(type)));
    }
}

function saveHistory(type, keywords, dispatch) {
    if (!keywords || keywords.length == 0) {
        return;
    }
    let items = SearchHistory.saveHistory(keywords, type)
    dispatch(loadHistoryDone(items))
}

export function searchBimFile(keywords, suffix, isModel) {
    return dispatch => {
        loadingToast();
        saveHistory(SearchHistory.SEARCH_TYPE_BIM, keywords, dispatch);
        API.searchModuleBlueprint(storage.loadProject(), storage.projectIdVersionId, keywords, suffix, isModel)
            .then((responseData) => {
                let data = responseData.data;
                let bimFiles = [];
                if (data && data.message === "success") {
                    bimFiles = data.data;
                    bimFiles.map((item) => {
                        item.name = parseBimFileName(item.name);
                    })
                }
                dispatch(searchBimFileDone(bimFiles))
                Toast.hide()
            }).catch((error) => {
                console.log(error);
            })

    }
}

function parseBimFileName(htmlName) {
    // 电缆沟<span class=\'highlight-search\'>图</span>纸.<span class=\'highlight-search\'>dwg</span>
    var reg1 = new RegExp(/<span class='highlight-search'>/g);
    var reg2 = new RegExp(/<\/span>/g);
    var str1 = htmlName.replace(reg1, '');
    var str2 = str1.replace(reg2, '');
    return str2;
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

function searchBimFileDone(bimFiles) {
    return {
        type: types.SEARCH_BIMFILE_DONE,
        bimFiles: bimFiles,
    }
}
export function searchBimFileReset(bimFiles) {
    return {
        type: types.SEARCH_BIMFILE_RESET,
    }
}

function loadHistoryDone(items) {
    return {
        type: types.LOAD_SEARCH_HISTORY,
        searchHistory: items,
    }
}