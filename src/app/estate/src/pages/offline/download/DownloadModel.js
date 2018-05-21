import React, { Component } from 'react';
import RNFS from 'react-native-fs';

import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
  } from 'react-native';

  import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive';


  const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
      'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
      'Shake or press menu button for dev menu',
  });
  
  export default class App extends Component {

    constructor(){
        super();
        // this.state = {
        //     progressNum: 0,
        // };
    }

    


    /*下载文件*/
    downloadFile() {
        // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)

        // 图片
        // const downloadDest = `${RNFS.MainBundlePath}/${((Math.random() * 1000) | 0)}.jpg`;
        // const formUrl = 'http://img.kaiyanapp.com/c7b46c492261a7c19fa880802afe93b3.png?imageMogr2/quality/60/format/jpg';

        // 文件
        // const path = RNFS.DocumentDirectoryPath;
        // const path = RNFS.ExternalStorageDirectoryPath;
        const path = '/sdcard/bimTest'
        console.log('start download  path='+path);
        const downloadDest = `${path}/${((Math.random() * 1000) | 0)}.zip`;
        const formUrl = 'http://files.cnblogs.com/zhuqil/UIWebViewDemo.zip';

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
        <TouchableOpacity onPress={this.downloadFile}>
            <View >
                <Text style={{marginTop:40}}>
                    Welcome to React Native!
                </Text>
            </View>
        </TouchableOpacity>
      );
    }
  }