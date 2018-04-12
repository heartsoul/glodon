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
  TextInput,
  ScrollView,
  Button,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
var { width, height } = Dimensions.get("window");
import { SegmentedView, ListRow, Label, ActionSheet, PullPicker, Theme } from 'app-3rd/teaset';
import ImageChooserView from './ImageChooserView';

import * as API from "app-api";
const UPLOADAPI = API
const QUALITYAPI = API
const PMBASICAPI = API

import { Modal, Toast } from 'antd-mobile';

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
          });
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
      });
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
          });
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
    _getCheckPoints = ()=> {
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
          if(files && files.length > 0){
              console.log(files)
              UPLOADAPI.upLoadFiles(files,(code,result)=>{
                  this.setState({
                      //上传图片的结果
                      files:result,
                  });
                  this._submit();
              });
          }else{
              this._submit();
          }
      });
    }
    //选择质检项目
    _selectCheckPoint = ()=>{ 
        let navigator = this.props.navigation; 
        global.storage.pushNext(
          navigator,
          'CheckPointPage',
          {
              selectedCheckPoint:this.state.selectedCheckPoint,
              callback:(checkPoint) => {
                  console.log('aaabbb123')
                  console.log(checkPoint)
  
                  this.setState({
                      selectedCheckPoint:checkPoint,
                  });
              }
          }
         );
   }
    /**
     * 检测必填项
     * return true  所有必填项都已填写   false 有必填项没有填写
     */
    _checkMustInfo = ()=> {
      let info = [];  
      //检查单位
      if(this.state.selectCompanyIndex == -1){
          info.push('检查单位');
      }
      //施工单位
      if(this.state.selectInspectionCompany == -1){
          info.push('施工单位');
      }
  
      //责任人
      if(this.state.selectPersonIndex == -1){
          info.push('责任人');
      }
      //现场描述
      if(!(typeof this.state.contentDescription === 'string')){
          info.push('现场描述');
      } 
      //质检项目 
      if(!this.state.selectedCheckPoint.name){
          info.push('质检项目');
      }
  
      //整改期限
      let len = info.length;
      if(len > 0){
          let msg = '您还未选择'
          if(len == 1){
              msg = `${msg}${info[0]}`
          }else{
              for(let index in info){
                  if(index ==0){
                      msg = `${msg}${info[index]}`
                  }else if(index == len-1){
                      msg = `${msg}和${info[index]}`
                  }else{
                      msg = `${msg}、${info[index]}`
                  }
              }
          }
  
          msg = `${msg}!`
          this._showCheckInfoModal(msg);
          return false;
      }
  
      return true;
    }
    
    //
    _assembleParams = ()=> {
      let params = {};
      //施工单位
      params.constructionCompanyId = this.state.companies[this.state.selectCompanyIndex].id;
      params.constructionCompanyName = this.state.companies[this.state.selectCompanyIndex].name;
      //描述
      params.description = this.state.contentDescription;
      //检查单id
      params.inspectId = this.state.inspectId;
      params.code = this.state.code;
  
      //检查单位 companies
      params.inspectionCompanyId = this.state.inspectionCompanies[this.state.selectInspectionCompanyIndex].id;
      params.inspectionCompanyName = this.state.inspectionCompanies[this.state.selectInspectionCompanyIndex].name;
      //单据类型 inspection acceptance
      params.inspectionType = 'inspection';
      //需要整改
      params.needRectification = this.state.switchValue;
  
      params.projectId = global.storage.projectId;
      params.projectName = '';
      //质检项目
      params.qualityCheckpointId = this.state.selectedCheckPoint.id;
      params.qualityCheckpointName = this.state.selectedCheckPoint.name;
      //责任人
      params.responsibleUserId =  this.state.persons[this.state.selectPersonIndex].id;
      params.responsibleUserName = this.state.persons[this.state.selectPersonIndex].name;
      params.responsibleUserTitle = this.state.persons[this.state.selectPersonIndex].title;
  
      //关联图纸
      params.drawingGdocFileId = this.state.relevantBluePrint.fileId;
      params.drawingName = this.state.relevantBluePrint.name;
      params.drawingPositionX = this.state.relevantBluePrint.drawingPositionX;
      params.drawingPositionY = this.state.relevantBluePrint.drawingPositionY;
  
      params.files = this.state.files;
  
      console.log(params)
     
      return JSON.stringify(params);
    }
  
    _loadingToast = ()=> {
      Toast.loading('加载中...', 0, null ,true);
    }
  
  
    _submit = ()=> {
      if(this._checkMustInfo()){
          this._loadingToast();
           //区分新增提交和编辑提交
          if(this.state.inspectId == '-1'){
              this._createSubmitInspection();
          } else {
              this._editSubmitInspection();
          }
          
      }
    }
    //检查单 新增 提交
    _createSubmitInspection = ()=> {
      let params = this._assembleParams();  
      QUALITYAPI.createSubmitInspection(global.storage.projectId,params)
          .then(data =>{
              Toast.hide();
              console.log(data)
              if(data && data.data && data.data.id){
                  global.storage.goBack(this.props.navigation,null);
              }
          })
    }
  
    //检查单 编辑   提交
    _editSubmitInspection = ()=> {
      let params = this._assembleParams();  
      QUALITYAPI.editSubmitInspection(global.storage.projectId, this.state.inspectId, params)
          .then(data =>{
              Toast.hide();
              console.log(data)
              global.storage.goBack(this.props.navigation,null);
          })
    }
    
   _save = ()=> {
      if(this._checkMustInfo()){
          //区分新增保存和编辑保存
         this._loadingToast();
         if(this.state.inspectId == '-1'){
            this._createSaveInspection();
         } else {
            this._editSaveInspection();
         }
     }
   } 
   // 检查单 新增 保存
    _createSaveInspection = ()=> {
      let params = this._assembleParams();  
      QUALITYAPI.createSaveInspection(global.storage.projectId,params)
          .then(data =>{
              console.log(data)
              Toast.hide();
              if(data ){
                  this.setState({
                      inspectId: data.data.id,
                      code: data.data.code,
                  });
              }
          })
    }
    //检查单 编辑   保存
    _editSaveInspection = ()=> {
      let params = this._assembleParams();  
      QUALITYAPI.editSaveInspection(global.storage.projectId,this.state.inspectId,params)
          .then(data =>{
              console.log(data)
              Toast.hide();
          })
    }
    //
    _delete = ()=>{
      QUALITYAPI.createDeleteInspection(global.storage.projectId,this.state.inspectId)
      .then(data =>{
          console.log(data)
          global.storage.goBack(this.props.navigation,null);
      })
    }
  
  
    componentDidMount=()=> {
      console.log(this.props.navigation.state.params);
      console.log(global.storage.projectId);
      this._initialState();
      //请求数据
       this.props.navigation.setParams({rightNavigatePress:this._rightAction }) 
       this._fetchData(this._getInspectionCompanies);
       this._fetchData(this._getCompaniesList);
       this._fetchData(this._getCheckPoints);
  
    }
    
    //初始状态
    _initialState = ()=>{
      // console.log(this.props.navigation.state.params);
      this.setState({
          selectInspectionCompanyIndex: -1,//选中的检查单位
          
          selectCompanyIndex: -1,//选中的施工单位
          
          selectPersonIndex: -1,//选中的责任人
  
          selectedCheckPoint:{},//选中的质检项目
          
          switchValue:false,//需要整改
  
          contentDescription:PropTypes.string,//内容描述
  
          modal:false,
  
          inspectId:-1,//检查单id
  
          files: [],//图片
  
          relevantBluePrint:{},//关联图纸
          relevantModel:{},//关联模型
             
      });  
    }
  
    _itemDividerLine = ()=> {
      return ( <View style={styles.dividerLine}></View>)
    }
    //需要整改
    _onChangeSwitch = (switchValue)=> {
              {
                  <ListRow title='需要整改'  bottomSeparator='indent'  detail={<Switch value={this.state.switchValue} onValueChange ={(value)=>{this._onChangeSwitch(value)}}/>}/>
              }
  
      console.log(switchValue)
      this.setState({
          switchValue:switchValue,
      })
    }
  
    _showCheckInfoModal = (message) => {
      Modal.alert('提示信息', message,[ {text:'知道了',style:{color:'#00baf3'}}]);
    }
    //选择图纸模型
   _bimFileChooserBluePrint = (dataType)=> {
      let navigator = this.props.navigation; 
      //保存当前页面的key
      global.storage.qualityState.bimChooserCallback = this._bimChooserCallback;

      if(this.state.relevantBluePrint.name){
        global.storage.pushNext(navigator,"RelevantBlueprintPage",{title:this.state.relevantBluePrint.name, fileId:this.state.relevantBluePrint.fileId,pageType:1,relevantBluePrint:this.state.relevantBluePrint});
      }else{
        global.storage.pushNext(navigator,"BimFileChooserPage",{fileId: 0,dataType: dataType,pageType:0})
      }

   }
       //选择图纸模型
   _bimFileChooserModel = (dataType)=> {
        let navigator = this.props.navigation; 
        //保存当前页面的key
        global.storage.qualityState.bimChooserCallback = this._bimChooserCallback;
  
      //   global.storage.pushNext(navigator,"RelevantBlueprintPage",{title:item.value.name, fileId:item.value.fileId});
  
  
        global.storage.pushNext(navigator,"BimFileChooserPage",{fileId: 0,dataType: dataType})
    
     }
   //选择图纸或者模型后的回调 dataType 图纸文件{name:'', fileId:'', drawingPositionX:'', drawingPositionY:'' }、模型文件
   _bimChooserCallback = (data,dataType)=>{
      if(dataType === '图纸文件'){
          this.setState({
              relevantBluePrint: data,
          });
      }else if(dataType === '模型文件'){
          this.setState({
              relevantModel: data,
          });
      }
   }
  
    constructor() {
        super();
        this.state = {
          projectId:global.storage.projectId,
          
          inspectionCompanies:PropTypes.array,
          selectInspectionCompanyIndex: -1,//选中的检查单位
          
          companies:PropTypes.array,
          selectCompanyIndex: -1,//选中的施工单位
          
          persons:PropTypes.array,
          selectPersonIndex: -1,//选中的责任人
  
          selectedCheckPoint:{},//选中的质检项目
          
          switchValue:false,//需要整改
  
          contentDescription:PropTypes.string,//内容描述
  
          modal:false,
  
          inspectId:-1,//检查单id
          
          code: '',
  
          files: [],//图片
  
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
        <ScrollView>
          <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
          
          <ListRow title='检查单位' accessory='indicator' bottomSeparator='indent' detail={this.state.selectInspectionCompanyIndex > -1 ? this.state.inspectionCompanies[this.state.selectInspectionCompanyIndex].name : ""} onPress={()=>{this._showInspectionCompanyActionSheet()}} />
          <ListRow title='施工单位' accessory='indicator' bottomSeparator='indent' detail={this.state.selectCompanyIndex > -1 ? this.state.companies[this.state.selectCompanyIndex].name : ""} onPress={()=>{this._showCompanyActionSheet()}} />
          <ListRow title='责任人' accessory='indicator' bottomSeparator='indent' detail={this.state.selectPersonIndex > -1 ? this.state.persons[this.state.selectPersonIndex].name : ""} onPress={()=>{this._getPersonList()}} />
          <TextInput 
              maxLength = {255}
              style={{textAlignVertical:'top',paddingLeft:12,paddingRight:12,paddingTop:12,paddingBottom:0,backgroundColor:'#ffffff',minHeight:120}}
              placeholder={'现场情况描述'}
              multiline ={true}
              underlineColorAndroid={"transparent"}
              textAlign="left"
              onChangeText={(text)=>{this.setState({contentDescription:text})}}
          />
  
          <ImageChooserView style={{ top:0,left:0,width:width,height:100,marginTop:20 }} backgroundColor="#00baf3" onChange={()=>alert('收到!')} />
          <View style={{marginTop:20,marginBottom:11}}>
              <ListRow title='需要整改'  bottomSeparator='indent'  detail={<Switch value={this.state.switchValue} onValueChange ={(value)=>{this._onChangeSwitch(value)}}/>}/>
              {
                  (this.state.switchValue)?(
                      <ListRow title='整改期限'  accessory='indicator' bottomSeparator='indent' detail={'2018-04-08'}/>
                  ):(null)
              }
          </View>
  
          <ListRow title='质检项目' accessory='indicator' bottomSeparator='indent'detail={this.state.selectedCheckPoint?this.state.selectedCheckPoint.name:''} onPress={()=>{this._selectCheckPoint()}} />
          <ListRow title='关联图纸' accessory='indicator' bottomSeparator='indent' detail={this.state.relevantBluePrint?this.state.relevantBluePrint.name:''} onPress={()=>{ this._bimFileChooserBluePrint('图纸文件') }} />
          <ListRow title='关联模型' accessory='indicator' bottomSeparator='indent' detail={this.state.relevantModel?this.state.relevantModel.name:''} onPress={()=>{ this._bimFileChooserModel('模型文件') }} />
  
          <ImageChooserView ref ={ REF_PHOTO } style={{ top:0,left:0,width:width,height:100 }} backgroundColor="#00baf3" onChange={()=>alert('收到!')} />
          <View style={{marginBottom:30}}>
              <TouchableHighlight
                  underlayColor="#0099f3"
                  activeOpacity={1.0}
                  
                  style={
                          this.state.pressed
                          ? styles.saveTextViewPressed
                          : styles.saveTextView
                      }
                      onHideUnderlay={() => {
                      this.setState({ pressed: false });
                      }}
                      onShowUnderlay={() => {
                      this.setState({ pressed: true });
                      }}
                  >
                      <Text style={styles.saveText} onPress={()=>{this._save()}}>保存</Text>
              </TouchableHighlight>
              {
                  (this.state.inspectId != -1)?(
                      <TouchableHighlight
                          underlayColor="#0099f3"
                          activeOpacity={1.0}
                          style={
                                  this.state.pressed
                                  ? styles.deleteTextViewPressed
                                  : styles.deleteTextView
                              }
                          onHideUnderlay={() => {
                          this.setState({ pressed: false });
                          }}
                          onShowUnderlay={() => {
                          this.setState({ pressed: true });
                          }}
                          >
                              <Text style={styles.deleteText} onPress={()=>{this._delete()}}>删除</Text>
                      </TouchableHighlight>
                  ):(null)
              }
  
          </View>
          
         </ScrollView>
        
      );
    }
  };
  
  var styles = StyleSheet.create({
      dividerLine:{
          height:10, 
          marginLeft:19, 
          flex:1,
          backgroundColor:'#ff0000'
      },
      saveText: {
          overflow: "hidden",
          height: 20,
          marginTop: 10,
          marginLeft: 38,
          marginRight: 38,
          borderRadius: 20,
          alignItems: "center",
          textAlign: "center",
          fontSize: 16,
          color: "#fff"
      },
      saveTextView: {
          overflow: "hidden",
          height: 40,
          backgroundColor: "#00baf3",
          borderRadius: 20,
          marginLeft: 38,
          marginRight: 38,
          marginTop:30,
      },
  
      saveTextViewPressed: {
          overflow: "hidden",
          height: 40,
          backgroundColor: "#33baf3",
          borderRadius: 20,
          marginLeft: 38,
          marginRight: 38,
          marginTop:30,
      },
  
      deleteText: {
          overflow: "hidden",
          height: 20,
          marginTop: 10,
          marginLeft: 38,
          marginRight: 38,
          borderRadius: 20,
          alignItems: "center",
          textAlign: "center",
          fontSize: 16,
          color: "#5b5b5b"
      },
      deleteTextView: {
          overflow: "hidden",
          height: 40,
          backgroundColor: "#cbcbcb",
          borderRadius: 20,
          marginLeft: 38,
          marginRight: 38,
          marginTop:30,
      },
  
      deleteTextViewPressed: {
          overflow: "hidden",
          height: 40,
          backgroundColor: "#cbcbcb",
          borderRadius: 20,
          marginLeft: 38,
          marginRight: 38,
          marginTop:30,
      },
  });