import { requestJSON } from "../../../base/api+base"

export async function getOperationCode() {
    // http://192.168.81.30/bimpm/attachment/operationCode?
    // containerId=30314&name=pic2.png&digest=pic2.png&length=61365
    let host = "http://192.168.81.30";
    let api = "/bimpm/attachment/operationCode";
   
    let filter = "?containerId=30314&name=pic2.png&digest=pic2.png&length=107815";

    var filePath = 'file:///storage/emulated/0/pic/Jellyfish.jpg'

    let ops = {
        method:'POST', 
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "X-Requested-With": "XMLHttpRequest",
        },
        credentials: 'include', // 带上cookie
    };
    // Authorization  Bearer 6515033c-6c5f-4d6a-8033-ec0906d4f085
    if(global.storage.isLogin()) {
        ops.headers.Authorization = "Bearer "+global.storage.getLoginToken();
    }
    
   
    return fetch(host + api+ filter, ...ops)
        .then((response) => response.text() )  
        .then((responseData)=>{  
            upLoad(responseData);
        })  
        .catch((error)=>{
            alert(222)
        });  
}

export async function upLoad(operationCode) {
    // http://192.168.81.30/bimpm/attachment/operationCode?
    // containerId=30314&name=pic2.png&digest=pic2.png&length=61365
    let BASE_UPLOAD_URL =  "http://172.16.233.183:8093/v1/insecure/objects?operationCode="+operationCode;

    var filePath = 'file:///storage/emulated/0/pic.png'
    let formData = new FormData();       //因为需要上传多张图片,所以需要遍历数组,把图片的路径数组放入formData中  
    let file = {uri: filePath, type: 'application/octet-stream', name: 'image.jpg'};
    formData.append("uploaded_file",file);   //这里的files就是后台需',要的key  
    
   
    return fetch(BASE_UPLOAD_URL,  {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data;charset=utf-8',
        },
        body: formData,
    })
        .then((response) => response.text() )  
        .then((responseData)=>{  
            alert("response:"+responseData)
        })  
        .catch((error)=>{
            alert("error:"+error)
        });  
}