import React, { Component } from 'react';
import RNFS from 'react-native-fs';
import { Platform,} from 'react-native';

import DirManager from '../manager/DirManager'

let dm = new DirManager();
export default class DownloadImg{

    download(arr){
        // console.log('arr.length='+(arr.length))
        if(arr && arr.length>0){
            let i = 0;
            this.downloadImg(arr,i)
        }
    }

    downloadImg=(arr,i)=> {
        let formUrl = arr[i].url;
        let id = arr[i].fileId;
        const path = dm.getImagePath();
        const downloadDest = `${path}/${id}.png`;
        // console.log('start download  downloadDest='+downloadDest);
        // console.log('downloadDest='+downloadDest);

        const options = {
            fromUrl: formUrl,
            toFile: downloadDest,
            background: true,
            begin: (res) => {
                // console.log('begin', res);
                // console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
            },
            progress: (res) => {

                // let pro = res.bytesWritten / res.contentLength;

                // console.log('progress='+pro);
                // this.setState({
                //     progressNum: pro,
                // });
            }
        };

        RNFS.exists(downloadDest)
         .then((str) => {
             if(!str){
                try {
                    //开始下载
                    const ret = RNFS.downloadFile(options);
                    ret.promise.then(res => {
                        console.log('success', res);
                        i++
                        if(i<arr.length){
                            this.downloadImg(arr,i);
                        }
                    }).catch(err => {
                        console.log('err', err);
                        i++
                        if(i<arr.length){
                            this.downloadImg(arr,i);
                        }
                    });
                }
                catch (e) {
                    console.log(e);
                    i++
                        if(i<arr.length){
                            this.downloadImg(arr,i);
                        }
                }
             }else{
                i++
                if(i<arr.length){
                    this.downloadImg(arr,i);
                }
             }
             
         })
         .catch((error) => {
             console.log(error);
             i++
            if(i<arr.length){
                this.downloadImg(arr,i);
            }
         })

        

    }


}