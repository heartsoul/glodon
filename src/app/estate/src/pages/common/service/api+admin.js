import { requestJSON } from "common-module"
/**
 * admin相关API
 */

 /**
 * 获取权限方案指定模块权限
 * 
 * @export
 * @param {number} profileId 权限方案ID
 * @param {String} moduleCode 模块编码
 * @returns 
 {
    "actionRights": [
      "string"
    ],
    "moduleCode": "string"
  }
 */
export async function getModelRights(profileId, moduleCode) {
    let api = `/admin/auths/admin/moduleRights/?profileId=${profileId}&moduleCode=${moduleCode}`;
    return requestJSON(api, {
        method: 'GET',
    });
}
