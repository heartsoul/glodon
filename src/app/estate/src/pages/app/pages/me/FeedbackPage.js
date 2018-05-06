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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
export default class extends React.Component {
  static navigationOptions= ({ navigation, screenProps }) => ({
    title: '意见反馈',
    headerRight:navigation.state.params ? navigation.state.params.loadRightTitle() : null
  });
  textInputValue = ''
  constructor(props) {
      super(props);
      this.props.navigation.setParams({loadRightTitle: this.loadRightTitle })
    };
    _onSubmit = (text) => {
       console.log("提交完成");
       alert(this.textInputValue);
       this.props.navigation.goBack()
  }
  loadRightTitle = () => { 
    return (<Text onPress={() => this._onSubmit()} style={{ marginRight: 10, color: '#FFFFFF', textAlign: "center" }} >提交</Text>)
    
  }
  onChangeText= (text) => {
    this.textInputValue = text;
  }
  render() {
    return (
      <KeyboardAwareScrollView style={[styles.container, { backgroundColor: '#ffffff' }]}>
      <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
      <TextInput onChangeText={this.onChangeText} multiline={false} style={styles.textLine} placeholder='姓名'></TextInput>
      <TextInput onChangeText={this.onChangeText} multiline={false} style={styles.textLine} placeholder='邮箱'></TextInput>
      <TextInput onChangeText={this.onChangeText} multiline={false} style={styles.textLine} placeholder='标题'></TextInput>
      <TextInput onChangeText={this.onChangeText} multiline={true} style={styles.text} placeholder='请输入意见反馈内容'></TextInput>
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