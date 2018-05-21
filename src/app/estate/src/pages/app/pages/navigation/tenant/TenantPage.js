/**
 * Created by Soul on 2018/03/16.
 */
'use strict';
import React, { Component, } from "react";
import ReactNative, { ActivityIndicator, Animated, FlatList, ScrollView, StyleSheet, Text, View, StatusBar, Image, TouchableOpacity, Platform } from "react-native";
import { LeftBarButtons } from "app-components";
import * as API from "app-api";
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default class tenantList extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: '租户列表',
        gesturesEnabled: false,
        headerLeft: navigation.state.params && navigation.state.params.loadLeftTitle ? navigation.state.params.loadLeftTitle() : null,
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
    }

    needBack = (backFun) => {
        // 这里要处理保存操作
        if (backFun) {
            backFun(false);
        }
        this.resetTenant();
    }
    resetTenant = () => {
        API.setCurrentTenant(storage.loadLastTenant())
            .then((responseData) => {
                storage.pop(this.props.navigation, 1)
            });
    }
    loadLeftTitle = () => {
        return <LeftBarButtons top={false} needBack={this.needBack} navigation={this.props.navigation} currentItem={API.APP_EQUIPMENT} />
    }
    componentDidMount() {
        this.appearAfterMount && this.appear()
    }

    componentWillUnmount() {
        this.removeBackListener()
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
                    this.resetTenant();
                    return true
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
                storage.pushNext(navigator, "ProjectPage", { tenantId: item.value.tenantId, id: item.value.id })
            } else {
                storage.loadTenantInfo((retVal) => {
                    storage.saveTenantInfo(JSON.stringify(item));//保存当前的租户item信息
                    storage.saveTenantInfoRefresh('1');//设置刷新
                    this.props.navigation.pop("ChangeProjectPage");
                });

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
            <ScrollView >
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <Text style={{ color: "transparent", height: 30 }}> 租户列表 </Text>
                <AnimatedFlatList
                    data={this.state.dataArray}
                    renderItem={this.renderItemView}
                    ListEmptyComponent={this.createEmptyView}
                    getItemLayout={(data, index) => ({
                        length: 60, offset: (44 + 1) * index, index
                    })}
                />
            </ScrollView>
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
        marginLeft: 40,
        marginRight: 40,
        backgroundColor: '#FFF',
        elevation: 5, // android 
        shadowColor: "#333", // iOS
        shadowOffset: { width: 3, height: 7 }, // iOS
        shadowOpacity: 0.15, // iOS
        shadowRadius: 3, // iOS

    },
    title: {
        fontSize: 15,
        color: 'blue',
    },
    content: {
        left: 60,
        top: -20,
        fontSize: 15,
        color: 'black',
    },
    image: {
        left: 10,
        top: 10,
        width: 40,
        height: 40,
    }

});