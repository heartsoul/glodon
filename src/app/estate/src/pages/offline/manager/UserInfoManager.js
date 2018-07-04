
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
 

    //清除本表
    clear=()=>{
        
    }


//     { username: '13716955121',
// I/ReactNativeJS(18588):   gldAccountId: '6260730431164916541',
// I/ReactNativeJS(18588):   token: null,
// I/ReactNativeJS(18588):   otherTokens: null,
// I/ReactNativeJS(18588):   authorities: [ 'ROLE_USER' ],
// I/ReactNativeJS(18588):   accountInfo:
// I/ReactNativeJS(18588):    { name: 'chengr',
// I/ReactNativeJS(18588):      phone: '13716955121',
// I/ReactNativeJS(18588):      email: null,
// I/ReactNativeJS(18588):      qq: null,
// I/ReactNativeJS(18588):      sex: 'MALE',
// I/ReactNativeJS(18588):      gldAccountId: '6260730431164916541',
// I/ReactNativeJS(18588):      userTenants:
// I/ReactNativeJS(18588):       [ { id: 234, admin: true, tenantId: '10000', tenantName: 'default' },
// I/ReactNativeJS(18588):         { id: 5200403,
// I/ReactNativeJS(18588):           admin: true,
// I/ReactNativeJS(18588):           tenantId: '5200057',
// I/ReactNativeJS(18588):           tenantName: '自动化测试—chengr' },
// I/ReactNativeJS(18588):         { id: 5200404,
// I/ReactNativeJS(18588):           admin: true,
// I/ReactNativeJS(18588):           tenantId: '5200058',
// I/ReactNativeJS(18588):           tenantName: 'chengr-自动化测试' } ],
// I/ReactNativeJS(18588):      otherTokens: null },
// I/ReactNativeJS(18588):   bindTenantId: null }
    //保存用户信息
    saveUserInfo(key,value){
        userHandler.saveUserInfo(key+'_user',value);
    }

    //获取用户信息
    getUserInfo(key){
        let info = userHandler.getUserInfo(key+'_user');
        return info;
    }

    //保存账户信息
    saveAccountInfo(key,value){
        userHandler.saveAccountInfo(key,value);
    }

    //验证账户信息
    checkAccountInfo(key,value){
        return userHandler.checkAccountInfo(key,value);
    }

    //获取当前账户信息   所有用户共用此
    getCurrentAccountInfo(){
        return userHandler.getCurrentAccountInfo();
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
