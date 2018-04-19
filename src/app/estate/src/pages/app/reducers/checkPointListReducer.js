'use strict'

import * as types from '../constants/checkPointListTypes';

const initialState = {
    topDirNode: [],
    topModelNode: [],
    navPage: null,
    selectedCheckPoint:{}
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.CHECK_POINT_LOAD:
            return {
                ...state,
                navPage: null,
                topDirNode: action.topDirNode,
                topModelNode: action.topModelNode,
            }
        case types.CHECK_POINT_TO_NEW_QUALITY:
        case types.CHECK_POINT_TO_INFO:
        case types.CHECK_POINT_TO_QUALITY_LIST:
            return {
                ...state,
                navPage: action.navPage,
                selectedCheckPoint: action.selectedCheckPoint,
            }
        case types.CHECK_POINT_RESET:
            return initialState
        case types.CHECK_POINT_INIT:
        
            return {
                ...state,
                navPage: null,
            }
        default:

            return state;
    }
};