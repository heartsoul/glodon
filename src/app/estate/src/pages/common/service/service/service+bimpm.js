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
    if (!shareToken) {
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
export function getDocFileChildrens(containerId, fileId, orderByType = null, withPrivilege = true, folder = null, order = null) {

    let retArray = [];
    return API.getDocFileChildrens(containerId, fileId, orderByType, withPrivilege, folder, order, null)
        .then(response => {
            let folderData = [];
            let fileData = [];
            response.data && response.data.map && response.data.map((item) => {
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
                if (item.folder) {
                    folderData.push(retItemInfo);
                } else {
                    fileData.push(retItemInfo);
                }
            });
            return folderData.concat(fileData);
        });
}

/**
 * 获取批注列表
 * @param {*} modelVersionId 
 * @param {*} fileId 
 * @param {*} creatorId 
 * @param {*} pageIndex 
 * @param {*} pageSize 
 */
export async function getModelMarkups(modelVersionId, fileId, creatorId, pageIndex, pageSize) {
    API.getModelMarkups(modelVersionId, fileId, creatorId, pageIndex, pageSize)
        .then(response => {
            return response;
        });
}