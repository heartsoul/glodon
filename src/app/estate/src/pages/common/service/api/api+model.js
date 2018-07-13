import { requestJSON } from "common-module"
import OfflineStateUtil from '../../../../common/utils/OfflineStateUtil'
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
  if(OfflineStateUtil.isOnLine()){
    let api = "/model/" + projectId + "/projectVersion/latestVersion";
    return requestJSON(api, {
        method: 'GET',
    });
  }
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
  if(OfflineStateUtil.isOnLine()){
    let api = "/model/" + projectId + "/" + projectVersionId + "/bim/view/token";
    return requestJSON(api + '?fileId=' + fileId, {
        method: 'GET',
    });
  }
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
  if(OfflineStateUtil.isOnLine()){
    let api = "/model/" + projectId + "/" + versionId + "/model/data/element/property";
    return requestJSON(api + '?fileId=' + fileId + '&elementId=' + elementId, {
        method: 'GET',
    });
  }
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
  if(OfflineStateUtil.isOnLine()){
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
  if(OfflineStateUtil.isOnLine()){
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
}

//获取模型 列表
export async function getModelDataList(projectId, projectVersionId, pageIndex, fileId = 0) {
  if(OfflineStateUtil.isOnLine()){
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
  if(OfflineStateUtil.isOnLine()){
    let api = `/model/${projectId}/${projectVersionId}/bim/file/query`;
    let filter = `?name=${name}&suffix=${suffix}&isModel=${isModel}`;
    return requestJSON(api + filter, {
        method: 'POST',
    });
  }
}

/**
 * 获取图纸缩略图
 * @param {*} projectId 
 * @param {*} projectVersion 项目版本
 * @param {*} fileId 
 */
export async function getBluePrintThumbnail(projectId, projectVersion, fileId) {
  if(OfflineStateUtil.isOnLine()){
    let api = `/model/${projectId}/${projectVersion}/viewing/files/${fileId}/thumbnailUrl`;
    return requestJSON(api, {
        method: 'GET',
    });
  }
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
export async function createModelOfflineZip(fileId,containerId) {
  if(OfflineStateUtil.isOnLine()){
    let api = `/bimpm/model/offline/data/${containerId}/files/${fileId}`;
    // console.log(api)
    return requestJSON(api, {
        method: 'PUT',
        // body:JSON.stringify({'key':'value'}),
    });
  }
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
export async function getModelOfflineZipStatus(fileId,containerId) {
  if(OfflineStateUtil.isOnLine()){
    let api = `/bimpm/model/offline/data/${containerId}/files/${fileId}`;
    return requestJSON(api, {
        method: 'GET',
    });
  }
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
export async function getModelOfflineZipAddress(fileId,databagVersion,containerId) {
  if(OfflineStateUtil.isOnLine()){
    let api = `/bimpm/model/offline/data/${containerId}/files`;
    let filter = '';
    filter += '&fileId=' + fileId;
    filter += '&databagVersion=' + databagVersion;
      return requestJSON(api + '?' + filter, {
          method: 'GET',
      });
  }
}

/**
 * 获取模型构件的属性
                        { data:
I/ReactNativeJS( 7746):    { code: '0',
I/ReactNativeJS( 7746):      message: 'success',
I/ReactNativeJS( 7746):      data:
I/ReactNativeJS( 7746):       { elementId: '8398946',
I/ReactNativeJS( 7746):         name: '热镀锌 -普通-1.0',
I/ReactNativeJS( 7746):         familyGuid: '',
I/ReactNativeJS( 7746):         boundingBox:
I/ReactNativeJS( 7746):          { min: { x: -10640.99, y: 13619.73, z: 20183.15 },
I/ReactNativeJS( 7746):            max: { x: -7952.671, y: 13653.43, z: 20216.85 } },
I/ReactNativeJS( 7746):         properties:
I/ReactNativeJS( 7746):          [ { group: '基本属性',
I/ReactNativeJS( 7746):              items:
I/ReactNativeJS( 7746):               [ { key: 'specialty', value: '', unit: '' },
I/ReactNativeJS( 7746):                 { key: 'floor', value: '8', unit: '' },
I/ReactNativeJS( 7746):                 { key: 'categoryId', value: '-2008044', unit: '' },
I/ReactNativeJS( 7746):                 { key: 'categoryName', value: '管道', unit: '' },
I/ReactNativeJS( 7746):                 { key: 'family', value: '管道类型', unit: '' },
I/ReactNativeJS( 7746):                 { key: 'familyType', value: '热镀锌 -普通-1.0', unit: '' },
I/ReactNativeJS( 7746):                 { key: 'systemType', value: '', unit: '' },
I/ReactNativeJS( 7746):                 { key: 'building', value: '', unit: '' } ] },
I/ReactNativeJS( 7746):            { group: 'PG_SEGMENTS_FITTINGS',
I/ReactNativeJS( 7746):              items: [ { key: '布管系统配置', value: '', unit: '' } ] },
I/ReactNativeJS( 7746):            ]}}}
                        */
export async function getModelAttribute(deptId,versionId,fileId,elementId) {
  if(OfflineStateUtil.isOnLine()){
    let api = `/model/${deptId}/${versionId}/model/data/element/property`;
    let filter = '';
    filter += '&fileId=' + fileId;
    filter += '&elementId=' + elementId;
      return requestJSON(api + '?' + filter, {
          method: 'GET',
      });
  }
}

// 模型图纸文档管理相关api接口
/**
 * 或是文件类型对应的api请求地址key
 *
 * @param {boolean} [modelOrDrawing=true] // true：模型 false：图纸
 * @returns
 */
function toFileType(modelOrDrawing=true) {
  return modelOrDrawing ? 'modelFiles' : 'drawingFiles';
}

/**
 * 获取文档rootDir
 * 
 * @param {项目id} projectId 
 * @param {*} modelVersionId
 * @param {boolean} [modelOrDrawing=true] // true：模型 false：图纸
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
export async function getModelDocRootDir(projectId,modelVersionId,modelOrDrawing=true) {
  let api = `/model/${projectId}/modelVersions/${modelVersionId}/${toFileType(modelOrDrawing)}/rootDir`;
  return requestJSON(api, {
      method: 'GET',
  });
}




/**
 * 查询子文件（仅包含下一级）
 * @param {*} projectId
 * @param {*} modelVersionId 
 * @param {*} fileId 
 * @param {boolean} [modelOrDrawing=true] // true：模型 false：图纸
 * @param {*} orderByType 排序字段，可选值：name,type,time,size, 默认不填是time
 * @param {*} withPrivilege  是否包含权限
 * 
 * response
 * [
  {
    "fileId": "031d576057b340f6aebe76c2c972c83c",
    "workspaceId": "f6568b4ec8a545cc9d22bc081be2f269",
    "name": "vfghghf",
    "suffix": null,
    "folder": true,
    "length": 0,
    "parentId": "f6568b4ec8a545cc9d22bc081be2f269",
    "appKey": null,
    "creatorId": "6295429827273925422",
    "creatorName": "徐园",
    "createTime": 1529051523000,
    "digest": null,
    "thumbnail": null,
    "versionIndex": 1,
    "filePath": null,
    "revisionId": null,
    "current": false,
    "alias": null,
    "index": null,
    "fileParentList": null,
    "convertStatus": null,
    "userPrivilege": {  //没有时是null
      "enter": true,
      "view": true,
      "download": true,
      "create": true,
      "update": true,
      "delete": true,
      "grant": true
    }
  },
]
 */

export async function getModelDocFileChildrens(projectId, modelVersionId, fileId, modelOrDrawing=true, orderByType=null, order=null, filePath=null) {
  let api = `/model/${projectId}/modelVersions/${modelVersionId}/${toFileType(modelOrDrawing)}/children`;
  let filter = "";
  if (fileId) {
      filter += `&fileId=${fileId}`
  }
  if (filePath) {
      filter += `&filePath=${filePath}`
  }
  if (orderByType) {
      filter += `&orderByType=${orderByType}`
  }
  if (order) {
      filter += `&order=${order}`
  }
  return requestJSON(api + `?${filter}`, {
      method: 'GET',
  });
}

/**
 * 获取模型/图纸上传operateCode
 * @param {*} projectId 
 * @param {*} modelVersionId
 * @param {*} folderPath 目录路径
 * @param {*} size 上传文件大小 
 * @param {boolean} [modelOrDrawing=true] // true：模型 false：图纸
 * @param {*} digest 上次文件信息，这里可以不传或者传MD5值，但不要传递空
 * response
// {
//     "data": "28588931-4416-4975-80c1-7d9d76ca455d"
//   }
*/
export async function getModelFileUploadOperateCode(projectId,modelVersionId,folderPath,size,modelOrDrawing=true,digest='project') {
  let api = `/model/${projectId}/modelVersions/${modelVersionId}/${toFileType(modelOrDrawing)}/files/upload/operateCode`;
  // {
  //     "callbackUrl": "string",
  //     "digest": "string",
  //     "folderPath": "string",
  //     "size": 0
  //   }
  // demo data: {"folderPath":"/1/3/baiduShare.html","digest":"project","size":"1567"}
  let props = JSON.stringify({ folderPath:folderPath, size:size, digest:digest })
  return requestJSON(api, {
      method: 'POST',
      body: props,
  });
}

// http://bim_test.glodon.com/model/5216581/projectVersion?t=1531362151220&projectId=5216581
/**
* 获取当前版本列表
* 
* @export
* @param {number} projectId 项目id
* @returns 
{"code":"0","message":"success",
"data":[
  {"projectId":5216581,
  "modelId":"2641bf717cc94db7a124dbf20601bb99",
  "versionId":"2641bf717cc94db7a124dbf20601bb99",
  "containerId":"2641bf717cc94db7a124dbf20601bb99",
  "baseVersionId":null,
  "name":"初始版本",
  "type":1,
  "businessStatus":1,
  "latest":true,
  "released":false,
  "createTime":1531206445000,
  "updateTime":1531206445000
}
]
}
*/
export async function getModelProjectVersion(projectId) {
    let t = new Date().getTime();
    let api = `/model/${projectId}/projectVersion?t=${t}&projectId=${projectId}`;
    return requestJSON(api, {
        method: 'GET',
    });
  
}

/**
 * 查找文件
 * @param {*} projectId 
 * @param {*} modelVersionId // 版本id
 * @param {boolean} [modelOrDrawing=true] // true：模型 false：图纸
 * @param {*} name  // 文件名， 全字匹配
 * @param {*} suffix // 后缀名， 全字匹配
 * @param {*} path  // 路径
 * @param {*} createTimeFrom  // 创建时间 范围开始时间
 * @param {*} createTimeTo // 创建时间 范围结束时间
 * @param {*} creatorId // 创建人id
 * @param {*} creatorName  // 创建人
 * 
 * response
 * [
  {
    "fileId": "031d576057b340f6aebe76c2c972c83c",
    "workspaceId": "f6568b4ec8a545cc9d22bc081be2f269",
    "name": "vfghghf",
    "suffix": null,
    "folder": true,
    "length": 0,
    "parentId": "f6568b4ec8a545cc9d22bc081be2f269",
    "appKey": null,
    "creatorId": "6295429827273925422",
    "creatorName": "徐园",
    "createTime": 1529051523000,
    "digest": null,
    "thumbnail": null,
    "versionIndex": 1,
    "filePath": null,
    "revisionId": null,
    "current": false,
    "alias": null,
    "index": null,
    "fileParentList": null,
    "convertStatus": null,
    "userPrivilege": {  //没有时是null
      "enter": true,
      "view": true,
      "download": true,
      "create": true,
      "update": true,
      "delete": true,
      "grant": true
    }
  },
]
 */
export async function getDocFileSearch(projectId,modelVersionId,modelOrDrawing=true, name=null, suffix=null, path = null,createTimeFrom=null,createTimeTo=null,creatorId=null,creatorName=null) {
  let api = `/model/${projectId}/modelVersions/${modelVersionId}/${toFileType(modelOrDrawing)}/files/search`;
  let filter = "";
  if (name) {
      filter += `&name=${name}`
  }
  if (suffix) {
      filter += `&suffix=${suffix}`
  }
  if (path) {
      filter += `&path=${path}`
  }
  if (createTimeFrom) {
      filter += `&createTimeFrom=${createTimeFrom}`
  }
  if (createTimeTo) {
      filter += `&createTimeTo=${createTimeTo}`
  }
  if (creatorId) {
      filter += `&creatorId=${creatorId}`
  }
  if (creatorName) {
      filter += `&creatorName=${creatorName}`
  }
  return requestJSON(api + `?${filter}`, {
      method: 'GET',
  });
}


/**
 * 批量复制文件
 * @param {*} projectId 
 * @param {*} modelVersionId // 版本id
 * @param {boolean} [modelOrDrawing=true] // true：模型 false：图纸
 * @param {*} fileIds 文件id数组
 * @param {*} targetParentId 
 * response 
 * {
  "success": [
    file对象
  ],
  "failure": [
    {
      "fileId": "19ef5970521a4fa1a42d8365440a4a66",
      "workspaceId": "f6568b4ec8a545cc9d22bc081be2f269",
      "name": "testa",
      "suffix": null,
      "folder": true,
      "length": 0,
      "parentId": "13192447cd3e47d1b1857aa0d5cb5722",
      "appKey": null,
      "creatorId": "6295429827273925422",
      "creatorName": "徐园",
      "createTime": 1530080526000,
      "digest": null,
      "thumbnail": null,
      "versionIndex": 1,
      "filePath": null,
      "revisionId": null,
      "current": false,
      "alias": null,
      "index": null,
      "fileParentList": null,
      "convertStatus": null,
      "userPrivilege": null
    }
  ]
}
 */
export async function copyDocFileBatch(projectId, modelVersionId, modelOrDrawing=true, fileIds, targetParentId) {
  let api = `/model/${projectId}/modelVersions/${modelVersionId}/${toFileType(modelOrDrawing)}/copy/batch`
  let params = {
      fileIds: fileIds,
      targetParentId: targetParentId,
  }
  let props = JSON.stringify(params);
  return requestJSON(api, {
      method: 'POST',
      body: props,
  });
}

/**
 * 批量移动
 * @param {*} projectId 
 * @param {*} modelVersionId // 版本id
 * @param {boolean} [modelOrDrawing=true] // true：模型 false：图纸
 * @param {*} fileIds 数组 
 * @param {*} targetParentId 
 * response同批量复制
 */
export async function moveDocFileBatch(projectId, modelVersionId, modelOrDrawing=true, fileIds, targetParentId) {
  let api = `/model/${projectId}/modelVersions/${modelVersionId}/${toFileType(modelOrDrawing)}/move/batch`
  let params = {
      fileIds: fileIds,
      targetParentId: targetParentId,
  }
  let props = JSON.stringify(params);
  return requestJSON(api, {
      method: 'POST',
      body: props,
  });
}

/**
 * 批量删除
 * @param {*} projectId 
 * @param {*} modelVersionId // 版本id
 * @param {boolean} [modelOrDrawing=true] // true：模型 false：图纸
 * @param {*} fileIds 数组
 * @param {*} targetParentId 
 */
export async function deleteDocFileBatch(projectId, modelVersionId, modelOrDrawing=true, fileIds) {
  let api = `/model/${projectId}/modelVersions/${modelVersionId}/${toFileType(modelOrDrawing)}`
  let params = {
      fileIds: fileIds,
      purge: false,
  }
  let props = JSON.stringify(params);
  return requestJSON(api, {
      method: 'DELETE',
      body: props,
  });
}