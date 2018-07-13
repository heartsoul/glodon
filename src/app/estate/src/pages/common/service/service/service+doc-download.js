import * as API from "./../api/api+bimpm";
/**
 * 获取文档的下载地址
 * @param {*} containerId 
 * @param {*} fileId 
 * @returns
 * "https://gly-dev-gdoc.oss-cn-shanghai.aliyuncs.com/object/77/aa31d5585383a0f7a57b859210e382?Expires=1530090045&OSSAccessKeyId=LTAIP9gxLRjd80Fl&Signature=C5A2e0y0wANN3VNVMM39ZYGKT9o%3D&response-content-disposition=attachment%3Bfilename%3D%22wode.jpg%22"
 */
export function getDocFileSingedUrl(containerId,fileId) {
    if(!containerId || !fileId) {
        alert('参数无效！');
        return '';
    }
    return API.getDocFileSingedUrl(containerId,fileId).then(response => {  
        if(response&&response.data&&response.data.signedURL) {
            return response.data.signedURL;
        }
        throw new Error('没有获取到有效的下载地址！');
    });
}

function download(url,processFun,finishFun) {
    // 这里执行下载
}
/**
 * 下载
 *
 * @export
 * @param {string} [fileData={containerId:'xxxx',parentId:'xxxx',name:'fileName',size:0,file:{},path:'file path'}]
 * 需要信息有容器id，父目录id，文件名，文件大小，文件对象或文件的路径
 * @returns
 */
export async function docDownloadFile(fileData={containerId:'xxxx',fileId:'xxxx'}) { 
    return getDocFileSingedUrl(fileData.containerId,fileData.fileId).then((response)=>{
         
         return download(response,(written, total) => {
             console.log(`doc uploaded:${written / total}`);  
         },(downloadData)=>{
            console.log(`doc download:${downloadData}`); 
         });
     });
 }