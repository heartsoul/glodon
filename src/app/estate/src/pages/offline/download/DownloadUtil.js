import { RNFS } from 'app-3rd';
import DirManager from '../manager/DirManager';


  let jobIdMap = new Map();
  export default class DownloadUtil  {

    //停止下载
    stopDownload(fileId){
        if(jobIdMap.has(fileId)){
            RNFS.stopDownload(jobIdMap.get(fileId));
        }
    }

    //是否已经下载文件
    isFileExist=(fileId,name)=>{
        let dm = new DirManager();
        let path = dm.getDocumentPathById(fileId,name);
        return RNFS.exists(path);
    }
    
    /*下载文件*/
     download=(url,fileId,name,callback)=> {
        
        let dm = new DirManager();
        const downloadDest = dm.getDocumentPathById(fileId,name);
        const options = {
            fromUrl: url,
            toFile: downloadDest,
            progressDivider:10,
            background: true,
            begin: (res) => {
                let progress = 0;
                let total = res.contentLength;
                jobIdMap.set(fileId,res.jobId)
                if(callback){
                    callback({
                        progress:progress,
                        total:total,
                        jobId:res.jobId
                    });
                }
            },
            progress: (res) => {
                // res = { contentLength: 1166005, bytesWritten: 1135267, jobId: 1 }
                let progress = res.bytesWritten;
                let total = res.contentLength;
                if(callback){
                    callback({
                        progress:progress,
                        total:total,
                        jobId:res.jobId
                    });
                }
            }
        };
        try {
            //开始下载
            const ret = RNFS.downloadFile(options);
            // res = { statusCode: 200, bytesWritten: 1166005, jobId: 1 }
           return ret.promise.then(res => {
                // console.log('00000000000000000000000000000')
                // console.log(res)
                let progress = res.bytesWritten;
                let total = res.bytesWritten;
                if(callback){
                    callback({
                        progress:progress,
                        total:total,
                        path:downloadDest,
                        jobId:res.jobId
                    });
                }

            }).catch(err => {
                console.log('err', err);
            });
        }
        catch (e) {
            console.log(error);
        }

    }

   

    

  }