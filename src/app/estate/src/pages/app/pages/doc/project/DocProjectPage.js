/**
 * Created by Soul on 2018/03/16.
 */
'use strict';
import API from 'app-api';
import { BarItems, LoadingView } from "app-components";
import React, { Component } from "react";
import { Dimensions, FlatList, Image, RefreshControl, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ThumbnailImage from "./../../navigation/bim/ThumbnailImage";
import { NoDataView, ShareManager} from 'app-components';
import { SERVER_TYPE } from 'common-module';
import DocView from './../components/DocView'

var { width, height } = Dimensions.get("window");

export default class DocProjectPage extends Component {

    static navigationOptions = ({ navigation }) => {
        const { params={} } = navigation.state;
        const {renderTitle,renderLeft,renderRight} = params;
        return {
            headerTitle: renderTitle,
            headerRight: renderRight,
            headerLeft: renderLeft,
        }
    };
    
    constructor(props) {
        super(props);
        const {params={}} = this.props.navigation.state ;
        let fileId = params.fileId || 0;
        let dataType = params.dataType || '';

        let navData = params.navData || [];

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
            fileId: fileId,
            dataType: dataType,//图纸文件 模型文件 ·
            pageType: params.pageType,
            containerId:params.containerId || null,
            fileData:{fileId:fileId,"userPrivilege": {
                "enter": true,
                "view": true,
                "download": false,
                "create": false,
                "update": false,
                "delete": false,
                "grant": false
              }},
        }
        this.props.navigation.setParams({ renderTitle: this.renderHeaderTitle, renderLeft: this.renderHeaderLeftButtons, renderRight:this.renderHeaderRightButtons })
    }
    _onSearchPress = () => {
        // 打开搜索页面。
    }
    renderHeaderTitle = () => {
        const title = this.props.navigation.getParam('title');
        return <BarItems.TitleBarItem text={title ? title : '项目文档'} />;
    }
    renderHeaderLeftButtons = () => {
        return (<BarItems navigation={this.props.navigation}>
        <BarItems.LeftBarItem navigation={this.props.navigation} imageSource={require('app-images/icon_back_white.png')} onPress={(navigation) => {storage.pop(navigation,1);}} />
        <BarItems.LeftBarItem navigation={this.props.navigation} imageSource={require('app-images/icon_search_white.png')} onPress={(navigation) => this._onSearchPress(navigation)} />
        </BarItems>);
    }
    renderHeaderRightButtons = () => {
       return (<BarItems navigation={this.props.navigation}>
        <BarItems.RightBarItem navigation={this.props.navigation} imageSource={require('app-images/icon_search_white.png')} onPress={(navigation) => this._onSearchPress(navigation)} />
        </BarItems>);
    }
   
    _keyExtractor = (item, index) => index;

    fetchData = (page) => {
        if (this.state.fileId === '0' || this.state.fileId === 0 ) {
    
            API.getDocContainer(storage.loadProject()).then((responseData) => {
                this.state.containerId = responseData.data.id;
                API.getDocRootDir(storage.loadProject()).then((responseData) => {
                    this.state.fileData = responseData.data;
                    this.fetchDataInner(page, storage.loadProject(), this.state.containerId, this.state.fileData);
                });
            }).catch((error) => {
                this.setState(
                    {
                        isLoading: false,
                        error: true,
                        errorInfo: error,
                    }
                );
            });
        } else {
            this.fetchDataInner(page, storage.loadProject(), this.state.containerId, this.state.fileData);
        }

    }
    //网络请求
    fetchDataInner = (page, projectId, containerId, fileData) => {
        API.getDocFileChildrens(containerId, fileData.fileId, 'time').then((responseData) => {
           let dataList = responseData.data;
            this._handleData(dataList,page);
            }
        ).catch((error) => {
            this.setState(
                {
                    isLoading: false,
                    error: true,
                    errorInfo: error,
                }
            );
        });
    }

    _handleData=(data,page)=>{
        // data = this.filterData(data);

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

                // data = null;
                dataBlob = null;
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
        //请求数据
        this.fetchData(1);
    }

    //加载失败view
    renderErrorView(error) {
        if(SERVER_TYPE === "TEST") {
            return ( <NoDataView text={"error："+error} /> );
        }
        return ( <NoDataView text="加载失败" /> );
    }
    _itemClick = (item, index) => {
        let navigator = this.props.navigation;
        if (item.value.folder === true) {
            storage.pushNext(navigator, "DocProjectPage", { fileId: item.value.fileId, containerId:this.state.containerId, dataType: this.state.dataType, pageType: this.state.pageType });
        } else {
            // if (this.state.dataType === '图纸文件') {
            //     BimFileEntry.showBlueprintFromChoose(navigator, this.state.pageType, item.value.fileId, item.value.name);
            // } else {
            //     BimFileEntry.showModelFromChoose(navigator, this.state.pageType, item.value.fileId, item.value.buildingId, item.value.buildingName)
            // }
            // 进入预览页面

        }
    }

    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#ededed',marginRight:20}} />;
    }

    //返回itemView
    renderItemView = ({ item, index }) => {
        if (item.value.folder) {
            return this.renderFolderView({ item, index });
        } else {
            return this.renderFileView({ item, index });
        }
    }
    onMore = (item, index) =>{
        ShareManager.share(this.state.containerId, item.value.fileId);
    }
    renderFileView = ({ item, index }) => {
        return (
            <DocView onMore={()=>this.onMore(item,index)}>
            <DocView.DocFileItemView key={index} onPress={(event) =>{event.preventDefault(); this._itemClick(item, index)}}
             content={item.value.name} time={item.value.createTime} fileId={item.value.fileId} ext={item.value.name}/></DocView>
        );
    }

    renderFolderView = ({ item, index }) => {
        // console.log('-------------renderFolder-----------')
        // console.log(item)
        return (
            <DocView>
            <DocView.DocFolderItemView key={index} onPress={(event) =>{event.preventDefault(); this._itemClick(item, index)}}
            content={item.value.name} time={item.value.createTime}/></DocView>
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
  
    /**
     * 列表
     */
    renderList = () => {
        return (
            <FlatList
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

   

    renderData = () => {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                {this.renderList()}
            </View>
        );
    }

    render = () => {
        //第一次加载等待的view
        if (this.state.isLoading && !this.state.error) {
            return (<LoadingView />);
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
        // flex: 1,
        height: 52,
        marginLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    containerFileView: {
        // flex: 1,
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
});