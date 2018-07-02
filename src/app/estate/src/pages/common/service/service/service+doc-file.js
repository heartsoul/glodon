import * as CONSTANT from "./../api/api+constant";
import * as API from "./../api/api+bimpm";


/**
 * 构建项外分享的URL
 *
 * @export
 * @param {*} shareToken 从服务器端得到的分享token
 * @returns 用于向外分享的url完整地址。
 */
export function buildShareUrl(shareToken) {
    if(!shareToken) {
        alert('没有分享token，无法生成正确的数据！！！');
        return '';
    }
    return API.buildShareUrl(shareToken);
}

/**
 * 查询子文件（仅包含下一级）
 *
 * @export
 * @param {*} containerId // 文档容器id
 * @param {*} fileId 文件/文件夹id
 * @param {*} [orderByType=null] 排序字段，可选值：name,type,time,size, 默认不填就是服务器返回的顺序，具体是啥还不知道
 * @param {boolean} [withPrivilege=true] 是否包含权限
 * @param {*} [folder=null] // 是否包含文件夹 不传就是包含文件和文件夹 true：只是文件夹 false:只是文件
 * @param {*} [order=null] // 排序规则 可能是 asc or desc
 * @returns response
 [
  {
    "fileId": "031d576057b340f6aebe76c2c972c83c",
    "name": "vfghghf",
    "folder": true,
    "parentId": "f6568b4ec8a545cc9d22bc081be2f269",
    "creatorId": "6295429827273925422",
    "creatorName": "徐园",
    "createTime": 1529051523000,
    "createTimeShow": '2018-06-30 03:13:43',
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
export function getDocFileChildrens(containerId, fileId, orderByType=null, withPrivilege = true,folder=null,order=null) {
    return API.getDocFileChildrens(containerId, fileId, orderByType, withPrivilege,folder,order,null)
        .then(response => {
            let folderData = [];
            let fileData = [];
            response.data && response.data.map && response.data.map((item)=>{
                let retItemInfo = {
                    "fileId": "031d576057b340f6aebe76c2c972c83c",
                    "name": "vfghghf",
                    "folder": true,
                    "parentId": "f6568b4ec8a545cc9d22bc081be2f269",
                    "creatorId": "6295429827273925422",
                    "creatorName": "徐园",
                    "createTime": 1529051523000,
                    "createTimeShow": '2018-06-30 03:13:43',
                    "userPrivilege": {  //没有时是null
                        "enter": true,
                        "view": true,
                        "download": true,
                        "create": true,
                        "update": true,
                        "delete": true,
                        "grant": true
                    }
                };
                retItemInfo.fileId = item.fileId;
                retItemInfo.name = item.name;
                retItemInfo.folder = item.folder;
                retItemInfo.parentId = item.parentId;
                retItemInfo.creatorId = item.creatorId;
                retItemInfo.creatorName = item.creatorName;
                retItemInfo.createTime = item.createTime;
                retItemInfo.createTimeShow = CONSTANT.formatUnixtimestamp(item.createTime);
                retItemInfo.userPrivilege = item.userPrivilege || null;
                if(item.folder) {
                    folderData.push(retItemInfo);
                } else {
                    fileData.push(retItemInfo);
                }
            });
            return folderData.concat(fileData);
        });
}

/**
 * 批量删除文件/文件夹
 * @param {*} containerId 
 * @param {*} fileIds 数组
 * response 
 {
     success:[{
         "fileId": "13192447cd3e47d1b1857aa0d5cb5722",
      "name": "test",
      "folder": true,
      "parentId": "f6568b4ec8a545cc9d22bc081be2f269",
      }]
     failure:[{
         "fileId": "13192447cd3e47d1b1857aa0d5cb5722",
      "name": "test",
      "folder": true,
      "parentId": "f6568b4ec8a545cc9d22bc081be2f269",
      }]
 }
 */
