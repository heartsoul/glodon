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
    Image,
    TouchableHighlight,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { ActionModal } from 'app-components'
import { Modal, Toast } from 'antd-mobile';
import { SegmentedView, ListRow, Label, ActionSheet, PullPicker, Theme } from 'app-3rd/teaset';
import { ImageChooserView } from 'app-components';
import SelectView from './SelectView';
import RectificationView from './RectificationView';//整改
import SelectCheckPointView from './SelectCheckPointView';
import StarView from "./StarView";

import * as PageType from '../navigation/bim/PageTypes';
import * as API from "app-api";
import * as BimFileEntry from "./../navigation/bim/BimFileEntry";
import * as NewQualityAction from "./../../actions/NewQualityAction";
import * as UpdateDataAction from "./../../actions/updateDataAction";



var { width, height } = Dimensions.get("window");
const REF_PHOTO = 'gldPhoto';
const REF_INSPECT_COMPANY = 'REF_INSPECT_COMPANY';//检查单位
const REF_COMPANY = 'REF_COMPANY';//施工单位
const REF_PERSON = 'REF_PERSON';//责任人
const REF_RECTIFICATION = 'REF_RECTIFICATION';//整改
const REF_CHECKPOINT = 'REF_CHECKPOINT';//质检项目


class NewPage extends React.Component {
    
    contentDescription = ''
    constructor(props) {
        super(props);
        let filesIn = [];
        let selectedCheckPoint = {}
        if (props.params) {
            if (props.params.files) {
                filesIn = props.params.files;
            }
            if (props.params.qualityCheckpointId) {
                selectedCheckPoint = {
                    id: props.params.qualityCheckpointId,
                    name: props.params.qualityCheckpointName
                };
            }
        }
        
        this.state = {
            isLoading: false,
            inspectionInfo: {},//初始草稿数据
            editInfo: {},//编辑的时候获取的详情

            projectId: storage.loadProject(),
            inspectId: -1,//检查单id
            code: '',
            contentDescription: '',//内容描述

            selectedCheckPoint: selectedCheckPoint,//选中的质检项目

            relevantBluePrint: {},//关联图纸
            relevantModel: {},//关联模型

            showInspectCompanyStar: false,
            showCompanyStar: false,
            showPersonStar: false,
            showDescriptionStar: false,
            showCheckpointStar: false,
            showRectificationStar: false,
            files: filesIn, //附件图片

        }

    };

    componentDidMount = () => {
        //把当前页面引用设置给父页面
        const { setRef } = this.props;
        if (setRef) {
            setRef(this);
        }

        // //从不同页面进入时初始化状态
        let params = this.props.params;
        NewQualityAction.initialState(params, this.props.selectedCheckPoint, (params) => {
            this.setState(params);
            this.contentDescription = params.contentDescription;
        })

    }
    //返回
    goBack = (navigation) => {
        //判断信息是否改变
        let requestParams = this.assembleParams();
        NewQualityAction.isEditInfoChange(requestParams, this.state.inspectionInfo, this.refs[REF_PHOTO], (isChange) => {
            if (isChange) {
                ActionModal.alert('是否确认退出当前页面？', "您还未保存当前数据！", [
                    {
                        text: '取消', style: { color: '#5b5b5b' }
                    },
                    {
                        text: '不保存', style: { color: '#e75452' }, onPress: () => { navigation.goBack() }
                    },
                    {
                        text: '保存', style: { color: '#00baf3' }, onPress: () => { this.save() }
                    }
                ]);
            } else {
                navigation.goBack();
            }
        })
    }

    /**
     * 获取selectView中的数据，没有时返回 null，ref(REF_INSPECT_COMPANY、REF_COMPANY、REF_PERSON)
     */
    getSelectedData = (ref) => {
        let ele = this.refs[ref];
        let ret = {};
        if (ele) {
            ret = ele.getSelectedData();
        }
        return ret;
    }

    /**
     * 整改期限{ value: true, date: '2018-04-08' }
     */
    getRectificationData = () => {
        return this.refs[REF_RECTIFICATION].getRectificationData()
    }

    /**
     * 质检项目
     */
    getSelectedCheckPoint = () => {
        return this.refs[REF_CHECKPOINT].getSelectedCheckPoint()
    }

    /**
     * 提交的数据
     */
    assembleParams = () => {
        let ret = {
            companyData: this.getSelectedData(REF_COMPANY),
            inspectCompanyData: this.getSelectedData(REF_INSPECT_COMPANY),
            personData: this.getSelectedData(REF_PERSON),
            checkPoint: this.getSelectedCheckPoint(),
            rectificationData: this.getRectificationData(),
            inspectionType: this.props.type,
            state: this.state,
        };
        return ret;
    }

    //提交
    submit = (navigation) => {
        //提交
        let requestParams = this.assembleParams();
        NewQualityAction.submit(requestParams, this.refs[REF_PHOTO], navigation, (params) => {
            this.setState(params);
            this.props.updateData();
        });
    }

    //保存
    save = () => {
        let requestParams = this.assembleParams();
        NewQualityAction.save(requestParams, this.refs[REF_PHOTO], (params) => {
            this.setState(params)
            Toast.success('保存成功', 1);
            this.props.updateData();
        });
    }

    //删除
    delete = (navigation) => {
        NewQualityAction.deleteInspection(this.state.inspectId, this.props.type, () => {
            this.props.updateData();
            storage.goBack(this.props.navigator, null);
        });
    }

