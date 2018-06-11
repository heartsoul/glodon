import { RNFS} from 'app-3rd';
import { Platform,} from 'react-native';
import ModelServer from '../model/ServerModule';
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
        try {
            let dirPath=((Platform.OS === 'ios') ? RNFS.MainBundlePath+'/bimcache' : '/sdcard/bimcache');
            return dirPath;
        } catch (error) {
            return '/bimcache';
        }
        
    }
    //项目目录
     getProjectPath =()=>{
        let dirPath = this.getRootPath();
        let targetPath = dirPath+`/`+this.getProjectName();
        return targetPath;
    }

     //获取项目文件夹名称
     getProjectName = ()=>{
        let userInfo = storage.loadUserInfo();
        // let userObj = JSON.parse(userInfo);
        let account = userInfo.username;//手机号

        let tenantInfo = storage.loadTenantInfo();
        let tenantObj = JSON.parse(tenantInfo);
        let tenantId = tenantObj.value.tenantId;//租户的id

        let projectId = storage.loadProject();//项目的id
        let targetPath = `${account}_${tenantId}_${projectId}`;
        return targetPath;
    }



    //获取模型根目录
    getModelPath = ()=>{
        let version = storage.getLatestVersionId(storage.loadProject());
        let modelPath = this.getProjectPath()+'/bimModel/'+version;
        return modelPath;
    }

    //获取模型的url地址
    getAppUrl = (fileId)=>{
        
        let version = storage.getLatestVersionId(storage.loadProject());
        let name = storage.getModelFileIdOfflineName(fileId);
        let root = ModelServer.ROOT_URL;//http://xxxxx:8080/
        let url = root+this.getProjectName()+'/bimModel/'+version+'/'+name+'/app.html';
       
        return url;
    }

    //获取图片根目录
    getImagePath =()=>{
        let imgPath = this.getProjectPath()+'/img';
        return imgPath;
    }

    //获取图片存储路径
    getImagePathById = (id)=>{
        const path = this.getImagePath();
        const downloadDest = `${path}/${id}.png`;
        return downloadDest;
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