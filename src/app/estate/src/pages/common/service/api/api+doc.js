import { requestJSON } from "common-module"

/**
 * 获取containerid
 * 
 * @param {项目id} projectId 
 * 
 *response 
{
  "id": "f6568b4ec8a545cc9d22bc081be2f269",
  "orgGroupId": "ea58947322b04897a83d3760ea9e714a",
  "repoId": "f6568b4ec8a545cc9d22bc081be2f269",
  "parentContainerId": null,
  "name": "WS.DOC.5216515",
  "status": 0,
  "createTime": 1529048163000,
  "creatorId": "aDlPf13UtiGs7yuHCd8eHSLHbHJTU8Sd",
  "creatorName": "aDlPf13UtiGs7yuHCd8eHSLHbHJTU8Sd",
  "updateTime": 1529048163000,
  "updaterId": "aDlPf13UtiGs7yuHCd8eHSLHbHJTU8Sd",
  "updaterName": "aDlPf13UtiGs7yuHCd8eHSLHbHJTU8Sd"
}
 */
export async function getDocContainer(projectId) {
    let api = `/doc/${projectId}/doc/container`;
    return requestJSON(api, {
        method: 'GET',
    });
}

/**
 * 获取文档rootDir
 * 
 * @param {项目id} projectId 
 * response
 * {
  "fileId": "f6568b4ec8a545cc9d22bc081be2f269",
  "workspaceId": "f6568b4ec8a545cc9d22bc081be2f269",
  "name": "/",
  "suffix": null,
  "folder": true,
  "length": 0,
  "parentId": null,
  "appKey": null,
  "creatorId": "aDlPf13UtiGs7yuHCd8eHSLHbHJTU8Sd",
  "creatorName": "aDlPf13UtiGs7yuHCd8eHSLHbHJTU8Sd",
  "createTime": 1529048163000,
  "digest": null,
  "thumbnail": null,
  "versionIndex": null,
  "filePath": null,
  "revisionId": null,
  "current": false,
  "alias": null,
  "index": null,
  "fileParentList": null,
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
export async function getDocRootDir(projectId) {
    let api = `/doc/${projectId}/doc/rootDir`;
    return requestJSON(api, {
        method: 'GET',
    });
}

/** 模型 图纸 */