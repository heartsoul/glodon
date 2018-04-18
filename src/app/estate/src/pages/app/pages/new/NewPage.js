'use strict';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
var { width, height } = Dimensions.get("window");
import { SegmentedView, ListRow, Label, ActionSheet, PullPicker, Theme } from 'app-3rd/teaset';
import ImageChooserView from './ImageChooserView';
import SelectView from './SelectView';
import RectificationView from './RectificationView';//整改
import SelectCheckPointView from './SelectCheckPointView';
import * as PageType from '../navigation/bim/PageTypes';
import * as API from "app-api";
import * as BimFileEntry from "./../navigation/bim/BimFileEntry";

const UPLOADAPI = API
const QUALITYAPI = API
const PMBASICAPI = API

import { Modal, Toast } from 'antd-mobile';

const REF_PHOTO = 'gldPhoto';
const REF_INSPECT_COMPANY = 'REF_INSPECT_COMPANY';//检查单位
const REF_COMPANY = 'REF_COMPANY';//施工单位
const REF_PERSON = 'REF_PERSON';//责任人
const REF_RECTIFICATION = 'REF_RECTIFICATION';//整改
const REF_CHECKPOINT = 'REF_CHECKPOINT';//质检项目

class NewPage extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: '新建',
        headerTintColor: "#FFF",
        headerStyle: { backgroundColor: "#00baf3" },
        headerRight: (
            <Text onPress={() => navigation.state.params.rightNavigatePress()} style={{ marginRight: 20, color: '#FFFFFF', width: 60, textAlign: "right" }} >
                提交
        </Text>
        ),
        // headerLeft:(  
        //   <Text  onPress={()=>navigation.goBack()} style={{marginLeft:20, color:'#FFFFFF' , width:60, textAlign:"left"}} >  
        //       返回   
        //   </Text>  
        // )
    });

    /**
     * 获取selectView中的数据，没有时返回 null，ref(REF_INSPECT_COMPANY、REF_COMPANY、REF_PERSON)
     */
    getSelectedData = (ref) => {
        let ele = this.refs[ref];
        let ret = {};
        if(ele){
            ret = ele.getSelectedData();
        }
        return ret;
    }
    /**
     * 整改期限{ value: true, date: '2018-04-08' }
     */
    getSwitchValue = () => {
        return this.refs[REF_RECTIFICATION].getSwitchValue()
    }
    /**
     * 质检项目
     */
    getSelectedCheckPoint = () => {
        return this.refs[REF_CHECKPOINT].getSelectedCheckPoint()
    }

    _rightAction = () => {
        // let fileData = [
        //     {"path" : "file:///storage/emulated/0/pic.png", "name" : "pic.png", "length" : 107815},
        //     {"path" : "file:///storage/emulated/0/pic2.png", "name" : "pic2.png", "length" : 61365}
        // ];
        this.refs[REF_PHOTO]._loadFile((files) => {
            if (files && files.length > 0) {
                console.log(files)
                UPLOADAPI.upLoadFiles(files, (code, result) => {
                    this.setState({
                        //上传图片的结果
                        files: result,
                    });
                    this._submit();
                });
            } else {
                this._submit();
            }
        });
    }

    /**
     * 检测必填项
     * return true  所有必填项都已填写   false 有必填项没有填写
     */
    _checkMustInfo = () => {
        let info = [];
        //检查单位
        if (this.getSelectedData(REF_INSPECT_COMPANY) == null) {
            info.push('检查单位');
        }
        //施工单位
        if (this.getSelectedData(REF_COMPANY) == null) {
            info.push('施工单位');
        }

        //责任人
        if (this.getSelectedData(REF_PERSON) == null) {
            info.push('责任人');
        }
        //现场描述
        if (!(typeof this.state.contentDescription === 'string')) {
            info.push('现场描述');
        }
        //质检项目 
        if (!this.getSelectedCheckPoint().name) {
            info.push('质检项目');
        }

        //整改期限
        let len = info.length;
        if (len > 0) {
            let msg = '您还未选择'
            if (len == 1) {
                msg = `${msg}${info[0]}`
            } else {
                for (let index in info) {
                    if (index == 0) {
                        msg = `${msg}${info[index]}`
                    } else if (index == len - 1) {
                        msg = `${msg}和${info[index]}`
                    } else {
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
    _assembleParams = () => {

        let params = {};
        //施工单位
        let companyData = this.getSelectedData(REF_COMPANY);
        params.constructionCompanyId = companyData.id;
        params.constructionCompanyName = companyData.name;
        //描述
        params.description = this.state.contentDescription;
        //检查单id
        params.inspectId = this.state.inspectId;
        params.code = this.state.code;

        //检查单位 
        let inspectCompanyData = this.getSelectedData(REF_INSPECT_COMPANY);
        params.inspectionCompanyId = inspectCompanyData.id;
        params.inspectionCompanyName = inspectCompanyData.name;
        //单据类型 inspection acceptance
        params.inspectionType = 'inspection';
        //需要整改
        params.needRectification = this.getSwitchValue().value;

        params.projectId = storage.projectId;
        params.projectName = '';
        //质检项目
        let checkPoint = this.getSelectedCheckPoint();
        params.qualityCheckpointId = checkPoint.id;
        params.qualityCheckpointName = checkPoint.name;
        //责任人
        let personData = this.getSelectedData(REF_INSPECT_COMPANY);
        params.responsibleUserId = personData.id;
        params.responsibleUserName = personData.name;
        params.responsibleUserTitle = personData.title;

        //关联图纸
        params.drawingGdocFileId = this.state.relevantBluePrint.fileId;
        params.drawingName = this.state.relevantBluePrint.name;
        params.drawingPositionX = this.state.relevantBluePrint.drawingPositionX;
        params.drawingPositionY = this.state.relevantBluePrint.drawingPositionY;

        params.files = this.state.files;

        return JSON.stringify(params);
    }

    _loadingToast = () => {
        Toast.loading('加载中...', 0, null, true);
    }


    _submit = () => {
        if (this._checkMustInfo()) {
            this._loadingToast();
            //区分新增提交和编辑提交
            if (this.state.inspectId == '-1') {
                this._createSubmitInspection();
            } else {
                this._editSubmitInspection();
            }

        }
    }
    //检查单 新增 提交
    _createSubmitInspection = () => {
        let params = this._assembleParams();
        QUALITYAPI.createSubmitInspection(storage.projectId, params)
            .then(data => {
                Toast.hide();
                console.log(data)
                if (data && data.data && data.data.id) {
                    storage.goBack(this.props.navigation, null);
                }
            })
    }

    //检查单 编辑   提交
    _editSubmitInspection = () => {
        let params = this._assembleParams();
        QUALITYAPI.editSubmitInspection(storage.projectId, this.state.inspectId, params)
            .then(data => {
                Toast.hide();
                console.log(data)
                storage.goBack(this.props.navigation, null);
            })
    }

    _save = () => {
        if (this._checkMustInfo()) {
            //区分新增保存和编辑保存
            this._loadingToast();
            if (this.state.inspectId == '-1') {
                this._createSaveInspection();
            } else {
                this._editSaveInspection();
            }
        }
    }
    // 检查单 新增 保存
    _createSaveInspection = () => {
        let params = this._assembleParams();
        QUALITYAPI.createSaveInspection(storage.projectId, params)
            .then(data => {
                console.log(data)
                Toast.hide();
                if (data) {
                    this.setState({
                        inspectId: data.data.id,
                        code: data.data.code,
                    });
                }
            })
    }
    //检查单 编辑   保存
    _editSaveInspection = () => {
        let params = this._assembleParams();
        QUALITYAPI.editSaveInspection(storage.projectId, this.state.inspectId, params)
            .then(data => {
                console.log(data)
                Toast.hide();
            })
    }
    //
    _delete = () => {
        QUALITYAPI.createDeleteInspection(storage.projectId, this.state.inspectId)
            .then(data => {
                console.log(data)
                storage.goBack(this.props.navigation, null);
            })
    }


    componentDidMount = () => {


        let params = this.props.navigation.state.params;
        //从列表编辑页进入
        // params = {
        //     item: {},
        // }
        if (params && params.item) {
            API.getQualityInspectionDetail(storage.loadProject(), params.item.value.id).then((responseData) => {
            // API.getQualityInspectionDetail('5200146', '5200227').then((responseData) => {
                let editInfo = {};
                if (responseData.data && responseData.data.inspectionInfo) {
                    editInfo = responseData.data.inspectionInfo;
                }
                this.setState({
                    editInfo: editInfo,
                    isLoading: false,
                }, () => {
                    this.initialState(editInfo);
                });
            }).catch(err => {
                this.setState({
                    isLoading: false,
                });
            });
        } else {
            //从首页图纸进入
            let relevantBlueprint = {};
            if (params.relevantBlueprint) {
                relevantBlueprint = params.relevantBlueprint;
            }
            //从质检项目进入
            let selectedCheckPoint = {};
            if (this.props.selectedCheckPoint) {
                selectedCheckPoint = this.props.selectedCheckPoint;
            }
            //从首页模型进入
            let relevantModel = {};
            if (params.relevantModel) {
                relevantModel = params.relevantModel;
            }
            this.setState({
                relevantBluePrint: relevantBlueprint,
                relevantModel: relevantModel,
                selectedCheckPoint: selectedCheckPoint,
                isLoading: false,
            });

        }
        //请求数据
        this.props.navigation.setParams({ rightNavigatePress: this._rightAction })
    }


    //编辑页面进入时，已存在设置数据
    initialState = (info) => {

        let contentDescription = info.description;
        let inspectId = info.id;
        let code = info.code;
        let inspectionType = info.inspectionType;
        let projectId = info.projectId;
        let projectName = info.projectName;

        let needRectification = info.needRectification;
        let lastRectificationDate = info.lastRectificationDate;

        let selectedCheckPoint = {
            id: info.qualityCheckpointId,//-1
            name: info.qualityCheckpointName,
        }

        let relevantBlueprint = {
            drawingGdocFileId: info.drawingGdocFileId,
            drawingName: info.drawingGdocFileId,
            drawingPositionX: info.drawingGdocFileId,
            drawingPositionY: info.drawingGdocFileId,
        }

        this.setState({
            contentDescription: contentDescription,//内容描述
            inspectId: inspectId,//检查单id
            code: code,
            projectId: projectId,
            projectName: projectName,
            files: [],//图片

            selectedCheckPoint: selectedCheckPoint,//选中的质检项目
            relevantBluePrint: relevantBlueprint,//关联图纸
            relevantModel: {},//关联模型
            
        });
    }

    _itemDividerLine = () => {
        return (<View style={styles.dividerLine}></View>)
    }

    _showCheckInfoModal = (message) => {
        Modal.alert('提示信息', message, [{ text: '知道了', style: { color: '#00baf3' } }]);
    }
    //选择图纸文件
    _bimFileChooserBluePrint = (dataType) => {
        let navigator = this.props.navigation;
        storage.bimFileChooseCallback = this._bimChooserCallback;
        BimFileEntry.chooseBlueprintFromQualityNew(navigator, this.state.relevantBluePrint)
    }
    //选择模型文件
    _bimFileChooserModel = (dataType) => {
        let navigator = this.props.navigation;
        storage.bimFileChooseCallback = this._bimChooserCallback;
        BimFileEntry.chooseModelFromQualityNew(navigator, this.state.relevantModel)
    }
    //选择图纸或者模型后的回调 dataType 图纸文件{name:'', fileId:'', drawingPositionX:'', drawingPositionY:'' }、模型文件
    _bimChooserCallback = (data, dataType) => {
        if (dataType === '图纸文件') {
            this.setState({
                relevantBluePrint: data,
            });
        } else if (dataType === '模型文件') {
            this.setState({
                relevantModel: data,
            });
        }
    }

    constructor() {
        super();
        this.state = {
            isLoading: true,

            editInfo: {},//编辑的时候获取的详情

            projectId: storage.projectId,
            inspectId: -1,//检查单id
            code: '',
            contentDescription: PropTypes.string,//内容描述

            selectedCheckPoint: {},//选中的质检项目

            files: [{
                url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
                name: '2121',
            }, {
                url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
                name: '2122',
            }],//图片

        }

    };
    //加载等待的view
    renderLoadingView = () => {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <ActivityIndicator
                    animating={true}
                    style={[styles.gray, { height: 80 }]}
                    color='green'
                    size="large"
                />
            </View>
        );
    }
    renderData = () => {
        return (
            <View>
                <SelectView ref={REF_INSPECT_COMPANY} title='检查单位'
                    value={this.state.editInfo ? ({
                        id: this.state.editInfo.inspectionCompanyId,
                        name: this.state.editInfo.inspectionCompanyName,
                    }) : ({})} />
                <SelectView ref={REF_COMPANY} title='施工单位'
                    value={this.state.editInfo ? ({
                        id: this.state.editInfo.constructionCompanyId,
                        name: this.state.editInfo.constructionCompanyName,
                    }) : ({})}
                    selectCallback={(selectCompany) => {
                        this.setState({
                            selectCompany: selectCompany,
                        })
                    }} />
                <SelectView tref={REF_PERSON} title='责任人'
                    value={this.state.editInfo ? ({
                        id: this.state.editInfo.responsibleUserId,
                        name: this.state.editInfo.responsibleUserName,
                        title: this.state.editInfo.responsibleUserTitle,
                    }) : ({})}
                    extraData={this.state.selectCompany} />

                <TextInput
                    maxLength={255}
                    style={{ textAlignVertical: 'top', paddingLeft: 12, paddingRight: 12, paddingTop: 12, paddingBottom: 0, backgroundColor: '#ffffff', minHeight: 120 }}
                    placeholder={'现场情况描述'}
                    multiline={true}
                    underlineColorAndroid={"transparent"}
                    textAlign="left"
                    onChangeText={(text) => { this.setState({ contentDescription: text }) }}
                    value={(typeof this.state.contentDescription === 'string') ? (this.state.contentDescription) : ('')}
                />

                <ImageChooserView ref={REF_PHOTO} files={[{
                    url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
                    name: '2121',
                }, {
                    url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
                    name: '2122',
                }]} style={{ top: 0, left: 0, width: width, height: 100, marginTop: 20 }} backgroundColor="#00baf3" onChange={() => alert('收到!')} />

                <RectificationView ref={REF_RECTIFICATION} ></RectificationView>
                <SelectCheckPointView ref={REF_CHECKPOINT} selectedCheckPoint={this.state.selectedCheckPoint} ></SelectCheckPointView>

                <ListRow title='关联图纸' accessory='indicator' bottomSeparator='indent' detail={this.state.relevantBluePrint ? this.state.relevantBluePrint.name : ''} onPress={() => { this._bimFileChooserBluePrint('图纸文件') }} />
                <ListRow title='关联模型' accessory='indicator' bottomSeparator='indent' detail={this.state.relevantModel ? this.state.relevantModel.fileName : ''} onPress={() => { this._bimFileChooserModel('模型文件') }} />

                <View style={{ marginBottom: 30 }}>
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
                        <Text style={styles.saveText} onPress={() => { this._save() }}>保存</Text>
                    </TouchableHighlight>
                    {
                        (this.state.inspectId != -1) ? (
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
                                <Text style={styles.deleteText} onPress={() => { this._delete() }}>删除</Text>
                            </TouchableHighlight>
                        ) : (null)
                    }

                </View>
            </View>
        );
    }

    render() {

        return (
            <ScrollView>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                {
                    this.state.isLoading ? (this.renderLoadingView()) : (this.renderData())
                }
            </ScrollView>

        );
    }
};

var styles = StyleSheet.create({
    dividerLine: {
        height: 10,
        marginLeft: 19,
        flex: 1,
        backgroundColor: '#ff0000'
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
        marginTop: 30,
    },

    saveTextViewPressed: {
        overflow: "hidden",
        height: 40,
        backgroundColor: "#33baf3",
        borderRadius: 20,
        marginLeft: 38,
        marginRight: 38,
        marginTop: 30,
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
        marginTop: 30,
    },

    deleteTextViewPressed: {
        overflow: "hidden",
        height: 40,
        backgroundColor: "#cbcbcb",
        borderRadius: 20,
        marginLeft: 38,
        marginRight: 38,
        marginTop: 30,
    },
});

export default connect(
    state => ({
        selectedCheckPoint: state.checkPointList.selectedCheckPoint,
    }),
    dispatch => ({

    })
)(NewPage);