import { requestJSON, BASE_URL } from "common-module"


/**
 * 构建项外分享的URL
 *
 * @export
 * @param {*} shareToken 从服务器端得到的分享token
 * @returns 用于向外分享的url完整地址。
 */
export function buildShareUrl(shareToken) {
    return `${BASE_URL}/share.html?t=${shareToken}`;
}

/**
 * 查询子文件（仅包含下一级）
 * @param {*} containerId 
 * @param {*} fileId 
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
export async function getDocFileChildrens(containerId, fileId, orderByType=null, withPrivilege = true,folder=null,order=null,filePath=null,) {
    let api = `/bimpm/doc/containers/${containerId}/files/children`;
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
    if (folder) {
        filter += `&folder=${folder}`
    }
    if (withPrivilege) {
        filter += `&withPrivilege=${withPrivilege}`
    }
    return requestJSON(api + `?${filter}`, {
        method: 'GET',
    });
}

/**
 * 创建文件夹（根据parentId和fileName，或者filePath创建）
 * @param {*} containerId 
 * @param {*} parentId 
 * @param {*} fileName 
 * 
 * response
 * {
  "fileId": "13192447cd3e47d1b1857aa0d5cb5722",
  "workspaceId": "f6568b4ec8a545cc9d22bc081be2f269",
  "name": "test",
  "suffix": null,
  "folder": true,
  "length": 0,
  "parentId": "f6568b4ec8a545cc9d22bc081be2f269",
  "appKey": null,
  "creatorId": "6295429827273925422",
  "creatorName": "徐园",
  "createTime": 1530078606000,
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
 */
export async function createDocDir(containerId, parentId, fileName) {
    let api = `/bimpm/doc/containers/${containerId}/files`
    let filter = '';
    if (parentId) {
        filter += `&parentId=${parentId}`
    }
    if (fileName) {
        filter += `&fileName=${fileName}`
    }
    return requestJSON(api + `?${filter}`, {
        method: 'POST',
    });

}

/**
 * 复制文件
 * @param {*} containerId 
 * @param {*} fileId 
 * @param {*} targetParentId 
 * response
 * {
  "success": [//新的文件信息
    {
      "fileId": "d97b85ab8d3f4ee29ea0e4181a0c64c7",
      "workspaceId": "f6568b4ec8a545cc9d22bc081be2f269",
      "name": "test2",
      "suffix": null,
      "folder": true,
      "length": 0,
      "parentId": "f6568b4ec8a545cc9d22bc081be2f269",
      "appKey": null,
      "creatorId": "6295429827273925422",
      "creatorName": "徐园",
      "createTime": 1530079759000,
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
  ],
  "failure": []//如果失败的话，success为[],failure中为原文件的信息
}
 */
export async function copyDocFile(containerId, fileId, targetParentId) {
    let api = `/bimpm/doc/containers/${containerId}/files/copy`
    let filter = '';
    if (fileId) {
        filter += `&fileId=${fileId}`
    }
    if (targetParentId) {
        filter += `&targetParentId=${targetParentId}`
    }
    return requestJSON(api + `?${filter}`, {
        method: 'POST',
    });
}

/**
 * 批量复制文件
 * @param {*} containerId 
 * @param {*} fileIds 文件id数组
 * @param {*} targetParentId 
 * response 
 * {
  "success": [
    
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
export async function copyDocFileBatch(containerId, fileIds, targetParentId) {
    let api = `/bimpm/doc/containers/${containerId}/files/copy/batch`
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
 * 移动文件
 * @param {*} containerId 
 * @param {*} fileId 
 * @param {*} targetParentId 
 * 
 * response同复制
 */
export async function moveDocFile(containerId, fileId, targetParentId) {
    let api = `/bimpm/doc/containers/${containerId}/files/move`
    let filter = '';
    if (fileId) {
        filter += `&fileId=${fileId}`
    }
    if (targetParentId) {
        filter += `&targetParentId=${targetParentId}`
    }
    return requestJSON(api + `?${filter}`, {
        method: 'POST',
    });
}

/**
 * 批量移动
 * @param {*} containerId 
 * @param {*} fileIds 数组 
 * @param {*} targetParentId 
 * response同批量复制
 */
