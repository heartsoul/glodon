'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import OfflineManager from '../../../offline/manager/OfflineManager'
let qualityConditionManager = null;
var { width, height } = Dimensions.get("window");
let clearFun=null;
//质检清单 下载条件记录
export default class extends Component {
  
  constructor() {
    super();
    qualityConditionManager = OfflineManager.getQualityConditionManager();
    this.state={
      datalist:[]
    }
    clearFun=()=>{
      this.setState((pre)=>{
        return {
          datalist:[],
        }
      })
    }
};

  static navigationOptions = {
    title: '质检清单',
    headerRight:<TouchableOpacity onPress={()=>{
      qualityConditionManager.deleteAll();
      clearFun();
    }}>
                   <Image source={require('app-images/icon_bottom_delete.png')} style={{width:24,height:24,marginRight:12} }/>
                </TouchableOpacity>
  };

  
 

  componentDidMount=()=>{
    console.log('+++++++++++++++')
    // let record = {
      //   startTime:startTime,//选择的时间范围的开始时间    时间戳
      //   endTime:endTime,//选择的时间范围的结束时间    时间戳
      //   qcState:qcState,//选择的分类   全部  待提交  待整改。。。
      
      //   timeText:timeText,//在下载记录中 显示的时间   近3天。。。
      //   downloadTime:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()),//下载时间
      //   size:111,//下载的单据的条数
      // }
    setTimeout (()=>{
      let result = qualityConditionManager.getAllRecords();
      this.setState((pre)=>{
        return {
          datalist:result,
        }
      })
    }, 500);
    
  }

  _getQcstateText(item){
        // {"全部", "待提交",  "待整改",       "待复查",      "已检查",      "已复查",    "已延迟",  "已验收"};
        // {"",     "staged", "unrectified",  "unreviewed",  "inspected",  "reviewed",  "delayed","accepted"};
    switch(item){
      case '':
      return '全部';
      case 'staged':
      return '待提交';
      case 'unrectified':
      return '待整改';
      case 'unreviewed':
      return '待复查';
      case 'inspected':
      return '已检查';
      case 'reviewed':
      return '已复查';
      case 'delayed':
      return '已延迟';
      case 'accepted':
      return '已验收';
    }
  }

  _renderItem=(item)=>{
    return (
      <View style={{height:129,backgroundColor:'#ffffff',marginLeft:20,marginRight:20,marginTop:16,borderRadius:12}}>
          <View style={{height:61,flexDirection:'row',alignItems:'center'}}>
              <View style={{flex:1}}>
                  <Text style={{color:'#565656',fontSize:14,marginLeft:20}}>{item.item.timeText}</Text>
                  <Text style={{color:'#999999',fontSize:12,marginLeft:20}}>下载时间:{item.item.downloadTime}</Text>
              </View>
              <View style={{flexDirection:'row',marginRight:23}}>
                  <Text style={{color:'#999999',fontSize:14}}>{item.item.size}条</Text>
              </View>
          </View>
          <View style={{height:1,backgroundColor:'rgba(204,204,204,163)'}} />
          <View style={{flexDirection:'row', flex:1,backgroundColor:'#ffffff',alignItems:'center',borderBottomLeftRadius:12,borderBottomRightRadius:12}}>
            <FlatList 
              data={item.item.qcState} 
              horizontal={true}
              renderItem={({item})=>{
                    return (
                              <View style={{width:60,height:28,alignItems:'center',justifyContent:'center',marginLeft:19,borderRadius:2,backgroundColor:'#00baf3'}}>
                                    <Text style={{color:'#ffffff',fontSize:12}}>{this._getQcstateText(item)}</Text>
                              </View>
                          );
                  }
              }
              keyExtractor={(item, index) => index+''}
              />
          </View>
      </View>
    );
  }
 

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
        <FlatList  style={{marginBottom:100}}
          data={this.state.datalist}
          keyExtractor={(item, index) => index+''}
          renderItem={this._renderItem}
        />
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
  mineItemContainer:{
    height:50,
    alignItems:'center',
    flexDirection:'row',
    backgroundColor:'#ffffff'
  },
  mineItemIcon:{
    width:30,
    height:30,
    marginLeft:15
  },
  mineItemText:{
    marginLeft:10,
    flex:1,
    fontSize:14,
    color:'#6f899b',
  },
  mineItemArrow:{
    width:5,
    height:12,
    marginRight:20
  },
  
});