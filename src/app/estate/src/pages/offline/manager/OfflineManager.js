import React,{Component} from 'react';
import BasicInfoManager from './BasicInfoManager';
import EquipmentConditionManager from './EquipmentConditionManager';
import QualityConditionManager from './QualityConditionManager';
import QualityManager from './QualityManager';

const Realm = require('realm');


let realm = null;
let basicInfoManager = null;
let equipmentConditionManager = null;
let qualityConditionManager = null;
let qualityManager = null;

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
        console.log('init');
        let basicInfoName =  'basic'+this.getTableName();
        let equipmentConditionName = 'equipmentcondition'+this.getTableName();
        let qualityConditionName = 'qualitycondition'+this.getTableName();
        let qualityName = 'quality'+this.getTableName();

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
        realm = new Realm({schema:[basicSchema,equipmentConditionSchema,qualityconditionSchema,qualitySchema]});

        basicInfoManager = new BasicInfoManager(basicInfoName,realm);
        equipmentConditionManager = new EquipmentConditionManager(equipmentConditionName,realm)
        qualityConditionManager = new QualityConditionManager(qualityConditionName,realm);
        qualityManager = new QualityManager(qualityName,realm)
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

    static close(){
        if(realm!=null){
            realm.close();
        }
        
    }
}