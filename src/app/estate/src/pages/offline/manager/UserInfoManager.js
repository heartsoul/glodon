
import * as API from 'app-api';
import UserInfoHandler from '../handler/UserInfoHandler';

let userHandler = null;
/**
 * 基础包下载
 */
export default class UserInfoManager {
    
    constructor(){
        userHandler = new UserInfoHandler();
    }
 
     //从数据库获取
     _getFromDb=(key)=>{
         let info = userHandler.query(key);
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
                                    console.log(responseData)
                                    let list=responseData.data.content;
                                    // console.log('项目列表 start-------------')
                                    // console.log(JSON.stringify(list))
                                    // console.log('项目列表 end-------------')

                                    let tenantInfo = storage.loadTenantInfo();
                                    let tenantObj = JSON.parse(tenantInfo);
                                    let tenantId = tenantObj.value.tenantId;//租户的id
                                    // console.log('=====================setlist  '+tenantId)
                                    _saveToDb(tenantId+'',JSON.stringify(list))
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
        //项目权限
        _getProjectAuthority=(projectId)=>{

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
    getProjectList=()=>{
        let tenantInfo = storage.loadTenantInfo();
        let tenantObj = JSON.parse(tenantInfo);
        let tenantId = tenantObj.value.tenantId;//租户的id
        return  this._getFromDb(tenantId+'');
    }
   

    
    
}
