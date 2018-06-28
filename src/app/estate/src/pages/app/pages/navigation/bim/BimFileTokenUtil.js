
import API from 'app-api';
import { Toast } from 'antd-mobile';
/**
 * 每次加载模型图纸后重新获取token
 * @param {*} fileId 
 * @param {*} callback 
 */
function getLastetVersion(fileId, callback) {
    API.getModelLatestVersion(storage.loadProject()).then((responseData) => {
        let latestVersion = responseData.data.data.versionId;
        storage.projectIdVersionId = latestVersion;
        getToken(fileId, callback);
    }).catch((error)=>{
        callback(null)
        Toast.info('非常抱歉，您目前没有查看此模型的权限，请联系系统管理员。', 3);
    });

}

function getToken(fileId, callback) {
    API.getModelBimFileToken(storage.loadProject(), storage.projectIdVersionId, fileId).then((responseData) => {
        let token = responseData.data.data;
        global.storage.bimToken = token;
        callback(token);
    }).catch((error)=>{
        Toast.info('抱歉，您目前没有查看此模型的权限，请联系系统管理员。', 3);
        callback(null);
    });
}


function fetchData(requestMethod) {
  requestMethod();    
}
/**
 * 获取token
 * @param {*} fileId  文件id
 * @param { (token)=>{} } callback 获取token后的回调
 */
export function getBimFileToken(fileId, callback) {
    fetchData(() => { getLastetVersion(fileId, callback) })
}
