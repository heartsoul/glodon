import * as CONSTANT from "./../api/api+constant";
import * as API from "./../api/api+bimpm";

/**
 * 收藏列表
 * @param {*} containerId  
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
export function getFavoritesDocFile(containerId) {

    return API.getFavoritesDocFile(containerId)
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
 * 批量收藏
 * @param {*} containerId 
 * @param {*} fileIds 数组
 * response 
 {}
 */
export function favoritesDocFileBatch(containerId, fileIds) {
    return API.favoritesDocFileBatch(containerId, fileIds)
        .then(response => {  
            return {};
        });
}

/**
 * 批量取消收藏
 * @param {*} containerId 
 * @param {*} fileIds 数组
 * response 
 {}
 */
export function cancelFavoritesDocFileBatch(containerId, fileIds) {
    return API.cancelFavoritesDocFileBatch(containerId, fileIds)
        .then(response => {  
            return {};
        });
}