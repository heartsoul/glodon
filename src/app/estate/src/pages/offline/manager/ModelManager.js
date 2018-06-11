import RNFS from 'app-3rd/react-native-fs';
import DirManager from '../manager/DirManager';
/**
 * 模型相关处理
 */
export default class ModelManager {
    //使用
    // let fileId = '1353300132668256';
    // let mm = new ModelManager();
    //     mm.exist(fileId).then((res)=>{
    //         console.log(res);true /false
    //     }).catch((error) => {
    //         console.log(error);
    //     })
    //模型文件是否已经下载离线包
    exist = (fileId) => {
        let dm = new DirManager();
        let name = storage.getModelFileIdOfflineName(fileId)
        let path = dm.getModelPath()+'/'+name;
        return RNFS.exists(path);
    }
}
