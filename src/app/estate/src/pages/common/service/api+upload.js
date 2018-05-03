
import { requestJSON, BASE_UPLOAD_URL } from "common-module"
import * as AppConfig from "common-module";

var count = 0;//请求成功的数量
var len = 0;//上传文件的数量
/**
 * 上传成功后，用来存储返回数据，
 * 
 * {
 *       name : data.name,
 *       objectId : data.id,
 *       extension : data.extension,
 *       digest : data.digest,
 *       length : data.length,
 *       uploadTime : data.createTime,
 *   }
 * 
 */
var resultArray = [];

/**
 * 上传文件
 * 
 * @param {[{path:"file:///storage/emulated/0/icon.png",name:"icon.png",length:988}]} fileData 文件数组
 * 已上传的图片{ objectId: 'a2dc4b3e003f46b58dacfe2319ba96f3',
     name: 'c2ecd15a5f1c2f95e5ec1ceae6b56dfb.data',
     extension: 'data',
     length: 158983,
     digest: 'acda2ade5c4efc5974f085b884a728cd',
     targetId: '5200266',
     targetType: 'Estate_Quality_Inspection',
     uploadId: null,
     uploadTime: 1524708482000,
     remark: null,
     extData: null,
     id: 5200649,
     creatorId: 5200003,
     creatorName: '徐园',
     updatorId: 5200003,
     updatorName: '徐园',
     createTime: 1524708482000,
     updateTime: 1524708482000,
     url: '' }
 * @param {(code:"success||fail",response)=>{}} callback 回调函数中code为success或者fail，response是错误信息，或者上传成功的数据 resultArray
 */
export async function upLoadFiles(fileData, callback) {
    count = 0;
    len = fileData.length
    resultArray = [];
    fileData.map((file) => {
        let path = "file://" + file.path;
        if(!isUploadedFile(file)){
            getOperationCode(path, file.name, file.length, callback,file.md5);
        }
    });
}
/**
 * 已经上传过的文件不再上传
 * @param {*} file 
 */
function isUploadedFile(file) {
    if (file && file.objectId) {
        let res = {
            name: file.name,
            objectId: file.objectId,
            extension: file.extension,
            digest: file.digest,
            length: file.length,
            uploadTime: file.createTime,
        }
        resultArray.push(res);
        count++;
        if (count == len) {
            callback("success", resultArray);
        }

        return true;
    }
    return false;
}

/**
 * 获取operationCode
 * @param {*} filePath 文件路径 
 * @param {*} name 文件名称
 * @param {*} length 文件大小
 * @param {*} callback 回调
 * @param {*} digest md5签名
 */
async function getOperationCode(filePath, name, length, callback,digest=null) {

    let api = "/bimpm/attachment/operationCode";
    let timestamp = new Date().getTime();
    let filter = "?containerId=" + timestamp + "&name=" + name + "&digest=" + (digest?digest:name) + "&length=" + length;

    let ops = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "X-Requested-With": "XMLHttpRequest",
        },
        credentials: 'include', // 带上cookie
    };

    if (storage.isLogin()) {
        ops.headers.Authorization = "Bearer " + storage.getLoginToken();
    }
    console.log("getOperationCode:"+AppConfig.BASE_URL + api + filter);
    return fetch(AppConfig.BASE_URL + api + filter, ...ops)
        .then((response) => response.text())
        .then((responseData) => {
            console.log("getOperationCode result:"+responseData);
            upLoad(filePath, name, responseData, callback);
        })
        .catch((error) => {
            alert(error)
            callback("fail", error)
        });
}

/**
 * 上传文件
 * @param {*} filePath 文件路径
 * @param {*} name 文件名
 * @param {*} operationCode 操作码 
 * @param {*} callback 回调
 */
async function upLoad(filePath, name, operationCode, callback) {

    let api = "/v1/insecure/objects?operationCode=" + operationCode;
    let formData = new FormData();
    let file = { uri: filePath, type: 'application/octet-stream', name: 'i'+name };
    formData.append("uploaded_file", file);   //这里的uploaded_file就是后台需',要的key  
    let ops = {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data;charset=utf-8',
        },
        body: formData,
    };

    console.log("upload2:"+BASE_UPLOAD_URL + api);
    console.log("upload filePath:"+filePath);
    return fetch(BASE_UPLOAD_URL + api, ops)
        .then((response) => response.json())
        .then((data) => {
            //处理上传成功的数据
            if (data && data.message && "success" == data.message) {
                count++;
                let res = parseUploadData(data.data);
                if (res && res.name) {
                    resultArray.push(res);
                }
            } else {
                callback("fail", data);
            }

            if (count == len) {
                callback("success", resultArray);
            }
        })
        .catch((error) => {
            callback("fail", error);
        });
}
/**
 * 处理返回成功的数据
 * @param {*} data response
 */
function parseUploadData(data) {
    if (!data) {
        return null;
    }
    let res = {
        name: data.name,
        objectId: data.id,
        extension: data.extension,
        digest: data.digest,
        length: data.length,
        uploadTime: data.createTime,
    }
    return res;
}
