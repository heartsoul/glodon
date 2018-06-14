
import { requestJSON, BASE_UPLOAD_URL } from "common-module/index"
import { RNFetchBlob} from 'app-3rd' 
import {DeviceEventEmitter} from 'app-3rd'

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
export async function uploadFileBlob(key,fileData,operationCode,onProgress) {
    let api = "/v1/insecure/objects?operationCode=" + operationCode;
    let formData = {};
    if(fileData.file) {
        formData = {name : 'uploaded_file', filename : 'hi'+fileData.name, data: fileData.file};
    } else {
        path = fileData.path;
        console.log('path:', path);
        path = path.replace("file://",'');
        console.log('path1:', path);
        formData = {name : 'uploaded_file', filename : 'hi'+fileData.name, data: RNFetchBlob.wrap(path)};
    }
    
    let task = RNFetchBlob.fetch('POST', BASE_UPLOAD_URL + api, {
        'Content-Type' : 'multipart/form-data',
      }, [formData]);
      
    DeviceEventEmitter.emit('uploadProcessStart',key,task,()=>{
        task.cancel((reason)=>{
            throw new Error(reason);
        });
    });
    task.uploadProgress({ interval : 200 }, (written, total) => {
        console.log('uploaded', written / total)
        // DeviceEventEmitter.emit('uploadProcessPercent',key,written, total);
        if(task.onProgress){
            task.onProgress(written,total);
        }
        onProgress && onProgress(written,total);
    }).then((response) => response.json())
    .then((data) => {
        //处理上传成功的数据
        if (data && data.message && "success" == data.message) {
            // DeviceEventEmitter.emit('uploadProcessFinish',key,null);
            if(task.onFinish){
                task.onFinish();
            }
            let res = parseUploadData(data.data);
            if (res && res.name) {
                return res;
            }
        } else {
            return null
        }
    })
    return task;
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
