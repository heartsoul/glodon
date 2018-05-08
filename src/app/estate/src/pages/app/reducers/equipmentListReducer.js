'use strict'

import * as types from '../constants/equipmentListTypes';

const initialState = {

    datas: {
        "all": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        },"edit": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        },
        "standard": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        },
        "notStandard": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        },
        "search": {
            page: 0,
            isLoading: true,
            error: null,
            hasMore: true,
            data: [],
            dataMap: new Map(),
        },
    },

}

export default (state = initialState, action) => {

    switch (action.type) {
        case types.EQUIPMENT_LIST_DOING: {
            let dataItem = state.datas[action.qcState]
            if (!dataItem) {
                dataItem = initialState.datas[""]
            }
            
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

        case types.EQUIPMENT_LIST_DONE: {
            let dataItem = state.datas[action.qcState]
            if (!dataItem) {
                dataItem = initialState.datas[""]
            }

           
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
        case types.EQUIPMENT_LIST_ERROR:
            {
                let dataItem = state.datas[action.qcState]
                if (!dataItem) {
                    dataItem = initialState.datas[""]
                }
                
               
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
        case types.EQUIPMENT_LIST_INIT:
            return {
                ...initialState
            };
        default:
            return state;
    }

};