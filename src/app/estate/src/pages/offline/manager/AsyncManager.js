
import * as API from 'app-api';
import AsyncHandler from '../handler/AsyncHandler';
import * as CONSTANT from "../../common/service/api+constant"
import OfflineManager from './OfflineManager';

let handler = null;
/**
 * 同步列表   离线进程跟踪
 */
export default class AsyncManager {
    
    constructor(name,realm){
        handler = new AsyncHandler(name,realm);
    }

    _formatDate(timestamp, formater) { 
            let date = new Date();
            date.setTime(parseInt(timestamp));
            formater = (formater != null)? formater : 'yyyy-MM-dd hh:mm';
            Date.prototype.Format = function (fmt) {
              var o = {
                "M+": this.getMonth() + 1, //月
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
              };
         
              if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
              for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ?
                  (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
              }
              return fmt;
            }
            return date.Format(formater);
          }

    // key:'string',//单据的id
    // value:'string',//展示的列表信息
    // state:'string',//单据状态  待同步   已同步  同步失败
    // updateTime:'string',//更新时间
    // type:'string',//单据类型  quality质量   equipment材设
    //根据状态查询记录
    getRecordsByState=(state)=>{
        let infos = handler.queryByState(state);
        console.log(infos)
        return  infos;
    }

    //增加一条待同步记录到数据库
    saveRecord=(key,value,state,updateTime)=>{
        handler.insert(key,value,state,updateTime);
    }

    //删除全部记录
    deleteAll=()=>{
        handler.deleteAll();
    }

    //删除一条记录
    deleteByKey = (key)=>{
        handler.delete(key);
    }

