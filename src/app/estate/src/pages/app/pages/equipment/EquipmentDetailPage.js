/**
 * Created by JokAr on 2017/4/12.
 */
'use strict';
import React, { Component } from "react";
import {
    ActivityIndicator, ScrollView, StyleSheet, Text, View, StatusBar,
} from "react-native";
import { connect } from 'react-redux' // 引入connect函数

import { BimFileEntry, AuthorityManager } from "app-entry";
import * as API from "app-api";
import EquipmentDetailView from "./equipmentDetailView"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LeftBarButtons } from "app-components";

import * as actions from '../../actions/equipmentInfoAction'

class EquipmentDetailPage extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: '材设进场记录',
        gesturesEnabled: navigation.state.params.gesturesEnabled ? navigation.state.params.gesturesEnabled() : false,
        headerLeft: navigation.state.params.loadLeftTitle ? navigation.state.params.loadLeftTitle() : null,
        headerRight: navigation.state.params.loadRightTitle ? navigation.state.params.loadRightTitle() : null
    })
    constructor(props) {
        super(props);
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
    }

    _onSubmit = (info) => {
        this.props.submit(info, this.props.navigation)
    }
    gesturesEnabled = () => {
        return false;
    }
    loadRightTitle = () => {
        const equipmentInfo = this.props.equipmentInfo;
        let power = AuthorityManager.isEquipmentCreate()
        const { editType, id, preEditType } = equipmentInfo;
        if (!id) {
            if (editType != API.EQUIPMENT_EDIT_TYPE_CONFIRM) {
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
            return (<Text onPress={() => this._onSubmit(equipmentInfo)} style={{ marginRight: 10, color: '#FFFFFF', textAlign: "center" }} >提交</Text>)
        }

        return null;
    }
    needBack = (backFun) => {
        const equipmentInfo = this.props.equipmentInfo;
        const { editType, preEditType } = equipmentInfo;
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
                    if (preEditType === API.EQUIPMENT_EDIT_TYPE_IMAGE) {
                        p = API.EQUIPMENT_EDIT_TYPE_OTHER
                    } else if (preEditType === API.EQUIPMENT_EDIT_TYPE_OTHER) {
                        p = API.EQUIPMENT_EDIT_TYPE_BASE
                    } else if (preEditType === API.EQUIPMENT_EDIT_TYPE_BASE) {
                        p = null
                    }
                    let data = { ...equipmentInfo, preEditType: p, editType: preEditType };
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
        return <LeftBarButtons top={false} needBack={this.needBack} navigation={this.props.navigation} currentItem={API.APP_EQUIPMENT} />
    }
    switchPage = (info) => {
        this.props.switchPage(info);
    }

    componentDidMount() {
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

    }

    componentWillUnmount() {
        const { resetData } = this.props;
        resetData();
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
                    Fail: {error}
                </Text>
            </View>
        );
    }

    renderData = () => {
        const equipmentInfo = this.props.equipmentInfo;
        return (
            <KeyboardAwareScrollView style={{ backgroundColor: '#FAFAFA' }}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <EquipmentDetailView
                    equipmentInfo={equipmentInfo}
                    acceptanceCompanies={this.props.acceptanceCompanies}
                    switchPage={this.switchPage}
                    save={this.props.save}
                    submit={this.props.submit}
                    equipmentDelete={(params)=>{this.props.equipmentDelete(params, this.props.navigation)}}
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
        acceptanceCompanies: state.equipmentInfo.acceptanceCompanies,
        isLoading: state.equipmentInfo.isLoading,
        error: state.equipmentInfo.error,
        updateIndex: state.updateData.updateIndex,
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
        }
    })
)(EquipmentDetailPage)