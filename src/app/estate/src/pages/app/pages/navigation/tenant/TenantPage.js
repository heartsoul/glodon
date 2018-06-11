/**
 * Created by Soul on 2018/03/16.
 */
'use strict';
import React, { Component, } from "react";
import ReactNative, { ActivityIndicator, Animated, ScrollView, StyleSheet, Text, View, StatusBar, Image, TouchableOpacity, Platform } from "react-native";
import { BarItems } from "app-components";
import { FlatList } from "app-3rd"
import * as API from "app-api";
import UserInfoManager from '../../../../offline/manager/UserInfoManager'

let userInfoManager= null;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default class tenantList extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: <BarItems.TitleBarItem text='租户列表' />,
        gesturesEnabled: false,
        headerLeft: navigation.state.params && navigation.state.params.loadLeftTitle ? navigation.state.params.loadLeftTitle() : null,
        headerRight: <View />,
    });

    changeProject = false;
    constructor(props) {
        super(props);
        if (!storage.homeNavigation) {
            storage.homeNavigation = this.props.navigation;
        }
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [],
        }
        //在使用过程中进行切换租户和项目
        if (undefined != this.props.navigation.state.params && undefined != this.props.navigation.state.params.changeProject) {
            this.changeProject = this.props.navigation.state.params.changeProject;
        }
        this.props.navigation.setParams({ loadLeftTitle: this.loadLeftTitle, })
        //获取所有项目信息
        userInfoManager = new UserInfoManager();
    }

    needBack = (backFun) => {
        // 这里要处理保存操作
        if (backFun) {
            backFun(false);
        }
        if (storage.loadLastTenant() == '0') {
            if (backFun) {
                backFun(true);
            } else {
                storage.gotoLogin(this.props.navigation)
            }
            return;
        }
        this.resetTenant();
    }
    resetTenant = () => {
        API.setCurrentTenant(storage.loadLastTenant())
            .then((responseData) => {
                storage.gotoMainPage(this.props.navigation, { activeIndex: storage.currentTab })
            });
    }
    loadLeftTitle = () => {
        return <BarItems top={false} needBack={this.needBack} navigation={this.props.navigation} currentItem={API.APP_EQUIPMENT} />
    }
    componentDidMount() {
        this.appearAfterMount && this.appear()
    }

    componentWillUnmount() {
        this.removeBackListener()
        userInfoManager.close();
    }

    removeBackListener() {
        if (this.backListener) {
            this.backListener.remove()
            this.backListener = null
        }
    }

    //网络请求
    fetchData = () => {
        //请求数据
        if (this.props.navigation.getParam('change') === true && storage.loadLastTenant() != '0' && storage.loadLastTenant() != 'undefined') {
            this.props.navigation.setParams({ change: false });
            let navigator = this.props.navigation;
            storage.pushNext(navigator, "ProjectPage", { tenantId: storage.loadLastTenant(), id: storage.loadTenant() })
        }
        let userInfo = storage.loadUserInfo();
        if (userInfo && userInfo["accountInfo"]) {

        } else {
            storage.gotoLogin(this.props.navigation);
            return;
        }
        let userTenants = userInfo["accountInfo"]["userTenants"];
        if (userTenants) {
            let data = userTenants;
            let dataBlob = [];
            let i = 0;
            data.map(function (item) {
                dataBlob.push({
                    key: "A0" + i,
                    value: item,
                })
                i++;

            });
            if (dataBlob.length == 1 && storage.loadLastTenant() == '0') {
                this.props.navigation.setParams({ isFirst: false });
                this._clickItem(dataBlob[0], 0)
                return;
            }
            this.setState({
                //复制数据源
                dataArray: dataBlob,
                isLoading: false,
            });
            data = null;
            dataBlob = null;
        } else {
            this.setState({
                error: true,
                errorInfo: { "errorInfo": "未登录" },
            });
        }
    }

    componentWillMount() {
        //请求数据
        this.fetchData();
        if (Platform.OS === 'android') {
            const BackHandler = ReactNative.BackHandler
                ? ReactNative.BackHandler
                : ReactNative.BackAndroid
            this.backListener = BackHandler.addEventListener(
                'hardwareBackPress',
                () => {
                    if (storage.currentRouteName === this.props.navigation.state.routeName) {
                        this.resetTenant();
                        return true
                    }
                    return false;
                }
            )
        }
    }

    //加载等待的view
    renderLoadingView() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <ActivityIndicator
                    animating={true}
                    style={[styles.gray, { height: 80 }]}
                    color='#00baf3'
                    size="large"
                />
            </View>
        );
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

    //点击列表点击每一行
    _clickItem = (item, index) => {
        //   alert(item.value.tenantId);
        API.setCurrentTenant(item.value.tenantId).then((responseData) => {
            
            let navigator = this.props.navigation;
            // storage.saveTenant(item.value.id);
            // storage.saveLastTenant(item.value.tenantId);
            // storage.saveTenantInfo(JSON.stringify(item));//保存当前的租户item信息
            // storage.pushNext(navigator, "ProjectPage")
            if (!this.changeProject) {
                storage.saveTenantInfo(JSON.stringify(item));//保存当前的租户item信息
                userInfoManager.downloadProjectInfo(item.value.tenantId+'');//切换租户后，获取租户下所有项目信息  保存到本地数据库
                storage.pushNext(navigator, "ProjectPage", { tenantId: item.value.tenantId, id: item.value.id })
            } else {
                storage.saveTenant(item.value.id);
                storage.saveLastTenant(item.value.tenantId);
                storage.saveTenantInfo(JSON.stringify(item));//保存当前的租户item信息
                storage.saveTenantInfoRefresh('1');//设置刷新
                userInfoManager.downloadProjectInfo(item.value.tenantId+'');//切换租户后，获取租户下所有项目信息  保存到本地数据库
                navigator.pop(1);//返回上一级

            }
           

        });
    }
    //返回itemView
    renderItemView = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} activeOpacity={0.5} onPress={() => this._clickItem(item, index)}>
                <View style={styles.containerView}>
                    <Image
                        source={require("app-images/icon_choose_tenant_item.png")}
                        style={styles.image} />
                    <Text style={[styles.content, item.value.tenantId == storage.loadLastTenant() ? { color: '#00baf3' } : null]}> {item.value.tenantName}</Text>
                </View>
            </TouchableOpacity>
        );
    }
    createEmptyView() {
        return (
            <Text style={{ fontSize: 40, alignSelf: 'center' }}>还没有数据哦！</Text>
        );
    }
    _keyExtractor = (item, index) => index;
    renderData() {
        return (
            <View style={{backgroundColor:"#fff",height:"100%",flex:1}}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <AnimatedFlatList
                    style={{backgroundColor:"#fff"}}
                    ListHeaderComponent={<View style={{height:25}}/>}
                    data={this.state.dataArray}
                    renderItem={this.renderItemView}
                    ListEmptyComponent={this.createEmptyView}
                    getItemLayout={(data, index) => ({
                        length: 60, offset: (44 + 1) * index, index
                    })}
                />
            </View>
        );
    }


    render() {
        //第一次加载等待的view
        if (this.state.isLoading && !this.state.error) {
            return this.renderLoadingView();
        } else if (this.state.error) {
            //请求失败view
            return this.renderErrorView(this.state.errorInfo);
        }
        //加载数据
        return this.renderData();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        height: 180
    },
    containerView: {
        flex: 1,
        borderRadius: 8,
        // borderWidth:1,
        // borderColor:"#0F0",
        height: 60,
        marginTop: 5,

        marginBottom: 15,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#FFF',
        elevation: 5, // android 
        shadowColor: "#333", // iOS
        shadowOffset: { width: 3, height: 7 }, // iOS
        shadowOpacity: 0.15, // iOS
        shadowRadius: 3, // iOS
        flexDirection: "row",
        alignItems: "center"
    },
    title: {
        fontSize: 15,
        color: 'blue',
    },
    content: {
        marginLeft: 10,
        fontSize: 15,
        color: '#325771',
    },
    image: {
        marginLeft: 10,
        width: 40,
        height: 40,
    }

});