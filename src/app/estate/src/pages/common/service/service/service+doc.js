import * as CONSTANT from "./../api/api+constant";
import API from "./../api/api+doc";

/**
 * 获取文档容器信息
 *
 *
 * @export
 * @param {*} projectId  选择的项目id （deptId）
 * @returns response 
{
  "id": "f6568b4ec8a545cc9d22bc081be2f269", // 根目录id
  "name": "WS.DOC.5216515",
  "status": 0,
  "createTime": 1529048163000,
  "createTimeShow": '2018-06-30 03:13:43',
  "updateTime": 1529048163000,
  "updateTimeShow": '2018-06-30 03:13:43',
}
 */
export function getDocContainer(projectId) {
    let retInfo = {
        "id": "f6568b4ec8a545cc9d22bc081be2f269",
        "name": "WS.DOC.5216515",
        "status": 0,
        "createTime": 1529048163000,
        "createTimeShow": '2018-06-30 03:13:43',
        "updateTime": 1529048163000,
        "updateTimeShow": '2018-06-30 03:13:43',
    };
    return API.getDocContainer(projectId)
        .then(response => {
            retInfo.id = response.data.id;
            retInfo.name = response.data.name;
            retInfo.status = response.data.status;
            retInfo.createTime = response.data.createTime;
            retInfo.updateTime = response.data.updateTime;
            retInfo.createTimeShow = CONSTANT.formatUnixtimestamp(response.data.createTime);
            retInfo.updateTimeShow = CONSTANT.formatUnixtimestamp(response.data.updateTime);
            return retInfo;
        });
}
/**
 * 获取文档的根目录信息，包括权限
 *
 * @export
 * @param {*} projectId  选择的项目id （deptId）
 * @returns response
 {
  "fileId": "f6568b4ec8a545cc9d22bc081be2f269",
  "name": "/",
  "folder": true,
  "createTime": 1529048163000,
  "createTimeShow": '2018-06-30 03:13:43',
  "filePath": null,
  "convertStatus": null,
  "userPrivilege": {
    "enter": true,
    "view": true,
    "download": true,
    "create": true,
    "update": true,
    "delete": true,
    "grant": true
  }
}
 */
export function getDocRootDir(projectId) {
    let retInfo = {
        "fileId": "f6568b4ec8a545cc9d22bc081be2f269",
        "name": "/",
        "createTime": 1529048163000,
        "createTimeShow": '2018-06-30 03:13:43',
        "userPrivilege": {
            "enter": false,
            "view": false,
            "download": false,
            "create": false,
            "update": false,
            "delete": false,
            "grant": false
        }
    };
    return API.getDocRootDir(projectId)
        .then(response => {
            retInfo.fileId = response.data.fileId;
            retInfo.name = response.data.name;
            retInfo.createTime = response.data.createTime;
            retInfo.createTimeShow = CONSTANT.formatUnixtimestamp(response.data.createTime);
            retInfo.userPrivilege = response.data.userPrivilege || null;
            return retInfo;
        });
}