import { requestJSON } from "../../../base/api+base"
/**
 * 模型相关API
 */
/**
 * 查询单体列表
 * 
 * @export
 * @param {number} projectId 项目id
 * @returns [
  {
    "area": 0,
    "code": "string",
    "id": 0,
    "name": "string",
    "projectId": 0,
    "structureType": "string"
  }
]
 */
export async function getPmbasicBuildings(projectId) {
    let api = "/pmbasic/projects/" + projectId + "/buildings";
    return requestJSON(api, {
        method: 'GET',
    });
}

/**
 * 查询专业列表
 * 
 * @export
 * @returns []
 * [
  {
    "code": "string",
    "id": 0,
    "keywords": "string",
    "name": "string",
    "orderNum": 0,
    "parentId": 0,
    "treePath": "string"
  }
]
 */
export async function getPmbasicSpecialty(includeChildren=true) {
    let api = "/pmbasic/specialty";
    return requestJSON(api + '?includeChildren=' + includeChildren, {
        method: 'GET',
    });
}