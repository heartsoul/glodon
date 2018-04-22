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
    Platform,
    BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
var { width, height } = Dimensions.get("window");
import { SegmentedView, ListRow, Label, ActionSheet, PullPicker, Theme } from 'app-3rd/teaset';
import ImageChooserView from './ImageChooserView';
import SelectView from './SelectView';
import RectificationView from './RectificationView';//整改
import SelectCheckPointView from './SelectCheckPointView';
import StarView from "./StarView";

import * as PageType from '../navigation/bim/PageTypes';
import * as API from "app-api";
import * as BimFileEntry from "./../navigation/bim/BimFileEntry";
import * as NewQualityAction from "./../../actions/NewQualityAction";



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
        headerLeft: (
            <TouchableOpacity onPress={() => { navigation.state.params.leftNavigatePress() }} style={{ paddingLeft: 20 }}>
                <Image source={require("app-images/icon_back_white.png")} style={{ width: 9, height: 20 }}></Image>
            </TouchableOpacity>
        )
    });


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

            relevantBluePrint: {},//关联图纸
            relevantModel: {},//关联模型

            showInspectCompanyStar: false,
            showCompanyStar: false,
            showPersonStar: false,
            showDescriptionStar: false,
            showCheckpointStar: false,
            showRectificationStar: false,
        }

    };

    componentDidMount = () => {

        BackHandler.addEventListener('hardwareBackPress', () => {
            this.goBack();
            return true;
        });

        let params = this.props.navigation.state.params;
        //从不同页面进入时初始化状态
        NewQualityAction.initialState(params, this.props.selectedCheckPoint, (params) => {
            this.setState(params);
        })
        //提交
        this.props.navigation.setParams({ rightNavigatePress: this.submit })
        this.props.navigation.setParams({ leftNavigatePress: this.goBack })
    }
    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress');
        }
    }

    //返回
    goBack = () => {
        Modal.alert('是否确认退出当前页面？', "您还未保存当前数据！", [
            {
                text: '取消', style: { color: '#5b5b5b' }
            },
            {
                text: '不保存', style: { color: '#e75452' }, onPress: () => { this.props.navigation.goBack() }
            },
            {
                text: '保存', style: { color: '#00baf3' }, onPress: () => { this.save() }
            }
        ]);
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
            state: this.state,
        };
        return ret;
    }

    //提交
    submit = () => {
        //提交
        let requestParams = this.assembleParams();
        NewQualityAction.submit(requestParams, this.refs[REF_PHOTO], this.props.navigation, (params) => {
            this.setState(params);
        });
    }

    //保存
    save = () => {
        let requestParams = this.assembleParams();
        NewQualityAction.save(requestParams, this.refs[REF_PHOTO], (params) => {
            this.setState(params)
            Toast.success('保存成功', 1);
        });
    }

    //删除
    delete = () => {
        NewQualityAction.deleteInspection(this.state.inspectId, this.props.navigation);
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
            API.getModelElementProperty(storage.projectId, storage.projectIdVersionId, data.gdocFileId, data.elementId)
                .then(responseData => {
                    let relevantModel = {
                        ...data,
                        elementName: responseData.data.data.name,
                    }
                    this.setState({
                        relevantModel: relevantModel,
                    });
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
                onChangeText={(text) => { this.setState({ contentDescription: text }) }}
                value={(typeof this.state.contentDescription === 'string') ? (this.state.contentDescription) : ('')}
            />
        );
    }

    renderData = () => {
        return (
            <View>
                <SelectView ref={REF_INSPECT_COMPANY} title='检查单位'
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

                <ImageChooserView ref={REF_PHOTO} files={[{
                    url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
                    name: '2121',
                }, {
                    url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
                    name: '2122',
                }]} style={{ top: 0, left: 0, width: width, height: 100, marginTop: 20 }} backgroundColor="#00baf3" onChange={() => alert('收到!')} />
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