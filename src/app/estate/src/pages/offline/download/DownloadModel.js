import React, { Component } from 'react';
import RNFS from 'react-native-fs';
// import {} from '../../../node_modules/app-html/app.html'

import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
  } from 'react-native';

  import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive';
  import {Buffer} from 'buffer';

  const appKey = 'wAL3NLP0aplEc6GipAXyTbXm7yENchzk';
  const appSecret = 'XV2tDlHB7aBVpEzHLdgcSspABjGWjIMR';
  
  
  export default class App extends Component {

    constructor(){
        super();
        // this.state = {
        //     progressNum: 0,
        // };
    }

    
    //获取离线下载的token
    getToken = ()=>{
        let key = appKey+':'+appSecret;
        let encodeKey = new Buffer(key).toString('base64');
        let auth = 'Basic '+encodeKey;
        let url = 'https://api.bimface.com/oauth2/token';
        let ops = {
            method:'POST',
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json;charset=utf-8",
                "X-Requested-With": "XMLHttpRequest",
                "Authorization":auth,
            },
        };

        fetch(url,ops).then((response) => response.json())
        .then((responseJson) => {
            // { code: 'success',
            //     message: null,
            //     data:
            //     { expireTime: '2018-05-29 08:38:49',
            //     token: '6532e462-334b-48dd-a2f3-86c7b1ab2317' } }
          console.log(responseJson);
          this.createOffline(responseJson.data.token);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    //生成离线包
    createOffline=(token)=>{
        let fileId = '1353300132668256';
        let url = `https://api.bimface.com/files/${fileId}/offlineDatabag`;
        let auth = 'bearer '+token;
        let ops = {
            method:'PUT',
            headers:{
                'Accept': 'application/json',
                "Content-Type": "application/json;charset=utf-8",
                "X-Requested-With": "XMLHttpRequest",
                "Authorization":auth,
            },
        }
        fetch(url,ops).then((response)=>response.json())
        .then((responseJson)=>{
            // { code: 'success',
            //     message: null,
            //     data:
            //     { createTime: '2018-05-22 09:28:23',
            //     databagVersion: '3.0',
            //     fileId: 1353300132668256,
            //     reason: null,
            //     status: 'success' } }
            console.log(responseJson);
            this.getAddress(responseJson.data.fileId,responseJson.data.databagVersion,token);
        }).catch((error) => {
            console.error(error);
          });
    }

    //获取离线包地址
    getAddress = (fileId,databagVersion,token)=>{
        let url = `https://api.bimface.com/data/databag/downloadUrl?fileId=${fileId}&type=offline&databagVersion=${databagVersion}`;
        let auth = 'bearer '+token;
        let ops = {
            method:'GET',
            headers:{
                'Accept': 'application/json',
                "Content-Type": "application/json;charset=utf-8",
                "X-Requested-With": "XMLHttpRequest",
                "Authorization":auth,
            },
        }
        fetch(url,ops).then((response)=>response.json())
        .then((responseJson)=>{
            // { code: 'success',
            //     message: null,
            //     data: 'http://bf-prod-databag.oss-cn-beijing.aliyuncs.com/1e5345adce95ee35646148ffaa6194e1/1e5345adce95ee35646148ffaa6194e1.zip?Expires=1526971919&OSSAccessKeyId=5nGlEwOIzrwCVaDZ&Signature=z4DFk0dJDBRXL9sElfgAHQxBYWQ%3D' }
            console.log(responseJson);
            let name = this.getName(responseJson.data)
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
        const path = '/sdcard/bimTest'
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

                console.log('progress='+pro);
                // this.setState({
                //     progressNum: pro,
                // });
            }
        };
        try {

            //先判断目录是否存在  不存在则创建
            RNFS.exists(path)
                .then((str) => {
                    console.log('mkdir:'+path);
                    console.log(str);
                    if(!str){
                        RNFS.mkdir(path)
                        .then(()=>{})
                    }
                })
                .catch((error) => {
                    console.log('mkdir------------');
                    console.log(error);
                })

            //开始下载
            const ret = RNFS.downloadFile(options);
            ret.promise.then(res => {
                console.log('success', res);

                console.log('file://' + downloadDest)

                RNFS.exists('file://' + downloadDest)
                .then((str) => {
                    console.log('++++++44444444+++');
                    console.log(str);
                })
                .catch((error) => {
                    console.log('------------');
                    console.log(error);
                })

                //解压缩
                const sourcePath = downloadDest;
                const targetPath = path;

                unzip(sourcePath, targetPath)
                .then((address) => {
                    console.log(`unzip completed at ${address}`)
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
        const src = 'app.html';
        RNFS.readFileAssets(src)
        .then((result)=>{
            console.log('read success result='+result);
            this.writeFile(path,result);
        }).catch((err)=>{
            console.log('read error'+err.message);
        })
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
    readFile() {
        // create a path you want to delete
        const path = RNFS.MainBundlePath + '/test.txt';

        return RNFS.readFile(path)
            .then((result) => {
                console.log(result);

                this.setState({
                    readTxtResult: result,
                })
            })
            .catch((err) => {
                console.log(err.message);

            });
    }

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
    deleteFile() {
        // create a path you want to delete
        const path = RNFS.MainBundlePath + '/test.txt';

        return RNFS.unlink(path)
            .then(() => {
                console.log('FILE DELETED');
            })
            // `unlink` will throw an error, if the item to unlink does not exist
            .catch((err) => {
                console.log(err.message);
            });
    }


    render() {
      return (
        <TouchableOpacity onPress={this.getToken}>
            <View >
                <Text style={{marginTop:40}}>
                    Welcome to React Native!
                </Text>
            </View>
        </TouchableOpacity>
      );
    }
  }