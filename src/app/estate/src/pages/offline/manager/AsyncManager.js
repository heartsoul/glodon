
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
        //获取所有待同步列表
        let list = this.getRecordsByState('待同步');
        if(list && list.length>0){
            //  [ { id: '_1529051607958',
            //     title: '',
            //      subTitle: '2018-06-15 08:33',
            //      state: '待同步',
            //      type: 'quality'
            //      qcState:'xxx' } ]
            for (let item of list){

                switch(item.qcState){
                    case CONSTANT.QC_STATE_Q_NEW_SUBMIT://质检单  新建 提交
                        let qm = OfflineManager.getQualityManager();
                        if(qm){
                            let params = qm.getSubmitInfoById(item.id);
                            if(params){
                                let projectId=params.projectId;
                                let inspectionType=params.inspectionType;
                                let props=params.props;
                                API.createSubmitInspection(projectId, inspectionType, props)
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

                                    }).catch(err => {
                                        Toast.hide();
                                        Toast.info("提交失败", 1);
                                        //修改为 同步失败
                                    })
                            }
                            
                        }
                        
                    break;
                }
            }
        }
    }
}
