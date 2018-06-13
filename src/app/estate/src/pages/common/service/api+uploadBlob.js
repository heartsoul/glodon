
import { requestJSON, BASE_UPLOAD_URL } from "common-module"
import RNFetchBlob from 'react-native-fetch-blob' 

/**
 * 获取operationCode
 * @param {*} name 文件名称
 * @param {*} length 文件大小
 * @param {*} digest md5签名
 */
export async function operationCode(name, length,digest=null) {
    
    let api = "/bimpm/attachment/operationCode";
    let timestamp = new Date().getTime();
    let filter = "?containerId=" + timestamp + "&name=" + name + "&digest=" + (digest?digest:name) + "&length=" + length;

    return requestJSON(api + filter, {
        method: 'GET',
    });
}

/**
 * 上传文件
 * @param {*} fileData 文件数据对象 {name:,path,url} 
 * @param {*} operationCode 上传操作校验码
 * @param {*} onProgress 进度 onProgress(written, total)
 */
export async function uploadFileBlob(fileData,operationCode,onProgress) {
    let api = "/v1/insecure/objects?operationCode=" + operationCode;
    let formData = {};
    if(fileData.url) {
        formData = {name : 'uploaded_file', filename : 'hi'+fileData.name, data: fileData.url};
    } else {
        path = fileData.path;
        console.log('path:', path);
        path = path.replace("file://",'');
        console.log('path1:', path);
        formData = {name : 'uploaded_file', filename : 'hi'+fileData.name, data: RNFetchBlob.wrap(path)};
    }
   return RNFetchBlob.fetch('POST', BASE_UPLOAD_URL + api, {
        'Content-Type' : 'multipart/form-data',
      }, [formData]).uploadProgress({ interval : 1000 }, (written, total) => {
        console.log('uploaded', written / total)
        onProgress && onProgress(written,total);
    }).then((response) => response.json())
    .then((data) => {
        //处理上传成功的数据
        if (data && data.message && "success" == data.message) {
            let res = parseUploadData(data.data);
            if (res && res.name) {
                return res;
            }
        } else {
            return null
        }
    })
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
