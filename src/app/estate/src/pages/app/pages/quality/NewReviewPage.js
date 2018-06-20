"use strict"

import { Toast } from 'antd-mobile';
import { BackHandler } from 'app-3rd';
import { ListRow } from 'app-3rd/teaset';
import * as API from "app-api";
import { ActionModal, BarItems, BimSwitch, ImageChooserView, LoadingView, StatusActionButton } from 'app-components';
import React, { Component } from 'react';
import ReactNative, { Dimensions, Image, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { connect } from 'react-redux';
import * as reviewRepairAction from "./../../actions/reviewRepairAction";
import GLDDatePicker from "./../../components/GLDDatePicker";
import QualityDetailView from "./QualityDetailView";


const REF_PHOTO = 'gldPhoto';
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
var { width, height } = Dimensions.get("window");

/**
 * 新建复查单整改单
 */
class NewReviewPage extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: (<Text style={{ color: '#ffffff', fontSize: 17, marginTop: 5, alignSelf: "center", flex: 1, textAlign: "center" }}>{navigation.state.params.createType === API.CREATE_TYPE_REVIEW ? '复查单' : "整改单"}</Text>),
        headerRight: (
            <BarItems navigation={navigation}>
                <BarItems.RightBarItem navigation={navigation} text="提交" onPress={(navigation) => navigation.state.params.rightNavigatePress()} />
            </BarItems>
        ),
        headerLeft: (
            <BarItems navigation={navigation}>
                <BarItems.LeftBarItem navigation={navigation} text="取消" onPress={(navigation) => navigation.state.params.leftNavigatePress()} />
            </BarItems>
        ),
        gesturesEnabled: false,
        // header: null
    });

    constructor(props) {
        let filesIn = [];
        if (props.params) {
            if (props.params.files) {
                filesIn = props.params.files;
            }
        }
        super(props);
        let params = this.props.navigation.state.params;
        let showRectificationView = (params && params.createType === API.CREATE_TYPE_REVIEW);
        this.state = {
            description: "",//内容描述
            status: API.STATUS_NOT_ACCEPTED,//复查合格，默认不合格
            expand: false,//检查单是否展开
            lastRectificationDate: now,//整改时间
            switchValue: null,
            isSetEditInfo: false,
            firstLoad:true,
            showRectificationView: showRectificationView,//是否显示复查合格
            files: filesIn, //附件图片
        };
        this.description = "";
        this.props.navigation.setParams({ leftNavigatePress: this.goBack, rightNavigatePress: this.submit })
    }

    componentDidMount() {
        // storage.pushNext(navigator, "NewReviewPage",{qualityCheckListId:qualityCheckListId,createType:createType});
        let params = this.props.navigation.state.params;
        const { fetchData } = this.props;
        fetchData(params.qualityCheckListId, params.createType);

        if (Platform.OS === 'android') {
            const BackHandler = ReactNative.BackHandler
                ? ReactNative.BackHandler
                : ReactNative.BackAndroid
            this.backListener = BackHandler.addEventListener(
                'hardwareBackPress',
                () => {
                    if (storage.currentRouteName === this.props.navigation.state.routeName) {
                        this.goBack();
                        return true;
                    }
                    return false;
                }
            )
        }
        if(Platform.OS === 'web') {
            this.backListener = BackHandler.addEventListener(
                'hardwareBackPress',
                () => {
                    if (storage.currentRouteName === this.props.navigation.state.routeName) {
                        this.goBack();
                        return true;
                    }
                    return false;
                }
            )
        }
    }


    shouldComponentUpdate(nextProps, nextState) {
        if (!this.state.isSetEditInfo && nextProps.editInfo && nextProps.editInfo.id) {
            //设置编辑数据
            this.setEditInfo(nextProps.editInfo);
            return false;
        } else {
            if(nextProps.isLoading === false && this.state.firstLoad === true) {
                this.setState({firstLoad:false});
                return false;
            }
        }
        
        return true;
    }

    componentWillUnmount() {
        this.props.reset();
        Toast.hide();
        this.removeBackListener();
        global.storage.backInterceptor = null;
    }
    removeBackListener() {
        if (this.backListener) {
            this.backListener.remove()
            this.backListener = null
        }
    }
    /**
     * 编辑草稿时，设置数据
     */
    setEditInfo = (editInfo) => {
        let date = now;
        let status = editInfo.status;
        let switchValue = this.state.switchValue;
        let timestamp = editInfo.lastRectificationDate;
        if (status == API.STATUS_NOT_ACCEPTED && timestamp) {
            date = new Date(timestamp)
            switchValue = false;
        } else {
            switchValue = true;
        }
        this.setState({
            firstLoad:false,
            status: status,
            description: editInfo.description,
            lastRectificationDate: date,
            isSetEditInfo: true,
            switchValue: switchValue,
            files: editInfo.files,
        });
        this.description = editInfo.description;
    }


    getRectificationId = (qualityInfo) => {
        if (qualityInfo) {
            let progressInfos = qualityInfo.progressInfos;
            if (progressInfos && progressInfos.length > 0) {
                return progressInfos[progressInfos.length - 1].id;
            }
        }
        return "";
    }

    goBack = () => {
        let params = this.props.navigation.state.params;
        reviewRepairAction.isEditInfoChange(this.state.description, this.state.status, this.state.lastRectificationDate, this.props.editInfo, params.createType, this.refs[REF_PHOTO],
            (isChange) => {
                if (isChange) {
                    ActionModal.alert('是否确认退出当前页面？', "您还未保存当前数据！", [
                        {
                            text: '取消', style: { color: '#5b5b5b' }
                        },
                        {
                            text: '不保存', style: { color: '#e75452' }, onPress: () => { storage.goBack(this.props.navigation, null); }
                        },
                        {
                            text: '保存', style: { color: '#00baf3' }, onPress: () => { this.save() }
                        }
                    ]);
                } else {
                    storage.goBack(this.props.navigation, null);
                }
            })
    }

    save = () => {
        let params = this.props.navigation.state.params;
        this.props.saveRepairReview(
            params.qualityCheckListId,
            this.state.description,
            this.state.status,
            this.state.lastRectificationDate,
            this.props.qualityInfo,
            this.props.editInfo,
            params.createType,
            this.refs[REF_PHOTO],
        );
    }

    submit = () => {
        let params = this.props.navigation.state.params;

        this.props.submit(
            params.qualityCheckListId,
            this.state.description,
            this.state.status,
            this.state.lastRectificationDate,
            this.props.qualityInfo,
            this.props.editInfo,
            params.createType,
            this.props.navigation,
            this.refs[REF_PHOTO],
        );
    }

    deleteForm = () => {
        ActionModal.alertConfirm('是否确认删除？', "删除当前数据后，数据不可恢复哦！", { text: '取消' }, {
            text: '删除', onPress: () => {
                let params = this.props.navigation.state.params;
                this.props.deleteForm(this.props.editInfo.id, params.createType, this.props.navigation);
            }
        });
    }

    onChangeSwitch = (value) => {
        let status = value ? API.STATUS_CLOSED : API.STATUS_NOT_ACCEPTED;
        this.setState({
            status: status,
            switchValue: value,
        })
    }

    renderSwitchView = () => {
        return (
            <BimSwitch value={this.state.switchValue} onValueChange={(value) => { this.onChangeSwitch(value) }} />
        );
    }

    renderReviewDate = () => {
        return (
            <GLDDatePicker title={"整改期限"} date={this.state.lastRectificationDate} onDateChange={(date) => {
                this.setState({ lastRectificationDate: date })
            }}></GLDDatePicker>
        )
    }
    //质检单展开闭合箭头
    renderAccessory = () => {
        return (
            <Image
                style={{ width: 12, height: 6, marginRight: 5 }}
                source={
                    (this.state.expand) ?
                        require("app-images/icon_draw_arrow_up.png") :
                        require("app-images/icon_drawer_arrow_down.png")
                } />
        );
    }
    render() {
        if(this.state.firstLoad === true) {
            return (<LoadingView />);
        }
        return (
            <ScrollView>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <TextInput
                    maxLength={255}
                    style={styles.input}
                    placeholder={'现场情况描述...'}
                    multiline={true}
                    underlineColorAndroid={"transparent"}
                    textAlign="left"
                    onChangeText={(text) => { this.state.description = text }}
                    defaultValue={this.description}
                />

                <View style={{ width: '100%', height: 130, marginTop: 10, marginBottom: 0, backgroundColor: '#FFFFFF' }}>
                    <ImageChooserView ref={REF_PHOTO} files={this.state.files} style={{ width: width, height: 100, marginTop: 10, marginLeft: 10, marginRight: 10, }} onChange={() => { }} />
                </View>
                {
                    this.state.showRectificationView ? (
                        <View style={{ backgroundColor: "#ffffff" }}>
                            <View style={{ paddingLeft: 8 }}>
                                <ListRow title='复查合格' bottomSeparator='full' detail={this.renderSwitchView()} />
                            </View>
                            {
                                (this.state.switchValue) ? (null) : (this.renderReviewDate())
                            }
                        </View>
                    ) : (null)
                }
                <View style={{ backgroundColor: "#ffffff", paddingLeft: 8, marginTop: 20 }}>
                    <ListRow title='检查单' bottomSeparator='full'
                        accessory={this.renderAccessory()}
                        onPress={() => { this.setState({ expand: !this.state.expand, }) }}
                    />
                </View>


                <View style={this.state.expand ? {} : { display: "none" }}>
                    {
                        this.props.qualityInfo.inspectionInfo ? <QualityDetailView qualityInfo={this.props.qualityInfo} /> : null
                    }

                </View>

                <StatusActionButton style={{ height: 40, marginTop: 30, marginRight: 40, marginLeft: 40, backgroundColor: "#00b5f2", borderColor: "#00b5f2", }}  color='#ffffff' text='保存' onClick={this.save} />
                {
                    (this.props.editInfo && this.props.editInfo.id) ? (
                        <StatusActionButton text='删除' style={{ height: 40, marginTop: 20, marginRight: 40, marginLeft: 40, backgroundColor: "#ffffff", borderColor: "#ffffff", }} color='#000000' onClick={this.deleteForm} />
                    ) : (null)
                }


            </ScrollView>
        );
    }
}



