'use strict'

import * as types from '../constants/transformInfoTypes';

const initialState = {
    item: {},
    relevantEquipmentModle: {},//材设关联模型
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.TRANSFORM_INFO_SET:
            return {
                ...state,
                ...action,
            }
        case types.QUALITY_INFO_UPDATE:
            return {
                ...state,
                ...action,
            }
        case types.TRANSFORM_INFO_INIT:
            return initialState;
        default:
            return state;
    }
};