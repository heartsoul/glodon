/**
 * Created by JokAr on 2017/4/12.
 */
'use strict';
import React, { Component } from "react";
import {
    ActivityIndicator, ScrollView, StyleSheet, Text, View, StatusBar, Image,
} from "react-native";
import { connect } from 'react-redux' // 引入connect函数
import { LoadingView } from "app-components";
import { BimFileEntry, AuthorityManager } from "app-entry";
import * as API from "app-api";
import QualityDetailView from "./QualityDetailView"

import * as actions from '../../actions/qualityInfoAction'

class QualityDetailPage extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: navigation.state.params.loadTitle ? navigation.state.params.loadTitle() : '',
        gesturesEnabled: true,
        headerRight: navigation.state.params.loadRightTitle ? navigation.state.params.loadRightTitle() : <View></View>
    })
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            qualityInfo: null,
        }
        this.props.navigation.setParams({ loadTitle: this.loadTitle, loadRightTitle: this.loadRightTitle })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.updateIndex != this.props.updateIndex) {
            const { fetchData } = this.props;
            const { item } = this.props.navigation.state.params;
            fetchData(item.value.id);
        }
        let preQcState = this.props.qualityInfo.inspectionInfo ? this.props.qualityInfo.inspectionInfo.qcState : null;
        let nextQcState = nextProps.qualityInfo.inspectionInfo ? nextProps.qualityInfo.inspectionInfo.qcState : null;
        if (nextQcState && nextQcState != preQcState) {//单据状态不一样的时候更新title
            this.props.navigation.setParams({ loadTitle: this.loadTitle, loadRightTitle: this.loadRightTitle })
        }
    }

    newUnreviewed = (qualityCheckListId) => {
        BimFileEntry.showNewReviewPage(this.props.navigation, qualityCheckListId, API.CREATE_TYPE_REVIEW);
    }
    newUnrectified = (qualityCheckListId) => {
        BimFileEntry.showNewReviewPage(this.props.navigation, qualityCheckListId, API.CREATE_TYPE_RECTIFY);
    }
    loadRightTitle = () => {
        const { inspectionInfo } = this.props.qualityInfo;
        let power = false;
        if (inspectionInfo.qcState == API.QC_STATE_UNRECTIFIED) {
            // 整改
            power = (AuthorityManager.isCreateRectify() && AuthorityManager.isMe(inspectionInfo.responsibleUserId))
            if (power) {
                return (<Text onPress={() => this.newUnrectified(inspectionInfo.id)} style={{ marginRight: 10, color: '#FFFFFF', textAlign: "center" }} >
                    {API.TYPE_NEW_NAME[0]}</Text>)
            }
        } else if (inspectionInfo.qcState == API.QC_STATE_UNREVIEWED) {
            // 检查
            power = (AuthorityManager.isCreateReview() && AuthorityManager.isMe(inspectionInfo.creatorId))
            if (power) {
                return (<Text onPress={() => this.newUnreviewed(inspectionInfo.id)} style={{ marginRight: 10, color: '#FFFFFF', textAlign: "center" }} >
                    {API.TYPE_NEW_NAME[1]}</Text>)
            }
        }
        return <View></View>;
    }

    loadTitle = () => {
        const { inspectionInfo } = this.props.qualityInfo;
        let title = '';
        if (inspectionInfo.inspectionType == API.TYPE_INSPECTION[0]) {
            title = API.TYPE_INSPECTION_NAME[0]
        } else if (inspectionInfo.inspectionType == API.TYPE_INSPECTION[1]) {
            title = API.TYPE_INSPECTION_NAME[1]
        }
        return title;
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
        const qualityInfo = this.props.qualityInfo;
        return (
            <ScrollView style={{ backgroundColor: '#FFFFFF' }}>
                <QualityDetailView qualityInfo={qualityInfo} />
            </ScrollView>
        );
    }

    render() {
        // 第一次加载等待的view
        if (this.props.isLoading && !this.props.error) {
            return (<LoadingView/>);
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
        qualityInfo: state.qualityInfo.data,
        isLoading: state.qualityInfo.isLoading,
        item: state.qualityInfo.item,
        error: state.qualityInfo.error,
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
)(QualityDetailPage)