    //选择图纸文件
    _bimFileChooserBluePrint = (dataType) => {
        let navigator = this.props.navigation;
        storage.bimFileChooseCallback = this._bimChooserCallback;
        BimFileEntry.chooseBlueprintFromQualityNew(navigator,
            this.state.relevantBluePrint.drawingGdocFileId,
            this.state.relevantBluePrint.drawingName,
            this.state.relevantBluePrint.drawingPositionX,
            this.state.relevantBluePrint.drawingPositionY,
        )
    }

    //选择模型文件
    _bimFileChooserModel = (dataType) => {
        let navigator = this.props.navigation;
        storage.bimFileChooseCallback = this._bimChooserCallback;
        BimFileEntry.chooseModelFromQualityNew(navigator,
            this.state.relevantModel.gdocFileId,
            this.state.relevantModel.elementId,
            this.state.relevantModel.buildingId,
            this.state.relevantModel.buildingName)
    }

    //选择图纸或者模型后的回调 dataType 图纸文件{name:'', fileId:'', drawingPositionX:'', drawingPositionY:'' }、模型文件
    _bimChooserCallback = (data, dataType) => {
        if (dataType === '图纸文件') {
            this.setState({
                relevantBluePrint: data,
            });
        } else if (dataType === '模型文件') {
            NewQualityAction.getModelElementProperty(data, (params) => {
                this.setState(params);
            });
        }
    }

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
    renderDescriptionView = () => {
        return (
            <TextInput
                maxLength={255}
                style={{ textAlignVertical: 'top', paddingLeft: 12, paddingRight: 12, paddingTop: 12, paddingBottom: 0, backgroundColor: '#ffffff', minHeight: 120 }}
                placeholder={'现场情况描述'}
                multiline={true}
                underlineColorAndroid={"transparent"}
                textAlign="left"
                onChangeText={(text) => { this.state.contentDescription = text; this.contentDescription = text;}}
                value={this.contentDescription}
            />
        );
    }

    renderData = () => {
        return (
            <View style={{ paddingBottom: 100 }}>
                <SelectView
                    ref={REF_INSPECT_COMPANY}
                    title={(this.props.type === "acceptance") ? ("验收单位") : ("检查单位")}
                    value={this.state.editInfo ? ({
                        id: this.state.editInfo.inspectionCompanyId,
                        name: this.state.editInfo.inspectionCompanyName,
                    }) : ({})}
                    showStar={this.state.showInspectCompanyStar}
                />
                <SelectView ref={REF_COMPANY} title='施工单位'
                    value={this.state.editInfo ? ({
                        id: this.state.editInfo.constructionCompanyId,
                        name: this.state.editInfo.constructionCompanyName,
                    }) : ({})}
                    selectCallback={(selectCompany) => {
                        this.setState({
                            selectCompany: selectCompany,
                        })
                    }}
                    showStar={this.state.showCompanyStar}
                />
                <SelectView ref={REF_PERSON} title='责任人'
                    value={this.state.editInfo ? ({
                        id: this.state.editInfo.responsibleUserId,
                        name: this.state.editInfo.responsibleUserName,
                        title: this.state.editInfo.responsibleUserTitle,
                    }) : ({})}
                    extraData={this.state.selectCompany}
                    showStar={this.state.showPersonStar}
                />
                <StarView
                    showStar={this.state.showDescriptionStar}
                    childView={this.renderDescriptionView()}
                ></StarView>

                <ImageChooserView ref={REF_PHOTO} files={this.state.files} style={{ top: 0, left: 0, width: width, height: 100, marginTop: 20 }} backgroundColor="#00baf3" onChange={() => alert('收到!')} />
                <RectificationView ref={REF_RECTIFICATION} rectificationData={this.state.rectificationData} showStar={this.state.showRectificationStar}></RectificationView>
                <StarView
                    showStar={this.state.showCheckpointStar}
                    childView={<SelectCheckPointView ref={REF_CHECKPOINT} selectedCheckPoint={this.state.selectedCheckPoint} ></SelectCheckPointView>}
                />

                <ListRow title='关联图纸' accessory='indicator' bottomSeparator='indent' detail={this.state.relevantBluePrint ? this.state.relevantBluePrint.drawingName : ''} onPress={() => { this._bimFileChooserBluePrint('图纸文件') }} />
                <ListRow title='关联模型' accessory='indicator' bottomSeparator='indent' detail={this.state.relevantModel.elementName ? this.state.relevantModel.elementName : ''} onPress={() => { this._bimFileChooserModel('模型文件') }} />

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
                        <Text style={styles.saveText} onPress={() => { this.save() }}>保存</Text>
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
                                <Text style={styles.deleteText} onPress={() => { this.delete() }}>删除</Text>
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
                    this.renderData()
                    // this.state.isLoading ? (this.renderLoadingView()) : (this.renderData())
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

NewPage.propTypes = {
    params: PropTypes.object,
    /**
     * 区分检查单和验收单（inspection、acceptance）
     */
    type: PropTypes.string,
}

export default connect(
    state => ({
        selectedCheckPoint: state.checkPointList.selectedCheckPoint,
    }),
    dispatch => ({
        updateData: () => {
            if (dispatch) {
                dispatch(UpdateDataAction.updateData());
            }
        },
    })
)(NewPage);