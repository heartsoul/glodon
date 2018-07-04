import { RNFS} from 'app-3rd';
import { Platform,} from 'react-native';

  import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive';
  import {Buffer} from 'buffer';
  import DirManager from '../manager/DirManager'
<<<<<<< Updated upstream
  import API from 'app-api';
=======
  import * as API from 'app-api';
  

  import OfflineManager from '../manager/OfflineManager';
  import ThreadModule from '../model/ThreadModule';
>>>>>>> Stashed changes

  import {DeviceEventEmitter} from 'app-3rd/index';
  
  export default class DownloadModel  {

    //下载多个文件
    downloadMultiItems=(list)=>{
        if(list && list.length>0){
            for(let item of list){
                this.downloadSingleItem(item);
            }
        }
    }

    //下载模型目录中的单个模型文件
    downloadSingleItem=(item)=>{
        
        if(!item){
            return;
        }
        let fileId = item.fileId;
        let parentId = item.parentId;
        // this.addToDownloadQueue(fileId,parentId,item);
        this.getToken(fileId,parentId,item)
    }

    //添加到下载队列
    addToDownloadQueue=(fileId,parentId,item)=>{
        let projectId = storage.loadProject();
        let projectVersionId = storage.getLatestVersionId(projectId);
        let key = fileId+"_"+projectVersionId
        let modelManager = OfflineManager.getModelManager();
        let updateTime = new Date().getTime()+'';
        let value = `path`
        let progress = 0;
        let total = 100;
        let done = progress==total;
        let size = 10;//'M'
        
        modelManager.addToDownloadQueue(key,value,projectVersionId+'',fileId+'',parentId+'',progress+'',total+'',done+'',size+'',updateTime+'',JSON.stringify(item))
    }

    //根据模型的id 下载模型
     getToken = (fileId,parentId,item=null)=>{
         console.log('模型信息=-==============');
         console.log(item);
         let projectId = storage.loadProject();
         let projectVersionId = storage.getLatestVersionId(projectId);
         //判断是否已经下载过   已经下载了 就不再下载了
         let mm = OfflineManager.getModelManager();
         if(mm.isDownloaded(fileId+'_'+projectVersionId)){
             return ;
         }
        let dm = new DirManager();
        dm.makeDirs();
        //查看离线包的生成状态
        API.getModelOfflineZipStatus(fileId,item.workspaceId)
        .then((responseJson)=>{
            //生成中
                        // : { data:
                        //     I/ReactNativeJS( 1123):    { code: '0',
                        //     I/ReactNativeJS( 1123):      message: 'success',
                        //     I/ReactNativeJS( 1123):      data:
                        //     I/ReactNativeJS( 1123):       { fileId: 1375483632698784,
                        //     I/ReactNativeJS( 1123):         databagVersion: '3.5',
                        //     I/ReactNativeJS( 1123):         status: 'processing',
                        //     I/ReactNativeJS( 1123):         reason: null,
                        //     I/ReactNativeJS( 1123):         createTime: '2018-06-27 16:25:53' } } }

                        //成功
                        // { data:
                        //     I/ReactNativeJS( 1123):    { code: '0',
                        //     I/ReactNativeJS( 1123):      message: 'success',
                        //     I/ReactNativeJS( 1123):      data:
                        //     I/ReactNativeJS( 1123):       { fileId: 1375483752850848,
                        //     I/ReactNativeJS( 1123):         databagVersion: '3.5',
                        //     I/ReactNativeJS( 1123):         status: 'success',
                        //     I/ReactNativeJS( 1123):         reason: null,
                        //     I/ReactNativeJS( 1123):         createTime: '2018-06-27 14:03:17' } } }
            console.log('查看离线包的生成状态')
            console.log(responseJson)

            if(responseJson && responseJson.data && responseJson.data.data &&responseJson.data.data.status=='success'){
                let databagVersion = responseJson.data.data.databagVersion;
                API.getModelOfflineZipAddress(fileId,databagVersion,item.workspaceId)
                .then((responseJson)=>{
                    // {
                    //     "code": "string",
                    //     "data": "string",
                    //     "message": "string"
                    //   }
                    console.log('查看离线包的下载地址')
                    console.log(responseJson)
                    if(responseJson && responseJson.data){
                        let name = this.getName(responseJson.data.data)
                        //保存模型id与离线包的名字对应关系
                        storage.setModelFileIdOfflineName(fileId,name);
                        //下载离线包
                        this.downloadFile(responseJson.data.data,name,fileId,parentId,JSON.stringify(item));
                    }
                }).catch((error)=>{
                    console.log('查看离线包的下载地址  err')
                    console.error(error);
                })
            }
            
        })
        .catch((error)=>{
            console.log('查看离线包的生成状态  err')
            console.error(error);
        })
    }

    downloadFile=(formUrl,name,fileId,parentId,item=null)=> {
        ThreadModule.startThread(formUrl,name,fileId,parentId,item,this.downloadFileThread);
    }

    /*下载文件*/
     downloadFileThread=(formUrl,name,fileId,parentId,data)=> {
         let item = JSON.parse(data)
        // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)

        // 图片
        // const downloadDest = `${RNFS.MainBundlePath}/${((Math.random() * 1000) | 0)}.jpg`;
        // const formUrl = 'http://img.kaiyanapp.com/c7b46c492261a7c19fa880802afe93b3.png?imageMogr2/quality/60/format/jpg';

        // 文件
        // const path = RNFS.DocumentDirectoryPath;
        // const path = RNFS.ExternalStorageDirectoryPath;
        let dm = new DirManager();
        const path = dm.getModelPath();
        console.log('start download  path='+path);
        const downloadDest = `${path}/${name}.zip`;
        console.log('downloadDest='+downloadDest);

        let projectId = storage.loadProject();
        let projectVersionId = storage.getLatestVersionId(projectId);
        let key = fileId+"_"+projectVersionId;
        let value = `${path}/${name}`;
        let modelManager = OfflineManager.getModelManager();
        let updateTime = new Date().getTime()+'';
        // const downloadDest = `${path}/${((Math.random() * 1000) | 0)}.zip`;
        // const formUrl = 'http://files.cnblogs.com/zhuqil/UIWebViewDemo.zip';

        // 视频
        // const downloadDest = `${RNFS.MainBundlePath}/${((Math.random() * 1000) | 0)}.mp4`;
        // http://gslb.miaopai.com/stream/SnY~bbkqbi2uLEBMXHxGqnNKqyiG9ub8.mp4?vend=miaopai&
        // https://gslb.miaopai.com/stream/BNaEYOL-tEwSrAiYBnPDR03dDlFavoWD.mp4?vend=miaopai&
        // const formUrl = 'https://gslb.miaopai.com/stream/9Q5ADAp2v5NHtQIeQT7t461VkNPxvC2T.mp4?vend=miaopai&';

        // 音频
        // const downloadDest = `${RNFS.MainBundlePath}/${((Math.random() * 1000) | 0)}.mp3`;
        // http://wvoice.spriteapp.cn/voice/2015/0902/55e6fc6e4f7b9.mp3
        // const formUrl = 'http://wvoice.spriteapp.cn/voice/2015/0818/55d2248309b09.mp3';

        const options = {
            fromUrl: formUrl,
            toFile: downloadDest,
            progressDivider:10,
            background: true,
            begin: (res) => {
                // console.log('begin', res);
                // console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
                let progress = 0;
                let total = res.contentLength;
                let done = progress==total;
                let size = total / 1024 / 1024;//'M'
                size = this.changeTwoDecimal_f(size)
                modelManager.update(key,value,projectVersionId+'',fileId+'',parentId+'',progress+'',total+'',done+'',size+'',updateTime+'',JSON.stringify(item))
            },
            progress: (res) => {
                // res = { contentLength: 1166005, bytesWritten: 1135267, jobId: 1 }
                // key,value,projectVersionId,fileId,parentId,progress,total,done,size
                // let pro = res.bytesWritten / res.contentLength;
                
                let progress = res.bytesWritten;
                let total = res.contentLength;
                let done = progress==total;
                let size = total / 1024 / 1024;//'M'
                size = this.changeTwoDecimal_f(size)
                
                // modelManager.setDownloadingState(true);
                modelManager.update(key,value,projectVersionId+'',fileId+'',parentId+'',progress+'',total+'',done+'',size+'',updateTime+'',JSON.stringify(item))

                // console.log(progress+'  '+total)
                // console.log('11111111111111')
                // console.log(res)
                DeviceEventEmitter.emit(key, { 
                    key: key,
                    value: value,
                    projectVersionId: projectVersionId+'',
                    fileId: fileId+'',
                    parentId:parentId+'',
                    progress: progress+'',
                    total: total+'',
                    done: done+'',
                    size: size+'',
                    updateTime:updateTime,
                    item:item,
                });
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
                let done = progress==total;
                let size = total / 1024 / 1024;//'M'
                size = this.changeTwoDecimal_f(size)
                // console.log('success', res);
                // console.log(progress+'  '+total)
                

                //解压
                const sourcePath = downloadDest;
                const targetPath = path;

                unzip(sourcePath, targetPath)
                .then((address) => {
                    console.log(`unzip completed at ${address}`)
                    
                    //解压成功后删除zip
                    this.deleteFile(sourcePath);
                    //复制app.html到解压后的目录
                    const downloadDest = `${path}/${name}/app.html`;
                    this.copyAppHtml(downloadDest);
                })
                .catch((error) => {
                    console.log(error)
                })

                //设定下载完毕
                // modelManager.setDownloadingState(false);
                modelManager.update(key,value,projectVersionId+'',fileId+'',parentId+'',progress+'',total+'',done+'',size+'',updateTime+'',JSON.stringify(item))
                DeviceEventEmitter.emit(key, { 
                    key: key,
                    value: value,
                    projectVersionId: projectVersionId+'',
                    fileId: fileId+'',
                    parentId:parentId+'',
                    progress: progress+'',
                    total: total+'',
                    done: done+'',
                    size: size+'',
                    updateTime:updateTime,
                    item:item,
                });

            }).catch(err => {
                console.log('err', err);
            });
        }
        catch (e) {
            console.log(error);
        }

    }

    changeTwoDecimal_f(x) {
        try {
            let f_x1 = parseFloat(x);
            if (isNaN(f_x1)) {
                return x;
            }
            let f_x = Math.round(x * 100) / 100;
            let s_x = f_x.toString();
            let pos_decimal = s_x.indexOf('.');
            if (pos_decimal < 0) {
                pos_decimal = s_x.length;
                s_x += '.';
            }
            while (s_x.length <= pos_decimal + 2) {
                s_x += '0';
            }
            return s_x;
        } catch (e) {
            return '0.00';
        }
    }

    getName=(url)=>{
        let index = url.indexOf('?');
        let str = url.substring(0,index);
        let lastIndex = str.lastIndexOf('/');
        let name = str.substring(lastIndex+1);
        let dotIndex = name.lastIndexOf('.');
        return name.substring(0,dotIndex);
    }

    //复制app.html 到离线包目录下
     copyAppHtml=(path)=>{
         if(Platform.OS === 'ios'){

         }
         if(Platform.OS === 'android'){
            const src = 'app.html';
            RNFS.readFileAssets(src)
            .then((result)=>{
                // console.log('read success result='+result);
                this.writeFile(path,result);
            }).catch((err)=>{
                console.log('read error'+err.message);
            })
        }
    }

     writeFile=(path,content)=> {

        // write the file
        RNFS.writeFile(path, content, 'utf8')
            .then((success) => {
                console.log('write success', path);
            })
            .catch((err) => {
                console.log('write error'+err.message);
            });
    }

    /*读取txt文件内容*/
    //  readFile() {
    //     // create a path you want to delete
    //     const path = RNFS.MainBundlePath + '/test.txt';

    //     return RNFS.readFile(path)
    //         .then((result) => {
    //             console.log(result);

    //             this.setState({
    //                 readTxtResult: result,
    //             })
    //         })
    //         .catch((err) => {
    //             console.log(err.message);

    //         });
    // }

    /*将文本写入本地 txt*/
    // writeFile() {
    //     // create a path you want to write to
    //     const path = RNFS.MainBundlePath + '/test.txt';

    //     // write the file
    //     RNFS.writeFile(path, '这是一段文本，YES', 'utf8')
    //         .then((success) => {
    //             console.log('path', path);
    //         })
    //         .catch((err) => {
    //             console.log(err.message);
    //         });
    // }


    /*删除文件*/
     deleteFile(path) {

        return RNFS.unlink(path)
            .then(() => {
                console.log('FILE DELETED');
            })
            // `unlink` will throw an error, if the item to unlink does not exist
            .catch((err) => {
                console.log(err.message);
            });
    }

  }