export function deleteDocFileBatch(containerId, fileIds) {
    return API.deleteDocFileBatch(containerId, fileIds)
        .then(response => {  
            let successData = [];
            let failureData = [];
            response.data && response.data.success && response.data.success.map((item)=>{
                let retItemInfo = {
                    "fileId": "031d576057b340f6aebe76c2c972c83c",
                    "name": "vfghghf",
                    "folder": true,
                    "parentId": "f6568b4ec8a545cc9d22bc081be2f269",
                };
                retItemInfo.fileId = item.fileId;
                retItemInfo.name = item.name;
                retItemInfo.folder = item.folder;
                retItemInfo.parentId = item.parentId;
                successData.push(retItemInfo);
            });
            response.data && response.data.failure && response.data.failure.map((item)=>{
                let retItemInfo = {
                    "fileId": "031d576057b340f6aebe76c2c972c83c",
                    "name": "vfghghf",
                    "folder": true,
                    "parentId": "f6568b4ec8a545cc9d22bc081be2f269",
                };
                retItemInfo.fileId = item.fileId;
                retItemInfo.name = item.name;
                retItemInfo.folder = item.folder;
                retItemInfo.parentId = item.parentId;
                failureData.push(retItemInfo);
            });
            return {success:successData,failure:failureData};
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
  "name": "test",
  "folder": true,
  "parentId": "f6568b4ec8a545cc9d22bc081be2f269",
  "creatorId": "6295429827273925422",
  "creatorName": "徐园",
  "createTime": 1530078606000,
  }
 */
export function createDocDir(containerId, parentId, fileName) {
    return API.createDocDir(containerId, parentId, fileName)
        .then(response => {  
            if(response.data){
                let retItemInfo = {
                    "fileId": "031d576057b340f6aebe76c2c972c83c",
                    "name": "vfghghf",
                    "folder": true,
                    "parentId": "f6568b4ec8a545cc9d22bc081be2f269",
                };
                let item = response.data;
                retItemInfo.fileId = item.fileId;
                retItemInfo.name = item.name;
                retItemInfo.folder = item.folder;
                retItemInfo.parentId = item.parentId;
                retItemInfo.creatorId = item.creatorId;
                retItemInfo.creatorName = item.creatorName;
                retItemInfo.createTime = item.createTime;
                retItemInfo.createTimeShow = CONSTANT.formatUnixtimestamp(item.createTime);
              return retItemInfo;
            };
            return {};
        });
}

/**
 * 重命名
 * @param {*} containerId 
 * @param {*} fileId 
 * @param {*} targetName 
 * 
 * response
 * success 200 response
 * {
 * fileId:fileId,name:targetName
 * }
 * fail
 * {"code":"19006","message":"file[aaa] exist","callStack":null}
 */
export function renameDocFile(containerId, fileId, targetName) {
    return API.renameDocFile(containerId, fileId, targetName)
        .then(response => {  
            return {fileId:fileId,name:targetName};
        });
}

/**
 * 批量复制文件
 * @param {*} containerId 
 * @param {*} fileIds 文件id数组
 * @param {*} targetParentId 
 * response 
 {
     success:[{
         "fileId": "13192447cd3e47d1b1857aa0d5cb5722",
      "name": "test",
      "folder": true,
      "parentId": "f6568b4ec8a545cc9d22bc081be2f269",
      }]
     failure:[{
         "fileId": "13192447cd3e47d1b1857aa0d5cb5722",
      "name": "test",
      "folder": true,
      "parentId": "f6568b4ec8a545cc9d22bc081be2f269",
      }]
 }
 */
export function copyDocFileBatch(containerId, fileIds, targetParentId) {
    return API.copyDocFileBatch(containerId, fileIds, targetParentId)
        .then(response => {  
            let successData = [];
            let failureData = [];
            response.data && response.data.success && response.data.success.map((item)=>{
                let retItemInfo = {
                    "fileId": "031d576057b340f6aebe76c2c972c83c",
                    "name": "vfghghf",
                    "folder": true,
                    "parentId": "f6568b4ec8a545cc9d22bc081be2f269",
                };
                retItemInfo.fileId = item.fileId;
                retItemInfo.name = item.name;
                retItemInfo.folder = item.folder;
                retItemInfo.parentId = item.parentId;
                successData.push(retItemInfo);
            });
            response.data && response.data.failure && response.data.failure.map((item)=>{
                let retItemInfo = {
                    "fileId": "031d576057b340f6aebe76c2c972c83c",
                    "name": "vfghghf",
                    "folder": true,
                    "parentId": "f6568b4ec8a545cc9d22bc081be2f269",
                };
                retItemInfo.fileId = item.fileId;
                retItemInfo.name = item.name;
                retItemInfo.folder = item.folder;
                retItemInfo.parentId = item.parentId;
                failureData.push(retItemInfo);
            });
            return {success:successData,failure:failureData};
        });
}

/**
 * 批量移动
 * @param {*} containerId 
 * @param {*} fileIds 数组 
 * @param {*} targetParentId 
 * response 
 {
     success:[{
         "fileId": "13192447cd3e47d1b1857aa0d5cb5722",
      "name": "test",
      "folder": true,
      "parentId": "f6568b4ec8a545cc9d22bc081be2f269",
      }]
     failure:[{
         "fileId": "13192447cd3e47d1b1857aa0d5cb5722",
      "name": "test",
      "folder": true,
      "parentId": "f6568b4ec8a545cc9d22bc081be2f269",
      }]
 }
 */
export function moveDocFileBatch(containerId, fileIds, targetParentId) {
    return API.moveDocFileBatch(containerId, fileIds, targetParentId)
        .then(response => {  
            let successData = [];
            let failureData = [];
            response.data && response.data.success && response.data.success.map((item)=>{
                let retItemInfo = {
                    "fileId": "031d576057b340f6aebe76c2c972c83c",
                    "name": "vfghghf",
                    "folder": true,
                    "parentId": "f6568b4ec8a545cc9d22bc081be2f269",
                };
                retItemInfo.fileId = item.fileId;
                retItemInfo.name = item.name;
                retItemInfo.folder = item.folder;
                retItemInfo.parentId = item.parentId;
                successData.push(retItemInfo);
            });
            response.data && response.data.failure && response.data.failure.map((item)=>{
                let retItemInfo = {
                    "fileId": "031d576057b340f6aebe76c2c972c83c",
                    "name": "vfghghf",
                    "folder": true,
                    "parentId": "f6568b4ec8a545cc9d22bc081be2f269",
                };
                retItemInfo.fileId = item.fileId;
                retItemInfo.name = item.name;
                retItemInfo.folder = item.folder;
                retItemInfo.parentId = item.parentId;
                failureData.push(retItemInfo);
            });
            return {success:successData,failure:failureData};
        });
}