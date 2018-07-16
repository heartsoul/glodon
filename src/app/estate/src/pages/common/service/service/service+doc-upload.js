import * as API from "./../api/api+bimpm";
import {DeviceEventEmitter} from 'app-3rd';
import {docUploadFileBlob} from "./../api/api+uploadBlob";

export function getDocFileUploadOperateCode(containerId,parentId,fileName,size,digest='project') {
    if(!containerId || !parentId || !fileName || !size) {
        alert('参数无效！');
        return '';
    }
    return API.getDocFileUploadOperateCode(containerId,parentId,fileName,size,digest).then(response => {  
        if(response&&response.data&&response.data.data) {
            return response.data.data;
        }
        throw new Error('没有获取到有效的下载地址！');
    });
}
/**
 *
 * @export
 * @param {string} [fileData={containerId:'xxxx',parentId:'xxxx',name:'fileName',size:0,file:{},path:'file path',randomKey:'randomKey'}]
 * 需要信息有容器id，父目录id，文件名，文件大小，文件对象或文件的路径,文件上传的唯一key，用于任务列表等涉及进度、状态的地方
 * @returns
 */
export async function docUpLoadFile(fileData={containerId:'xxxx',parentId:'xxxx',name:'fileName',size:0,file:{},path:'file path',randomKey:''}) { 
    return getDocFileUploadOperateCode(fileData.containerId,fileData.parentId,fileData.name,fileData.size).then((operationCode)=>{
        let formData = {};
        if(fileData.file) {
            formData = {name:fileData.name,file:fileData.file}
        } else {
            formData = {name:fileData.name,path:fileData.path}
        }
        DeviceEventEmitter.emit('transProcessStart',fileData.randomKey);
        return docUploadFileBlob(fileData.randomKey,formData,operationCode,(progress, total, task, response) => {
            if(response) {
                // 有上传路径返回了，就任务上传完成了。
                DeviceEventEmitter.emit('finishProcessPercent',fileData.randomKey,progress, total,response);
            } else if(total && total <= progress){
                // 进度完成了也任务完成了
                DeviceEventEmitter.emit('finishProcessPercent',fileData.randomKey,progress, total,response);
            } else {
                // 更新进度
                DeviceEventEmitter.emit('transProcessPercent',fileData.randomKey,progress, total, task);
            }
        });
    });
}