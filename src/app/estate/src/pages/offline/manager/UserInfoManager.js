
import API from 'app-api';
import UserInfoHandler from '../handler/UserInfoHandler';

let userHandler = null;
/**
 * 基础包下载
 */
export default class UserInfoManager {
    
    constructor(){
        userHandler = new UserInfoHandler();
    }
 
    //保存账户信息
    saveAccountInfo(key,value){
        userHandler.saveAccountInfo(key,value);
    }

    //验证账户信息
    checkAccountInfo(key,value){
        return userHandler.checkAccountInfo(key,value);
    }

     //从数据库获取
     _getFromDb=(key)=>{
         let info = userHandler.query(key);
         console.log(info)
         return new Promise((resolve,reject)=>{
            let infos = JSON.parse(info);
            resolve(infos);
            // reject('bbb');
        });
     }
    //用户项目信息
    downloadProjectInfo = (tenantId)=>{
        //保存到数据库
        _saveToDb=(key,value)=>{
            userHandler.update(key,value);
        }
        //项目列表
        _getProjectList=()=>{
            return API.getProjects(0, 1,tenantId).then(
                (responseData) => {
                    let last = responseData.last;
                    if (last) {
                        this.setState(preState => {
                            return { ...preState, dataList: responseData.data.content }
                        });
                    } else {
                        API.getProjects(0, responseData.data.totalElements,tenantId).then(
                            (responseData) => {
                                if(responseData.data.content.length>0){
                                    let list=responseData.data.content;
                                    _saveToDb(tenantId+'',JSON.stringify(responseData))
                                    return list;
                                }
                            }
                        ).catch(err => {
                            console.log(err);
                        });
                    }
    
                }
            ).catch(err => {
                console.log(err);
            });
        }

        async function downloadProject(){
            let list = await _getProjectList();

            return true;
        }

        downloadProject().then((res)=>{

        }).catch((err)=>{
            console.log(err);
        })
    }


    //获取当前租户的项目列表
    getProjectList=(tenantId)=>{
        return  this._getFromDb(tenantId+'');
    }
   
}
