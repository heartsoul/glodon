
import * as API from "app-api";

import * as AuthorityConfig from './AuthorityConfig'
// const 
// const Quality_Accept_Bean = {actionRights:storage.loadAuthority(AuthorityConfig.Quality_Accept)};//质量验收记录
// const 
// const 
// const 


//---------------------------质量--------------------------------------

/**
 * 质量  是否显示新增检查单验收单按钮
 */
export function isQualityCreate(){
    Quality_Check_Bean = {actionRights:storage.loadAuthority(AuthorityConfig.Quality_Check)};//质量检查记录
    if(Quality_Check_Bean!=null && Quality_Check_Bean.actionRights!=null && Quality_Check_Bean.actionRights.size()>0 &&isHasModifyRight(Quality_Check_Bean.actionRights)){
        return true;
    }else{
        return false;
    }
}
/**
 * 质量  待提交 提交功能
 */
export function isQualityCheckSubmit(){
    Quality_Check_Bean = {actionRights:storage.loadAuthority(AuthorityConfig.Quality_Check)};//质量检查记录
    if(Quality_Check_Bean!=null && Quality_Check_Bean.actionRights!=null && Quality_Check_Bean.actionRights.size()>0 &&(Quality_Check_Bean.actionRights.contains(AuthorityConfig.ModifyUnit) ||Quality_Check_Bean.actionRights.contains(AuthorityConfig.ModifyAll) )){
        return true;
    }else{
        return false;
    }
}
/**
 * 质量  待提交 删除功能
 */
export function isQualityCheckDelete(){
    Quality_Check_Bean = {actionRights:storage.loadAuthority(AuthorityConfig.Quality_Check)};//质量检查记录
    if(Quality_Check_Bean!=null && Quality_Check_Bean.actionRights!=null && Quality_Check_Bean.actionRights.size()>0 &&(Quality_Check_Bean.actionRights.contains(AuthorityConfig.DeleteUnit) ||Quality_Check_Bean.actionRights.contains(AuthorityConfig.DeleteAll) )){
        return true;
    }else{
        return false;
    }
}

/**
 * 质量  是否有新建整改单权限
 */
export function isCreateRectify(){
    Quality_Rectification_Bean = {actionRights:storage.loadAuthority(AuthorityConfig.Quality_Rectification)} ;//质量整改记录
    if(Quality_Rectification_Bean!=null && Quality_Rectification_Bean.actionRights!=null && Quality_Rectification_Bean.actionRights.size()>0 &&Quality_Rectification_Bean.actionRights.contains(AuthorityConfig.ModifyGrant)){
        return true;
    }else{
        return false;
    }
}

/**
 * 质量  是否有新建复查单权限
 */
export function isCreateReview(){
    Quality_Risk_Bean = {actionRights:storage.loadAuthority(AuthorityConfig.Quality_Risk)} ;//质量隐患记录
    if(Quality_Risk_Bean!=null && Quality_Risk_Bean.actionRights!=null && Quality_Risk_Bean.actionRights.size()>0 &&(Quality_Risk_Bean.actionRights.contains(AuthorityConfig.ModifyUnit)||Quality_Risk_Bean.actionRights.contains(AuthorityConfig.ModifyAll))){
        return true;
    }else{
        return false;
    }
}
//质量   是否有新增、编辑权限
function isHasModifyRight(actionRights){
    if (actionRights.contains(AuthorityConfig.ModifyAll)) return true;
//        if (Quality_Check_Bean.actionRights.contains(AuthorityConfig.ModifyGrant)) return true;
    if (actionRights.contains(AuthorityConfig.ModifyUnit)) return true;
    return false;
}

/**
 * 判断是否有浏览质量的权限
 */
export function isQualityBrowser(){
    Quality_Rectification_Bean = {actionRights:storage.loadAuthority(AuthorityConfig.Quality_Rectification)} ;//质量整改记录
    return Quality_Rectification_Bean!=null &&
            Quality_Rectification_Bean.actionRights!=null &&
            Quality_Rectification_Bean.actionRights.size()>0 &&
            (
                    Quality_Rectification_Bean.actionRights.contains(AuthorityConfig.BrowseAll)||
                    Quality_Rectification_Bean.actionRights.contains(AuthorityConfig.BrowseSelf)||
                    Quality_Rectification_Bean.actionRights.contains(AuthorityConfig.BrowseGrant)||
                    Quality_Rectification_Bean.actionRights.contains(AuthorityConfig.BrowseUnit)
            );
}

//判断是不是我
export function isMe(currentId){
    return storage.loadTenant() == currentId;
}
//---------------------------质量--------------------------------------


