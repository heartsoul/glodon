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
  Dimensions,
  FlatList,
  
} from 'react-native';
import { DeviceEventEmitter } from "app-3rd"
import OfflineManager from '../../../offline/manager/OfflineManager'
var { width, height } = Dimensions.get("window");

//离线数据跟踪
export default class extends Component {
  
  static navigationOptions = {
    title: '离线进程跟踪',

  };

  constructor() {
      super();
       
      this.state ={
        showTodo:true,
        showSuccess:false,
        showFail:false,
      }
  };
  
  componentDidMount=()=>{
    
  }

  componentWillUnmount=()=>{
    
  }



  //点击待处理
  _clickAll=()=>{
    this.setState((pre)=>{
      return {
        ...pre,
        showTodo:true,
        showSuccess:false,
        showFail:false,
      };
    })
  }
  //点击已成功
  _clickLoaded=()=>{
    this.setState((pre)=>{
      return {
        ...pre,
        showTodo:false,
        showSuccess:true,
        showFail:false,
      };
    })
  }
  //点击已失败
  _clickLoading=()=>{
    this.setState((pre)=>{
      return {
        ...pre,
        showTodo:false,
        showSuccess:false,
        showFail:true,
      };
    })
  }

  _getContentView=()=>{
    if(this.state.showTodo){
      return  (<AllView />);
    }
    if(this.state.showSuccess){
      return (<LoadedView />);
    }

    if(this.state.showFail){
      return (<LoadingView />);
    }
    return null;
  }


  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
        <View style={{flexDirection:'row',backgroundColor:'#ffffff'}}>
          <TopItemView title={'待处理'} isShowLine={this.state.showTodo} num={0} onPress={this._clickAll} />
          <TopItemView title={'已成功'} isShowLine={this.state.showSuccess} num={0} onPress={this._clickLoaded} />
          <TopItemView title={'已失败'} isShowLine={this.state.showFail} num={0} onPress={this._clickLoading} />
        </View>
        <View style={{height:10}}></View>
        {
          this._getContentView()
        }
      </SafeAreaView>
    );
  }
};

//待处理-内容页面
class AllView extends Component{

  _renderItem =(item,index)=>{
    return (
      <View style={{height:55,backgroundColor:'#ffffff'}} >
        <View style={{height:55,backgroundColor:'#ffffff' ,flexDirection:'row',alignItems:'center' }}>
          <Image source={require('app-images/icon_downloading_quality.png')} style={{width:40,height:40,marginLeft:15,marginRight:10}} />
          <View style={{flex:1,justifyContent:'center'}} >
            <Text style={{fontSize:14,color:'#333333'}} >检查单</Text>
            <Text style={{fontSize:10,color:'#999999'}} >201825865</Text>
          </View>
          <Text style={{fontSize:12,color:'#f39b3d',marginRight:20}} >待同步</Text>
          
        </View>
      </View>
    );
  }

  _separtor= ()=>{
    return (
      <View style={{backgroundColor:'#f7f7f7',height:1,marginLeft:20}} />
    );
  }

  render(){
    return (
      <View style={{backgroundColor:'#f9f9f9'}} >

        <FlatList 
          data={[1,2,3,4]}
          renderItem={this._renderItem}
          ItemSeparatorComponent={this._separtor}
          keyExtractor={(item, index) => index+''}
        />
      </View>
    );
  }
}


//已成功-内容页面
class LoadedView extends Component{

  _renderItem =(item,index)=>{
    return (
      <View style={{height:55,backgroundColor:'#ffffff'}} >
        <View style={{height:55,backgroundColor:'#ffffff' ,flexDirection:'row',alignItems:'center' }}>
          <Image source={require('app-images/icon_downloading_quality.png')} style={{width:40,height:40,marginLeft:15,marginRight:10}} />
          <View style={{flex:1,justifyContent:'center'}} >
            <Text style={{fontSize:14,color:'#333333'}} >检查单</Text>
            <Text style={{fontSize:10,color:'#999999'}} >201825865</Text>
          </View>
          <Text style={{fontSize:12,color:'#666666',marginRight:20}} >已同步</Text>
          
        </View>
      </View>
    );
  }

  _separtor= ()=>{
    return (
      <View style={{backgroundColor:'#f7f7f7',height:1,marginLeft:20}} />
    );
  }

  render(){
    return (
      <View style={{backgroundColor:'#f9f9f9'}} >
        <FlatList 
          data={[1,2,3,4]}
          renderItem={this._renderItem}
          ItemSeparatorComponent={this._separtor}
          keyExtractor={(item, index) => index+''}
        />
      </View>
    );
  }
}



