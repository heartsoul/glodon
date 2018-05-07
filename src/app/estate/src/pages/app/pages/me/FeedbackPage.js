'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { Toast } from 'antd-mobile';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as API from 'app-api'
export default class extends React.Component {
  static navigationOptions= ({ navigation, screenProps }) => ({
    title: '意见反馈',
    headerRight:(navigation.state.params &&navigation.state.params.loadRightTitle) ? navigation.state.params.loadRightTitle() : null
  });
  textInputValue = {
    "name": null,
    "email": null,
    "title": null,
    "content": null
}
  constructor(props) {
      super(props);
      this.props.navigation.setParams({loadRightTitle: this.loadRightTitle })
    };
    _onSubmit = (text) => {
      if(!this.textInputValue.name || this.textInputValue.name.length < 1) {
        Toast.info('请输入名称', 1);
        return;
      }
      if(!this.textInputValue.email || this.textInputValue.email.length < 1) {
        Toast.info('请输入合法邮箱', 1);
         return;
       } else {
        let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; 
        if(!reg.test(this.textInputValue.email)) {
          Toast.info('请输入合法邮箱', 1);
          return;
        } 
       }
       if(!this.textInputValue.title || this.textInputValue.title.length < 1) {
        Toast.info('请输入主题'), 1;
         return;
       }
       if(!this.textInputValue.content || this.textInputValue.content.length < 1) {
        Toast.info("请输入内容", 1);
         return;
       }
      //  console.log("提交完成");
      API.feedbacks(this.textInputValue).then((data)=>{
        Toast.success("提交成功", 1);
        this.props.navigation.goBack()  
      }).catch(err=>{
        Toast.fail("提交失败", 1);
      })
       
       
  }
  loadRightTitle = () => { 
    return (<Text onPress={() => this._onSubmit()} style={{ marginRight: 10, color: '#FFFFFF', textAlign: "center" }} >提交</Text>)
    
  }
  onChangeTextName= (text) => {
    this.textInputValue.name = text;
  }
  onChangeTextEmail= (text) => {
    this.textInputValue.email = text;
  }
  onChangeTextTitle= (text) => {
    this.textInputValue.title = text;
  }
  onChangeTextContent= (text) => {
    this.textInputValue.content = text;
  }
  render() {
    return (
      <KeyboardAwareScrollView style={[styles.container, { backgroundColor: '#ffffff' }]}>
      <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
      <TextInput onChangeText={this.onChangeTextName} multiline={false} style={styles.textLine} placeholder='姓名'></TextInput>
      <TextInput onChangeText={this.onChangeTextEmail} multiline={false} style={styles.textLine} placeholder='邮箱'></TextInput>
      <TextInput onChangeText={this.onChangeTextTitle} multiline={false} style={styles.textLine} placeholder='标题'></TextInput>
      <TextInput onChangeText={this.onChangeTextContent} multiline={true} style={styles.text} placeholder='请输入意见反馈内容'></TextInput>
      </KeyboardAwareScrollView>
      
    );
  }
};

var styles = StyleSheet.create({
    container:{
      // flex:1,
      height:'100%'
    },
    text:{
      fontSize:18,
      width:'90%',
      height:100,
      color:'gray',
      marginRight:20,
      marginLeft:20,
      paddingRight:10,
      paddingLeft:10,
      paddingTop:10,
      marginTop:20,
      borderWidth:1,
      borderColor:'#ededed',
    },
    textLine:{
      fontSize:18,
      width:'90%',
      height:30,
      color:'gray',
      marginRight:20,
      paddingLeft:10,
      marginLeft:20,
      marginTop:20,
      borderWidth:1,
      borderColor:'#ededed',
    },
});