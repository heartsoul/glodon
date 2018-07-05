import * as CONSTANT from "./../api/api+constant";
import API from "./../api/api+bimpm";

/**
 * 回收站列表
 * @param {*} containerId 
 * @param {*} pageIndex 
 * response
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
  },
]
 */
export function getTrashFiles(containerId, pageIndex) {

    return API.getTrashFiles(containerId, pageIndex)
        .then(response => {  
            let folderData = [];
            let fileData = [];
            response.data && response.data.items && response.data.items.map && response.data.items.map((item)=>{
                let retItemInfo = {
                    "fileId": "031d576057b340f6aebe76c2c972c83c",
                    "name": "vfghghf",
                    "folder": true,
                    "parentId": "f6568b4ec8a545cc9d22bc081be2f269",
                    "creatorId": "6295429827273925422",
                    "creatorName": "徐园",
                    "createTime": 1529051523000,
                    "createTimeShow": '2018-06-30 03:13:43',
                };
                retItemInfo.fileId = item.fileId;
                retItemInfo.name = item.name;
                retItemInfo.folder = item.folder;
                retItemInfo.parentId = item.parentId;
                retItemInfo.creatorId = item.creatorId;
                retItemInfo.creatorName = item.creatorName;
                retItemInfo.createTime = item.createTime;
                retItemInfo.createTimeShow = CONSTANT.formatUnixtimestamp(item.createTime);
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
 * 批量删除回收站文件
 * @param {*} containerId 
 * @param {*} fileIds 数组
 * response 
 {}
 */
export function deleteTrashFileBatch(containerId, fileIds) {
    return API.deleteTrashFileBatch(containerId, fileIds)
        .then(response => {  
            return {};
        });
}
/**
 * 批量还原回收站文件
 * @param {*} containerId 
 * @param {*} fileIds 数组
 * response 
 {}
 */
export function recoveryTrashFileBatch(containerId, fileIds) {
    return API.recoveryTrashFileBatch(containerId, fileIds)
        .then(response => {  
            return {};
        });
}

/**
 * 清空回收站
 * @param {*} containerId 
 * response 
 {}
 */
export function clearTrashFileBatch(containerId) {
    return API.clearTrashFileBatch(containerId)
        .then(response => {  
            return {};
        });
}
