'use strict'

import * as types from '../constants/qualityListTypes';

const initialState = {

    datas: {
        "": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        },"closed": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        },
        "notAccepted": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        },
        "staged": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        },
        "unrectified": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        },
        "unreviewed": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        },
        "inspected": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        },
        "reviewed": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        },
        "delayed": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        },
        "accepted": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        }
    },
    datas_n: {
        "": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        },"closed": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        },
        "notAccepted": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        },
        "staged": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        },
        "unrectified": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        },
        "unreviewed": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        },
        "inspected": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        },
        "reviewed": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        },
        "delayed": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        },
        "accepted": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        }
    },

}

export default (state = initialState, action) => {

    switch (action.type) {
        case types.QUALITY_LIST_DOING: {
            let dataItem = state.datas[action.qcState]
            if (!dataItem) {
                dataItem = initialState.datas[""]
            }
            
            if(action.qualityCheckpointId > 0) {
                state.datas_n[action.qcState] = {
                    ...dataItem,
                    isLoading: true,
                    error: null
                }
                return {
                    ...state,
                    datas_n:state.datas_n
                }
            } else {
                state.datas[action.qcState] = {
                    ...dataItem,
                    isLoading: true,
                    error: null
                }
                return {
                    ...state,
                    datas:state.datas
                }
            }
        }

        case types.QUALITY_LIST_DONE: {
            let dataItem = state.datas[action.qcState]
            if (!dataItem) {
                dataItem = initialState.datas[""]
            }

            if(action.qualityCheckpointId > 0) {
                state.datas_n[action.qcState] = {
                    ...dataItem,
                    isLoading: false,
                    page: action.page + 1,
                    error: null,
                    isSuccessed: true,
                    hasMore: action.hasMore,
                    data: action.data,
                    dataMap:action.dataMap
                }
                return {
                    ...state,
                    datas_n:state.datas_n
                }
            } else {
                state.datas[action.qcState] = {
                    ...dataItem,
                    isLoading: false,
                    page: action.page + 1,
                    error: null,
                    isSuccessed: true,
                    hasMore: action.hasMore,
                    data: action.data,
                    dataMap:action.dataMap
                }
                return {
                    ...state,
                    datas:state.datas
                }
            }

            
        }
        case types.QUALITY_LIST_ERROR:
            {
                let dataItem = state.datas[action.qcState]
                if (!dataItem) {
                    dataItem = initialState.datas[""]
                }
                
                if(action.qualityCheckpointId > 0) {
                    state.datas_n[action.qcState] = {
                        ...dataItem,
                        isLoading: false,
                        error: action.error,
                        isSuccessed: false
                    }
                    return {
                        ...state,
                        datas_n:state.datas_ndatas
                    }
                } else {
                    state.datas[action.qcState] = {
                        ...dataItem,
                        isLoading: false,
                        error: action.error,
                        isSuccessed: false
                    }
                    return {
                        ...state,
                        datas:state.datas
                    }
                }
            }
        case types.QUALITY_LIST_INIT:
            return {
                ...initialState
            };
        default:
            return state;
    }

};