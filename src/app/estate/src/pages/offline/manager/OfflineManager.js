import React,{Component} from 'react';
import BasicInfoManager from './BasicInfoManager';
import EquipmentConditionManager from './EquipmentConditionManager';
import QualityConditionManager from './QualityConditionManager';
import QualityManager from './QualityManager';
import EquipmentManager from './EquipmentManager';
import DownloadingManager from './DownloadingManager';
import AsyncManager from './AsyncManager';
import ModelManager from './ModelManager';
import DirManager from './DirManager';

const {Realm} = require('app-3rd');


let realm = null;
let basicInfoManager = null;
let equipmentConditionManager = null;
let qualityConditionManager = null;
let qualityManager = null;
let equipmentManager = null;
let downloadingManager = null;
let asyncManager = null;
let modelManager = null;

// let equipmentName=null;
export default class OfflineManager{
    //获取数据库表后缀名称
    static getTableName = ()=>{
        let userInfo = storage.loadUserInfo();
        // let userObj = JSON.parse(userInfo);
        let account = userInfo.username;//手机号

        let tenantInfo = storage.loadTenantInfo();
        let tenantObj = JSON.parse(tenantInfo);
        let tenantId = tenantObj.value.tenantId;//租户的id

        let projectId = storage.loadProject();//项目的id
        let targetPath = `${account}${tenantId}${projectId}`;
        return targetPath;
    }

    static init(){
        let tableName = this.getTableName();
        let basicInfoName =  'basic'+tableName;//基础信息
        let equipmentConditionName = 'equipmentcondition'+tableName;//材设下载条件
        let qualityConditionName = 'qualitycondition'+tableName;//质量条件下载
        let qualityName = 'quality'+tableName;//质量相关
        let equipmentName = 'equipment'+tableName;//材设相关
        let downloadingName = 'downloading'+tableName;//下载中
        let asyncListName = 'asyncList'+tableName;//离线进程跟踪列表
        let modelDownloadingName = 'modelDownloading'+tableName;//离线进程跟踪列表

        //基础数据包
        const basicSchema = {
            name:basicInfoName,
            primaryKey:'key',
            properties:{
                key:'string',
                value:'string',
            }
        }
        //材设条件下载
        const equipmentConditionSchema = {
            name:equipmentConditionName,
            primaryKey:'key',
            properties:{
                key:'string',
                value:'string',
            }
        }
        //质量条件下载
        const qualityconditionSchema = {
            name:qualityConditionName,
            primaryKey:'key',
            properties:{
                key:'string',
                value:'string',
            }
        }
        //质量单据
        const qualitySchema = {
            name:qualityName,
            primaryKey:'key',
            properties:{
                key:'string',//单据的id
                value:'string',//单据内容
                qcState:'string',//单据当前状态
                qualityCheckpointId:'string',//质检项目
                updateTime:'string',
                submitState:'string',//待同步
                errorMsg:'string',//同步失败原因
            }
        }
        //材设单据
        const equipmentSchema = {
            name:equipmentName,
            primaryKey:'key',
            properties:{
                key:'string',//单据的id
                value:'string',//单据内容
                committed:'string',//false  待提交   true 已提交
                qualified:'string',//是否合格
                updateTime:'string',
                submitState:'string',//待同步
                errorMsg:'string',//同步失败原因
            }
        }
        //下载中  进度记录
        const downloadingSchema = {
            name:downloadingName,
            primaryKey:'key',
            properties:{
                key:'string',
                value:'string',
                downloading:'string',//true  下载中    false已下载
            }
        }
        //待同步列表
        const asyncSchema = {
            name:asyncListName,
            primaryKey:'key',
            properties:{
                key:'string',//单据的id
                value:'string',//展示的列表信息
                state:'string',//单据状态  待同步   已成功  已失败
                updateTime:'string',//更新时间
            }
        }
        //模型下载的进度列表
        const modelDownloadingSchema = {
            name:modelDownloadingName,
            primaryKey:'key',
            properties:{
                key:'string',//模型fileid+versionId
                value:'string',//离线包的存储路径
                projectVersionId:'string',//模型版本
                fileId:'string',//模型文件的id
                progress:'string',//当前的下载进度
                total:'string',//总长度
                done:'string',//是否完成了  false正在下载  true下载完成
                size:'string',//大小  ‘M'
                updateTime:'string',//下载时间
                item:'string',//模型数据
            }
        }
        realm = new Realm({schema:[basicSchema,equipmentConditionSchema,qualityconditionSchema,qualitySchema,equipmentSchema,downloadingSchema,asyncSchema,modelDownloadingSchema]});
        
        basicInfoManager = new BasicInfoManager(basicInfoName,realm);
        equipmentConditionManager = new EquipmentConditionManager(equipmentConditionName,realm);
        qualityConditionManager = new QualityConditionManager(qualityConditionName,realm);
        qualityManager = new QualityManager(qualityName,realm);
        equipmentManager = new EquipmentManager(equipmentName,realm);
        downloadingManager = new DownloadingManager(downloadingName,realm);
        asyncManager = new AsyncManager(asyncListName,realm);
        modelManager = new ModelManager(modelDownloadingName,realm);
    }

    static getBasicInfoManager(){
        return basicInfoManager;
    }

    static getEquipmentConditionManager(){
        return equipmentConditionManager;
    }

    static getQualityConditionManager(){
        return qualityConditionManager;
    }

    static getQualityManager(){
        return qualityManager;
    }

    static getEquipmentManager(){
        // equipmentManager = new EquipmentManager(equipmentName,realm);
        return equipmentManager;
    }

    static getDownloadingManager(){
        return downloadingManager;
    }

    static getAsyncManager(){
        return asyncManager;
    }

    static getModelManager(){
        return modelManager;
    }
    static close(){
        if(realm!=null){
            realm.close();
        }
        
    }

    //清除所有缓存
    static clear(){
        if(basicInfoManager){  basicInfoManager.clear();  }
        if(equipmentConditionManager){  equipmentConditionManager.clear();  }
        if(qualityConditionManager){  qualityConditionManager.clear();  }
        if(qualityManager){  qualityManager.clear();  }
        if(equipmentManager){  equipmentManager.clear();  }
        if(downloadingManager){  downloadingManager.clear();  }
        if(asyncManager){  asyncManager.clear();  }
        if(modelManager){  modelManager.clear();  }

        let dm = new DirManager();
        dm.clear();
    }
}