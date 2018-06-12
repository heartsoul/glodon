'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import WideButton from "../../../app/components/WideButton";
import { DatePicker } from 'antd-mobile';
import OfflineManager from '../../../offline/manager/OfflineManager'

let timeStart=0
let timeEnd = 0
// let equipmentConditionManager = null;
let equipmentManager = null;
var { width, height } = Dimensions.get("window");
//材设进场清单下载条件选择
export default class extends Component {
  
  static navigationOptions = {
    title: '材设进场清单',

  };

  constructor() {
      super();
      // equipmentConditionManager = OfflineManager.getEquipmentConditionManager();
      equipmentManager = OfflineManager.getEquipmentManager();
      this.state={
        top1:true,
        top2:false,
        top3:false,
        top4:false,
        top5:false,
        bottom1:true,
        bottom2:false,
        visible: false,
        clickLeft:false,
        startText:'起始日期',
        endText:'终止日期',
        timeText:'近3天',
      }
  };
  


  _clickTop1=()=>{
    this.setState((pre)=>{
      return {
        ...pre,
        top1:true,
        top2:false,
        top3:false,
        top4:false,
        top5:false,
        timeText:'近3天',
      }
    })
  }

  _clickTop2=()=>{
    this.setState((pre)=>{
      return {
        ...pre,
        top1:false,
        top2:true,
        top3:false,
        top4:false,
        top5:false,
        timeText:'近1周',
      }
    })
  }
  _clickTop3=()=>{
    this.setState((pre)=>{
      return {
        ...pre,
        top1:false,
        top2:false,
        top3:true,
        top4:false,
        top5:false,
        timeText:'近1月',
      }
    })
  }

  //起始日期
  _clickTop4=()=>{
    this.setState((pre)=>{
      return {
        ...pre,
        top1:false,
        top2:false,
        top3:false,
        top4:true,
        top5:true,
        visible:true,
        clickLeft:true,
      }
    })
  }
//终止日期
  _clickTop5=()=>{
    this.setState((pre)=>{
      return {
        ...pre,
        top1:false,
        top2:false,
        top3:false,
        top4:true,
        top5:true,
        visible:true,
        clickLeft:false,
      }
    })
  }

  _PickerDismiss=()=>{
    this.setState((pre)=>{
      return {
        ...pre,
        visible:false,
      }
    })
  }
  _PickerOk=(date)=>{
    
    this.state.clickLeft?timeStart=date.getTime():timeEnd=date.getTime();
    let day = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
    this.state.clickLeft?this.setState((pre)=>{
                                return {
                                  ...pre,
                                  visible:false,
                                  startText:day,
                                }
                              })
                              :this.setState((pre)=>{
                                return {
                                  ...pre,
                                  visible:false,
                                  endText:day,
                                }
                              })
    
  }

  _clickBottom1=()=>{
    this.setState((pre)=>{
      return {
        ...pre,
        bottom1:true,
        bottom2:false,
        bottom3:false,
        bottom4:false,
        bottom5:false,
      }
    })
  }

  _clickBottom2=()=>{
    this.setState((pre)=>{
      return {
        ...pre,
        bottom1:false,
        bottom2:true,
      }
    })
  }

  
  //点击下载
  _download=()=>{
    let date = new Date();
    let startTime = date.getTime();
    let endTime = date.getTime();

    let day = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
    let st= this.state.startText=='起始日期'?day:this.state.startText;;
    let et = this.state.endText=='终止日期'?day:this.state.endText;

    // console.log('startTime='+startTime+' endTime='+endTime);
    // console.log(st+' '+et)
    this.state.top1?(startTime=date.getTime()-3*24*60*60*1000,endTime=date.getTime()):'';
    this.state.top2?(startTime=date.getTime()-7*24*60*60*1000,endTime=date.getTime()):'';
    this.state.top3?(startTime=date.getTime()-31*24*60*60*1000,endTime=date.getTime()):'';
    this.state.top4?(startTime=timeStart>0?timeStart:date.getTime()):'';
    this.state.top5?(endTime=timeEnd>0?timeEnd:date.getTime()):'';
    // console.log('startTime='+startTime+' endTime='+endTime);
    // console.log(st+' '+et)
    if (this.state.top4 || this.state.top5){
      startTime<endTime?'':([st,et]=[et,st]);
    }
    startTime<endTime?'':([startTime,endTime]=[endTime,startTime])
    
    // console.log('startTime='+startTime+' endTime='+endTime);
    // console.log(st+' '+et)

    let qcState=[];
    this.state.bottom1?qcState=['全部']:'';
    this.state.bottom2?qcState=[...qcState,'待提交']:''

    let qcStateText = '( ';
    for(item of qcState){
      qcStateText += item;
    }
    qcStateText += ' )';

    let timeText = '近3天'
    if(this.state.top4){
      timeText=st+' - '+et;
    }else{
      timeText = this.state.timeText;
    }
    //下载单据
    let record = {
      startTime:startTime,//选择的时间范围的开始时间    时间戳
      endTime:endTime,//选择的时间范围的结束时间    时间戳
      qcState:qcState,//选择的分类   全部  待提交  待整改。。。

      timeText:timeText,//在下载记录中 显示的时间   近3天。。。
      downloadTime:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()),//下载时间
      size:111,//下载的单据的条数

      title:'材设进场单',
      subTitle:qcStateText,
      progress:0,
      total:100,
    }

