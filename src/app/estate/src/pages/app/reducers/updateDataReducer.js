'use strict'

import * as types from '../constants/updateDataTypes';

const initialState = {
    updateIndex:0,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.UPDATE_DATA_SET:
            return {
                ...state,
                updateIndex:action.updateIndex,
            }
        case types.UPDATE_DATA_UPDATE:
            return {
                ...state,
                updateIndex:state.updateIndex+1,
            }
        case types.UPDATE_DATA_INIT:
            return initialState;
        default:
            return state;
    }
};