export async function moveDocFileBatch(containerId, fileIds, targetParentId) {
    let api = `/bimpm/doc/containers/${containerId}/files/move/batch`
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
 * 重命名
 * @param {*} containerId 
 * @param {*} fileId 
 * @param {*} targetName 
 * 
 * response
 * success 200 response为空
 * fail
 * {"code":"19006","message":"file[aaa] exist","callStack":null}
 */
export async function renameDocFile(containerId, fileId, targetName) {
    // /bimpm/doc/containers/f6568b4ec8a545cc9d22bc081be2f269/files/rename?fileId=13192447cd3e47d1b1857aa0d5cb5722&targetName=sss
    let api = `/bimpm/doc/containers/${containerId}/files/rename`
    let filter = '';
    if (fileId) {
        filter += `&fileId=${fileId}`
    }
    if (targetName) {
        filter += `&targetName=${targetName}`
    }
    return requestJSON(api + `?${filter}`, {
        method: 'POST',
    });
}

/**
 * 删除单个文件
 * @param {*} containerId 
 * @param {*} fileId 
 * 
 * response{
  "success": [
    {
      "fileId": "13192447cd3e47d1b1857aa0d5cb5722",
      "workspaceId": "f6568b4ec8a545cc9d22bc081be2f269",
      "name": "test",
      "suffix": null,
      "folder": true,
      "length": 0,
      "parentId": "f6568b4ec8a545cc9d22bc081be2f269",
      "appKey": null,
      "creatorId": "6295429827273925422",
      "creatorName": "徐园",
      "createTime": 1530078606000,
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
  ],
  "failure": []
}
response 500
{
  "code": "19001",
  "message": "invalid fileId",
  "callStack": null
}
 */
export async function deleteDocFile(containerId, fileId) {
    let api = `/bimpm/doc/containers/${containerId}/files`
    let filter = 'purge=true';
    if (fileId) {
        filter += `&fileId=${fileId}`
    }
    return requestJSON(api + `?${filter}`, {
        method: 'DELETE',
    });
}

/**
 * 批量删除
 * @param {*} containerId 
 * @param {*} fileIds 数组
 * @param {*} targetParentId 
 */
export async function deleteDocFileBatch(containerId, fileIds) {
    let api = `/bimpm/doc/containers/${containerId}/files/batch`
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

/**
 * 回收站列表
 * @param {*} containerId 
 * @param {*} fileId 
 * @param {*} orderByType 
 * @param {*} withPrivilege 
 * response
 * {
  "totalItemCount": 0,
  "pageItemCount": 100,
  "pageIndex": 0,
  "pageCount": 1,
  "items": []
  }
 */
export async function getTrashFiles(containerId, pageIndex) {
    let api = `/bimpm/doc/containers/${containerId}/files/trash`;
    let filter = "";
    pageIndex = pageIndex || 0;
    filter += `&pageIndex=${pageIndex}`
    return requestJSON(api + `?${filter}`, {
        method: 'GET',
    });
}

/**
 * 删除回收站单个文件
 * @param {*} containerId 
 * @param {*} fileId 
 * response 
 * no content
 */
export async function deleteTrashFile(containerId, fileId) {
    let api = `/bimpm/doc/containers/${containerId}/files/trash`;
    let filter = "";
    if (fileId) {
        filter += `&fileId=${fileId}`
    }
    return requestJSON(api + `?${filter}`, {
        method: 'DELETE',
    });
}

/**
 * 批量删除回收站文件
 * @param {*} containerId 
 * @param {*} fileIds 数组
 * response 
 * no content
 */
export async function deleteTrashFileBatch(containerId, fileIds) {
    let api = `/bimpm/doc/containers/${containerId}/files/trash/batch`;
    let props = JSON.stringify({ fileIds: fileIds })
    return requestJSON(api, {
        method: 'DELETE',
        body: props,
    });
}


/**
 * 还原回收站文件
 * @param {*} containerId 
 * @param {*} fileId 
 */
export async function recoveryTrashFile(containerId, fileId) {
    let api = `/bimpm/doc/containers/${containerId}/files/trash/recovery`;
    let filter = "";
    if (fileId) {
        filter += `&fileId=${fileId}`
    }
    return requestJSON(api + `?${filter}`, {
        method: 'POST',
    });
}

/**
 * 批量还原回收站文件
 * @param {*} containerId 
 * @param {*} fileIds 数组
 * response 
 * no content
 */
export async function recoveryTrashFileBatch(containerId, fileIds) {
    let api = `/bimpm/doc/containers/${containerId}/files/trash/recovery/batch`;
    let props = JSON.stringify({ fileIds: fileIds })
    return requestJSON(api, {
        method: 'POST',
        body: props,
    });
}

/**
 * 清空回收站
 * response 
 * no content
 */
export async function clearTrashFileBatch(containerId) {
    let api = `/bimpm/doc/containers/${containerId}/files/trash/clear`;
    return requestJSON(api, {
        method: 'DELETE',
    });
}

/**
 * 收藏文件
 * @param {*} containerId 
 * @param {*} fileId 
 * response
 * {
  "fileId": "string",
  "message": "string",
  "name": "string",
  "success": true
   }
 */
export async function favoritesDocFile(containerId, fileId) {
    let api = `/bimpm/doc/containers/${containerId}/files/favorites`;
    let filter = "";
    if (fileId) {
        filter += `&fileId=${fileId}`
    }
    return requestJSON(api + `?${filter}`, {
        method: 'POST',
    });
}


/**
 * 批量收藏
 * @param {*} containerId 
 * @param {*} fileIds 数组
 * response
 * [
  {
    "fileId": "730351e358cd423aa1f9f0039fd3ada2",
    "name": "wode.jpg",
    "success": true,
    "message": null
  }
]
 */
export async function favoritesDocFileBatch(containerId, fileIds) {
    let api = `/bimpm/doc/containers/${containerId}/files/favorites/batch`;
    let props = JSON.stringify({ fileIds: fileIds })
    return requestJSON(api, {
        method: 'POST',
        body: props,
    });
}


/**
 * 取消收藏文件
 * @param {*} containerId 
 * @param {*} fileId 
 * response
 *no content
 */
export async function cancelFavoritesDocFile(containerId, fileId) {
    let api = `/bimpm/doc/containers/${containerId}/files/favorites`;
    let filter = "";
    if (fileId) {
        filter += `&fileId=${fileId}`
    }
    return requestJSON(api + `?${filter}`, {
        method: 'DELETE',
    });
}


/**
 * 批量取消收藏
 * @param {*} containerId 
 * @param {*} fileIds 数组
 * response
 * no content
 */
export async function cancelFavoritesDocFileBatch(containerId, fileIds) {
    let api = `/bimpm/doc/containers/${containerId}/files/favorites/batch`;
    let props = JSON.stringify({ fileIds: fileIds })
    return requestJSON(api, {
        method: 'DELETE',
        body: props,
    });
}

/**
 * 收藏文件列表
 * [
  {
    "fileId": "730351e358cd423aa1f9f0039fd3ada2",
    "workspaceId": "f6568b4ec8a545cc9d22bc081be2f269",
    "name": "wode.jpg",
    "suffix": "jpg",
    "folder": false,
    "length": 595284,
    "parentId": "985b27cd365f4ea089d8a5e2f787eddf",
    "appKey": null,
    "creatorId": "6295429827273925422",
    "creatorName": "徐园",
    "createTime": 1529370894000,
    "digest": "77aa31d5585383a0f7a57b859210e382",
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
 */
export async function getFavoritesDocFile(containerId) {
    let api = `/bimpm/doc/containers/${containerId}/files/favorites`;
    return requestJSON(api, {
        method: 'GET',
    });
}

/**
 * 获取上传operateCode
 * @param {*} containerId 
 * @param {*} parentId
 * @param {*} fileName
 * @param {*} size 上传文件大小
 * @param {*} digest 上次文件信息，这里可以不传或者传MD5值，但不要传递空
 * response
// {
//     "data": "28588931-4416-4975-80c1-7d9d76ca455d"
//   }
*/
export async function getDocFileUploadOperateCode(containerId,parentId,fileName,size,digest='project') {
    let api = `/bimpm/doc/containers/${containerId}/files/upload/operateCode`;
    // {
    //     "callbackUrl": "string",
    //     "digest": "string",
    //     "folderPath": "string",
    //     "parentId": "string",
    //     "fileName": "string",
    //     "size": 0
    //   }
    // demo data: {"fileName":"baiduShare.html","parentId":"aefeslksjftrhxksjdfls1d234lxfj","digest":"project","size":"1567"}
    let props = JSON.stringify({ parentId:parentId, fileName:fileName, size:size, digest:digest })
    return requestJSON(api, {
        method: 'POST',
        body: props,
    });
}



/**
 * 获取文档的下载地址
 * @param {*} containerId 
 * @param {*} fileId 
 * {
  "fileId": "730351e358cd423aa1f9f0039fd3ada2",
  "name": "wode.jpg",
  "workspaceId": "f6568b4ec8a545cc9d22bc081be2f269",
  "signedURL": "https://gly-dev-gdoc.oss-cn-shanghai.aliyuncs.com/object/77/aa31d5585383a0f7a57b859210e382?Expires=1530090045&OSSAccessKeyId=LTAIP9gxLRjd80Fl&Signature=C5A2e0y0wANN3VNVMM39ZYGKT9o%3D&response-content-disposition=attachment%3Bfilename%3D%22wode.jpg%22",
  "versionIndex": "1"
}
 */
export async function getDocFileSingedUrl(containerId,fileId) {
    let api = `/bimpm/doc/containers/${containerId}/files/signedURL`;
    let filter = `fileId=${fileId}`;
    return requestJSON(api + `?${filter}`, {
        method: 'GET',
    });
}

/**
 * 创建分享
 * @param {*} containerId 
 * @param {*} fileId 
 * @param {*} encrypt 
 * @param {*} expireTime 
 * @param {*} privilege 
 * response
 * {
  "creatorId": "6295429827273925422",
  "creatorName": "徐园",
  "createTime": 1530085482965,
  "title": "wode.jpg",
  "expireTime": null,
  "token": "bONgGp",
  "password": "SKt0",
  "encrypt": true,
  "privilege": [],
  "viewCount": 0,
  "downloadCount": 0,
  "transferCount": 0
}
 */
export async function createDocShare(containerId, fileId, encrypt = true, expireTime, privilege) {
    let api = `/bimpm/doc/share/containers/${containerId}/files/${fileId}`;
    let filter = `&encrypt=${encrypt}`;
    if (expireTime) {
        filter += `&expireTime=${expireTime}`
    }
    if (privilege) {
        filter += `&privilege=${privilege}`
    }
    return requestJSON(api + `?${filter}`, {
        method: 'POST',
    });
}

/**
 * 获取分享文件已签名的下载地址
 * @param {*} shareToken 
 * @param {*} fileId 
 * @param {*} password 
 * response 
 * {
  "data": "https://gly-dev-gdoc.oss-cn-shanghai.aliyuncs.com/object/77/aa31d5585383a0f7a57b859210e382?Expires=1530089908&OSSAccessKeyId=LTAIP9gxLRjd80Fl&Signature=qtWg4AjOrqvTaq%2BWFMBOHaJ7Pls%3D&response-content-disposition=attachment%3Bfilename%3D%22wode.jpg%22"
  }
 */
export async function getShareSignedUrl(shareToken, fileId, password) {
    let api = `/bimpm/doc/share/${shareToken}/files/${fileId}/signedURL`;
    let filter = "";
    if (password) {
        filter += `&password=${password}`
    }
    return requestJSON(api + `?${filter}`, {
        method: 'GET',
    });
}

/**
 * 获取批注列表
 * @param {*} modelVersionId 
 * @param {*} fileId 
 * @param {*} creatorId 
 * @param {*} pageIndex 
 * @param {*} pageSize 
 * 
 * response
 *{
  "code": "string",
  "data": {
    "list": [
      {
        "appKey": "string",
        "attachment": "string",
        "createTime": "1531330238000",
        "creatorId": "string",
        "creatorName": "string",
        "description": "string",
        "favor": false,
        "id": "string",
        "markupId": "string",
        "name": "string",
        "screenshotKey": "string",
        "screenshotName": "string",
        "screenshotType": "string",
        "screenshotURL": "string",
        "state": "string",
        "status": "string",
        "subjectContainerId": "string",
        "subjectId": "string",
        "subjectType": "string",
        "subjectVersion": 0,
        "updateTime": "2018-06-27T03:04:15.201Z",
        "xdata": "string"
      }
    ],
    "total": 0
  },
  "message": "string"
}
}
 */
export async function getModelMarkups(modelVersionId, fileId, creatorId, pageIndex, pageSize) {
    let api = `/bimpm/modelVersions/${modelVersionId}/files/${fileId}/markups`;
    let filter = "";
    if (creatorId) {
        filter += `&creatorId=${creatorId}`
    }
    if (pageIndex) {
        filter += `&pageIndex=${pageIndex}`
    }
    if (pageSize) {
        filter += `&pageSize=${pageSize}`
    }
    return requestJSON(api + `?${filter}`, {
        method: 'GET',
    });
}

/**
 * 批注详情
 * @param {*} modelVersionId 
 * @param {*} fileId 
 * @param {*} markupId 
 * response
 * {
  "code": "string",
  "data": {
    "appKey": "string",
    "attachment": "string",
    "createTime": "2018-06-27T03:04:15.213Z",
    "creatorId": "string",
    "creatorName": "string",
    "description": "string",
    "favor": false,
    "id": "string",
    "markupId": "string",
    "name": "string",
    "screenshotKey": "string",
    "screenshotName": "string",
    "screenshotType": "string",
    "screenshotURL": "string",
    "state": "string",
    "status": "string",
    "subjectContainerId": "string",
    "subjectId": "string",
    "subjectType": "string",
    "subjectVersion": 0,
    "updateTime": "2018-06-27T03:04:15.213Z",
    "xdata": "string"
  },
  "message": "string"
}
 */
export async function getModelMarkupDetail(modelVersionId, fileId, markupId) {
    let api = `/bimpm/modelVersions/${modelVersionId}/files/${fileId}/markups/${markupId}`;

    return requestJSON(api, {
        method: 'GET',
    });
}

/**
 * 删除批注
 * @param {*} modelVersionId 
 * @param {*} fileId 
 * @param {*} markupId 
 * 
 * response
 * {
  "code": "string",
  "data": {
    "appKey": "string",
    "attachment": "string",
    "createTime": "2018-06-27T03:04:15.210Z",
    "creatorId": "string",
    "creatorName": "string",
    "description": "string",
    "favor": false,
    "id": "string",
    "markupId": "string",
    "name": "string",
    "screenshotKey": "string",
    "screenshotName": "string",
    "screenshotType": "string",
    "screenshotURL": "string",
    "state": "string",
    "status": "string",
    "subjectContainerId": "string",
    "subjectId": "string",
    "subjectType": "string",
    "subjectVersion": 0,
    "updateTime": "2018-06-27T03:04:15.210Z",
    "xdata": "string"
  },
  "message": "string"
}
 */
export async function deleteModelMarkup(modelVersionId, fileId, markupId) {
    let api = `/bimpm/modelVersions/${modelVersionId}/files/${fileId}/markups/${markupId}`;
    return requestJSON(api, {
        method: 'DELETE',
    });
}

/**
 * 关闭批注
 * @param {*} modelVersionId 
 * @param {*} fileId 
 * @param {*} markupId 
 * response
 * {
  "code": "string",
  "data": {},
  "message": "string"
}
 */
export async function closeModelMarkup(modelVersionId, fileId, markupId) {
    let api = `/bimpm/modelVersions/${modelVersionId}/files/${fileId}/markups/${markupId}`;
    return requestJSON(api, {
        method: 'PUT',
    });
}

/**
 * 查询批注评论
 * @param {*} modelVersionId 
 * @param {*} fileId 
 * @param {*} markupId 
 * @param {*} offset 
 * @param {*} limit 
 * 
 * response
 * {
  "code": "string",
  "data": [
    {
      "containerId": "string",
      "content": "string",
      "createTime": "2018-06-27T03:04:15.220Z",
      "creatorId": "string",
      "creatorName": "string",
      "id": "string",
      "markupCommentId": "string",
      "updateTime": "2018-06-27T03:04:15.220Z"
    }
  ],
  "message": "string"
}
 */
export async function getModelMarkupComments(modelVersionId, fileId, markupId, offset, limit) {
    let api = `/bimpm/modelVersions/${modelVersionId}/files/${fileId}/markups/${markupId}/comments`;
    let filter = "";
    if (offset) {
        filter += `&offset=${offset}`
    }
    if (limit) {
        filter += `&limit=${limit}`
    }
    return requestJSON(api + `?${filter}`, {
        method: 'GET',
    });
}

/**
 * 新增批注评论
 * @param {*} containerId 
 * @param {*} fileIds 
 * @param {*} markupId 
 * @param {*} content 
 * @param {*} deptId 
 * @param {*} receiverIds 
 * response
 * {
  "code": "string",
  "data": {
    "containerId": "string",
    "content": "string",
    "createTime": "2018-06-27T03:04:15.223Z",
    "creatorId": "string",
    "creatorName": "string",
    "id": "string",
    "markupCommentId": "string",
    "updateTime": "2018-06-27T03:04:15.223Z"
  },
  "message": "string"
}
 */
export async function addModelMarkupComment(modelVersionId, fileId, markupId, content, deptId, receiverIds = []) {
    let api = `/bimpm/modelVersions/${modelVersionId}/files/${fileId}/markups/${markupId}/comments`;
    let params = {
        content: content,
        deptId: deptId,
        receiverIds: receiverIds,
    }
    let props = JSON.stringify(params);
    return requestJSON(api, {
        method: 'POST',
        body: props,
    });
}

/**
 * 删除批注评论
 * @param {*} containerId 
 * @param {*} fileIds 
 * @param {*} markupId 
 * @param {*} commentId 
 */
export async function deleteModelMarkupComment(containerId, fileIds, markupId, commentId) {
    let api = `/bimpm/modelVersions/${modelVersionId}/files/${fileId}/markups/${markupId}/comments/${commentId}`;
    return requestJSON(api, {
        method: 'DELETE',
    });
}


/**
 * 查询批注截图url screenshotURL
 * @param {*} modelVersionId 
 * @param {*} fileId 
 * @param {*} markupId 
 * response  
 * {
  "code": "string",
  "data": {
    "appKey": "string",
    "attachment": "string",
    "createTime": "2018-06-27T03:04:15.236Z",
    "creatorId": "string",
    "creatorName": "string",
    "description": "string",
    "favor": false,
    "id": "string",
    "markupId": "string",
    "name": "string",
    "screenshotKey": "string",
    "screenshotName": "string",
    "screenshotType": "string",
    "screenshotURL": "string",
    "state": "string",
    "status": "string",
    "subjectContainerId": "string",
    "subjectId": "string",
    "subjectType": "string",
    "subjectVersion": 0,
    "updateTime": "2018-06-27T03:04:15.236Z",
    "xdata": "string"
  },
  "message": "string"
} 
 */
export async function getModelMarkupScreenUrl(modelVersionId, fileId, markupId) {
    let api = `/bimpm/modelVersions/${modelVersionId}/files/${fileId}/markups/${markupId}/screenUrl`;
    return requestJSON(api, {
        method: 'GET',
    });
}

/**
 * 查找文件
 * @param {*} containerId 
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
export async function getDocFileSearch(containerId, name=null, suffix=null, path = null,createTimeFrom=null,createTimeTo=null,creatorId=null,creatorName=null) {
    let api = `/bimpm/doc/containers/${containerId}/files/search`;
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
 * 获取文件完整路径，包括namePath和idPath
 * @param {*} containerId 
 * @param {*} fileId  // 文件id
 * 
 * response
 * 
 {
  "fileIdPath": "string",
  "fileNamePath": "string"
 }
 */
export async function getDocFileMetaPath(containerId, fileId) {
    let api = `/bimpm/doc/containers/${containerId}/files/meta/path`;
    let filter = "fileId=${fileId}";
   
    return requestJSON(api + `?${filter}`, {
        method: 'GET',
    });
}
