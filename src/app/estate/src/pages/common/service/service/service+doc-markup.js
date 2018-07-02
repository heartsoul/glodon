import * as CONSTANT from "./../api/api+constant";
import * as API from "./../api/api+bimpm";

/**
 * 获取批注列表
 * @param {*} modelVersionId 
 * @param {*} fileId 
 * @param {*} creatorId 
 * @param {*} pageIndex 
 * @param {*} pageSize 
 */
export async function getModelMarkups(modelVersionId, fileId, creatorId, pageIndex, pageSize) {
    API.getModelMarkups(modelVersionId, fileId, creatorId, pageIndex, pageSize)
        .then(response => {
            return response;
        });
}