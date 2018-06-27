import { requestJSON } from "common-module"
/**
 * 模型相关API
 */

/**
* 获取当前已发布的最新版本
* 
* @export
* @param {number} projectId 项目id
* @returns 
{
 "code": "string",
 "data": {
   "baseVersionId": "string",
   "businessStatus": "string",
   "containerId": "string",
   "createTime": 0,
   "latest": true,
   "modelId": "string",
   "name": "string",
   "projectId": 0,
   "released": true,
   "type": "string",
   "updateTime": 0,
   "versionId": "string"
 },
 "message": "string"
}
*/
export async function getModelLatestVersion(projectId) {
    let api = "/model/" + projectId + "/projectVersion/latestVersion";
    return requestJSON(api, {
        method: 'GET',
    });
}

/**
 * 获取模型的token
 * 
 * @export
 * @param {number} projectId 项目id
 * @param {string} projectVersionId  最新版本
 * @param {string} fileId 文件id
 * @returns 
 */
export async function getModelBimFileToken(projectId, projectVersionId, fileId) {
    let api = "/model/" + projectId + "/" + projectVersionId + "/bim/view/token";
    return requestJSON(api + '?fileId=' + fileId, {
        method: 'GET',
    });
}

/**
 * 根据构件id获取构件名称 单模型获取构件属性
 * 
 * @export
 * @param {number} projectId 项目id
 * @param {string} projectVersionId  最新版本
 * @param {string} fileId 文件id
 * @param {string} elementId 构件id
 * @returns 
 {
  "code": "string",
  "data": {
    "boundingBox": {
      "max": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "min": {
        "x": 0,
        "y": 0,
        "z": 0
      }
    },
    "elementId": "string",
    "familyGuid": "string",
    "name": "string",
    "properties": [
      {
        "group": "string",
        "items": [
          {
            "key": "string",
            "unit": "string",
            "value": "string"
          }
        ]
      }
    ]
  },
  "message": "string"
}

 */
export async function getModelElementProperty(projectId, versionId, fileId, elementId) {
    let api = "/model/" + projectId + "/" + versionId + "/model/data/element/property";
    return requestJSON(api + '?fileId=' + fileId + '&elementId=' + elementId, {
        method: 'GET',
    });
}

/**
 * 根据单体id或者专业code查询集成模型文件
 * 
 * @export
 * @param {number} projectId 项目id
 * @param {string} projectVersionId  最新版本
 * @param {string} [buildingId=0]  单体
 * @param {string} [specialtyCode='']  专业
 * @returns 
 {
    "code": "string",
    "data": [
      {
        "buildingId": 0,
        "fileId": "string",
        "fileName": "string"
      }
    ],
    "message": "string"
  }
 */
export async function getModelBimFiles(projectId, projectVersionId, buildingId = 0, specialtyCode = '') {
    let api = "/model/" + projectId + "/" + projectVersionId + "/bimFiles";
    let filter = '';
    if (!(buildingId === 0)) {
        filter += '&buildingId=' + buildingId;
    }
    if (!(specialtyCode === '')) {
        filter += '&specialtyCode=' + specialtyCode;
    }
    return requestJSON(api + '?' + filter, {
        method: 'GET',
    });
}

/**
 * 获取图纸项目列表 直接就是图纸的根目录下面的列表
 * 
 * @export
 * @param {number} projectId 项目id
 * @param {string} projectVersionId 版本id
 * @param {number} pageIndex 当前页码 从1开始
 * @param {number} [fileId=0] 可选 文件id
 * @returns 
 {
  "code": "string",
  "data": {
    "items": [
      {
        "alias": "string",
        "appKey": "string",
        "buildingId": 0,
        "buildingName": "string",
        "convertStatus": "string",
        "createTime": 0,
        "creatorId": "string",
        "creatorName": "string",
        "current": true,
        "digest": "string",
        "fileFolderAssocStatus": "UnAssoc",
        "fileId": "string",
        "fileParentList": [
          null
        ],
        "filePath": "string",
        "folder": true,
        "index": 0,
        "length": 0,
        "name": "string",
        "parentId": "string",
        "revisionId": "string",
        "specialtyCode": "string",
        "specialtyName": "string",
        "suffix": "string",
        "thumbnail": "string",
        "userPrivilege": {
          "create": true,
          "delete": true,
          "download": true,
          "enter": true,
          "grant": true,
          "update": true,
          "view": true
        },
        "versionIndex": 0,
        "workspaceId": "string"
      }
    ],
    "pageCount": 0,
    "pageIndex": 0,
    "pageItemCount": 0,
    "totalItemCount": 0
  },
  "message": "string"
}
 */
