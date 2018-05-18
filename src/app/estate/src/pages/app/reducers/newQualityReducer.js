'use strict'

import * as types from "./../constants/newQualityTypes";

let initialState = {
    isLoading: false,
    editQualityParams: {},
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.NEW_QUALITY_LOADING_START:
            return {
                ...state,
                isLoading: true,
            }
        case types.NEW_QUALITY_LOADING_DONE:
            return {
                ...state,
                isLoading: false,
                editQualityParams: action.editQualityParams,
            }
        case types.NEW_QUALITY_RESET:
            return initialState;
        default:
            return state;
    }
};