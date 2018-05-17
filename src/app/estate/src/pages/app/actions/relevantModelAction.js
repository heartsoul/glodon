import * as types from '../constants/transformInfoTypes';

/**
 * 设置选中的模型信息
 * @param {*} relevantModel 
 */
export function transformInfo(relevantModel) {
    return {
        type: types.TRANSFORM_INFO_SET,
        relevantEquipmentModle: relevantModel,
    }
}

/**
 * 设置选中的模型信息
 * @param {*} relevantModel 
 */
export function resetTransformInfo() {
    return {
        type: types.TRANSFORM_INFO_SET,
        relevantEquipmentModle: {},
    }
}