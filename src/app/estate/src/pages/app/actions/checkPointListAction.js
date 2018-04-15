'use strict'

import * as types from '../constants/checkPointListTypes';
import * as API from 'app-api'

export function getCheckPoints() {
    return dispatch => {
        API.getCheckPoints(storage.projectId)
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
        type: types.GET_CHECK_POINTS,
        topDirNode: topDirNode,
        topModelNode: topModelNode,
    }

}


/**
 * 选中构件，新建、质检清单列表、构件信息页
 * @param {*} checkPoint 
 */
export function selectCheckPoint(checkPoint) {
    return {
        type: types.SELECT_CHECK_POINT,
        selectCheckPoint: checkPoint,
    }
}
export function toQualityCheckList(checkPoint) {
    //跳转到列表页
    
    let navigator = this.props.navigation;
    storage.pushNext(navigator, 'QualityMainPage', { selectedCheckPoint: checkPoint, });
    return dispatch=>{
        dispatch(selectCheckPoint(checkPoint));
    }
}

export function toCheckPointInfoPage(item) {
    //构件信息页面
    return dispatch=>{
        dispatch(selectCheckPoint(checkPoint));
    }
}

export function toAddPage(checkPoint) {
    //新建页面
    let navigator = this.props.navigation;
    storage.pushNext(navigator, 'NewPage', { selectedCheckPoint: checkPoint, });
    return dispatch=>{
        dispatch(selectCheckPoint(checkPoint));
    }
}