export async function getDrawingDataList(projectId, projectVersionId, pageIndex, fileId = 0) {
    // let api = "/model/" + projectId + "/" + projectVersionId + "/bim/file/children";
    // model/{deptId}/modelVersions/{modelVersionId}/drawingFiles/children
    let api = "/model/" + projectId + "/modelVersions/" + projectVersionId + "/drawingFiles/children";
    let filter = '';
    if (!(fileId === 0)) {
        filter += '&fileId=' + fileId;
    }

    return requestJSON(api + '?' + filter, {
        method: 'GET',
    });
}

export async function getModelDataList(projectId, projectVersionId, pageIndex, fileId = 0) {
  // let api = "/model/" + projectId + "/" + projectVersionId + "/bim/file/children";
  // model/{deptId}/modelVersions/{modelVersionId}/drawingFiles/children
  let api = "/model/" + projectId + "/modelVersions/" + projectVersionId + "/modelFiles/children";
  let filter = '';
  if (!(fileId === 0)) {
      filter += '&fileId=' + fileId;
  }

  return requestJSON(api + '?' + filter, {
      method: 'GET',
  });
}

/**
 * 搜索模型或图纸
 * @param {*} projectId 
 * @param {*} projectVersionId 项目版本
 * @param {*} name 搜索关键字
 * @param {*} suffix 模型rvt  图纸dwg
 * @param {*} isModle 默认true
 */
export async function searchModuleBlueprint(projectId, projectVersionId, name, suffix, isModel = false) {
    let api = `/model/${projectId}/${projectVersionId}/bim/file/query`;
    let filter = `?name=${name}&suffix=${suffix}&isModel=${isModel}`;
    return requestJSON(api + filter, {
        method: 'POST',
    });
}

/**
 * 获取图纸缩略图
 * @param {*} projectId 
 * @param {*} projectVersion 项目版本
 * @param {*} fileId 
 */
export async function getBluePrintThumbnail(projectId, projectVersion, fileId) {
    let api = `/model/${projectId}/${projectVersion}/viewing/files/${fileId}/thumbnailUrl`;
    return requestJSON(api, {
        method: 'GET',
    });
}

/**
 * 创建模型的离线数据包
 * @param {*} fileId 模型文件id
 * @returns 
 * {
      "code": "string",
      "data": {
        "createTime": "string",
        "databagVersion": "string",
        "fileId": 0,
        "reason": "string",
        "status": "string"
      },
      "message": "string"
    }
 */
export async function createModelOfflineZip(fileId) {
  let api = `/bimpm/model/offline/data/files/${fileId}`;
  return requestJSON(api, {
      method: 'PUT',
  });
}

/**
 * 获取离线包的生成状态
 * @param {*} fileId 模型文件id
 * @returns 
 * {
      "code": "string",
      "data": {
        "createTime": "string",
        "databagVersion": "string",
        "fileId": 0,
        "reason": "string",
        "status": "string"
      },
      "message": "string"
    }
 */
export async function getModelOfflineZipStatus(fileId) {
  let api = `/bimpm/model/offline/data/files/${fileId}`;
  return requestJSON(api, {
      method: 'GET',
  });
}

/**
 * 获取离线包的下载地址
 * @param {*} fileId 模型文件id
 * @returns 
 * {
      "code": "string",
      "data": "string",
      "message": "string"
    }
 */
export async function getModelOfflineZipAddress(fileId,databagVersion) {
  let api = `/bimpm/model/offline/data/files`;
  let filter = '';
  filter += '&fileId=' + fileId;
  filter += '&databagVersion=' + databagVersion;
    return requestJSON(api + '?' + filter, {
        method: 'GET',
    });
}