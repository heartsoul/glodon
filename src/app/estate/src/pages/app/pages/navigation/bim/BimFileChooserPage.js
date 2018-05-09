/**
 * Created by Soul on 2018/03/16.
 */
'use strict';
import React, { Component, } from "react";
import {
    ActivityIndicator, Animated, FlatList,
    ScrollView, StyleSheet,
    Text, View, StatusBar, Image, TouchableOpacity, RefreshControl, Dimensions
} from "react-native";
import { StackNavigator, TabNavigator, TabBarBottom } from 'app-3rd/react-navigation'; // 1.0.0-beta.27

import ThumbnailImage from "./ThumbnailImage"
import * as PageType from "./PageTypes";
import * as API from "app-api";
import { LeftBarButtons } from "app-components"
import * as BimFileEntry from "./BimFileEntry";
import BimFileFilterView from "./BimFileFilterView";
import Breadcrumb from "./../../../components/Breadcrumb";

var { width, height } = Dimensions.get("window");
class RightBarButtons extends React.Component {
    _onSearchPress = (navigation) => {
        // console.log(navigation);
        // navigation.navigate("BimSearchPage")
        global.storage.pushNext(navigation, "BimSearchPage", { dataType: navigation.state.params.dataType, pageType: navigation.state.params.pageType });

    }
    render() {
        return <View style={{
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'flex-end',
            width: 70,
        }}>
            <TouchableOpacity onPress={() => this._onSearchPress(this.props.navigation)} >
                <Image style={styles.barItemImage} source={require('app-images/icon_search_white.png')} />
            </TouchableOpacity>
            <View style={styles.spliteItem} />
        </View>
    }
}
export default class BimFileChooser extends Component {

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        let dataType = params.dataType;
        let title = '图纸';
        let currentItem = API.APP_QUALITY_DRAWER;
        if (dataType === '图纸文件') {
            title = '图纸';
            currentItem = API.APP_QUALITY_DRAWER;
        } else {
            title = '模型';
            currentItem = API.APP_QUALITY_MODLE;
        }
        return {
            headerTitle: (<Text style={{ color: '#ffffff', fontSize: 17, marginTop: 5, alignSelf: "center", flex: 1, textAlign: "center" }}>{title}</Text>),
            headerRight: (<RightBarButtons navigation={navigation} />),
            headerLeft: (
                <LeftBarButtons top={navigation.getParam('top')} navigation={navigation} currentItem={currentItem} />
            ),
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
            projectId: storage.loadProject(),
            latestVersion: storage.projectIdVersionId,
            fileId: 0,
            dataType: "",//图纸文件 模型文件 
            pageType: PageType.PAGE_TYPE_NEW_QUALITY,
            navData: [],//导航条面包屑数据
        }
    }
    _keyExtractor = (item, index) => index;

    fetchData = (page) => {
        if (this.state.latestVersion === '') {
            API.getModelLatestVersion(storage.loadProject()).then((responseData) => {
                let latestVersion = responseData.data.data.versionId;
                storage.projectIdVersionId = latestVersion;
                this.setState({
                    latestVersion: latestVersion,
                });
                this.fetchDataInner(page, storage.loadProject(), latestVersion);
            });
        } else {
            this.fetchDataInner(page, storage.loadProject(), this.state.latestVersion);
        }

    }
    //网络请求
    fetchDataInner = (page, projectId, latestVersion) => {
        // 这个是js的访问网络的方法
        API.getModelBimFileChildren(projectId, latestVersion, page, this.state.fileId).then(
            (responseData) => {
                // console.log(responseData)
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

        let navData = params.navData ? params.navData : [];
        // console.log(params)
        this.setState({
            fileId: fileId,
            dataType: dataType,
            pageType: params.pageType,
            navData: navData,
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
            let navData = [];
            this.state.navData.forEach((child) => {
                navData.push(child);
            })
            navData.push(item.value);

            global.storage.pushNext(navigator, "BimFileChooserPage", { fileId: item.value.fileId, dataType: this.state.dataType, pageType: this.state.pageType, navData: navData });
        } else {
            API.getModelBimFileToken(this.state.projectId, this.state.latestVersion, item.value.fileId).then((responseData) => {
                let token = responseData.data.data;
                global.storage.bimToken = token;
                if (this.state.dataType === '图纸文件') {
                    BimFileEntry.showBlueprintFromChoose(navigator, this.state.pageType, item.value.fileId, item.value.name);
                } else {
                    BimFileEntry.showModelFromChoose(navigator, this.state.pageType, item.value.fileId, item.value.buildingId, item.value.buildingName)
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
        // console.log(this.state.refreshing);
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
    onFilterChange = (specialty, building) => {
        let specialtyCode = specialty ? specialty.Code : "";
        let buildingId = building ? building.id : 0;

        API.getModelBimFiles(storage.loadProject(), storage.projectIdVersionId, buildingId, specialtyCode)
            .then(responseData => {
                if (responseData) {
                    let list = responseData.data.data;
                    let dataBlob = [];
                    if (list.length > 0) {
                        list.forEach(item => {
                            item.name = item.fileName;
                            dataBlob.push({
                                key: "P0" + item.fileId,
                                value: item
                            });
                        })
                        this.setState({
                            dataArray: dataBlob,
                        });
                    }
                }


            }).catch(err => {
            });
    }
    /**
     * 模型图纸列表
     */
    renderList = () => {
        return (
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
        );
    }
    /**
     * 带导航的View
     */
    renderDataWithBreadcrumb = () => {
        return (
            <View>
                <Breadcrumb data={this.state.navData} onItemClick={(item, index) => {
                    let len = this.state.navData.length;
                    this.props.navigation.pop(len - index);
                }}></Breadcrumb>
                {
                    this.renderList()
                }
            </View>
        );
    }
    /**
     * 模型筛选的
     */
    renderDataWithFilter = () => {
        return (
            <BimFileFilterView
                onFilterChange={(specialty, building) => { this.onFilterChange(specialty, building) }}
            >
                {
                    this.renderList()
                }
            </BimFileFilterView>
        );
    }

    renderData = () => {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                {
                    (this.state.dataType === '模型文件' && this.state.fileId === 0) ? (
                        this.renderDataWithFilter()
                    ) : (
                            this.renderDataWithBreadcrumb()
                        )
                }

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
    },
    barItem: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        width: 70,
    },
    barItemImage: {
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },
    spliteItem: {
        width: 10,
    },
});