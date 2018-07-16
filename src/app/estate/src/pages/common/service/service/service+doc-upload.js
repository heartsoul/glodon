import * as API from "./../api/api+bimpm";
import {uploadFileBlob} from "./../api/api+uploadBlob";

/**
 * 上传
 *
 * @export
 * @param {string} [fileData={containerId:'xxxx',parentId:'xxxx',name:'fileName',size:0,file:{},path:'file path'}]
 * 需要信息有容器id，父目录id，文件名，文件大小，文件对象或文件的路径
 * @returns
 */
export async function docUpLoadFile(fileData={containerId:'xxxx',parentId:'xxxx',name:'fileName',size:0,file:{},path:'file path'}) { 
    return API.getDocFileUploadOperateCode(fileData.containerId,fileData.parentId,fileData.name,fileData.size).then((response)=>{
        let formData = {};
        if(fileData.file) {
            formData = {name:fileData.name,file:fileData.file}
        } else {
            formData = {name:fileData.name,path:fileData.filePath}
        }
        return uploadFileBlob(fileData.randomKey,formData,operationCode,(written, total) => {
            console.log(`doc uploaded:${written / total}`);  
        });
    });
}