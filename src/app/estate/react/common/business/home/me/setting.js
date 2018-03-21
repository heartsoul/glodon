'use strict';
import React,{ Component} from "react";
import{
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet
} from "react-native";

var Dimensions = require("Dimensions");
var { width, height } = Dimensions.get("window");

export default class SettingPage extends Component{

    static navigationOptions = ({navigation, screenProps}) => ({
        headerTitle:(<Text style={{color:'#ffffff',fontSize:17,alignSelf:'center',textAlign:'center',flex:1,}}>设置</Text>),
        headerStyle:{backgroundColor:"#00baf3"},
        headerLeft:(
            <TouchableOpacity onPress={()=>{navigation.goBack()}}>
              <Image source={require('../../../res/images/icon_back_white.png')} style={{width:9,height:20,marginLeft:20}} />
            </TouchableOpacity>  
        ),
        headerRight:(<View style={{width:29}}/>)
      });
      componentDidMount=()=> {
        console.log(this.props.navigation.state.params);
        //请求数据
         this.props.navigation.setParams({rightNavigatePress:this._rightAction }) 
      }
      _rightAction = ()=> {
        console.log("执行_rightAction");
      }
    constructor() {
        super();
    }



    render(){
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />

                <SettingItemView icon = {require('../../../res/images/icon_setting_change_password.png')} title='修改密码' onPress={()=>this._gotoSetting()}></SettingItemView>
                <View style={{height:10}}></View>

                <SettingItemView icon = {require('../../../res/images/icon_setting_version.png')} title='版本信息' hideArrow={true} showExtText={'版本号V1.1.0'} onPress={()=>this._gotoSetting()}></SettingItemView>
                <View style={styles.settingItemLine}></View>
                <SettingItemView icon = {require('../../../res/images/icon_setting_feedback.png')} title='意见反馈' onPress={()=>this._gotoSetting()}></SettingItemView>
                <View style={styles.settingItemLine}></View>
                <SettingItemView icon = {require('../../../res/images/icon_setting_contact_us.png')} title='联系我们'hideArrow={true} onPress={()=>this._gotoSetting()}></SettingItemView>
                <View style={styles.settingItemLine}></View>
                <SettingItemView icon = {require('../../../res/images/icon_setting_about_us.png')} title='关于我们' onPress={()=>this._gotoSetting()}></SettingItemView>

                <View style={{height:10}}></View>

                <SettingItemView icon = {require('../../../res/images/icon_setting_change_project.png')} title='切换项目' onPress={()=>this._gotoSetting()}></SettingItemView>

                <View style={{height:10}}></View>
                
                <SettingItemView icon = {require('../../../res/images/icon_setting_offline.png')} title='离线设置' onPress={()=>this._gotoSetting()}></SettingItemView>


            </SafeAreaView>
        );
    }

}

class SettingItemView extends React.Component{
    
    constructor() {
        super();
    }

    render(){
        let arrow = this.props.hideArrow ? null:<Image source={require('../../../res/images/icon_arrow_right_gray.png')} style={styles.settingItemArrow}/> ;    // 箭头
        let extText = this.props.showExtText ? <Text style={styles.settingItemExtText}>{this.props.showExtText}</Text> : null;    // 箭头

        return(
         <TouchableOpacity onPress={()=>{ this.props.onPress()}}>
          <View style={styles.settingItemContainer}>
            <Image source={this.props.icon} style={styles.settingItemIcon}/>
            <Text style={styles.settingItemText}>{this.props.title} </Text>
            {extText}
            {arrow}
          </View>
        </TouchableOpacity>
        );
    }
}

var styles = StyleSheet.create({
    container:{
      backgroundColor:'#f5f8f9',
      width:width,
      height:height
    },

    settingItemContainer:{
      height:50,
      alignItems:'center',
      flexDirection:'row',
      backgroundColor:'#ffffff'
    },
    settingItemIcon:{
      width:24,
      height:24,
      marginLeft:20
    },
    settingItemText:{
      marginLeft:17,
      flex:1,
      fontSize:14,
      color:'#000000',
    },
    settingItemExtText:{
        fontSize:14,
        color:'#999992',
        marginRight:20
      },
    settingItemArrow:{
      width:5,
      height:12,
      marginRight:20
    },
    settingItemLine:{
      height:1,
      backgroundColor:'#f7f7f7',
    },

});