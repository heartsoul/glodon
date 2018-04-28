/**
 * Created by JokAr on 2017/4/12.
 */
'use strict';
import React, { Component } from "react";
import {
    ActivityIndicator, ScrollView, StyleSheet, Text, View, StatusBar, Image,
} from "react-native";
import { connect } from 'react-redux' // 引入connect函数

import { BimFileEntry, AuthorityManager } from "app-entry";
import * as API from "app-api";
import EquipmentDetailView from "./equipmentDetailView"

import * as actions from '../../actions/equipmentInfoAction'

class EquipmentDetailPage extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: '材设进场记录',
        gesturesEnabled: true,
        headerRight: navigation.state.params.loadRightTitle ? navigation.state.params.loadRightTitle() : null
    })
    constructor(props) {
        super(props);
        this.props.navigation.setParams({loadRightTitle: this.loadRightTitle })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.updateIndex != this.props.updateIndex) {
            const { fetchData } = this.props;
            const { item } = this.props.navigation.state.params;
            fetchData(item.value.id);
        }
    }

    _onSubmit = (id) => {
        // BimFileEntry.submitEquipmentFromList(id, ()=>{
        //   console.log("提交完成");
        // });
    }
    loadRightTitle = () => {
        const equipmentInfo = this.props.equipmentInfo;
        let power = 
            power = (AuthorityManager.isEquipmentCreate())
            if (power) {
                return (<Text onPress={() => this._onSubmit(equipmentInfo.id)} style={{ marginRight: 10, color: '#FFFFFF', textAlign: "center" }} >提交</Text>)
            }
        
        return null;
    }

    componentDidMount() {
        const { fetchData } = this.props;
        const { item } = this.props.navigation.state.params;
        fetchData(item.value.id);
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
            <ScrollView style={{ backgroundColor: '#FAFAFA' }}>
            <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <EquipmentDetailView equipmentInfo={equipmentInfo} />
            </ScrollView>
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
    })
)(EquipmentDetailPage)