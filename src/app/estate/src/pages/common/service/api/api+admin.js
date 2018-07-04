import { requestJSON } from "common-module"
import OfflineStateUtil from '../../../common/utils/OfflineStateUtil'
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
export async function getProfileModelRights(profileId, moduleCode) {
    if(OfflineStateUtil.isOnLine()){
        let api = `/admin/auths/admin/moduleRights/?profileId=${profileId}&moduleCode=${moduleCode}`;
        return requestJSON(api, {
            method: 'GET',
        });
    }
    
}

/**
 * 获取应用中模块权限
 * 
 * @export
 * @param {string} appCode 应用编码 eg Estate
 * @param {string} moduleCode 模块编码
 * @param {string} deptId 所在组织
 * @returns 
 {
    "actionRights": [
      "string"
    ],
    "moduleCode": "string"
  }
 */
export function getAppModelRights(appCode, moduleCode, deptId, tenantId = '0') {
    

    if(OfflineStateUtil.isOnLine()){
        let headers = {};
        if(tenantId && tenantId != '0') {
            headers = {'X-CORAL-TENANT':''+tenantId};
        }
        let api = `/admin//auths/${appCode}/moduleRights/${moduleCode}?deptId=${deptId}`;
        return requestJSON(api, {
            method: 'GET',
            headers: headers,
        });
    }
}
/**
 * Android检测版本更新
 */
export async function checkVersion() {
    if(OfflineStateUtil.isOnLine()){
        let name = "android";
        let api = `/basis/sysinfo?name=${name}`;
        return requestJSON(api, {
            method: 'GET',
        });
    }
}