    //同步列表数据到服务端
    syncList=()=>{
        _getRecordsByState=(state)=>{
            let infos = handler.queryByState(state);
            console.log(infos)
            return  infos;
        }

        //提交成功  则修改改为已同步
        _asyncSuccess=(item)=>{
            //删除旧数据
            let id = item.id+'';
            this.deleteByKey(id);
            //修改同步列表
            let key = id;
            let date = new Date();
            let updateTime = date.getTime()+'';
            let state = '已同步';
            let value={
                id:id,
                title:item.title,
                subTitle:this._formatDate(updateTime),
                state:state,
                type:item.type,
                qcState:item.qcState,
            }
            this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
            
            return key;
        }

        //提交失败  则修改为失败
        _asyncError=(item,err)=>{
            //删除旧数据
            let id = item.id+'';
            this.deleteByKey(id);
            //修改同步列表
            let key = id;
            let date = new Date();
            let updateTime = date.getTime()+'';
            let state = '同步失败';
            let value={
                id:id,
                title:item.title,
                subTitle:this._formatDate(updateTime),
                state:state,
                type:item.type,
                qcState:item.qcState,
                errMsg:err+'',
            }
            this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
            return '';
        }

        //新建 提交到服务器
        _createSubmitInspection=(item,projectId, inspectionType, props)=>{
            // console.log('---------------------------------')
            // console.log(item)
            // console.log(projectId)
            // console.log(inspectionType)
            // console.log(props)
            // console.log('---------------------------------')
            return API.createSubmitInspection(projectId, inspectionType, JSON.stringify(props))
                .then(data => {
                    //{data:{id:33,code:'xxx'}}
                    //提交成功
                    //删除旧数据
                    this.deleteByKey(item.id+'');
                    //修改同步列表
                    let key = data.data.id+'';
                    let date = new Date();
                    let updateTime = date.getTime()+'';
                    let state = '已同步';
                    let value={
                        id:data.data.id+'',
                        title:data.data.code,
                        subTitle:this._formatDate(updateTime),
                        state:state,
                        type:item.type,
                        qcState:item.qcState,
                    }
                    this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
                    //修改单据列表
                    return key;

                }).catch(err => {
                    // // console.log('_createSubmitInspection err='+err)
                    // //修改为 同步失败
                    // //删除旧数据
                    // this.deleteByKey(item.id+'');
                    // //修改同步列表
                    // let key = item.id+'';
                    // let date = new Date();
                    // let updateTime = date.getTime()+'';
                    // let state = '同步失败';
                    // let value={
                    //     id:item.id+'',
                    //     title:item.title,
                    //     subTitle:this._formatDate(updateTime),
                    //     state:state,
                    //     type:item.type,
                    //     qcState:item.qcState,
                    //     errMsg:err+'',
                    // }
                    // this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
                    // return '';
                    return _asyncError(item,err);
                })
        }

        //编辑提交
        _editSubmitInspection=(item,projectId, fileId, inspectionType, props)=>{
            return API.editSubmitInspection(projectId,fileId, inspectionType, JSON.stringify(props))
                .then(data => {
                    // //{data:{id:33,code:'xxx'}}
                    // //提交成功
                    // //删除旧数据
                    // this.deleteByKey(item.id+'');
                    // //修改同步列表
                    // let key = item.id+'';
                    // let date = new Date();
                    // let updateTime = date.getTime()+'';
                    // let state = '已同步';
                    // let value={
                    //     id:item.id+'',
                    //     title:item.title,
                    //     subTitle:this._formatDate(updateTime),
                    //     state:state,
                    //     type:item.type,
                    //     qcState:item.qcState,
                    // }
                    // this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
                    // //修改单据列表
                    // return key;
                    return _asyncSuccess(item);

                }).catch(err => {
                    // // console.log('_createSubmitInspection err='+err)
                    // //修改为 同步失败
                    // //删除旧数据
                    // this.deleteByKey(item.id+'');
                    // //修改同步列表
                    // let key = item.id+'';
                    // let date = new Date();
                    // let updateTime = date.getTime()+'';
                    // let state = '同步失败';
                    // let value={
                    //     id:item.id+'',
                    //     title:item.title,
                    //     subTitle:this._formatDate(updateTime),
                    //     state:state,
                    //     type:item.type,
                    //     qcState:item.qcState,
                    //     errMsg:err+'',
                    // }
                    // this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
                    // return '';
                    return _asyncError(item,err);
                })
        }

        //新建 保存到服务器
        _createSaveInspection=(item,projectId, inspectionType, props)=>{
            // console.log('---------------------------------')
            // console.log(item)
            // console.log(projectId)
            // console.log(inspectionType)
            // console.log(props)
            // console.log('---------------------------------')
            return API.createSaveInspection(projectId, inspectionType, JSON.stringify(props))
                .then(data => {
                    //{data:{id:33,code:'xxx'}}
                    //提交成功
                    //删除旧数据
                    this.deleteByKey(item.id+'');
                    //修改同步列表
                    let key = data.data.id+'';
                    let date = new Date();
                    let updateTime = date.getTime()+'';
                    let state = '已同步';
                    let value={
                        id:data.data.id+'',
                        title:data.data.code,
                        subTitle:this._formatDate(updateTime),
                        state:state,
                        type:item.type,
                        qcState:item.qcState,
                    }
                    this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
                    //修改单据列表
                    return key;

                }).catch(err => {
                    // // console.log('_createSubmitInspection err='+err)
                    // //修改为 同步失败
                    // //删除旧数据
                    // this.deleteByKey(item.id+'');
                    // //修改同步列表
                    // let key = item.id+'';
                    // let date = new Date();
                    // let updateTime = date.getTime()+'';
                    // let state = '同步失败';
                    // let value={
                    //     id:item.id+'',
                    //     title:item.title,
                    //     subTitle:this._formatDate(updateTime),
                    //     state:state,
                    //     type:item.type,
                    //     qcState:item.qcState,
                    //     errMsg:err+'',
                    // }
                    // this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
                    // return '';
                    return _asyncError(item,err);
                })
        }

        //编辑 保存到服务器
        _editSaveInspection=(item,projectId, fileId, inspectionType, props)=>{
            return API.editSaveInspection(projectId,fileId, inspectionType, JSON.stringify(props))
                .then(data => {
                    // //{data:{id:33,code:'xxx'}}
                    // //提交成功
                    // //删除旧数据
                    // this.deleteByKey(item.id+'');
                    // //修改同步列表
                    // let key = item.id+'';
                    // let date = new Date();
                    // let updateTime = date.getTime()+'';
                    // let state = '已同步';
                    // let value={
                    //     id:item.id+'',
                    //     title:item.title,
                    //     subTitle:this._formatDate(updateTime),
                    //     state:state,
                    //     type:item.type,
                    //     qcState:item.qcState,
                    // }
                    // this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
                    // //修改单据列表
                    // return key;
                    return _asyncSuccess(item);

                }).catch(err => {
                    // // console.log('_createSubmitInspection err='+err)
                    // //修改为 同步失败
                    // //删除旧数据
                    // this.deleteByKey(item.id+'');
                    // //修改同步列表
                    // let key = item.id+'';
                    // let date = new Date();
                    // let updateTime = date.getTime()+'';
                    // let state = '同步失败';
                    // let value={
                    //     id:item.id+'',
                    //     title:item.title,
                    //     subTitle:this._formatDate(updateTime),
                    //     state:state,
                    //     type:item.type,
                    //     qcState:item.qcState,
                    //     errMsg:err+'',
                    // }
                    // this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
                    // return '';
                    return _asyncError(item,err);
                })
        }

        //检查单删除
        _createDeleteInspection=(item,projectId, inspectionType, fileId)=>{
            return API.createDeleteInspection(projectId,inspectionType,fileId)
                .then(data => {
                    //{data:{id:33,code:'xxx'}}
                    //提交成功
                    //删除旧数据
                    this.deleteByKey(fileId+'');
                    //修改同步列表
                    let key = fileId+'';
                    let date = new Date();
                    let updateTime = date.getTime()+'';
                    let state = '已同步';
                    let value={
                        id:item.id+'',
                        title:item.title,
                        subTitle:this._formatDate(updateTime),
                        state:state,
                        type:item.type,
                        qcState:item.qcState,
                    }
                    this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
                    //修改单据列表
                    return key;

                }).catch(err => {
                    // // console.log('_createSubmitInspection err='+err)
                    // //修改为 同步失败
                    // //删除旧数据
                    // this.deleteByKey(item.id+'');
                    // //修改同步列表
                    // let key = item.id+'';
                    // let date = new Date();
                    // let updateTime = date.getTime()+'';
                    // let state = '同步失败';
                    // let value={
                    //     id:item.id+'',
                    //     title:item.title,
                    //     subTitle:this._formatDate(updateTime),
                    //     state:state,
                    //     type:item.type,
                    //     qcState:item.qcState,
                    //     errMsg:err+'',
                    // }
                    // this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
                    // return '';
                    return _asyncError(item,err);
                })
        }

        //整改单 新增 提交
        _createSubmitRepair=(item,projectId, props)=>{
            return API.createSubmitRepair(projectId,JSON.stringify(props))
                .then(data => {

                    // //{data:{id:33,code:'xxx'}}
                    // //提交成功
                    // //删除旧数据
                    // let id = item.id+'';
                    // this.deleteByKey(id);
                    // //修改同步列表
                    // let key = id;
                    // let date = new Date();
                    // let updateTime = date.getTime()+'';
                    // let state = '已同步';
                    // let value={
                    //     id:id,
                    //     title:item.title,
                    //     subTitle:this._formatDate(updateTime),
                    //     state:state,
                    //     type:item.type,
                    //     qcState:item.qcState,
                    // }
                    // this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
                    // //修改单据列表
                    // return key;
                    return _asyncSuccess(item);

                }).catch(err => {
                    // console.log('_createSubmitInspection err='+err)
                    //修改为 同步失败
                    //删除旧数据
                    // let id = item.id+'';
                    // this.deleteByKey(id);
                    // //修改同步列表
                    // let key = id;
                    // let date = new Date();
                    // let updateTime = date.getTime()+'';
                    // let state = '同步失败';
                    // let value={
                    //     id:id,
                    //     title:item.title,
                    //     subTitle:this._formatDate(updateTime),
                    //     state:state,
                    //     type:item.type,
                    //     qcState:item.qcState,
                    //     errMsg:err+'',
                    // }
                    // this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
                    // return '';
                    return _asyncError(item,err);
                })
        }

        //整改单 新增  保存
        _createSaveRepair=(item,projectId, props)=>{
            return API.createSaveRepair(projectId,JSON.stringify(props))
                .then(data => {

                    // //{data:{id:33,code:'xxx'}}
                    // //提交成功
                    // //删除旧数据
                    // let id = item.id+'';
                    // this.deleteByKey(id);
                    // //修改同步列表
                    // let key = id;
                    // let date = new Date();
                    // let updateTime = date.getTime()+'';
                    // let state = '已同步';
                    // let value={
                    //     id:id,
                    //     title:item.title,
                    //     subTitle:this._formatDate(updateTime),
                    //     state:state,
                    //     type:item.type,
                    //     qcState:item.qcState,
                    // }
                    // this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
                    // //修改单据列表
                    // return key;
                    return _asyncSuccess(item);

                }).catch(err => {
                    // // console.log('_createSubmitInspection err='+err)
                    // //修改为 同步失败
                    // //删除旧数据
                    // let id = item.id+'';
                    // this.deleteByKey(id);
                    // //修改同步列表
                    // let key = id;
                    // let date = new Date();
                    // let updateTime = date.getTime()+'';
                    // let state = '同步失败';
                    // let value={
                    //     id:id,
                    //     title:item.title,
                    //     subTitle:this._formatDate(updateTime),
                    //     state:state,
                    //     type:item.type,
                    //     qcState:item.qcState,
                    //     errMsg:err+'',
                    // }
                    // this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
                    // return '';
                    return _asyncError(item,err);
                })
        }

        //整改单   编辑  保存
        _editSaveRepair=(item,projectId,fileId, props)=>{
            return API.editSaveRepair(projectId,fileId,JSON.stringify(props))
                .then(data => {

                    // //{data:{id:33,code:'xxx'}}
                    // //提交成功
                    // //删除旧数据
                    // let id = item.id+'';
                    // this.deleteByKey(id);
                    // //修改同步列表
                    // let key = id;
                    // let date = new Date();
                    // let updateTime = date.getTime()+'';
                    // let state = '已同步';
                    // let value={
                    //     id:id,
                    //     title:item.title,
                    //     subTitle:this._formatDate(updateTime),
                    //     state:state,
                    //     type:item.type,
                    //     qcState:item.qcState,
                    // }
                    // this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
                    // //修改单据列表
                    // return key;
                    return _asyncSuccess(item);

                }).catch(err => {
                    // // console.log('_createSubmitInspection err='+err)
                    // //修改为 同步失败
                    // //删除旧数据
                    // let id = item.id+'';
                    // this.deleteByKey(id);
                    // //修改同步列表
                    // let key = id;
                    // let date = new Date();
                    // let updateTime = date.getTime()+'';
                    // let state = '同步失败';
                    // let value={
                    //     id:id,
                    //     title:item.title,
                    //     subTitle:this._formatDate(updateTime),
                    //     state:state,
                    //     type:item.type,
                    //     qcState:item.qcState,
                    //     errMsg:err+'',
                    // }
                    // this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
                    // return '';
                    return _asyncError(item,err);
                })
        }

        //整改单 编辑 提交
        _editSubmitRepair=(item,projectId,fileId, props)=>{
            return API.editSubmitRepair(projectId,fileId,JSON.stringify(props))
                .then(data => {

                    // //{data:{id:33,code:'xxx'}}
                    // //提交成功
                    // //删除旧数据
                    // let id = item.id+'';
                    // this.deleteByKey(id);
                    // //修改同步列表
                    // let key = id;
                    // let date = new Date();
                    // let updateTime = date.getTime()+'';
                    // let state = '已同步';
                    // let value={
                    //     id:id,
                    //     title:item.title,
                    //     subTitle:this._formatDate(updateTime),
                    //     state:state,
                    //     type:item.type,
                    //     qcState:item.qcState,
                    // }
                    // this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
                    // //修改单据列表
                    // return key;
                    return _asyncSuccess(item);

                }).catch(err => {
                    // // console.log('_createSubmitInspection err='+err)
                    // //修改为 同步失败
                    // //删除旧数据
                    // let id = item.id+'';
                    // this.deleteByKey(id);
                    // //修改同步列表
                    // let key = id;
                    // let date = new Date();
                    // let updateTime = date.getTime()+'';
                    // let state = '同步失败';
                    // let value={
                    //     id:id,
                    //     title:item.title,
                    //     subTitle:this._formatDate(updateTime),
                    //     state:state,
                    //     type:item.type,
                    //     qcState:item.qcState,
                    //     errMsg:err+'',
                    // }
                    // this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
                    // return '';
                    return _asyncError(item,err);
                })
        }

        //整改单 删除
        _deleteRepair=(item,inspectionId,projectId, fileId)=>{
            return API.deleteRepair(inspectionId,projectId, fileId)
                .then(data => {

                    // //{data:{id:33,code:'xxx'}}
                    // //提交成功
                    // //删除旧数据
                    // let id = item.id+'';
                    // this.deleteByKey(id);
                    // //修改同步列表
                    // let key = id;
                    // let date = new Date();
                    // let updateTime = date.getTime()+'';
                    // let state = '已同步';
                    // let value={
                    //     id:id,
                    //     title:item.title,
                    //     subTitle:this._formatDate(updateTime),
                    //     state:state,
                    //     type:item.type,
                    //     qcState:item.qcState,
                    // }
                    // this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
                    
                    // return key;
                    return _asyncSuccess(item);

                }).catch(err => {
                    // // console.log('_createSubmitInspection err='+err)
                    // //修改为 同步失败
                    // //删除旧数据
                    // let id = item.id+'';
                    // this.deleteByKey(id);
                    // //修改同步列表
                    // let key = id;
                    // let date = new Date();
                    // let updateTime = date.getTime()+'';
                    // let state = '同步失败';
                    // let value={
                    //     id:id,
                    //     title:item.title,
                    //     subTitle:this._formatDate(updateTime),
                    //     state:state,
                    //     type:item.type,
                    //     qcState:item.qcState,
                    //     errMsg:err+'',
                    // }
                    // this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
                    // return '';
                    return _asyncError(item,err);
                })
        }

        //复查单  新增 提交
        _createSubmitReview=(item,projectId, props)=>{
            return API.createSubmitReview(projectId, JSON.stringify(props))
                .then(data => {
                    //{data:{id:33,code:'xxx'}}
                    // console.log(data)
                   //提交成功
                    return _asyncSuccess(item);
                }).catch(err => {
                    // console.log(err)
                    //修改为 同步失败
                    return _asyncError(item,err);
                })
        }
        //复查单  编辑 提交
        _editSubmitReview=(item,projectId,fileId, props)=>{
            return API.editSubmitReview(projectId,fileId, JSON.stringify(props))
                .then(data => {
                    //{data:{id:33,code:'xxx'}}
                    // console.log(data)
                   //提交成功
                    return _asyncSuccess(item);
                }).catch(err => {
                    // console.log(err)
                    //修改为 同步失败
                    return _asyncError(item,err);
                })
        }

        //复查单  新增  保存
        _createSaveReview=(item,projectId, props)=>{
            return API.createSaveReview(projectId, JSON.stringify(props))
            .then(data => {
                //{data:{id:33,code:'xxx'}}
               //提交成功
                return _asyncSuccess(item);
            }).catch(err => {
                //修改为 同步失败
                return _asyncError(item,err);
            })
        }

        //复查单  编辑 保存
        _editSaveReview=(item,projectId,fileId, props)=>{
            return API.editSaveReview(projectId,fileId, JSON.stringify(props))
                .then(data => {
                    //{data:{id:33,code:'xxx'}}
                   //提交成功
                    return _asyncSuccess(item);
                }).catch(err => {
                    //修改为 同步失败
                    return _asyncError(item,err);
                })
        }

        //复查单 删除
        _deleteReview=(item,inspectionId,projectId, fileId)=>{
            return API.deleteReview(inspectionId,projectId, fileId)
                .then(data => {
                    //{data:{id:33,code:'xxx'}}
                   //提交成功
                    return _asyncSuccess(item);
                }).catch(err => {
                    //修改为 同步失败
                    return _asyncError(item,err);
                })
        }

        //材设单  新增  提交
        _equipmentCreateSubmit=(item,projectId, props)=>{
            return API.equipmentCreateSubmit(projectId, JSON.stringify(props))
            .then(data => {
                //{data:{id:33,code:'xxx'}}
               //提交成功
                //删除旧数据
                this.deleteByKey(item.id+'');
                //修改同步列表
                let key = data.data.id+'';
                let date = new Date();
                let updateTime = date.getTime()+'';
                let state = '已同步';
                let value={
                    id:data.data.id+'',
                    title:data.data.code,
                    subTitle:this._formatDate(updateTime),
                    state:state,
                    type:item.type,
                    qcState:item.qcState,
                }
                this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
                //修改单据列表
                return key;
            }).catch(err => {
                //修改为 同步失败
                return _asyncError(item,err);
            })
        }

        //材设单 编辑  提交
        _equipmentEditSubmit=(item,projectId, equipmentId, props)=>{
            return API.equipmentEditSubmit(projectId,equipmentId, JSON.stringify(props))
            .then(data => {
                //{data:{id:33,code:'xxx'}}
               //提交成功
                return _asyncSuccess(item);
            }).catch(err => {
                //修改为 同步失败
                return _asyncError(item,err);
            })
        }

        //材设单  新增  保存
        _equipmentCreateSave=(item,projectId, props)=>{
            return API.equipmentCreateSave(projectId, JSON.stringify(props))
            .then(data => {
                //{data:{id:33,code:'xxx'}}
               //提交成功
                //删除旧数据
                this.deleteByKey(item.id+'');
                //修改同步列表
                let key = data.data.id+'';
                let date = new Date();
                let updateTime = date.getTime()+'';
                let state = '已同步';
                let value={
                    id:data.data.id+'',
                    title:data.data.code,
                    subTitle:this._formatDate(updateTime),
                    state:state,
                    type:item.type,
                    qcState:item.qcState,
                }
                this.saveRecord(key,JSON.stringify(value),state,updateTime+'');
                //修改单据列表
                return key;
            }).catch(err => {
                //修改为 同步失败
                return _asyncError(item,err);
            })
        }

        //材设单 编辑  保存
        _equipmentEditSave=(item,projectId, equipmentId, props)=>{
            return API.equipmentEditSave(projectId,equipmentId, JSON.stringify(props))
            .then(data => {
                //{data:{id:33,code:'xxx'}}
               //提交成功
                return _asyncSuccess(item);
            }).catch(err => {
                //修改为 同步失败
                return _asyncError(item,err);
            })
        }

        //材设单 删除
        _equipmentDelete=(item,projectId, id)=>{
            return API.equipmentDelete(projectId,id)
            .then(data => {
                //{data:{id:33,code:'xxx'}}
               //提交成功
                return _asyncSuccess(item);
            }).catch(err => {
                //修改为 同步失败
                return _asyncError(item,err);
            })
        }

        
        //质检单详情下载
        let  _getQualityDetail=(projectId,id)=> {
            return  API.getQualityInspectionDetail(projectId, id).then((responseData) => {
                // console.log('质检单详情 start--------------');
                // console.log(responseData); //
                // console.log('质检单详情 end--------------');
                if(responseData && responseData.data ){
                    return responseData;
                }
                return null;
            }).catch(err => {
                console.log(err)
            });
        }

        //质检单编辑信息
        let  _getQualityEditInfo=(projectId,id)=> {
            return  API.getQualityInspectionDetail(projectId, id).then((responseData) => {
                // console.log('质检单编辑信息 start--------------');
                // console.log(responseData); //
                // console.log('质检单编辑信息 end--------------');
                if(responseData){
                    return responseData;
                }
                return null;
            }).catch(err => {
                console.log(err)
            });
        }
        //整改单编辑信息
        let  _getRepairEditInfo=(projectId,id)=> {
            return API.getRepairInfo(projectId, id).then((responseData) => {
                // console.log('整改单编辑信息 start--------------');
                // console.log(responseData); //
                // console.log('整改单编辑信息 end--------------');
                if(responseData && responseData.data){
                    return responseData;
                }
                return null;
            }).catch(err => {
                console.log(err)
            });
        }
        //复查单编辑信息
        let  _getReviewEditInfo=(projectId,id)=> {
            return API.getReviewInfo(projectId, id).then((responseData) => {
                // console.log('复查单编辑信息 start--------------');
                // console.log(responseData); //
                // console.log('复查单编辑信息 end--------------');
                if(responseData && responseData.data){
                    return responseData;
                }
                return null;
            }).catch(err => {
                console.log(err)
            });
        }

        async function sync(){
            //获取所有待同步列表
            let list = _getRecordsByState('待同步');
            console.log('待同步列表')
            console.log(list)
            if(list && list.length>0){
                //  [ { id: '_1529051607958',
                //     title: '',
                //      subTitle: '2018-06-15 08:33',
                //      state: '待同步',
                //      type: 'quality'
                //      qcState:'xxx' } ]
                for (let item of list){
                    let qm = OfflineManager.getQualityManager();
                    let em = OfflineManager.getEquipmentManager();
                    switch(item.qcState){
                        case CONSTANT.QC_STATE_Q_NEW_SUBMIT://质检单  新建 提交
                            if(qm){
                                let params = qm.getSubmitInfoById(item.id);
                                if(params){
                                    let projectId=params.projectId;
                                    let inspectionType=params.inspectionType;
                                    let props=params.props;
                                    let id = await _createSubmitInspection(item,projectId, inspectionType, props);
                                    if(id){
                                        // let detail = await _getQualityDetail(projectId,id);
                                        // let inspectionData = detail.data.inspectionInfo;
                                        // // [{ id: 5200303,
                                        // //     code: 'ZLJC_20180517_001',
                                        // //     qcState: 'delayed',
                                        // //     projectId: 5200153,
                                        // //     inspectionDate: 1526486400000,
                                        // //     lastRectificationDate: 1526659200000,
                                        // //     description: 'i fghhh ',
                                        // //     inspectionType: 'inspection',
                                        // //     creatorId: 5200003,
                                        // //     responsibleUserId: 5200007,
                                        // //     updateTime: 1526526006000,
                                        // //     files: [],
                                        // //     needRectification: true }]
                                        // let listItem = {
                                        //     id:inspectionData.id,
                                        //     code:inspectionData.code,
                                        //     qcState:inspectionData.qcState,
                                        //     projectId:inspectionData.projectId,
                                        //     inspectionDate:inspectionData.inspectionDate,
                                        //     lastRectificationDate:inspectionData.lastRectificationDate,
                                        //     description:inspectionData.description,
                                        //     inspectionType:inspectionData.inspectionType,
                                        //     creatorId:inspectionData.creatorId,
                                        //     responsibleUserId:inspectionData.responsibleUserId,
                                        //     updateTime:inspectionData.updateTime,
                                        //     files:inspectionData.files,
                                        //     needRectification:inspectionData.needRectification,
                                        // }
                                        // let key = id+'';
                                        // let value = {
                                        //     item:listItem,
                                        //     detail:detail,
                                        //     editInfo:'',
                                        //     repairInfo:'',
                                        //     reviewInfo:'',
                                        //     submitInfo:'',//提交、保存时保存的参数
                                        // }
                                        // let qcState = inspectionData.qcState;
                                        // let qualityCheckpointId =inspectionData.qualityCheckpointId+'';
                                        // let updateTime = inspectionData.updateTime+'';
                                        // let submitState = '';
                                        // let errorMsg = '';
                                        // let qm = OfflineManager.getQualityManager();
                                        // // console.log('oooooooooooooooooooooooooo')
                                        // // console.log(key)
                                        // // console.log(JSON.stringify(value))
                                        // // console.log(qcState)
                                        // // console.log(qualityCheckpointId)
                                        // // console.log(updateTime)
                                        // // console.log('oooooooooooooooooooooooooo')
                                        // qm.insert(key,JSON.stringify(value),qcState,qualityCheckpointId,updateTime,submitState,errorMsg);
                                        qm.uploadById(id)
                                        qm.delete(item.id+'');
                                    }
                                    
                                }
                                
                            }
                            
                        break;
                        case CONSTANT.QC_STATE_Q_EDIT_SUBMIT://质检单 编辑 提交
                            if(qm){
                                let params = qm.getSubmitInfoById(item.id);
                                if(params){
                                    let projectId=params.projectId;
                                    let inspectionType=params.inspectionType;
                                    let props=params.props;
                                    let inspectId = props.inspectId;
                                    let id = await _editSubmitInspection(item,projectId,inspectId, inspectionType, props);
                                    qm.uploadById(item.id)
                                    // if(id){
                                    //     let detail = await _getQualityDetail(projectId,id);
                                    //     let inspectionData = detail.data.inspectionInfo;
                                    //     // [{ id: 5200303,
                                    //     //     code: 'ZLJC_20180517_001',
                                    //     //     qcState: 'delayed',
                                    //     //     projectId: 5200153,
                                    //     //     inspectionDate: 1526486400000,
                                    //     //     lastRectificationDate: 1526659200000,
                                    //     //     description: 'i fghhh ',
                                    //     //     inspectionType: 'inspection',
                                    //     //     creatorId: 5200003,
                                    //     //     responsibleUserId: 5200007,
                                    //     //     updateTime: 1526526006000,
                                    //     //     files: [],
                                    //     //     needRectification: true }]
                                    //     let listItem = {
                                    //         id:inspectionData.id,
                                    //         code:inspectionData.code,
                                    //         qcState:inspectionData.qcState,
                                    //         projectId:inspectionData.projectId,
                                    //         inspectionDate:inspectionData.inspectionDate,
                                    //         lastRectificationDate:inspectionData.lastRectificationDate,
                                    //         description:inspectionData.description,
                                    //         inspectionType:inspectionData.inspectionType,
                                    //         creatorId:inspectionData.creatorId,
                                    //         responsibleUserId:inspectionData.responsibleUserId,
                                    //         updateTime:inspectionData.updateTime,
                                    //         files:inspectionData.files,
                                    //         needRectification:inspectionData.needRectification,
                                    //     }
                                    //     let key = id+'';
                                    //     let value = {
                                    //         item:listItem,
                                    //         detail:detail,
                                    //         editInfo:'',
                                    //         repairInfo:'',
                                    //         reviewInfo:'',
                                    //         submitInfo:'',//提交、保存时保存的参数
                                    //     }
                                    //     let qcState = inspectionData.qcState;
                                    //     let qualityCheckpointId =inspectionData.qualityCheckpointId+'';
                                    //     let updateTime = inspectionData.updateTime+'';
                                    //     let submitState = '';
                                    //     let errorMsg = '';
                                    //     let qm = OfflineManager.getQualityManager();
                                    //     // console.log('oooooooooooooooooooooooooo')
                                    //     // console.log(key)
                                    //     // console.log(JSON.stringify(value))
                                    //     // console.log(qcState)
                                    //     // console.log(qualityCheckpointId)
                                    //     // console.log(updateTime)
                                    //     // console.log('oooooooooooooooooooooooooo')
                                    //     qm.insert(key,JSON.stringify(value),qcState,qualityCheckpointId,updateTime,submitState,errorMsg);
                                    // }
                                    
                                }
                                
                            }
                            
                        break;
                        case CONSTANT.QC_STATE_Q_NEW_SAVE://质检单  新建 保存
                        if(qm){
                            let params = qm.getSubmitInfoById(item.id);
                            if(params){
                                let projectId=params.projectId;
                                let inspectionType=params.inspectionType;
                                let props=params.props;
                                let id = await _createSaveInspection(item,projectId, inspectionType, props);
                                if(id){
                                    // let detail = await _getQualityDetail(projectId,id);
                                    // let inspectionData = detail.data.inspectionInfo;
                                    // // [{ id: 5200303,
                                    // //     code: 'ZLJC_20180517_001',
                                    // //     qcState: 'delayed',
                                    // //     projectId: 5200153,
                                    // //     inspectionDate: 1526486400000,
                                    // //     lastRectificationDate: 1526659200000,
                                    // //     description: 'i fghhh ',
                                    // //     inspectionType: 'inspection',
                                    // //     creatorId: 5200003,
                                    // //     responsibleUserId: 5200007,
                                    // //     updateTime: 1526526006000,
                                    // //     files: [],
                                    // //     needRectification: true }]
                                    // let listItem = {
                                    //     id:inspectionData.id,
                                    //     code:inspectionData.code,
                                    //     qcState:inspectionData.qcState,
                                    //     projectId:inspectionData.projectId,
                                    //     inspectionDate:inspectionData.inspectionDate,
                                    //     lastRectificationDate:inspectionData.lastRectificationDate,
                                    //     description:inspectionData.description,
                                    //     inspectionType:inspectionData.inspectionType,
                                    //     creatorId:inspectionData.creatorId,
                                    //     responsibleUserId:inspectionData.responsibleUserId,
                                    //     updateTime:inspectionData.updateTime,
                                    //     files:inspectionData.files,
                                    //     needRectification:inspectionData.needRectification,
                                    // }
                                    // let key = id+'';
                                    // let value = {
                                    //     item:listItem,
                                    //     detail:detail,
                                    //     editInfo:detail,
                                    //     repairInfo:'',
                                    //     reviewInfo:'',
                                    //     submitInfo:'',//提交、保存时保存的参数
                                    // }
                                    // let qcState = inspectionData.qcState;
                                    // let qualityCheckpointId =inspectionData.qualityCheckpointId+'';
                                    // let updateTime = inspectionData.updateTime+'';
                                    // let submitState = '';
                                    // let errorMsg = '';
                                    // let qm = OfflineManager.getQualityManager();
                                    // // console.log('oooooooooooooooooooooooooo')
                                    // // console.log(key)
                                    // // console.log(JSON.stringify(value))
                                    // // console.log(qcState)
                                    // // console.log(qualityCheckpointId)
                                    // // console.log(updateTime)
                                    // // console.log('oooooooooooooooooooooooooo')
                                    // qm.insert(key,JSON.stringify(value),qcState,qualityCheckpointId,updateTime,submitState,errorMsg);
                                    qm.uploadById(id)
                                    qm.delete(item.id+'');
                                }
                                
                            }
                            
                        }
                        break;
                        case CONSTANT.QC_STATE_Q_EDIT_SAVE://质检单 编辑 保存
                            if(qm){
                                let params = qm.getSubmitInfoById(item.id);
                                if(params){
                                    let projectId=params.projectId;
                                    let inspectionType=params.inspectionType;
                                    let props=params.props;
                                    let inspectId = props.inspectId;
                                    let id = await _editSaveInspection(item,projectId,inspectId, inspectionType, props);
                                    qm.uploadById(item.id)
                                    // if(id){
                                    //     let detail = await _getQualityDetail(projectId,id);
                                    //     let inspectionData = detail.data.inspectionInfo;
                                    //     // [{ id: 5200303,
                                    //     //     code: 'ZLJC_20180517_001',
                                    //     //     qcState: 'delayed',
                                    //     //     projectId: 5200153,
                                    //     //     inspectionDate: 1526486400000,
                                    //     //     lastRectificationDate: 1526659200000,
                                    //     //     description: 'i fghhh ',
                                    //     //     inspectionType: 'inspection',
                                    //     //     creatorId: 5200003,
                                    //     //     responsibleUserId: 5200007,
                                    //     //     updateTime: 1526526006000,
                                    //     //     files: [],
                                    //     //     needRectification: true }]
                                    //     let listItem = {
                                    //         id:inspectionData.id,
                                    //         code:inspectionData.code,
                                    //         qcState:inspectionData.qcState,
                                    //         projectId:inspectionData.projectId,
                                    //         inspectionDate:inspectionData.inspectionDate,
                                    //         lastRectificationDate:inspectionData.lastRectificationDate,
                                    //         description:inspectionData.description,
                                    //         inspectionType:inspectionData.inspectionType,
                                    //         creatorId:inspectionData.creatorId,
                                    //         responsibleUserId:inspectionData.responsibleUserId,
                                    //         updateTime:inspectionData.updateTime,
                                    //         files:inspectionData.files,
                                    //         needRectification:inspectionData.needRectification,
                                    //     }
                                    //     let key = id+'';
                                    //     let value = {
                                    //         item:listItem,
                                    //         detail:detail,
                                    //         editInfo:detail,
                                    //         repairInfo:'',
                                    //         reviewInfo:'',
                                    //         submitInfo:'',//提交、保存时保存的参数
                                    //     }
                                    //     let qcState = inspectionData.qcState;
                                    //     let qualityCheckpointId =inspectionData.qualityCheckpointId+'';
                                    //     let updateTime = inspectionData.updateTime+'';
                                    //     let submitState = '';
                                    //     let errorMsg = '';
                                    //     let qm = OfflineManager.getQualityManager();
                                    //     // console.log('oooooooooooooooooooooooooo')
                                    //     // console.log(key)
                                    //     // console.log(JSON.stringify(value))
                                    //     // console.log(qcState)
                                    //     // console.log(qualityCheckpointId)
                                    //     // console.log(updateTime)
                                    //     // console.log('oooooooooooooooooooooooooo')
                                    //     qm.insert(key,JSON.stringify(value),qcState,qualityCheckpointId,updateTime,submitState,errorMsg);
                                    // }
                                    
                                }
                                
                            }
                            
                        break;
                        case CONSTANT.QC_STATE_Q_DELETE://质检单 删除
                            if(qm){
                                let params = qm.getSubmitInfoById(item.id);
                                if(params){
                                    let projectId=params.projectId;
                                    let inspectionType=params.inspectionType;
                                    let fileId=params.fileId;
                                    
                                    let id = await _createDeleteInspection(item,projectId, inspectionType,fileId);
                                    qm.delete(fileId+'');
                                    
                                }
                                
                            }
                            
                        break;
                        case CONSTANT.QC_STATE_REPAIR_NEW_SUBMIT://整改单  新增 提交
                            if(qm){
                                let params = qm.getSubmitInfoById(item.id);
                                if(params){
                                    let projectId=params.projectId;
                                    let props=params.props;
                                    
                                    let id = await _createSubmitRepair(item,projectId, props);
                                    //更新当前的单据列表
                                    qm.uploadById(item.id)
                                    
                                }
                                
                            }
                            
                        break;

                        case CONSTANT.QC_STATE_REPAIR_NEW_SAVE://整改单  新增 保存
                            if(qm){
                                let params = qm.getSubmitInfoById(item.id);
                                if(params){
                                    let projectId=params.projectId;
                                    let props=params.props;
                                    
                                    let id = await _createSaveRepair(item,projectId, props);
                                    //更新当前的单据列表
                                    qm.uploadById(item.id)
                                    
                                }
                                
                            }
                            
                        break;
                        case CONSTANT.QC_STATE_REPAIR_EDIT_SAVE://整改单  编辑 保存
                            if(qm){
                                let params = qm.getSubmitInfoById(item.id);
                                if(params){
                                    let projectId=params.projectId;
                                    let props=params.props;
                                    let fileId = params.fileId;

                                    let id = await _editSaveRepair(item,projectId,fileId, props);
                                    //更新当前的单据列表
                                    qm.uploadById(item.id)
                                    
                                }
                                
                            }
                            
                        break;
                        case CONSTANT.QC_STATE_REPAIR_EDIT_SUBMIT://整改单  编辑 提交
                            if(qm){
                                let params = qm.getSubmitInfoById(item.id);
                                if(params){
                                    let projectId=params.projectId;
                                    let props=params.props;
                                    let fileId = params.fileId;

                                    let id = await _editSubmitRepair(item,projectId,fileId, props);
                                    //更新当前的单据列表
                                    qm.uploadById(item.id)
                                    
                                }
                                
                            }
                            
                        break;
                        case CONSTANT.QC_STATE_REPAIR_DELETE://整改单 删除
                            if(qm){
                                let params = qm.getSubmitInfoById(item.id);
                                if(params){
                                    let projectId=params.projectId;
                                    let inspectionId=params.inspectionId;
                                    let fileId = params.fileId;

                                    let id = await _deleteRepair(item,inspectionId,projectId, fileId);
                                    //更新当前的单据列表
                                    qm.uploadById(item.id)
                                    
                                }
                                
                            }
                            
                        break;

                        case CONSTANT.QC_STATE_REVIEW_NEW_SUBMIT://复查单 新增 提交
                        console.log('复查单 新增 提交')
                            if(qm){
                                let params = qm.getSubmitInfoById(item.id);
                                if(params){
                                    let projectId=params.projectId;
                                    let props=params.props;

                                    let id = await _createSubmitReview(item,projectId, props);
                                    //更新当前的单据列表
                                    qm.uploadById(item.id)
                                }
                            }
                            
                        break;

                        case CONSTANT.QC_STATE_REVIEW_EDIT_SUBMIT://复查单 编辑 提交
                        console.log('复查单 编辑 提交')
                            if(qm){
                                let params = qm.getSubmitInfoById(item.id);
                                if(params){
                                    let projectId=params.projectId;
                                    let props=params.props;
                                    let fileId = params.fileId;
                                    let id = await _editSubmitReview(item,projectId,fileId, props);
                                    //更新当前的单据列表
                                    qm.uploadById(item.id)
                                }
                            }
                            
                        break;

                        case CONSTANT.QC_STATE_REVIEW_NEW_SAVE://复查单 新增 保存
                            if(qm){
                                let params = qm.getSubmitInfoById(item.id);
                                if(params){
                                    let projectId=params.projectId;
                                    let props=params.props;
                                    let id = await _createSaveReview(item,projectId, props);
                                    //更新当前的单据列表
                                    qm.uploadById(item.id)
                                }
                            }
                            
                        break;

                        case CONSTANT.QC_STATE_REVIEW_EDIT_SAVE://复查单 编辑 保存
                            if(qm){
                                let params = qm.getSubmitInfoById(item.id);
                                if(params){
                                    let projectId=params.projectId;
                                    let props=params.props;
                                    let fileId = params.fileId;
                                    let id = await _editSaveReview(item,projectId,fileId, props);
                                    //更新当前的单据列表
                                    qm.uploadById(item.id)
                                }
                            }
                            
                        break;

                        case CONSTANT.QC_STATE_REVIEW_DELETE://复查单 删除
                            if(qm){
                                let params = qm.getSubmitInfoById(item.id);
                                if(params){
                                    let projectId=params.projectId;
                                    let inspectionId=params.inspectionId;
                                    let fileId = params.fileId;

                                    let id = await _deleteReview(item,inspectionId,projectId, fileId);
                                    //更新当前的单据列表
                                    qm.uploadById(item.id)
                                }
                            }
                            
                        break;

                        //  [ { id: '_1529051607958',
                        //     title: '',
                        //      subTitle: '2018-06-15 08:33',
                        //      state: '待同步',
                        //      type: 'quality'
                        //      qcState:'xxx' } ]
                        case CONSTANT.QC_STATE_EQUIPMENT_NEW_SUBMIT://材设单  新增 提交
                            if(em){
                                let params = em.getSubmitInfoById(item.id);
                                if(params){
                                    let projectId=params.projectId;
                                    let props=params.props;

                                    let id = await _equipmentCreateSubmit(item,projectId, props);
                                    //更新当前的单据列表
                                    em.delete(item.id+'')
                                    em.updateById(id)
                                }
                            }
                        break;

                        case CONSTANT.QC_STATE_EQUIPMENT_EDIT_SUBMIT://材设单  编辑 提交
                            if(em){
                                let params = em.getSubmitInfoById(item.id);
                                if(params){
                                    let projectId=params.projectId;
                                    let props=params.props;
                                    let equipmentId = params.equipmentId;

                                    let id = await _equipmentEditSubmit(item,projectId,equipmentId, props);
                                    //更新当前的单据列表
                                    em.updateById(id)
                                }
                            }
                        break;

                        case CONSTANT.QC_STATE_EQUIPMENT_NEW_SAVE://材设单  新增 保存
                            if(em){
                                let params = em.getSubmitInfoById(item.id);
                                if(params){
                                    let projectId=params.projectId;
                                    let props=params.props;

                                    let id = await _equipmentCreateSave(item,projectId, props);
                                    //更新当前的单据列表
                                    em.delete(item.id+'')
                                    em.updateById(id)
                                }
                            }
                        break;

                        case CONSTANT.QC_STATE_EQUIPMENT_EDIT_SAVE://材设单  编辑  保存
                            if(em){
                                let params = em.getSubmitInfoById(item.id);
                                if(params){
                                    let projectId=params.projectId;
                                    let props=params.props;
                                    let equipmentId = params.equipmentId;

                                    let id = await _equipmentEditSave(item,projectId,equipmentId, props);
                                    //更新当前的单据列表
                                    em.updateById(id)
                                }
                            }
                        break;

                        case CONSTANT.QC_STATE_EQUIPMENT_DELETE://材设单  删除
                            if(em){
                                let params = em.getSubmitInfoById(item.id);
                                if(params){
                                    let projectId=params.projectId;
                                    let equipmentId = params.equipmentId;

                                    let id = await _equipmentDelete(item,projectId,equipmentId);
                                    //更新当前的单据列表
                                    em.delete(item.id+'')
                                }
                            }
                        break;
                    }
                }
            }
        }

        sync().then((data)=>{
            console.log('同步完成')
        })
        
    }
}
