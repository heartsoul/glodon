'use strict';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Switch,
  requireNativeComponent,
} from 'react-native';
var Dimensions = require("Dimensions");
var { width, height } = Dimensions.get("window");
import { SegmentedView, ListRow, Label, ActionSheet, PullPicker, Theme } from 'teaset';
import ImageChooserView from './ImageChooserView';
import * as UPLOADAPI from "../../service/api/api+upload"; 
import * as QUALITYAPI from "../../service/api/api+quality"; 
import * as PMBASICAPI from "../../service/api/api+pmbasic"; 

var ReactNative = require('ReactNative');

const REF_PHOTO = 'gldPhoto';

export default class extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: '新建',
    headerTintColor:"#FFF",
    headerStyle:{backgroundColor:"#00baf3"},
    headerRight:(  
      <Text  onPress={()=>navigation.state.params.rightNavigatePress()} style={{marginRight:20, color:'#FFFFFF' , width:60, textAlign:"right"}} >  
          提交   
      </Text>  
    ),
    // headerLeft:(  
    //   <Text  onPress={()=>navigation.goBack()} style={{marginLeft:20, color:'#FFFFFF' , width:60, textAlign:"left"}} >  
    //       返回   
    //   </Text>  
    // )
  });

  _fetchData(fetchData){
    if (this.state.projectId === 0 || this.state.latestVersion === '') {
        global.storage.loadProject((projectId) => {
            global.storage.projectId = projectId;
            this.setState({
                projectId: projectId,
            });
            fetchData();
        });
    } else {
        fetchData();
    }
  }
  /**
   * 获取项目下检查单位列表
   */
  _getInspectionCompanies = () => {
    QUALITYAPI.getInspectionCompanies(global.storage.projectId)
        .then(data => {
            this.setState({
                inspectionCompanies: data.data,
                selectInspectionCompanyIndex: data.data && data.data.length > 0 && 0,
            });
        })
        .catch(err);
  }


  _showInspectionCompanyActionSheet = ()=> {
    PullPicker.show(
        '选择检查单位',
        this.state.inspectionCompanies,
        this.state.selectInspectionCompanyIndex,
        (item, index) => this.setState({selectInspectionCompanyIndex: index}),
        {getItemText:(item,index) => {return item.name}}
    );
  }

 /**
  * 获取施工单位列表
  */
  _getCompaniesList = ()=> {
    PMBASICAPI.getCompaniesList(global.storage.projectId,'SGDW')
    .then(data => {
        this.setState({
            companies: data.data,
            selectCompanyIndex: data.data && data.data.length > 0 && 0,
        });
    })
    .catch(err);
  }
  
  _showCompanyActionSheet = ()=> {
    PullPicker.show(
        '选择施工单位',
        this.state.companies,
        this.state.selectCompanyIndex,
        (item, index) => this.setState({selectCompanyIndex: index}),
        {getItemText:(item,index) => {return item.name}}
    );
  }

 /**
  * 查询施工单位的责任人
  */
 _getPersonList = ()=> {
    if(this.state.selectCompanyIndex == undefined){
         return;
    }
    this._fetchData(() => {
        let coperationId = this.state.companies[this.state.selectCompanyIndex].coperationId;
        PMBASICAPI.getPersonList(global.storage.projectId,coperationId)
        .then(data => {
            this.setState({
                persons: data.data,
            });
            this._showPersonActionSheet();
        })
        .catch(err);
    });

  }
  
  _showPersonActionSheet = ()=> {
    PullPicker.show(
        '选择责任人',
        this.state.persons,
        this.state.selectPersonIndex,
        (item, index) => this.setState({selectPersonIndex: index}),
        {getItemText:(item,index) => {return item.name}}
    );
  }

  /**
   * 获取质检项目列表
   */
  _getCheckPoints = () => {
      QUALITYAPI.getCheckPoints(global.storage.projectId)
        .then(data => {
            this.setState({
                checkPoints: data.data,
            });
        });
  }

  _rightAction = ()=> {
    // let fileData = [
    //     {"path" : "file:///storage/emulated/0/pic.png", "name" : "pic.png", "length" : 107815},
    //     {"path" : "file:///storage/emulated/0/pic2.png", "name" : "pic2.png", "length" : 61365}
    // ];
    this.refs[REF_PHOTO]._loadFile((files)=>{
        if(files){
            UPLOADAPI.upLoadFiles(files,(code,result)=>{
                alert(result)//上传图片的结果
            });
        }
    });
  }

  componentDidMount=()=> {
    console.log(this.props.navigation.state.params);
    console.log(global.storage.projectId);
    //请求数据
     this.props.navigation.setParams({rightNavigatePress:this._rightAction }) 
     this._fetchData(this._getInspectionCompanies);
     this._fetchData(this._getCompaniesList);
     this._fetchData(this._getCheckPoints);
  }
  

  constructor() {
      super();
      this.state = {
        projectId:global.storage.projectId,
        
        inspectionCompanies:PropTypes.array,
        selectInspectionCompany: -1,//选中的检查单位
        
        companies:PropTypes.array,
        selectCompanyIndex: -1,//选中的施工单位
        
        persons:PropTypes.array,
        selectPersonIndex: -1,//选中的责任人
     }

  };
  
  render() {
    var region = {
      latitude: 37.48,
      longitude: -122.16,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
    return (
      <View>
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
        <ListRow title='检查单位' accessory='indicator' detail={this.state.selectInspectionCompanyIndex > -1 ? this.state.inspectionCompanies[this.state.selectInspectionCompanyIndex].name : ""} onPress={()=>{this._showInspectionCompanyActionSheet()}} />
        <ListRow title='施工单位' accessory='indicator' detail={this.state.selectCompanyIndex > -1 ? this.state.companies[this.state.selectCompanyIndex].name : ""} onPress={()=>{this._showCompanyActionSheet()}} />
        <ListRow title='责任人' accessory='indicator' detail={this.state.selectPersonIndex > -1 ? this.state.persons[this.state.selectPersonIndex].name : ""} onPress={()=>{this._getPersonList()}} />
        <ImageChooserView style={{ top:0,left:0,width:width,height:100 }} backgroundColor="#00baf3" onChange={()=>alert('收到!')} />
        <ListRow title='质检项目' accessory='indicator' onPress={()=>{}} />
        <ListRow title='关联图纸' accessory='indicator' onPress={()=>{}} />
        <ListRow title='关联模型' accessory='indicator' onPress={()=>{}} />
        <ImageChooserView ref ={ REF_PHOTO } style={{ top:0,left:0,width:width,height:100 }} backgroundColor="#00baf3" onChange={()=>alert('收到!')} />
      
       </View>
      
    );
  }
};

var styles = StyleSheet.create({
    
});