export default connect(
    state => ({
        qualityInfo: state.reviewRepair.qualityInfo,
        editInfo: state.reviewRepair.editInfo,
        error: state.reviewRepair.error,
        isLoading:state.reviewRepair.isLoading
    }),
    dispatch => ({
        fetchData: (fileId, type) => {
            if (dispatch) {
                dispatch(reviewRepairAction.fetchData(fileId, type))
            }
        },
        saveRepairReview: (inspectionId, description, status, lastRectificationDate, qualityInfo, editInfo, type, imageChooserEle) => {
            if (dispatch) {
                dispatch(reviewRepairAction.save(inspectionId, description, status, lastRectificationDate, qualityInfo, editInfo, type, imageChooserEle))
            }
        },
        submit: (inspectionId, description, status, lastRectificationDate, qualityInfo, editInfo, type, navigator, imageChooserEle) => {
            dispatch(reviewRepairAction.submit(inspectionId, description, status, lastRectificationDate, qualityInfo, editInfo, type, navigator, imageChooserEle))
        },
        deleteForm: (fileId, type, navigator) => {
            if (dispatch) {
                dispatch(reviewRepairAction.deleteForm(fileId, type, navigator))
            }
        },
        reset: () => {
            dispatch(reviewRepairAction.reset())
        }
    }))(NewReviewPage);

const styles = StyleSheet.create({
    input: {
        textAlignVertical: 'top',
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 12,
        paddingBottom: 0,
        backgroundColor: '#ffffff',
        minHeight: 120
    },
    title: {
        color: '#ffffff',
        fontSize: 17,
        marginTop: 5,
        alignSelf: "center",
        flex: 1,
        textAlign: "center"
    }
})