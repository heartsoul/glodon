'use strict';
 import React, { Component } from 'react'
  import request from '../../utils/request'

import {
  AppRegistry,
  StyleSheet,
  Button,
  Text,
  Image,
  View,
  TextInput,
  TouchableHighlight,
  Alert,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';

var RNBridgeModule = NativeModules.GLDRNBridgeModule;//你的类名
const NativeModule = new NativeEventEmitter(RNBridgeModule);
const API_HOST = 'http://sg.glodon.com/api';

function logout() {
  request(API_HOST+'/logout', {
    method: 'GET',
  });
  request(API_HOST+'/uaa/logout', {
    method: 'GET',
  });
}


function account() {
  return request(API_HOST+'/admin/account',{
          method:'get'
        });
}

function login(username,pwd) {
  
  logout(); // 先退出一下再说
   let url = API_HOST+"/uaa/login";
    fetch(url , {  
      headers: {"Content-Type":"application/x-www-form-urlencoded","X-Requested-With":"XMLHttpRequest"},
       credentials:'include',  
      method:'post',
       body: 'username='+username+'&password='+pwd, 
      } ,
    ).then((response) => { 
       console.log(response); 
      // alert(response);
      // 登录成功就获取用户信息
       let accountRet = account();
      // if(accountRet) {
        let navigator = this.props.navigator;
        if (navigator) {
            navigator.push('HomePage');
        }
     // }
     // let accountRet = request('http://sg.glodon.com/api/admin/account',{
     //      method:'get'
     //    })
     // console.log(accountRet);
    })
  return request('http://sg.glodon.com/api/admin/account',{
          method:'get'
        });
}
//import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class GLDLoginViewController extends React.Component {
    constructor(props){  
      super(props);  
      /*用来指示是否显示Loading提示符号*/  
      this.state = {  
          disabled : false,  
          pressed : false, 
          username : '',// props.userName,
          password : '',//props.password,
          focusUserName:1,// 焦点 0: 没有 1:
          focusPassword:0,// 焦点 0: 没有 1:
          events:'',
          msg:'',
      };
    }

   componentDidMount(){
    console.log('componentDidMount');
       NativeModule.addListener('test',(data)=>this._getNotice(data));
   }

   _getNotice (body) {//body 看你传什么
    console.log('_getNotice:');
      console.log('_getNotice:'+body);
       this.forceUpdate();//重新渲染
   }

   componentWillUnmount() {
    console.log('componentWillUnmount');
       //删除监听
       this.NativeModule.remove()
   }
  
  _confirm(){
    console.log('_confirm');
    
  }
  /**
    * 登录
    * @param {*} username 
    * @param {*} password  md5加密
    */
    // _onLogin(username, password) {
    //     var url = 'http://192.168.2.112:8042/ShengDaAutoPlatform/client!businessUserLogin';
    //     var params = "service=businessUserLogin&businessUserName=" + username + "&businessPassword=" + NetUtils.MD5(password);
    //     var service = "businessUserLogin";
    //     NetUtils.post(url, service, params, (result) => {
    //         //存储数据
    //         AsyncStorage.setItem("userInfo", JSON.stringify(result), (error) => {
    //             if (error) {
    //                 alert('数据保存失败');
    //             } else {
    //                 //跳转到主界面
    //                 let navigator = this.props.navigator;
    //                 if (navigator) {
    //                     navigator.push({
    //                         name: '主界面',
    //                         component: Home,
    //                     });
    //                 }
    //             }
    //         })
    //     });
    // }
  _onUserNameChangeText(text){
    console.log('_onUserNameChangeText'+text);
    this.setState({username:text});
  }
  _onUserNameBlur(){
    this.setState({focusUserName:0});
  }
  _onPasswordBlur(){
    this.setState({focusPassword:0});
  }
  _onUserNameFocus() {
    this.setState({
      focusUserName:1
    });
  }
  _onPasswordFocus(){
    this.setState({
      focusPassword:1
    });
  }
  _onPasswordChangeText(text){
    console.log('_onPasswordChangeText'+text);
    this.setState({password:text});
  }


 _loginAction() {
    // body...
 // Alert.alert('提示','确认登录',[{text:"我知道了", onPress:this._confirm},{text:"我知道了1", onPress:this._confirm},{text:"我知道了2", onPress:this._confirm}]);
    // RNBridgeModule.RNInvokeOCCallBack({
    //     "caller": "gldrn",
    //     "name": "push",
    //     "ver": "1.0",
    //     "data": {}
    //   },
    //   (data, request) => {
    //     console.log(request);
    //     if (data) {
    //       console.log(data);
    //     } else {
    //       this.setState({
    //         events: data
    //       });
    //     }
    //   });


    // RNBridgeModule.RNInvokeOCCallBack({
    //     "caller": "gldrn",
    //     "name": "alert",
    //     "ver": "1.0",
    //     "data": {"title":"登录", "message":"是否确认登录？"}
    //   },
    //   (data, request) => {
    //     console.log(request);
    //     if (data) {
    //       console.log(data);
    //     } else {
    //       this.setState({
    //         events: data
    //       });
    //     }
    //   });
    //uaa/login
    
    // let url = "https://sg.glodon.com/api/uaa/login";
  //  login('18800105362','123qwe!@#');
  let navigator = this.props.navigation;
        if (navigator) {
            navigator.replace('HomePage');
        }
        return;
  }
  render() {
    return (
      <View style={{backgroundColor:'#ffffff',flex:1,marginLeft:0,marginRight:0}}>
      <Text style={[styles.style_login_title]}>
        登录
      </Text>
      <Text style={[styles.style_input_title,(this.state.focusUserName == 1 || this.state.username.length > 0) ? {color:'rgb(153,153,146)'}:{color:'transparent'},,{marginTop:68}]}>
        账户名
      </Text>
          <TextInput style={styles.style_user_input}
              placeholder={this.state.focusUserName == 1 ? '': '请输入账户名称'}
              numberOfLines={1}
              autoFocus={true}
             underlineColorAndroid={'transparent'}
              textAlign='left'
              onBlur={() => this._onUserNameBlur()}
              onFocus={() => this._onUserNameFocus()}
              onChangeText={(text) => this._onUserNameChangeText(text)}
              value={this.state.username}
          />
          <View
             style={this.state.focusUserName == 1 ? styles.style_input_line : styles.style_input_line_gray}
          />
          <Text style={[styles.style_input_title,(this.state.focusPassword == 1 || this.state.password.length > 0) ? {color:'rgb(153,153,146)'}:{color:'transparent'}]}>
        密码
      </Text>
          <TextInput
              style={styles.style_pwd_input}
              placeholder={this.state.focusPassword == 1 ? '': '请输入用户密码'}
              numberOfLines={1}
             underlineColorAndroid={'transparent'}
              secureTextEntry={true}
              textAlign='left'
              onChangeText={(text) => this._onPasswordChangeText(text)}
              value={this.state.password}
              onBlur={() => this._onPasswordBlur()}
              onFocus={() => this._onPasswordFocus()}
          />
          <View
              style={this.state.focusPassword == 1 ? styles.style_input_line : styles.style_input_line_gray} 
              /> 
              <View>
      <TouchableHighlight onPress={this._loginAction} underlayColor='#1AA667' activeOpacity={1.0} style={this.state.disabled ? styles.style_loginTextViewDisabled: (this.state.pressed ? styles.style_loginTextViewPressed : styles.style_loginTextView)} onHideUnderlay={()=>{this.setState({pressed: false})}} onShowUnderlay={()=>{this.setState({pressed: true})}} >
        <Text style={styles.style_loginText} >
            登 录
        </Text>
      </TouchableHighlight>
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  style_login_title:{
   fontSize:36,
    height:50,
    width:76,
    marginTop:80,
    marginLeft:0,
  },
  style_input_title:{
   fontSize:12,
    height:14,
    width:76,
    marginTop:12,
    marginLeft:20,
  },  
  style_image:{
    borderRadius:35,
    height:70,
    width:70,
    marginTop:440,
    alignSelf:'center',
  },
  style_user_input:{ 
      backgroundColor:'#fff',
      marginTop:12,
      height:40,
      marginLeft:20,
      marginRight:60,
  },
  style_pwd_input:{ 
      backgroundColor:'#fff',
      height:40,
      marginTop:12,
      marginLeft:20,
      marginRight:60,
  },
  style_input_line:{
    height:2,
    backgroundColor:'rgb(51,206,136)',
    marginLeft:20,
    marginRight:20,
  },
  style_input_line_gray:{
    height:2,
    backgroundColor:'rgb(243,242,242)',
    marginLeft:20,
    marginRight:20,
  },
   style_input_submit:{ 
      marginTop:15,
      marginLeft:20,
      marginRight:20,
      backgroundColor:'#333',
      height:60,
      borderRadius:20,
      justifyContent: 'center',
      alignItems: 'center',
      color:'#fff',
  },
  style_view_unlogin:{
    fontSize:12,
    color:'#63B8FF',
    marginLeft:10,
  },
  style_view_register:{
    fontSize:12,
    color:'#63B8FF',
    marginRight:10,
    alignItems:'flex-end',
    flex:1,
    flexDirection:'row',
    textAlign:'right',
  },
  style_loginText: {
    overflow: 'hidden',
    height: 20,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 20,
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 16,
    color: '#fff'
  },
  style_loginTextView: {
    overflow: 'hidden',
    height: 40,
    backgroundColor: '#33ce88',
    borderRadius: 20,
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
  },
  style_loginTextViewPressed: {
    overflow: 'hidden',
    height: 40,
    backgroundColor: '#1AA667',
    borderRadius: 20,
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
  },
  style_loginTextViewDisabled: {
    overflow: 'hidden',
    height: 40,
    backgroundColor: '#C8C8C8',
    borderRadius: 20,
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
  },
});
export default GLDLoginViewController;