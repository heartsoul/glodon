/**
 * Created by JokAr on 2017/4/12.
 */
'use strict';
import React, { Component } from "react";
import ReactNative, {
    ActivityIndicator, ScrollView, StyleSheet, Text, View, StatusBar, Platform
} from "react-native";
import { connect } from 'react-redux' // 引入connect函数

import { BimFileEntry, AuthorityManager } from "app-entry";
import * as API from "app-api";
import EquipmentDetailView from "./equipmentDetailView"

import { KeyboardAwareScrollView } from 'app-3rd/index';
import { BarItems, ActionModal } from "app-components";
import * as actions from '../../actions/equipmentInfoAction';
import * as relevantModelAction from "../../actions/relevantModelAction";
import { getModelElementProperty } from "app-api";

class EquipmentDetailPage extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: <BarItems.TitleBarItem text='材设进场记录'/>,
        gesturesEnabled: navigation.state.params && navigation.state.params.gesturesEnabled ? navigation.state.params.gesturesEnabled() : false,
        headerLeft: navigation.state.params && navigation.state.params.loadLeftTitle ? navigation.state.params.loadLeftTitle() : <BarItems />,
        headerRight: navigation.state.params && navigation.state.params.loadRightTitle ? navigation.state.params.loadRightTitle() : <View/>
    })
    constructor(props) {
        super(props);
        const { item } = this.props.navigation.state.params;
        this.state = {
            committed: item && item.value &&item.value.committed,
        };
        this.props.navigation.setParams({ loadLeftTitle: this.loadLeftTitle, loadRightTitle: this.loadRightTitle, gesturesEnabled: this.gesturesEnabled })

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.updateIndex != this.props.updateIndex) {
            const { fetchData } = this.props;
            const { item } = this.props.navigation.state.params;
            if (item && item.value && item.id) {
                fetchData(item.value.id);
            }
        }
        if (nextProps.equipmentInfo.editType != this.props.equipmentInfo.editType) {
            this.props.navigation.setParams({ loadLeftTitle: this.loadLeftTitle, loadRightTitle: this.loadRightTitle, gesturesEnabled: this.gesturesEnabled })
        }
        if (nextProps.relevantEquipmentModle && nextProps.relevantEquipmentModle.gdocFileId && nextProps.relevantEquipmentModle.elementId && nextProps.relevantEquipmentModle != this.props.relevantEquipmentModle) {
            this.props.getModelElementProperty(nextProps.relevantEquipmentModle, this.props.equipmentInfo)
        }

    }

    _onSubmit = (info) => {
        if(info.skip === true) {
            info = {...info,quantity:'',unit:'',specification:'',modelNum:'',elementId:'',elementName:'',manufacturer:'',brand:'',supplier:'',}
        }
        this.props.submit(info, this.props.navigation)
    }
    _onSave = (info) => {
        if(info.skip === true) {
            info = {...info,quantity:'',unit:'',specification:'',modelNum:'',elementId:'',elementName:'',manufacturer:'',brand:'',supplier:'',}
        }
        this.props.save(info)
    }
    
    gesturesEnabled = () => {
        return false;
    }
    loadRightTitle = () => {
        const equipmentInfo = this.props.equipmentInfo;
        let power = AuthorityManager.isEquipmentCreate() && !this.state.committed;
        const { editType, id, preEditType } = equipmentInfo;
        if (!id) {
            if (editType && editType != API.EQUIPMENT_EDIT_TYPE_CONFIRM) {
                power = false;
            }
        } else {
            if (editType == API.EQUIPMENT_EDIT_TYPE_BASE
                || editType == API.EQUIPMENT_EDIT_TYPE_OTHER
                || editType == API.EQUIPMENT_EDIT_TYPE_IMAGE) {
                power = false;
            }
        }
        if (power) {
           return <BarItems navigation={this.props.navigation}>
            <BarItems.RightBarItem text="提交" navigation={this.props.navigation}  onPress={() => this._onSubmit(equipmentInfo)} />
           </BarItems>
        }

        return  <View/>;
    }
    check = (info) => {
        const { editType, preEditType } = info;
        if(editType != API.EQUIPMENT_EDIT_TYPE_BASE) {
            return false;
        }
        let ret = info && info.acceptanceCompanyName && info.acceptanceCompanyName.length > 0
        && info.batchCode && info.batchCode.length > 0
        && info.approachDate && info.approachDate > 0
        && info.facilityCode && info.facilityCode.length > 0
        && info.facilityName && info.facilityName.length > 0;
        return ret;
    }
    tipSave = (backFun,info) => {
        actions.isEditInfoChange(info, this.props.oldData, (isChange) => {
            if (isChange) {
                ActionModal.alert('是否确认退出当前页面？', "您还未保存当前数据！", [
                    {
                        text: '取消', style: { color: '#5b5b5b'},onPress: () => { if (backFun) {
                            backFun(false);
                        } }
                    },
                    {
                        text: '不保存', style: { color: '#e75452' }, onPress: () => { if (backFun) {
                            backFun(true);
                        } }
                    },
                    {
                        text: '保存', style: { color: '#00baf3' }, onPress: () => { this._onSave(info) }
                    }
                ]);
            } else {

                if (backFun) {
                    backFun(true);
                }
            }
        })
    }
    needBack = (backFun) => {
        const equipmentInfo = this.props.equipmentInfo;
        const { editType, preEditType} = equipmentInfo;
        if(editType == API.EQUIPMENT_EDIT_TYPE_CONFIRM) {
            this.tipSave(backFun,equipmentInfo);
            return;
        }
        if (preEditType) {
            if (preEditType === API.EQUIPMENT_EDIT_TYPE_CONFIRM) {
                let data = { ...equipmentInfo, preEditType: null, editType: preEditType };
                this.switchPage(data);
                // 这里要处理保存操作
                if (backFun) {
                    backFun(false);
                }
                return;
            } else {
                if (preEditType === API.EQUIPMENT_EDIT_TYPE_BASE || preEditType === API.EQUIPMENT_EDIT_TYPE_OTHER || preEditType === API.EQUIPMENT_EDIT_TYPE_IMAGE) {
                    let p = null
                    let skip = equipmentInfo.skip;
                    if (preEditType === API.EQUIPMENT_EDIT_TYPE_IMAGE) {
                        p = API.EQUIPMENT_EDIT_TYPE_OTHER
                        skip = false;
                    } else if (preEditType === API.EQUIPMENT_EDIT_TYPE_OTHER) {
                        p = API.EQUIPMENT_EDIT_TYPE_BASE
                        skip = false;
                    } else if (preEditType === API.EQUIPMENT_EDIT_TYPE_BASE) {
                        p = null
                        skip = false;
                    }
                    let data = { ...equipmentInfo,skip:skip, preEditType: p, editType: preEditType };
                    this.switchPage(data);
                    // 这里要处理保存操作
                    if (backFun) {
                        backFun(false);
                    }
                    return;
                }
            }
        }
        // 这里要处理保存操作
        if (backFun) {
            backFun(true);
        }
    }
    loadLeftTitle = () => {
        return <BarItems top={false} needBack={this.needBack} navigation={this.props.navigation} currentItem={API.APP_EQUIPMENT} />
    }
    switchPage = (info) => {
        this.props.switchPage(info);
    }

    componentDidMount() {
        this.registerBackhandler();
        const { fetchData } = this.props;
        const { item } = this.props.navigation.state.params;
        if (item) {
            if (item.id) {
                fetchData(item.id);
                return;
            } else if (item.value && item.value.id) {
                fetchData(item.value.id);
                return;
            }
        }
        fetchData(null);
        this.props.getModelElementProperty(this.props.relevantEquipmentModle, this.props.equipmentInfo)


    }

    componentWillUnmount() {
        const { resetData } = this.props;
        resetData();
        this.props.resetTransformInfo();
        this.removeBackListener()
    }

    registerBackhandler = () => {
        if (Platform.OS === 'android') {
            const BackHandler = ReactNative.BackHandler
                ? ReactNative.BackHandler
                : ReactNative.BackAndroid
            this.backListener = BackHandler.addEventListener(
                'hardwareBackPress',
                () => {
                    if(storage.currentRouteName === this.props.navigation.state.routeName){
                        this.needBack((needBack)=>{
                            if(needBack) {
                              storage.pop(this.props.navigation,1)
                            }
                          })
                        return true;
                    }
                    return false;
                }
            )
        }
    }

    removeBackListener() {
        if (this.backListener) {
            this.backListener.remove()
            this.backListener = null
        }
    }
    //加载等待的view
    renderLoadingView() {
        return (
            <View>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <ActivityIndicator
                    animating={true}
                    style={[{ height: 80 }]}
                    color='green'
                    size="large"
                />
            </View>
        );
    }

    //加载失败view
    renderErrorView(error) {
        this.setState({
            refreshing: false,
            isLoading: false,
        });
        return (
            <View>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <Text>
                    加载失败
                </Text>
            </View>
        );
    }

    renderData = () => {
        const equipmentInfo = this.props.equipmentInfo;
        return (
            <KeyboardAwareScrollView keyboardShouldPersistTaps={"always"} keyboardDismissMode={'on-drag'} style={{ backgroundColor: '#FAFAFA' }}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <EquipmentDetailView
                    committed={this.state.committed}
                    equipmentInfo={equipmentInfo}
                    acceptanceCompanies={this.props.acceptanceCompanies}
                    switchPage={this.switchPage}
                    save={this._onSave}
                    equipmentDelete={(params) => { this.props.equipmentDelete(params, this.props.navigation) }}
                />
            </KeyboardAwareScrollView>
        );
    }

    render() {
        // 第一次加载等待的view
        if (this.props.isLoading && !this.props.error) {
            return this.renderLoadingView();
        } else
            if (this.props.error) {
                //请求失败view
                return this.renderErrorView(this.props.error);
            }
        //加载数据
        return this.renderData();
    }
}

