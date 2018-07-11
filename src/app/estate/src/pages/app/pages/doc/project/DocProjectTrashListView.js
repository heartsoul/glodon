/**
 * Created by Soul on 2018/03/16.
 */
'use strict';
import SERVICE from 'app-api/service';
import { BarItems, LoadingView, NoDataView, ActionModal} from "app-components";
import React, { Component } from "react";
import { FlatList, RefreshControl, StatusBar, StyleSheet, View} from "react-native";
import {Toast} from 'antd-mobile'
import DocView from './../components/DocView';
import DocActionSheet from './../components/DocActionSheet';


export default class extends Component {
   
    static navigationOptions = ({ navigation }) => {
        const { params={} } = navigation.state;
        const {renderTitle,renderLeft,renderRight} = params;
        return {
            headerTitle: renderTitle && renderTitle(),
            headerRight: renderRight && renderRight(),
            headerLeft: renderLeft && renderLeft(),
        }
    };
    
    constructor(props) {
        super(props);
        const {params={}} = this.props.navigation.state ;
        let fileId = params.fileId || 0;
        let dataType = params.dataType || '';
        let orderType = params.orderType || null;
        let userPrivilege = params.userPrivilege || {
            "enter": true,
            "view": true,
            "download": false,
            "create": false,
            "update": false,
            "delete": false,
            "grant": false
          };
        this.state = {
            isLoading: true,
            refreshing: false,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [],
            page: 0,
            isEdit:false,
            hasMore: true,
            orderType:orderType,
            projectId: storage.loadProject(),
            latestVersion: storage.projectIdVersionId,
            fileId: fileId,
            dataType: dataType,//图纸文件 模型文件 ·
            pageType: params.pageType,
            containerId:params.containerId || null,
            fileData:{fileId:fileId,userPrivilege: userPrivilege},
        }
        this.onSelectPage();
    }
    onSelectPage = (bInnerCall=true) => {
        this.props.navigation.setParams({ renderTitle: this.renderHeaderTitle, renderLeft: this.renderHeaderLeftButtons, renderRight: this.renderHeaderRightButtons });
        if(!bInnerCall) {
            this.fetchData(0);
        }
    }
    _onCancelEdit = () =>{
        this.state.selectedItems = [];
        this.state.isEdit = false;
        // this.forceUpdate();
        // this.onSelectPage(); // 更新标题 
    }
    _onSearchPress = () => {
        // 打开搜索页面。
    } 
    renderHeaderTitle = () => {
        const title = this.props.navigation.getParam('title');
        return <BarItems.TitleBarItem text={title ? title : '回收站'} />;
    }
    renderHeaderLeftButtons = () => {
        let power = true;
        return (<BarItems navigation={this.props.navigation}>
        <BarItems.LeftBarItem navigation={this.props.navigation} imageSource={require('app-images/icon_back_white.png')} onPress={(navigation) => {storage.pop(navigation,1);}} />
       {power ? <BarItems.LeftBarItem navigation={this.props.navigation} text="清空" onPress={(navigation) => this.onClear(navigation)} /> : null}
        </BarItems>);
    }
    renderHeaderRightButtons = () => {
       return (<BarItems navigation={this.props.navigation}>
        <BarItems.RightBarItem navigation={this.props.navigation} imageSource={require('app-images/icon_search_white.png')} onPress={(navigation,event,barItem) => this._onSearchPress(navigation,event,barItem)} />
        </BarItems>);
    }
   
    _keyExtractor = (item, index) => item.value.id+'-'+index;

