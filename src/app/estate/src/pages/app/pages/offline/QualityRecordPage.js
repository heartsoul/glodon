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
import { BarItems } from "app-components";

var { width, height } = Dimensions.get("window");
//质检清单 下载条件记录
export default class extends Component {
  
  //右上角清除按钮
  _clear=()=>{

  }

  static navigationOptions = {
    title: '质检清单',
    headerRight:<TouchableOpacity onPress={()=>{this._clear();}}>
                   <Image source={require('app-images/icon_bottom_delete.png')} style={{width:24,height:24,marginRight:12} }/>
                </TouchableOpacity>
  };

  constructor() {
      super();
      this.state={
        datalist:[1,2,3,4,5,6,7,8]
      }
  };
  
  _renderItem=(item,index)=>{
    return (
      <View style={{height:129,backgroundColor:'#ffffff',marginLeft:20,marginRight:20,marginTop:16,borderRadius:12}}>
          <View style={{height:61,flexDirection:'row',alignItems:'center'}}>
              <View style={{flex:1}}>
                  <Text style={{color:'#565656',fontSize:14,marginLeft:20,marginTop:12}}>近三天</Text>
                  <Text style={{color:'#999999',fontSize:12,marginLeft:20,marginTop:6}}>下载时间：2018-03-28 09:56</Text>
              </View>
              <View style={{flexDirection:'row',marginRight:23}}>
                  <Text style={{color:'#999999',fontSize:14}}>143条</Text>
              </View>
          </View>
          <View style={{height:1,backgroundColor:'rgba(204,204,204,163)'}} />
          <View style={{flexDirection:'row', flex:1,backgroundColor:'#ffffff',alignItems:'center',borderBottomLeftRadius:12,borderBottomRightRadius:12}}>
            <FlatList 
              data={['待提交','待整改','待复查','已延迟']} 
              horizontal={true}
              renderItem={({item,index})=>{
                    return (
                              <View style={{width:60,height:28,alignItems:'center',justifyContent:'center',marginLeft:19,borderRadius:2,backgroundColor:'#00baf3'}}>
                                    <Text style={{color:'#ffffff',fontSize:12}}>{item}</Text>
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