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
import { KeyboardAwareScrollView } from 'app-3rd/index';
import * as API from 'app-api'
import { BarItems } from "app-components"
import EquipmentInfoItem from "../equipment/equipmentInfoItem"
export default class extends React.Component {
  static navigationOptions= ({ navigation, screenProps }) => ({
    headerTitle: <BarItems.TitleBarItem text='意见反馈'/>,
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
    return (<BarItems navigation={this.props.navigation}>
      <BarItems.RightBarItem text="提交" navigation={this.props.navigation}  onPress={(navigation) => this._onSubmit(navigation)} />
     </BarItems>)
    
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
      <EquipmentInfoItem.EquipmentInfoItemTextInput key="fb1" leftTitle="姓名：" titleWidth={55} showType="input" onChangeText={this.onChangeTextName} />
      <EquipmentInfoItem showType="line" />
      <EquipmentInfoItem.EquipmentInfoItemTextInput key="fb2" leftTitle="邮箱：" titleWidth={55} showType="input" onChangeText={this.onChangeTextEmail} />
      <EquipmentInfoItem showType="line" />
      <EquipmentInfoItem.EquipmentInfoItemTextInput key="fb3" leftTitle="标题：" titleWidth={55} showType="input" onChangeText={this.onChangeTextTitle} />
      <EquipmentInfoItem showType="line" />

      <TextInput underlineColorAndroid={"transparent"} onChangeText={this.onChangeTextContent} multiline={true} style={styles.text} placeholder='留言内容...'></TextInput>
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
      fontSize:15,
      textAlignVertical: 'top',
      // width:'100%',
      minHeight:120,
      marginRight:0,
      marginLeft:0,
      paddingRight:20,
      paddingLeft:20,
      paddingTop:10,
      marginTop:20,
      color: '#666666',
        fontWeight: '100',
        marginBottom: 0,
        backgroundColor:'#FAFAFA'
    },
});