//已失败-内容页面
class LoadingView extends Component{


  _clickDelete=()=>{

  }
  _clickDetail=()=>{
    
  }
  _clickSubmit=()=>{
    
  }
  _renderItem =(item,index)=>{
    return (
      <View style={{height:206,backgroundColor:'#ffffff',borderRadius:6,marginLeft:10,marginRight:10,marginTop:10}} >
        <View style={{height:60,backgroundColor:'#ffffff' ,flexDirection:'row',alignItems:'center' }}>
          <Image source={require('app-images/icon_downloading_quality.png')} style={{width:40,height:40,marginLeft:15,marginRight:10}} />
          <View style={{flex:1,justifyContent:'center'}} >
            <Text style={{fontSize:14,color:'#333333'}} >检查单</Text>
            <Text style={{fontSize:10,color:'#999999'}} >201825865</Text>
          </View>
          <Text style={{fontSize:12,color:'#f39b3d',marginRight:20}} >同步失败</Text>
        </View>

        <View style={{height:100,backgroundColor:'#fafafa',marginLeft:20,marginRight:20}}>
          <Text style={{fontSize:14,color:'#ff460d',marginTop:9}} >失败原因：</Text>
          <Text style={{fontSize:13,color:'#262525',marginTop:8}} >失败原因描述失败原因描述失败原因描述失败原因描述失败原因描述</Text>
        </View>

        <View style={{height:46,flexDirection:'row',alignItems:'center',justifyContent:'flex-end',backgroundColor:'#ffffff'}}>
          <TouchableOpacity onPress={this._clickDelete}>
            <View style={{backgroundColor:'#f9f9f9',width:58,height:28,borderColor:'#979797',borderWidth:1,borderRadius:100,alignItems:'center',justifyContent:'center'}} >
              <Text style={{fontSize:14,color:'#666666',}} >删除</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._clickDetail}>
            <View style={{backgroundColor:'#f9f9f9',width:80,height:28,borderColor:'#979797',borderWidth:1,borderRadius:100,alignItems:'center',justifyContent:'center',marginLeft:10,marginRight:10}} >
              <Text style={{fontSize:14,color:'#666666',}} >查看详情</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._clickSubmit}>
            <View style={{backgroundColor:'#f9f9f9',width:80,height:28,borderColor:'#979797',borderWidth:1,borderRadius:100,alignItems:'center',justifyContent:'center',marginRight:10}} >
              <Text style={{fontSize:14,color:'#666666',}} >再次提交</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }



  render(){
    return (
      <View style={{backgroundColor:'#f9f9f9',flex:1,}} >
          <FlatList 
            data={[1,2,3,4]}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index+''}
          />
        <View style={{backgroundColor:'#ffffff',height:1,marginBottom:80}} />
      </View>
    );
  }
}

//横条的item   全部   已下载   下载中
class TopItemView extends Component{
    
  //title
  _showTitle=()=>{
    let isShowLine = this.props.isShowLine;
    if(isShowLine){
      return (
        <Text style={{fontSize:14,color:'#00baf3',marginTop:15}}>{this.props.title} </Text>
      );
    }
    return (
      <Text style={{fontSize:14,color:'#6f899b',marginTop:15}}>{this.props.title} </Text>
    );
  }
  //蓝色线
  _showLine=()=>{
    let isShowLine = this.props.isShowLine;
    if(isShowLine){
      return (
        <View style={{width:52,height:2,backgroundColor:'#00baf3',marginTop:11}} />
      );
    }
    return (
      <View style={{width:52,height:2,backgroundColor:'#ffffff',marginTop:11}} />
    );
  }

  //红点数字
  _showNum =()=>{
    let num = this.props.num;
    if(num>0){
      let str =' '+num+' ';
      if(num>999){
        num = 999
        str = ' '+num+'+ ';
      }
      return (
        <Text style={{fontSize:10,color:'#ffffff',borderRadius:27,backgroundColor:'#ff460d',height:16,marginTop:16}}>{str}</Text>
      );
    }
    return null;
  }
  render(){
    
    return(
      <TouchableOpacity onPress={()=>{ this.props.onPress()}}>
        <View style={{width:width/3,height:51,flexDirection:'row',justifyContent:'center'}}>
          <View style={{alignItems:'center',justifyContent:'flex-end'}}>
            {
              this._showTitle()
            }
            {
              this._showLine()
            }
         </View>
         {
           this._showNum()
         }
        </View>
      </TouchableOpacity>

    );
  }

}




var styles = StyleSheet.create({
    container:{
      backgroundColor:'#F9F9F9',
      width:width,
      height:height
    },
    
    
});