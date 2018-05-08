import * as types from "./../constants/searchTypes";

const initialState = {
    qualityList: {},
    totalQuality: 0,
    equipmentList: {},
    totalEquipment: 0,
    keywords: "",
    searchHistory: [],
}

export default (state = initialState, action) => {

    switch (action.type) {
        case types.SEARCH_QUALITY_START:
            return {
                ...state,
                qualityList: {},
                totalQuality: 0,
                equipmentList: {},
                totalEquipment: 0,
                keywords: "",
            }
        case types.SEARCH_QUALITY_DONE:
            return {
                ...state,
                qualityList: action.qualityList,
                totalQuality: action.totalQuality,
                keywords: action.keywords,
            }
        case types.SEARCH_EQUIPMENT_DONE:
            return {
                ...state,
                equipmentList: action.equipmentList,
                totalEquipment: action.totalEquipment,
                keywords: action.keywords,
            }
        case types.LOAD_SEARCH_HISTORY:
            return {
                ...state,
                searchHistory: action.searchHistory,
            }
        default:
            return state;
    }
};