    fetchData = (page) => {
        SERVICE.getDocContainer(storage.loadProject()).then((responseData) => {
            this.state.containerId = responseData.id;
            this.onSelectPage();
            this.fetchDataInner(page, this.state.containerId);
        })
        .catch((error) => {
            this.setState(
                {
                    isLoading: false,
                    error: true,
                    errorInfo: error,
                }
            );
        });

    }
    //网络请求
    fetchDataInner = (page, containerId) => {
        SERVICE.getTrashFiles(containerId, page).then((responseData) => {
           let dataList = responseData;
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
                    this.setState({
                        //复制数据源
                        dataArray: dataBlob,
                        isLoading: false,
                        refreshing: false,
                        page: page + 1,
                        hasMore: last ? false : true
                    });
                } else {
                    if(page < 1) {
                        this.setState({
                            dataArray: [],
                            isLoading: false,
                            refreshing: false,
                            page: 0,
                            hasMore: false
                        });
                    } else {
                        this.setState({
                            isLoading: false,
                            refreshing: false,
                        });
                    }
                    
                }
                dataBlob = null;
    }
    componentDidMount() {
        //请求数据
        // this.fetchData(0);
    }

    //加载失败view
    renderErrorView(error) {
        return ( <NoDataView text="加载失败" image={require('app-images/doc/icon_doc_empty_trash.png')} /> );
    }
    _itemClick = (item, index) => {
        return;
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

    /**
     * 清空回收站
     */
    onClear = () => {
        ActionModal.alertConfirm(`确定要清空回收站吗？`, '清空后将彻底删除，无法恢复！', {
            text: '清空', style: { color: 'red', fontSize: 18 }, onPress: () => {
                SERVICE.clearTrashFileBatch(this.state.containerId).then(() => {
                    this._onCancelEdit();
                    this.fetchData(0);
                    Toast.success('清空成功', 1.500);
                }).catch(err => {
                    Toast.fail('清空失败', 1.500);
                });
            }
        }, { text: '取消' });
    }

    /**
     * 彻底删除
     * items: 数据列表
     */
    doDestroy = (items) => {
        if (items.length < 1) {
            return;
        }

        ActionModal.alertConfirm(`确定要彻底删除吗？`, '彻底删除后将无法恢复！', {
            text: '删除', style: { color: 'red', fontSize: 18 }, onPress: () => {
                let fileIds = [];
                items.map((item) => {
                    fileIds.push(item.value.fileId);
                });
                SERVICE.deleteTrashFileBatch(this.state.containerId, fileIds).then(() => {
                    this._onCancelEdit();
                    this.fetchData(0);
                    Toast.success('删除成功', 1.500);
                }).catch(err => {
                    Toast.fail('删除失败', 1.500);
                });
            }
        }, { text: '取消' });

    }
    
     /**
     * 恢复已经删除内容
     * items: 数据列表
     */
    doRecovery = (items) => {
        if(items.length < 1) {
            return;
        }
        let fileIds = [];
        items.map((item)=>{
            fileIds.push(item.value.fileId);
        });
        SERVICE.recoveryTrashFileBatch(this.state.containerId,fileIds).then(()=>{
            this._onCancelEdit();
            this.fetchData(0);
            Toast.success('还原成功',1.500);
        }).catch(err=>{
            Toast.fail('还原失败',1.500);
        });
    }

    onMore = (item, index) => {
        // 处理权限
        const userPrivilege = this.state.fileData && this.state.fileData.userPrivilege || {};
        const { enter=false, view=false, download=false, create=false,delete:deleteItem=false, update=false,grant=false} = userPrivilege || {};
        let data =[];
        view && data.push(DocActionSheet.dataItemRestore);
        deleteItem && data.push(DocActionSheet.dataItemDestroy);
        
        if(data.length < 1) {
            return;
        }

        DocActionSheet.show(data,(actionItem)=>{
            if(actionItem.itemKey === 'recovery') {
                this.doRecovery([item]);
                return;
            }
            if(actionItem.itemKey === 'destroy') {
                this.doDestroy([item]);
                return;
            }
            alert(actionItem.itemKey); // 处理点击了哪个项目 因为项目数量不确定，就不能用索引来操作了，通过数据项目的可以来搞定就可以了。
        });
    }
    renderFileView = ({ item, index }) => {
        let onPress = () => {this._itemClick(item, index)};
        let onMore = ()=>{this.onMore(item, index)};
        let onSelect = (event,selected) => {this._itemSelected(selected,item, index)};
        let {selected = false} = item.value;
        if(this.state.isEdit) {
            onMore = null;
        } else {
            onSelect = null;
        }
        return (
            <DocView onMore={onMore} onSelect={onSelect} selected={selected}>
                <DocView.DocFileItemView key={index} onPress={onPress}
             content={item.value.name} time={item.value.createTimeShow} fileId={item.value.fileId} ext={item.value.name}/></DocView>
        );
    }

    renderFolderView = ({ item, index }) => {
        let onPress = () => {this._itemClick(item, index)};
        let onMore = ()=>{this.onMore(item, index)};
        let onSelect = (event,selected) => {this._itemSelected(selected,item, index)};
        let {selected = false} = item.value;
        if(this.state.isEdit) {
            onMore = null;
        } else {
            onSelect = null;
        }
        return (
            <DocView onMore={onMore} onSelect={onSelect} selected={selected}>
            <DocView.DocFolderItemView key={index} onPress={onPress}
            content={item.value.name} time={item.value.createTimeShow}/></DocView>
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
  
    renderFooterView = () => {
        return <View style={{height:50,width:'100%'}} />
    }
    renderEmptyView = () => {
        return <NoDataView text='暂无数据' image={require('app-images/doc/icon_doc_empty_trash.png')}/>
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
                ListFooterComponent={this.renderFooterView}
                ListEmptyComponent={this.renderEmptyView}
                onEndReached={this._onEndReached}
                onRefresh={this._onRefreshing}
                refreshing={this.state.refreshing}
                onEndReachedThreshold={0.1}
                keyExtractor={this._keyExtractor}
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