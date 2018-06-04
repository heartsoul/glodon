/**
 * Created by Soul on 2018/03/16.
 */
'use strict';
import React, { Component, } from "react";
import {
    ActivityIndicator, StyleSheet, Dimensions,
    Text, View, StatusBar, Image, TouchableOpacity, RefreshControl
} from "react-native";
import { connect } from 'react-redux' // 引入connect函数
import { FlatList } from "app-3rd"

import * as AuthorityManager from "./AuthorityManager";
import * as actions from '../../../actions/projectAction'
import { BarItems, LoadingView } from "app-components";
import * as API from "app-api";
import { Toast } from 'antd-mobile'

var { width, height } = Dimensions.get("window");
class ProjectPage extends Component {

    static navigationOptions = {
        headerTitle: <BarItems.TitleBarItem text='项目列表' />,
        headerRight: <View />,
    };

    constructor(props) {
        super(props);
        if (!storage.homeNavigation) {
            storage.homeNavigation = this.props.navigation;
        }
    }
    _keyExtractor = (item, index) => index;
    //网络请求
    fetchData = (page, dataArray) => {
        if (page > 0 && this.props.hasMore === false) {
            return;
        }
        let prevTenant = storage.loadLastTenant();
        let newTenant = this.props.navigation.state.params.tenantId;
        this.props.fetchData(page, dataArray, newTenant, prevTenant);
    }

    componentDidMount() {
        //请求数据
        this.fetchData(0, this.props.dataArray);
    }
    //加载失败view
    renderErrorView(error) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <Text>
                    加载失败
                </Text>
            </View>
        );
    }
    _itemClick = (item, index) => {
        let navigator = this.props.navigation;
        let prevTenant = storage.loadLastTenant();
        let newTenant = this.props.navigation.state.params.tenantId;
        AuthorityManager.loadAuthoritys("" + item.value.id, (success) => {
            if (!success) {
                Toast.info('获取权限失败', 1.5);
                return;
            }
            API.setCurrentTenant(newTenant).then((responseData) => {
                storage.saveTenant(this.props.navigation.state.params.id);
                storage.saveLastTenant(newTenant);
                storage.saveProject("" + item.value.id, "" + item.value.name);
                storage.gotoMainPage(navigator);
            }).catch(error => {
                Toast.info('切换失败', 1.5);
            });

        }, newTenant);
    }

    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#F7F7F7', marginLeft: 40 }} />;
    }
    //返回itemView
    renderItemView = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} activeOpacity={0.5} onPress={() => this._itemClick(item, index)}>
                <View style={[styles.containerView, item.value.id == storage.loadProject() ? styles.selectContainer : null]}>
                    <Text style={[styles.content, item.value.id == storage.loadProject() ? { color: '#00baf3', fontWeight: "bold" } : null]}> {item.value.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    //返回itemView
    renderItemSimpleView = ({ item, index }) => {
        return (
            <View style={styles.containerSimpleView}>
                <TouchableOpacity key={index} activeOpacity={0.5} onPress={() => this._itemClick(item, index)}>
                    <View>
                        <Image
                            source={require("app-images/icon_choose_project_item.png")}
                            style={styles.image} />
                        <Text style={[styles.contentSimple, item.value.id == storage.loadProject() ? { color: '#00baf3' } : null]}> {item.value.name}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    _onEndReached = () => {
        if (this.props.isLoading || this.props.hasMore === false) {
            return;
        }
        this.fetchData(this.props.page, this.props.dataArray);
    }
    _onRefreshing = () => {
        if (this.props.isLoading) {
            return;
        }
        this.fetchData(-1, []);
    }
    renderData = () => {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <FlatList style={{ width: width }}
                    data={this.props.dataArray}
                    renderItem={this.renderItemView}
                    ItemSeparatorComponent={this._separator}
                    onEndReached={this._onEndReached}
                    onRefresh={this._onRefreshing}
                    refreshing={this.props.isLoading}
                    onEndReachedThreshold={0.1}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.isLoading}
                        />
                    }
                />
            </View>
        );
    }

    renderDataSimple = () => {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <Text style={{ color: "transparent", height: 25 }}> 项目列表 </Text>
                <FlatList style={{ width: width }}
                    data={this.props.dataArray}
                    renderItem={this.renderItemSimpleView}
                />
            </View>
        );
    }

    render = () => {
        
        if(this.props.dataArray && this.props.dataArray.length == 1) {
            // 只有一个项目
            let prj = storage.loadProject();
            if(prj && prj == '0') {
                // 直接进入
                this._itemClick(this.props.dataArray[0],0);
                return <LoadingView />;
            }
        }
        //第一次加载等待的view
        if (this.props.isLoading && !this.props.error) {
            return (<LoadingView />);
        } else if (this.props.error) {
            //请求失败view
            return this.renderErrorView(this.props.error);
        }
        if (this.props.dataArray.length < 5) {
            //加载数据
            return this.renderDataSimple();
        }
        //加载数据
        return this.renderData();
    }
}

export default connect(
    state => ({
        dataArray: state.projectList.data,
        isLoading: state.projectList.isLoading,
        error: state.projectList.error,
        page: state.projectList.page,
        hasMore: state.projectList.hasMore,
    }),
    dispatch => ({
        fetchData: (page, dataArray, newTenant, prevTenant) => {
            if (dispatch) {
                dispatch(actions.fetchData(page, dataArray, newTenant, prevTenant))
            }
        },
        resetData: () => {
            if (dispatch) {
                dispatch(actions.reset())
            }
        },
    })
)(ProjectPage)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    containerSimpleView: {
        flex: 1,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#00baf3",
        height: 60,
        marginTop: 5,

        marginBottom: 15,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#FFF',
        // elevation: 2.5, // android 
        // shadowColor: "#00baf3", // iOS
        // shadowOffset: { width: 3, height: 7 }, // iOS
        // shadowOpacity: 0.15, // iOS
        // shadowRadius: 3, // iOS

    },
    containerView: {
        flex: 1,
        height: 50,
        paddingLeft: 40,
        paddingRight: 40,
        justifyContent:"center"
    },
    selectContainer: {
        backgroundColor: '#F2FcFf',
    },
    title: {
        fontSize: 15,
        color: 'blue',
    },
    content: {
        alignItems: "center",
        textAlign: "left",
        fontSize: 15,
        color: '#325771',
    },
    contentSimple: {
        left: 60,
        top: -20,
        fontSize: 15,
        color: '#325771',
    },
    image: {
        left: 10,
        top: 10,
        width: 40,
        height: 40,
    }
});