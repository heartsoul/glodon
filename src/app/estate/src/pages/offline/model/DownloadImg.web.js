import RNFS from 'app-3rd/react-native-fs';

import DirManager from '../manager/DirManager'

let dm = new DirManager();
export default class DownloadImg{

    download(arr){
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
        try {
            //开始下载
            const ret = RNFS.downloadFile(options);
            ret.promise.then(res => {
                // console.log('success', res);
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
        }

    }


}