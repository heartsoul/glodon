import RNFS from 'react-native-fs';
import { Platform,} from 'react-native';
/**
 * 目录处理
 */
export default class DirManager  {
    //创建缓存目录
      makeDirs = ()=>{
        // (Platform.OS === 'ios') ? 'unknown' : ((Platform.OS === 'android')
        //创建缓存根目录
        this._createDir(this.getRootPath());
        //不同的账号 不同的租户 不同的项目  文件夹不同
        this._createDir(this.getProjectPath());
        //功能不同，位置不同
        this._createDir(this.getModelPath());
        this._createDir(this.getImagePath());
    }
    
    //根目录
     getRootPath =()=>{
        let dirPath=((Platform.OS === 'ios') ? RNFS.MainBundlePath+'/bimcache' : '/sdcard/bimcache');
        return dirPath;
    }
    //项目目录
     getProjectPath =()=>{
        let dirPath = this.getRootPath();
        let userInfo = storage.loadUserInfo();
        // let userObj = JSON.parse(userInfo);
        let account = userInfo.username;//手机号

        let tenantInfo = storage.loadTenantInfo();
        let tenantObj = JSON.parse(tenantInfo);
        let tenantId = tenantObj.value.tenantId;//租户的id

        let projectId = storage.loadProject();//项目的id
        let targetPath = dirPath+`/${account}_${tenantId}_${projectId}`;
        return targetPath;
    }

    //获取模型根目录
    getModelPath = ()=>{
        let version = storage.getLatestVersionId(storage.loadProject());
        let modelPath = this.getProjectPath()+'/bimModel/'+version;
        return modelPath;
    }

    //获取图片根目录
    getImagePath =()=>{
        let imgPath = this.getProjectPath()+'/img';
        return imgPath;
    }

     _createDir = (path)=>{
         //先判断目录是否存在  不存在则创建
         RNFS.exists(path)
         .then((str) => {
             if(!str){
                 RNFS.mkdir(path)
                 .then(()=>{})
             }
         })
         .catch((error) => {
             console.log(error);
         })
    }
}