'use strict'

import * as types from '../constants/checkPointListTypes';
import * as API from 'app-api'

export function getCheckPoints() {
    return dispatch => {
        API.getCheckPoints(storage.loadProject())
            .then(data => {
                let topNode = getListByParentId(data.data, null);
                let topDirNode = [];
                let topModelNode = [];
                topNode.map((item) => {
                    if (item.viewType == 1) {
                        item.childList = getListByParentId(data.data, item.id)
                        topDirNode.push(item);
                    } else {
                        topModelNode.push(item);
                    }
                });
                dispatch(loadSuccess(topDirNode, topModelNode));
            })
    }
}

function getListByParentId(checkPoints, parentId) {
    let data = [];
    checkPoints.map((item) => {
        if (item.parentId == parentId) {
            if (hasChild(checkPoints, item.id)) {
                item.viewType = 1;
            }
            data.push(item);
        }
    });
    return data;
}

function hasChild(checkPoints, parentId) {
    for (let item of checkPoints) {
        if (item.parentId == parentId) {
            return true;
        }
    }
    return false;
}

/**
 * 返回构件列表
 * @param {*} topDirNode 
 * @param {*} topModelNode 
 */
export function loadSuccess(topDirNode, topModelNode) {
    return {
        type: types.CHECK_POINT_LOAD,
        topDirNode: topDirNode,
        topModelNode: topModelNode,
    }

}

export function toQualityCheckList(checkPoint) {
    //跳转到列表页
    return {
        type: types.CHECK_POINT_TO_QUALITY_LIST,
        selectedCheckPoint: checkPoint,
        navPage: 'QualityMainPage',
    }
}

export function toCheckPointInfoPage(checkPoint) {
    //构件信息页面
    return {
        type: types.CHECK_POINT_TO_INFO,
        selectedCheckPoint: checkPoint,
        navPage: 'QualityStatardsPage',
    }
}



export function toAddPage(checkPoint) {
    //新建页面
    return {
        type: types.CHECK_POINT_TO_NEW_QUALITY,
        selectedCheckPoint: checkPoint,
        navPage: 'NewPage',
    }
}

export function navSuccess(){
    return {
        type: types.CHECK_POINT_INIT,
    }
}

export function reset(){
      return {
        type: types.CHECK_POINT_RESET,
    }
}