import { RNFS} from 'app-3rd';
import { Platform,} from 'react-native';

  import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive';
  import {Buffer} from 'buffer';
  import DirManager from '../manager/DirManager'
  import API from 'app-api';

  
  let dm = new DirManager();
  export default class DownloadModel  {

    

    //创建离线数据包
     getToken = (fileId)=>{

        dm.makeDirs();
        this.createOffline(fileId);
    }

    //生成离线包
     createOffline=(token='',fileId)=>{
        API.createModelOfflineZip(fileId)
        .then((responseJson) => {
            // {
            //     "code": "string",
            //     "data": {
            //       "createTime": "string",
            //       "databagVersion": "string",
            //       "fileId": 0,
            //       "reason": "string",
            //       "status": "string"
            //     },
            //     "message": "string"
            //   }
            console.log('createOffline')
            console.log(responseJson)
            
            //查看离线包的生成状态
            API.getModelOfflineZipStatus(fileId)
            .then((responseJson)=>{
                // {
                //     "code": "string",
                //     "data": {
                //       "createTime": "string",
                //       "databagVersion": "string",
                //       "fileId": 0,
                //       "reason": "string",
                //       "status": "string"
                //     },
                //     "message": "string"
                //   }
                console.log('createOffline')
                console.log(responseJson)
                
            })
            .catch((error)=>{
                console.error(error);
            })
        })
        .catch((error) => {
          console.error(error);
        });
        
    }

    //获取离线包地址
     getAddress = (fileId,databagVersion,token='')=>{
        APi.getModelOfflineZipAddress(fileId,databagVersion)
        .then((responseJson)=>{
            // { code: 'success',
            //     message: null,
            //     data: 'http://bf-prod-databag.oss-cn-beijing.aliyuncs.com/1e5345adce95ee35646148ffaa6194e1/1e5345adce95ee35646148ffaa6194e1.zip?Expires=1526971919&OSSAccessKeyId=5nGlEwOIzrwCVaDZ&Signature=z4DFk0dJDBRXL9sElfgAHQxBYWQ%3D' }
            // console.log(responseJson);
            let name = this.getName(responseJson.data)
            //保存模型id与离线包的名字对应关系
            storage.setModelFileIdOfflineName(fileId,name);
            //下载离线包
            this.downloadFile(responseJson.data,name);
        }).catch((error)=>{
            console.error(error);
        });
    }

     getName=(url)=>{
        let index = url.indexOf('?');
        let str = url.substring(0,index);
        let lastIndex = str.lastIndexOf('/');
        let name = str.substring(lastIndex+1);
        let dotIndex = name.lastIndexOf('.');
        return name.substring(0,dotIndex);
    }

    /*下载文件*/
     downloadFile=(formUrl,name)=> {
        // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)

        // 图片
        // const downloadDest = `${RNFS.MainBundlePath}/${((Math.random() * 1000) | 0)}.jpg`;
        // const formUrl = 'http://img.kaiyanapp.com/c7b46c492261a7c19fa880802afe93b3.png?imageMogr2/quality/60/format/jpg';

        // 文件
        // const path = RNFS.DocumentDirectoryPath;
        // const path = RNFS.ExternalStorageDirectoryPath;
        const path = dm.getModelPath();
        console.log('start download  path='+path);
        const downloadDest = `${path}/${name}.zip`;
        console.log('downloadDest='+downloadDest);
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
            background: true,
            begin: (res) => {
                console.log('begin', res);
                console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
            },
            progress: (res) => {

                let pro = res.bytesWritten / res.contentLength;

                // console.log('progress='+pro);
                // this.setState({
                //     progressNum: pro,
                // });
            }
        };
        try {


            //开始下载
            const ret = RNFS.downloadFile(options);
            ret.promise.then(res => {
                // console.log('success', res);

                // console.log('file://' + downloadDest)

                // RNFS.exists('file://' + downloadDest)
                // .then((str) => {
                //     // console.log('++++++44444444+++');
                //     console.log(str);
                // })
                // .catch((error) => {
                //     // console.log('------------');
                //     console.log(error);
                // })

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

            

            }).catch(err => {
                console.log('err', err);
            });
        }
        catch (e) {
            console.log(error);
        }

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