"use strict"

import * as types from "./../constants/reviewRepairTypes";

const initialState = {
    detailInfo: {},
    reviewInfo: {},
    isLoading: true,
    error: null,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.REVIEW_REPAIR_LOAD_DETAIL:
            return {
                ...state,
                isLoading: false,
                qualityInfo: action.qualityInfo,
            }
        case types.REVIEW_REPAIR_LOAD_REVIEWiNFO:
            return {
                ...state,
                isLoading: false,
                reviewInfo: action.reviewInfo,
            }
        case types.REVIEW_REPAIR_LOAD_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.error,
            }
        case types.REVIEW_REPAIR_INIT:
            return initialState;
        default:
            return state;
    }
};