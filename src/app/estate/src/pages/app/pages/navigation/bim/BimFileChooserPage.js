/**
 * Created by Soul on 2018/03/16.
 */
'use strict';
import React, { Component, } from "react";
import {
    ActivityIndicator, Animated, FlatList, SectionList,
    ScrollView, StyleSheet,
    Text, View, StatusBar, Image, TouchableOpacity, RefreshControl, Dimensions
} from "react-native";
import { StackNavigator, TabNavigator, TabBarBottom } from 'app-3rd/react-navigation'; // 1.0.0-beta.27

import ThumbnailImage from "./ThumbnailImage"
import * as PageType from "./PageTypes";
import * as MODELAPI from "app-api";
var { width, height } = Dimensions.get("window");
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default class BimFileChooser extends Component {

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        let dataType = params.dataType;
        let title = '图纸';
        if (dataType === '图纸文件') {
            title = '图纸';
        } else {
            title = '模型';
        }
        return {
            title: title,
            tabBarVisible: false,
            headerTintColor: "#FFF",
            headerStyle: { backgroundColor: "#00baf3" },
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            refreshing: false,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [],
            page: 0,
            hasMore: true,
            projectId: global.storage.projectId,
            latestVersion: global.storage.projectIdVersionId,
            fileId: 0,
            dataType: "",//图纸文件 模型文件 
            pageType: PageType.PAGE_TYPE_NEW_QUALITY,
        }
    }
    _keyExtractor = (item, index) => index;

    fetchData = (page) => {
        if (this.state.projectId === 0 || this.state.latestVersion === '') {
            global.storage.loadProject((projectId) => {
                global.storage.projectId = projectId;
                // 这个是js的访问网络的方法
                MODELAPI.getModelLatestVersion(projectId).then((responseData) => {
                    let latestVersion = responseData.data.data.versionId;
                    global.storage.projectIdVersionId = latestVersion;
                    console.log(responseData)
                    this.setState({
                        projectId: projectId,
                        latestVersion: latestVersion,
                    });
                    this.fetchDataInner(page, projectId, latestVersion);
                });
            });
        } else {
            this.fetchDataInner(page, this.state.projectId, this.state.latestVersion);
        }

    }
    //网络请求
    fetchDataInner = (page, projectId, latestVersion) => {
        // 这个是js的访问网络的方法
        MODELAPI.getModelBimFileChildren(projectId, latestVersion, page, this.state.fileId).then(
            (responseData) => {
                console.log(responseData)
                let data = responseData.data.data.items;
                data = this.filterData(data);

                let last = false;

                let dataBlob = [];
                if (data.length > 0) {
                    if (page > 0) {
                        dataBlob = this.state.dataArray;
                    }
                    let i = 0;
                    data.forEach(item => {
                        dataBlob.push({
                            key: "P0" + item.fileId,
                            value: item,
                        })
                        i++;
                    });
                    dataBlob = this.sortData(dataBlob);
                    // alert(2);
                    this.setState({
                        //复制数据源
                        dataArray: dataBlob,
                        isLoading: false,
                        refreshing: false,
                        page: page + 1,
                        hasMore: last ? false : true
                    });
                } else {
                    // alert(3);
                    this.setState({
                        isLoading: false,
                        refreshing: false,
                    });
                }

                data = null;
                dataBlob = null;
            }
        );
    }
    //过滤模型和图纸
    filterData = (data) => {
        console.log('---------------')
        console.log(this.state.fileId)
        console.log(this.state.dataType)
        if ((!this.state.fileId || this.state.fileId == 0) && data.length > 0 && this.state.dataType) {
            //根据dataType过滤 图纸和模型
            let filterData = data.filter((item) => {
                return item.name === this.state.dataType;
            });
            return filterData;
        }
        return data;
    }
    //文件夹在上面
    sortData = (data) => {
        return data.sort((item1, item2) => {
            if (item1.value.folder) {
                return -1;
            } else if (item2.value.folder) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    componentDidMount() {
        //上一个页面传来的参数

        let params = this.props.navigation.state.params;
        let fileId = params.fileId;
        let dataType = params.dataType;
        let saveKey = params.saveKey;
        console.log('fileId --------------------------- ' + fileId)
        if ((!fileId || fileId == 0) && saveKey != 0) {//保存目录的初始key
            console.log('save nav key ---------------------------')
            global.storage.qualityState.navKey = this.props.navigation.state.key;
        }

        console.log(params)
        this.setState({
            fileId: fileId,
            dataType: dataType,
            pageType: params.pageType,
        }, () => {
            //请求数据
            this.fetchData(1);
        });

    }

    //加载等待的view
    renderLoadingView() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <ActivityIndicator
                    animating={true}
                    style={[styles.gray, { height: 80 }]}
                    color='red'
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
                    Fail: {error}
                </Text>
            </View>
        );
    }
    _itemClick = (item, index) => {
        let navigator = this.props.navigation;
        if (item.value.folder === true) {
            global.storage.pushNext(navigator, "BimFileChooserPage", { fileId: item.value.fileId, dataType: this.state.dataType, pageType: this.state.pageType });
        } else {
            MODELAPI.getModelBimFileToken(this.state.projectId, this.state.latestVersion, item.value.fileId).then((responseData) => {
                let token = responseData.data.data;
                global.storage.bimToken = token;
                if (this.state.dataType === '图纸文件') {
                    global.storage.pushNext(navigator, "RelevantBlueprintPage", { title: item.value.name, fileId: item.value.fileId, pageType: this.state.pageType });
                } else {
                    global.storage.pushNext(navigator, "RelevantModlePage", { title: item.value.name, fileId: item.value.fileId, pageType: this.state.pageType });
                }
            });

        }

    }


    _separator = () => {
        return <View style={{ height: 0.5, backgroundColor: '#CCCCCC', marginLeft: 20 }} />;
    }

    //返回itemView
    renderItemView = ({ item, index }) => {
        if (item.value.folder) {
            return this.renderFolderView({ item, index });
        } else {
            return this.renderFileView({ item, index });
        }
    }

    renderFileView = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} activeOpacity={0.5} onPress={() => this._itemClick(item, index)}>
                <View style={styles.containerFileView}>
                    <ThumbnailImage fileId={item.value.fileId} />
                    <Text style={styles.content}> {item.value.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    renderFolderView = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} activeOpacity={0.5} onPress={() => this._itemClick(item, index)}>
                <View style={styles.containerFolderView}>
                    <Image
                        source={require("app-images/icon_blueprint_file.png")}
                        style={styles.image} />
                    <Text style={styles.content}> {item.value.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    _onEndReached = () => {
    }
    _onRefreshing = () => {
        console.log(this.state.refreshing);
        if (this.state.refreshing) {
            return;
        }
        //设置刷新状态为正在刷新
        this.setState({
            refreshing: true,
            page: 0,
        });
        //延时加载
        const timer = setTimeout(() => {
            clearTimeout(timer);
            this.fetchData(this.state.page);
        }, 1500);
    }
    renderData = () => {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <FlatList style={{ width: width }}
                    data={this.state.dataArray}
                    renderItem={this.renderItemView}
                    ItemSeparatorComponent={this._separator}
                    onEndReached={this._onEndReached}
                    onRefresh={this._onRefreshing}
                    refreshing={this.state.refreshing}
                    onEndReachedThreshold={0.1}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                        />
                    }
                />
            </View>
        );
    }

    render = () => {
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
        backgroundColor: '#FFFFFF',
    },
    containerFolderView: {
        flex: 1,
        height: 52,
        marginLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    containerFileView: {
        flex: 1,
        height: 72,
        marginLeft: 20,
        flexDirection: 'row',
        alignItems: 'center'
        // backgroundColor: '#FFF',
    },
    title: {
        fontSize: 15,
        color: 'blue',
    },
    content: {
        left: 0,
        top: 15,
        marginLeft: 12,
        textAlign: "left",
        fontSize: 15,
        color: 'black',
        alignSelf: 'flex-start'
    },

    image: {
        width: 30,
        height: 25,
    }

});