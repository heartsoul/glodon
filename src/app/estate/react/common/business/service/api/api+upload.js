import * as AppConfig from "./../../../config/AppConfig"

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
 * @param {(code:"success||fail",response)=>{}} callback 回调函数中code为success或者fail，response是错误信息，或者上传成功的数据 resultArray
 */
export async function upLoadFiles(fileData,callback) {
    count = 0;
    len = fileData.length
    result = [];
    fileData.map((file)=>{
        let path = "file://" + file.path;
        getOperationCode(path,file.name,file.length,callback);   
    });
}

/**
 * 获取operationCode
 * @param {*} filePath 文件路径 
 * @param {*} name 文件名称
 * @param {*} length 文件大小
 * @param {*} callback 回调
 */
async function getOperationCode(filePath,name,length,callback) {

    let api = "/bimpm/attachment/operationCode";
    let timestamp =new Date().getTime();
    let filter = "?containerId="+timestamp+"&name="+name+"&digest="+name+"&length="+length;

    let ops = {
        method:'POST', 
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "X-Requested-With": "XMLHttpRequest",
        },
        credentials: 'include', // 带上cookie
    };

    if(global.storage.isLogin()) {
        ops.headers.Authorization = "Bearer "+global.storage.getLoginToken();
    }
    
    return fetch(AppConfig.BASE_URL + api+ filter, ...ops)
        .then((response) => response.text() )  
        .then((responseData)=>{
            upLoad(filePath,name,responseData,callback);
        })  
        .catch((error)=>{
            alert(error)
            callback("fail",error)
        });  
}

/**
 * 上传文件
 * @param {*} filePath 文件路径
 * @param {*} name 文件名
 * @param {*} operationCode 操作码 
 * @param {*} callback 回调
 */
async function upLoad(filePath,name,operationCode,callback) {

    let api =  "/v1/insecure/objects?operationCode="+operationCode;
    let formData = new FormData();     
    let file = {uri: filePath, type: 'application/octet-stream', name: name};
    formData.append("uploaded_file",file);   //这里的uploaded_file就是后台需',要的key  
    let ops = {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data;charset=utf-8',
        },
        body: formData,
    };

    return fetch(AppConfig.BASE_UPLOAD_URL + api, ops)
        .then((response) => response.json() )  
        .then((data)=>{
            //处理上传成功的数据
            if(data && data.message && "success" == data.message ){
                count++;
                let res = parseUploadData(data);
                resultArray.push(res);
            }else{
                callback("fail", data);
            }

            if(count == len){
                callback("success", resultArray);
            }  
        })  
        .catch((error)=>{
            callback("fail", error);
        });  
}
/**
 * 处理返回成功的数据
 * @param {*} data response
 */
function parseUploadData(data){
    let res = {
        name : data.name,
        objectId : data.id,
        extension : data.extension,
        digest : data.digest,
        length : data.length,
        uploadTime : data.createTime,
    }
    return res;
}