export default connect(
    state => ({
        equipmentInfo: state.equipmentInfo.data,
        oldData:state.equipmentInfo.oldData,
        acceptanceCompanies: state.equipmentInfo.acceptanceCompanies,
        isLoading: state.equipmentInfo.isLoading,
        error: state.equipmentInfo.error,
        updateIndex: state.updateData.updateIndex,
        relevantEquipmentModle: state.transformInfo.relevantEquipmentModle,
    }),
    dispatch => ({
        fetchData: (fileId) => {
            if (dispatch) {
                dispatch(actions.fetchData(fileId))
            }
        },
        resetData: () => {
            if (dispatch) {
                dispatch(actions.reset())
            }
        },
        switchPage: (equipmentInfo) => {
            if (dispatch) {
                dispatch(actions.switchPage(equipmentInfo))
            }
        },
        save: (params) => {
            if (dispatch) {
                dispatch(actions.save(params))
            }
        },
        submit: (params, navigator) => {
            if (dispatch) {
                dispatch(actions.submit(params, navigator))
            }
        },
        equipmentDelete: (fieldId, navigator) => {
            if (dispatch) {
                dispatch(actions.equipmentDelete(fieldId, navigator))
            }
        },
        getModelElementProperty: (relevantEquipmentModle, equipmentInfo) => {
            if (relevantEquipmentModle && relevantEquipmentModle.gdocFileId && relevantEquipmentModle.elementId) {
                if (dispatch) {
                    dispatch(actions.getModelElementProperty(relevantEquipmentModle, equipmentInfo))
                }
            }
        },
        resetTransformInfo: () => {
            if (dispatch) {
                dispatch(relevantModelAction.resetTransformInfo())
            }
        },
        
    })
)(EquipmentDetailPage)