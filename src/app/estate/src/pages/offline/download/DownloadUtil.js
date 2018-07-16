import { RNFS} from 'app-3rd';
import { Platform,} from 'react-native';

  import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive';
  import {Buffer} from 'buffer';
  import DirManager from '../manager/DirManager'
  import API from 'app-api';
  import OfflineManager from '../manager/OfflineManager';
  import ThreadModule from '../model/ThreadModule';

  import {DeviceEventEmitter} from 'app-3rd/index';
  let jobIdMap = new Map();
  export default class DownloadUtil  {


    //停止下载
    // stopDownload(list){
    //     if(list && list.length>0){
    //         let projectId = storage.loadProject();
    //         let projectVersionId = storage.getLatestVersionId(projectId);
    //         for(let item of list){
    //             let fileId = item.fileId;
    //             if(jobIdMap.has(fileId)){
    //                 RNFS.stopDownload(jobIdMap.get(fileId));
    //                 let key = fileId+'_'+projectVersionId
    //                 DeviceEventEmitter.emit(key, { 
    //                     key: key,
    //                     progress: null,
    //                     total: 100,
    //                     size: 10,
    //                 });
    //             }
    //         }
    //     }
    // }


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
            ret.promise.then(res => {
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