    // equipmentConditionManager.saveRecord(date.getTime()+'',JSON.stringify(record));

    console.log('startTime='+startTime+' endTime='+endTime);
    let startDate = this._formatDate(startTime,'yyyy-MM-dd')
    let endDate = this._formatDate(endTime,'yyyy-MM-dd')
    console.log('startDate='+startDate+' endDate='+endDate);
    console.log(JSON.stringify(qcState));
    equipmentManager.download(startDate,endDate,qcState,date.getTime()+'',record);
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

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
        <ScrollView bounces={false} >
          <View style={{backgroundColor:'#f9f9f9'}} >
                  <View style={{flex:1,height:148,backgroundColor:'#ffffff',marginLeft:20,marginRight:20,marginTop:16,borderRadius:12}}>
                      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <View style={{backgroundColor:'#6f899b',width:18,height:1,marginTop:16}} />
                        <Text style={{color:'#6f899b',fontSize:14,marginTop:16,alignSelf:'center',marginLeft:9,marginRight:9}} >时间范围</Text>
                        <View style={{backgroundColor:'#6f899b',width:18,height:1,marginTop:16}} />
                      </View>
                    <View style={{flexDirection:'row',marginTop:16}} >
                        <TouchableOpacity onPress={()=>{this._clickTop1() }}>
                        {
                          this.state.top1?
                            <View style={{width:60,height:28,alignItems:'center',justifyContent:'center',marginLeft:19,borderRadius:2,backgroundColor:'#00baf3'}}>
                              <Text style={{color:'#ffffff',fontSize:12}}>近3天</Text>
                            </View>
                            :
                            <View style={{width:60,height:28,alignItems:'center',justifyContent:'center',marginLeft:19,borderRadius:2,backgroundColor:'#f6f6f6'}}>
                              <Text style={{color:'#666666',fontSize:12}}>近3天</Text>
                            </View>
                        }
                            
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{ this._clickTop2()}}>
                          {
                            this.state.top2?
                            <View style={{width:60,height:28,alignItems:'center',justifyContent:'center',backgroundColor:'#00baf3',marginLeft:12,borderRadius:2}}>
                              <Text style={{color:'#ffffff',fontSize:12}}>近1周</Text>
                            </View>
                            :
                            <View style={{width:60,height:28,alignItems:'center',justifyContent:'center',backgroundColor:'#f6f6f6',marginLeft:12,borderRadius:2}}>
                              <Text style={{color:'#666666',fontSize:12}}>近1周</Text>
                            </View>
                          }
                            
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this._clickTop3() }}>
                            {
                              this.state.top3?
                              <View style={{width:60,height:28,alignItems:'center',justifyContent:'center',backgroundColor:'#00baf3',marginLeft:12,borderRadius:2}}>
                                <Text style={{color:'#ffffff',fontSize:12}}>近1月</Text>
                              </View>
                              :
                              <View style={{width:60,height:28,alignItems:'center',justifyContent:'center',backgroundColor:'#f6f6f6',marginLeft:12,borderRadius:2}}>
                                <Text style={{color:'#666666',fontSize:12}}>近1月</Text>
                              </View>
                            }
                        </TouchableOpacity>
                    </View>

                    <View style={{flexDirection:'row',marginTop:12}} >
                        <TouchableOpacity onPress={()=>{ this._clickTop4()}}>
                            {
                              this.state.top4?
                              <View style={{width:115,height:28,alignItems:'center',justifyContent:'center',backgroundColor:'#00baf3',marginLeft:19,borderRadius:2}}>
                                <Text style={{color:'#ffffff',fontSize:12}}>{this.state.startText}</Text>
                              </View>
                              :
                              <View style={{width:115,height:28,alignItems:'center',justifyContent:'center',backgroundColor:'#f6f6f6',marginLeft:19,borderRadius:2}}>
                                <Text style={{color:'#999999',fontSize:12}}>{this.state.startText}</Text>
                              </View>
                            }
                        </TouchableOpacity>
                        <View style={{width:28,height:28,alignItems:'center',justifyContent:'center',backgroundColor:'#ffffff'}}>
                              <Text style={{color:'#6f899b',fontSize:12}}>—</Text>
                            </View>
                        <TouchableOpacity onPress={()=>{ this._clickTop5() }}>
                            {
                              this.state.top5?
                              <View style={{width:115,height:28,alignItems:'center',justifyContent:'center',backgroundColor:'#00baf3',borderRadius:2}}>
                                <Text style={{color:'#ffffff',fontSize:12}}>{this.state.endText}</Text>
                              </View>
                              :
                              <View style={{width:115,height:28,alignItems:'center',justifyContent:'center',backgroundColor:'#f6f6f6',borderRadius:2}}>
                                <Text style={{color:'#999999',fontSize:12}}>{this.state.endText}</Text>
                              </View>
                            }
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{flex:1,height:148,backgroundColor:'#ffffff',marginLeft:20,marginRight:20,marginTop:16,borderRadius:12}}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <View style={{backgroundColor:'#6f899b',width:18,height:1,marginTop:16}} />
                        <Text style={{color:'#6f899b',fontSize:14,marginTop:16,alignSelf:'center',marginLeft:9,marginRight:9}} >单据状态</Text>
                        <View style={{backgroundColor:'#6f899b',width:18,height:1,marginTop:16}} />
                      </View>

                    <View style={{flexDirection:'row',marginTop:16}} >
                        <TouchableOpacity onPress={()=>{this._clickBottom1() }}>
                            {
                              this.state.bottom1?
                              <View style={{width:60,height:28,alignItems:'center',justifyContent:'center',backgroundColor:'#00baf3',marginLeft:19,borderRadius:2}}>
                                <Text style={{color:'#ffffff',fontSize:12}}>全部</Text>
                              </View>
                              :
                              <View style={{width:60,height:28,alignItems:'center',justifyContent:'center',backgroundColor:'#f6f6f6',marginLeft:19,borderRadius:2}}>
                                <Text style={{color:'#666666',fontSize:12}}>全部</Text>
                              </View>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this._clickBottom2() }}>
                            {
                              this.state.bottom2?
                              <View style={{width:60,height:28,alignItems:'center',justifyContent:'center',backgroundColor:'#00baf3',marginLeft:12,borderRadius:2}}>
                                <Text style={{color:'#ffffff',fontSize:12}}>待提交</Text>
                              </View>
                              :
                              <View style={{width:60,height:28,alignItems:'center',justifyContent:'center',backgroundColor:'#f6f6f6',marginLeft:12,borderRadius:2}}>
                                <Text style={{color:'#666666',fontSize:12}}>待提交</Text>
                              </View>
                            }
                        </TouchableOpacity>
                        
                    </View>

                </View>
          </View>
          
          
           <WideButton text="下载" onClick={()=>{this._download();}} style={{ marginTop: 32, width: 297,height:40, alignSelf: "center" }} />
           
           <DatePicker
                    mode="date"
                    title=" "
                    visible={this.state.visible}
                    onDismiss={() => this._PickerDismiss()}
                    onOk={date => {
                        this._PickerOk(date);
                    }}
                    extra=" "
                    value={ new Date()}
                >
                </DatePicker>
        </ScrollView>
      </SafeAreaView>
    );
  }
};



var styles = StyleSheet.create({
  container:{
    backgroundColor:'#F9F9F9',
    width:width,
    height:height
  },
  selectedBg:{
    backgroundColor:'#00baf3',
  },
  selectedText:{
    color:'#ffffff',
  },
  unSelectedBg:{
    backgroundColor:'#f6f6f6',
  },
  unSelectedText:{
    color:'#666666',
  },
  unTimedText:{
    color:'#999999',
  }
  
});