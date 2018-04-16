'use strict'

import * as types from '../constants/checkPointListTypes';

const initialState = {
    topDirNode: [],
    topModelNode: [],
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.GET_CHECK_POINTS:
            return {
                ...state,
                topDirNode: action.topDirNode,
                topModelNode: action.topModelNode,
            }
        case types.SELECT_CHECK_POINT:
            return {
                ...state,
                selectedCheckPoint: action.selectCheckPoint,
            }    
        default:
            return state;
    }
};