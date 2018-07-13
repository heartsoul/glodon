
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


// Request URL: https://api.glodon.com/gdoc/v4/insecure/operationCode/files?operationCode=11d59f67-c6e4-474d-87bc-c4ed25926e57&
// Request Method: POST
// Status Code: 200 
// Remote Address: 127.0.0.1:8888
// Referrer Policy: no-referrer-when-downgrade
// Access-Control-Allow-Credentials: true
// Access-Control-Allow-Headers: *, DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type
// Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, HEAD
// Access-Control-Allow-Origin: http://bim_test.glodon.com
// Access-Control-Max-Age: 0
// Cache-Control: no-cache, no-store, max-age=0, must-revalidate
// Connection: keep-alive
// Content-Type: application/json;charset=UTF-8
// Date: Thu, 12 Jul 2018 02:12:11 GMT
// Expires: 0
// Pragma: no-cache
// Server: nginx/1.10.1
// Transfer-Encoding: chunked
// X-Content-Type-Options: nosniff
// X-Frame-Options: DENY
// X-XSS-Protection: 1; mode=block
// XDomainRequestAllowed: 1
// Provisional headers are shown
// Content-Type: multipart/form-data; boundary=----WebKitFormBoundary6CnyfXAg12TXBA65
// Origin: http://bim_test.glodon.com
// Referer: http://bim_test.glodon.com/pm/document.html
// User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1
// operationCode: 11d59f67-c6e4-474d-87bc-c4ed25926e57
// (empty)
// ------WebKitFormBoundary6CnyfXAg12TXBA65
// Content-Disposition: form-data; name="filepond"; filename="Simulator Screen Shot - iPhone 6s Plus - 2018-06-19 at 12.19.03.png"
// Content-Type: image/png


// ------WebKitFormBoundary6CnyfXAg12TXBA65
// Content-Disposition: form-data; name="filepond"

// {"operationCode":"11d59f67-c6e4-474d-87bc-c4ed25926e57"}
// ------WebKitFormBoundary6CnyfXAg12TXBA65--

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
    return task.uploadProgress({ interval : 200 }, (written, total) => {
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
            throw new Error('上传失败：'+(data&&data.message))
            return data;
        }
    })
    // return task;
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