//---------------------------材设--------------------------------------
/**
 * 进场  是否显示新增
 */
export function isEquipmentCreate(){
    Quality_Facility_Bean = {actionRights:storage.loadAuthority(AuthorityConfig.Quality_Facility)};//质量检查记录
    if(Quality_Facility_Bean!=null && Quality_Facility_Bean.actionRights!=null && Quality_Facility_Bean.actionRights.size()>0 &&isHasModifyRight(Quality_Facility_Bean.actionRights)){
        return true;
    }else{
        return false;
    }
}
/**
 * 判断是否有删除材设的权限
 */
export function isEquipmentDelete(){
    Quality_Facility_Bean = {actionRights:storage.loadAuthority(AuthorityConfig.Quality_Facility)} ;//材料设备进场验收
    return Quality_Facility_Bean!=null &&
            Quality_Facility_Bean.actionRights!=null &&
            Quality_Facility_Bean.actionRights.size()>0 &&
            (Quality_Facility_Bean.actionRights.contains(AuthorityConfig.DeleteUnit) ||Quality_Facility_Bean.actionRights.contains(AuthorityConfig.DeleteAll) );
}

/**
 * 判断是否有创建和修改材设的权限
 */
export function isEquipmentModify(){
    Quality_Facility_Bean = {actionRights:storage.loadAuthority(AuthorityConfig.Quality_Facility)} ;//材料设备进场验收
    return Quality_Facility_Bean!=null &&
            Quality_Facility_Bean.actionRights!=null &&
            Quality_Facility_Bean.actionRights.size()>0 &&
            (Quality_Facility_Bean.actionRights.contains(AuthorityConfig.ModifyAll)||Quality_Facility_Bean.actionRights.contains(AuthorityConfig.ModifyUnit)||Quality_Facility_Bean.actionRights.contains(AuthorityConfig.ModifySelf) );
}

/**
 * 判断是否有浏览材设的权限
 */
export function isEquipmentBrowser(){
    Quality_Facility_Bean = {actionRights:storage.loadAuthority(AuthorityConfig.Quality_Facility)} ;//材料设备进场验收
    return Quality_Facility_Bean!=null &&
            Quality_Facility_Bean.actionRights!=null &&
            Quality_Facility_Bean.actionRights.size()>0 &&
            (
                    Quality_Facility_Bean.actionRights.contains(AuthorityConfig.BrowseAll)||
                    Quality_Facility_Bean.actionRights.contains(AuthorityConfig.BrowseSelf)||
                    Quality_Facility_Bean.actionRights.contains(AuthorityConfig.BrowseGrant)||
                    Quality_Facility_Bean.actionRights.contains(AuthorityConfig.BrowseUnit)
            );
}
//---------------------------材设--------------------------------------

/**
 * 获取所有权限
 */
export function loadAuthoritys(projectId,retFun) {
    let count = 4;
    let error = false;
    //质量检查记录
    getAuthority(projectId,AuthorityConfig.Quality_Check,(success)=>{
        count --
        if(error) {
            return;
        }
        if(!success) {
            error = success;
            retFun(false);
        }
        if(count > 0) {return}
        retFun(true);
    });
    // //质量验收记录
    // getAuthority(projectId,AuthorityConfig.Quality_Accept,(success)=>{
    //     count --
    //     if(error) {
    //         return;
    //     }
    //     if(!success) {
    //         error = success;
    //         retFun(false);
    //     }
    //     if(count > 0) {return}
    //     retFun(true);
    // });
    //质量隐患记录
    getAuthority(projectId,AuthorityConfig.Quality_Risk,(success)=>{
        count --
        if(error) {
            return;
        }
        if(!success) {
            error = success;
            retFun(false);
        }
        if(count > 0) {return}
        retFun(true);
    });
    //材料设备进场验收
    getAuthority(projectId,AuthorityConfig.Quality_Facility,(success)=>{
        count --
        if(error) {
            return;
        }
        if(!success) {
            error = success;
            retFun(false);
        }
        if(count > 0) {return}
        retFun(true);
    });
    //质量整改记录
    getAuthority(projectId,AuthorityConfig.Quality_Rectification,(success)=>{
        count --
        if(error) {
            return;
        }
        if(!success) {
            error = success;
            retFun(false);
        }
        if(count > 0) {return}
        retFun(true);
    });
}

export function getAuthority(projectId,key,retFun){
    API.getAppModelRights(AuthorityConfig.appCode,key,projectId).then((responseData) => {
        storage.setActionRights(key,responseData.data.actionRights);
        retFun(true);
    }).catch((err)=>{
        retFun(false);
    });
}

