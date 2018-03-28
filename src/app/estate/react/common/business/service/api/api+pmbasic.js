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

/**
 * 获取施工单位列表
 * @param projectId            项目id
 * @param deptTypeEnums 监理JLDW  业主JSDW     (SJDW SGDW)
 * @returns
 * 
 [
  {
    "parentId": null,
    "code": "HZDW1712064259",
    "name": "施工单位A",
    "alias": null,
    "type": "PARTNER",
    "extData": null,
    "id": 5213138,
    "treePath": null,
    "orderNum": 0,
    "external": true,
    "formal": false,
    "coperationId": 5212715
  }
]
 * 
 */
export async function getCompaniesList(projectId, deptTypeEnums) {
    let api = `/pmbasic/projects/${projectId}/supporters`;
    return requestJSON(api + '?deptTypeEnums=' + deptTypeEnums, {
        method: 'GET',
    });
}


/**
 * 查询施工单位的责任人
 * 
 * @param {*} projectId 
 * @param {*} coperationCorpId 施工单位id
 * @returns
 * 
 [
  {
    "name": "XP",
    "title": "总工",
    "phone": "18330117163",
    "authPeriod": -1,
    "roleAuthKeys": "进度,质量,成本",
    "roleAuthValues": "JD,ZL,CB",
    "active": true,
    "memberId": 5201080,
    "coperationCorpId": 5212715,
    "id": 5211603,
    "userId": 5200299
  }
]
 */
export async function getPersonList(projectId, coperationCorpId) {
    let api = `/pmbasic/projects/${projectId}/coperationCorps/${coperationCorpId}/coperationRoles`;
    let filter = `?active=true`;
    return requestJSON(api + filter, {
        method: 'GET',
    });
}
