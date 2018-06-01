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

let timeStart=0
let timeEnd = 0
var { width, height } = Dimensions.get("window");
//质检清单下载条件选择
export default class extends Component {
  
  static navigationOptions = {
    title: '质检清单',

  };

  constructor() {
      super();
      this.state={
        top1:true,
        top2:false,
        top3:false,
        top4:false,
        top5:false,
        bottom1:true,
        bottom2:false,
        bottom3:false,
        bottom4:false,
        bottom5:false,
        visible: false,
        clickLeft:false,
        startText:'起始日期',
        endText:'终止日期',
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

  _clickBottom3=()=>{
    this.setState((pre)=>{
      return {
        ...pre,
        bottom1:false,
        bottom3:true,
      }
    })
  }

  _clickBottom4=()=>{
    this.setState((pre)=>{
      return {
        ...pre,
        bottom1:false,
        bottom4:true,
      }
    })
  }

  _clickBottom5=()=>{
    this.setState((pre)=>{
      return {
        ...pre,
        bottom1:false,
        bottom5:true,
      }
    })
  }
  //点击下载
  _download=()=>{
    let date = new Date();
    let startTime = date.getTime;
    let endTime = date.getTime;
    this.state.top1?(startTime=date.getTime-3*24*60*60*1000,endTime=date.getTime):'';
    this.state.top2?(startTime=date.getTime-7*24*60*60*1000,endTime=date.getTime):'';
    this.state.top3?(startTime=date.getTime-31*24*60*60*1000,endTime=date.getTime):'';
    this.state.top4?(startTime=timeStart):'';
    this.state.top5?(endTime=timeEnd):'';
    startTime<endTime?'':([startTime,endTime]=[endTime,startTime])


    let qcState=[];
    this.state.bottom1?qcState=['bottom1']:'';
    this.state.bottom2?qcState=[...qcState,'bottom2']:''
    this.state.bottom3?qcState=[...qcState,'bottom3']:''
    this.state.bottom4?qcState=[...qcState,'bottom4']:''
    this.state.bottom5?qcState=[...qcState,'bottom5']:''

    //下载单据

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
                              <Text style={{color:'#ffffff',fontSize:12}}>近7天</Text>
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
                        <TouchableOpacity onPress={()=>{this._clickBottom3() }}>
                            {
                              this.state.bottom3?
                              <View style={{width:60,height:28,alignItems:'center',justifyContent:'center',backgroundColor:'#00baf3',marginLeft:12,borderRadius:2}}>
                                <Text style={{color:'#ffffff',fontSize:12}}>待整改</Text>
                              </View>
                              :
                              <View style={{width:60,height:28,alignItems:'center',justifyContent:'center',backgroundColor:'#f6f6f6',marginLeft:12,borderRadius:2}}>
                                <Text style={{color:'#666666',fontSize:12}}>待整改</Text>
                              </View>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{ this._clickBottom4()}}>
                            {
                              this.state.bottom4?
                              <View style={{width:60,height:28,alignItems:'center',justifyContent:'center',backgroundColor:'#00baf3',marginLeft:12,borderRadius:2}}>
                                <Text style={{color:'#ffffff',fontSize:12}}>待复查</Text>
                              </View>
                              :
                              <View style={{width:60,height:28,alignItems:'center',justifyContent:'center',backgroundColor:'#f6f6f6',marginLeft:12,borderRadius:2}}>
                                <Text style={{color:'#666666',fontSize:12}}>待复查</Text>
                              </View>
                            }
                        </TouchableOpacity>
                    </View>

                    <View style={{flexDirection:'row',marginTop:12}} >
                        <TouchableOpacity onPress={()=>{this._clickBottom5() }}>
                            {
                              this.state.bottom5?
                              <View style={{width:60,height:28,alignItems:'center',justifyContent:'center',backgroundColor:'#00baf3',marginLeft:19,borderRadius:2}}>
                                <Text style={{color:'#ffffff',fontSize:12}}>已延迟</Text>
                              </View>
                              :
                              <View style={{width:60,height:28,alignItems:'center',justifyContent:'center',backgroundColor:'#f6f6f6',marginLeft:19,borderRadius:2}}>
                                <Text style={{color:'#666666',fontSize:12}}>已延迟</Text>
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