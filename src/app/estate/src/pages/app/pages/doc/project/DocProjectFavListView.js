/**
 * Created by Soul on 2018/03/16.
 */
'use strict';
import SERVICE from 'app-api/service';
import { BarItems, LoadingView, NoDataView, ShareManager } from "app-components";
import React, { Component } from "react";
import { FlatList, RefreshControl, StatusBar, StyleSheet, View, Platform,TouchableOpacity,Text } from "react-native";
import { TabView } from 'app-3rd/teaset';
import {Toast} from 'antd-mobile'
import DocView from './../components/DocView';
import DocActionSheet from './../components/DocActionSheet';
import DocEditFileDataList from './../components/DocEditFileDataList';

export default class extends DocEditFileDataList {

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
            selectedItems:[],
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
    renderToolbar = ()=> {
        if(!this.state.isEdit) {
            return null;
        }
       return( <TabView style={{ height:49,bottom:0,right:0,left:0, overflow: 'visible',position:'absolute' }}>
        <TabView.Sheet
            title={'下载'}
            type='button'
            icon={require('app-images/doc/icon_doc_bar_download.png')}
            activeIcon={require('app-images/doc/icon_doc_bar_download_click.png')}
            onPress={(event) => { event.preventDefault(); this.doDownload(this.state.selectedItems)}}
        >
        </TabView.Sheet>
        <TabView.Sheet
            title={'分享'}
            type='button'
            icon={require('app-images/doc/icon_doc_bar_share.png')}
            activeIcon={require('app-images/doc/icon_doc_bar_share_click.png')}
            onPress={(event) => { event.preventDefault(); this.doShare(this.state.selectedItems)}}
        >
        </TabView.Sheet>

        <TabView.Sheet
            title={'取消收藏'}
            type='button'
            icon={require('app-images/doc/icon_doc_bar_fav.png')}
            activeIcon={require('app-images/doc/icon_doc_bar_fav_click.png')}
            onPress={(event) => { event.preventDefault(); this.doFavoriteCancel(this.state.selectedItems)}}
        >
        </TabView.Sheet>
    </TabView>);
    }
    onSelectPage = (bInnerCall=true) => {
        this.props.navigation.setParams({ renderTitle: this.renderHeaderTitle, renderLeft: this.renderHeaderLeftButtons, renderRight: this.renderHeaderRightButtons });
        if(!bInnerCall) {
            this.fetchData(0);
        }
    }
    _onSearchPress = () => {
        // 打开搜索页面。
    }
    _changeOrderType = (type) => {
        if(this.state.orderType === type) {
            return;
        }
        this.state.orderType = type;
        this.fetchData(0);
    } 
    _itemSelected = (selected, item, index) => {
        item.value.selected = !selected;
        
        this.state.selectedItems = this.state.dataArray.filter(function (element, index, self) {
            return element.value.selected === true;
        });
        this.setState({dataArray:this.state.dataArray});
        this.onSelectPage(); // 更新标题 
    }
    _onEditModePress = () => {
        // 打开搜索页面。
        this.state.isEdit=true;
        this.onSelectPage();
        this.forceUpdate();
    }
    _onMorePress = (navigation, event, barItem) => {
        this._onEditModePress();
    }

    _onCancelEdit = () =>{
        this.state.selectedItems = [];
        this.state.isEdit = false;
        this.forceUpdate();
        this.onSelectPage(); // 更新标题 
    }

    renderHeaderTitle = () => {
        if(this.state.isEdit) {
            let title = '请选择文件';
            if(this.state.selectedItems.length > 0) {
                title = `选中${this.state.selectedItems.length}项`;
            }
            return <BarItems.TitleBarItem text={title ? title : '项目文档'} />;
        }
        const title = this.props.navigation.getParam('title');
        return <BarItems.TitleBarItem text={title ? title : '收藏列表'} />;
    }
    renderHeaderLeftButtons = () => {
        if(this.state.isEdit) {
            return (<BarItems navigation={this.props.navigation}>
                        <BarItems.LeftBarItem navigation={this.props.navigation} text="全选" onPress={(navigation) => this.onSelectAll(navigation)} />
                </BarItems>);
        }
        let power = false;
        return (<BarItems navigation={this.props.navigation}>
        <BarItems.LeftBarItem navigation={this.props.navigation} imageSource={require('app-images/icon_back_white.png')} onPress={(navigation) => {storage.pop(navigation,1);}} />
       {power ? <BarItems.LeftBarItem navigation={this.props.navigation} imageSource={require('app-images/icon_module_create_white.png')} onPress={(navigation) => this.onAdd(navigation)} /> : null}
        </BarItems>);
    }
    renderHeaderRightButtons = () => {
        if(this.state.isEdit) {
            return (<BarItems navigation={this.props.navigation}>
                <BarItems.RightBarItem navigation={this.props.navigation} text="取消" onPress={(navigation,event) => this._onCancelEdit(navigation,event)} />
                </BarItems>);
        } else {
       return (<BarItems navigation={this.props.navigation}>
        <BarItems.RightBarItem navigation={this.props.navigation} imageSource={require('app-images/icon_search_white.png')} onPress={(navigation,event,barItem) => this._onSearchPress(navigation,event,barItem)} />
        <BarItems.RightBarItem navigation={this.props.navigation} text="选择" onPress={(navigation,event,barItem) => this._onMorePress(navigation,event,barItem)} />
        </BarItems>);
        }
    }
   
    _keyExtractor = (item, index) => item.value.id+'-'+index;

    fetchData = (page) => {
        SERVICE.getDocContainer(storage.loadProject()).then((responseData) => {
            this.state.containerId = responseData.id;
            this.onSelectPage();
            this.fetchDataInner(page, this.state.containerId, this.state.fileData, this.state.orderType);
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
    fetchDataInner = (page, containerId, fileData, orderType = null) => {
        SERVICE.getFavoritesDocFile(containerId).then((responseData) => {
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
                    // dataBlob = this.sortData(dataBlob);
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
        // this.fetchData(0);
    }

    //加载失败view
    renderErrorView(error) {
        return ( <NoDataView text="加载失败" image={require('app-images/doc/icon_doc_empty_fav.png')}/> );
    }
    _itemClick = (item, index) => {
        
        if(this.state.isEdit) {
            // 这里需要处理编辑状态，
            this._itemSelected(item.value.selected,item,index);
            return;
        }
        let navigator = this.props.navigation;
        if (item.value.folder === true) {
            storage.pushNext(navigator, "DocProjectFileListView", {isEdit:this.state.isEdit,selectedItems:this.state.selectedItems, title:item.value.name, fileId: item.value.fileId, containerId:this.state.containerId,orderType:this.state.orderType,userPrivilege:this.state.fileData.userPrivilege, dataType: this.state.dataType, pageType: this.state.pageType });
        } else {
            alert('处理打开文件');
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
    onAdd = () => {
        const userPrivilege = this.state.fileData && this.state.fileData.userPrivilege || {};
        const { create=false} = userPrivilege || {};
        let data =[];
        create && data.push(DocActionSheet.dataItemNewfolder);
        create && data.push(DocActionSheet.dataItemTakephoto);
        create && data.push(DocActionSheet.dataItemImage);
        create && data.push(DocActionSheet.dataItemVideo);

        if(Platform.OS != 'ios') {
            // ios平台不支持这种方式
            create && data.push(DocActionSheet.dataItemAll);
        } 
        if(data.length < 1) {
            return;
        }
        DocActionSheet.show(data,(actionItem)=>{
            alert(actionItem.itemKey); // 处理点击了哪个项目 因为项目数量不确定，就不能用索引来操作了，通过数据项目的可以来搞定就可以了。
        });
    }
    onMore = (item, index) => {
        // 处理权限
        const {folder,} = item.value;
        const userPrivilege = this.state.fileData && this.state.fileData.userPrivilege || {};
        const { enter=false, view=false, download=false, create=false,delete:deleteItem=false, update=false,grant=false} = userPrivilege || {};
        let data =[];
        if(folder) {
            download && data.push(DocActionSheet.dataItemDownload);
            deleteItem && data.push(DocActionSheet.dataItemDelete);
            create && data.push(DocActionSheet.dataItemCopyto);
            deleteItem && data.push(DocActionSheet.dataItemMoveto);
            view && data.push(DocActionSheet.dataItemFavoriteCancel);
            create && data.push(DocActionSheet.dataItemRename);
        } else {
            download && data.push(DocActionSheet.dataItemDownload);
            view && data.push(DocActionSheet.dataItemShare); // 目录暂时不支持分享
            deleteItem && data.push(DocActionSheet.dataItemDelete);
            create && data.push(DocActionSheet.dataItemCopyto);
            deleteItem && data.push(DocActionSheet.dataItemMoveto);
            view && data.push(DocActionSheet.dataItemFavoriteCancel);
            create && data.push(DocActionSheet.dataItemRename);
        }
       
        // ShareManager.share(this.state.containerId, item.value.fileId);
        if(data.length < 1) {
            return;
        }
        DocActionSheet.show(data,(actionItem)=>{
            if(actionItem.itemKey === 'share') {
                this.doShare([item]);
               
                return;
            }
            if(actionItem.itemKey === 'copyto') {
                this.doCopyto([item]);
                return;
            }
            if(actionItem.itemKey === 'moveto') {
                this.doMoveto([item]);
                return;
            }
            if(actionItem.itemKey === 'favorite-cancel') {
                this.doFavoriteCancel([item]);
                return;
            }
            if(actionItem.itemKey === 'download') {
                this.doDownload([item]);
                return;
            }
            alert(actionItem.itemKey); // 处理点击了哪个项目 因为项目数量不确定，就不能用索引来操作了，通过数据项目的可以来搞定就可以了。
        });
    }

    doShare = (items) => {
        if(items.length !== 1) {
            alert('暂不支持批量分享');
            return;
        }
        ShareManager.share(this.state.containerId, items[0].value.fileId); 
    }
    doDownload = (items) => {
        
    }
    doMoveto = (items) => {
        if(items.length < 1) {
            return;
        }
        let fileIds = [];
        items.map((item)=>{
            fileIds.push(item.value.fileId);
        });
        SERVICE.moveDocFileBatch(this.state.containerId,fileIds).then(()=>{
            alert('ok');
        }).catch(err=>{
            alert('failed');
        });
    }
    doCopyto = (items) => {
        if(items.length < 1) {
            return;
        }
        let fileIds = [];
        items.map((item)=>{
            fileIds.push(item.value.fileId);
        });
        SERVICE.copyDocFileBatch(this.state.containerId,fileIds).then(()=>{
            alert('ok');
        }).catch(err=>{
            alert('failed');
        });
    }
    doFavoriteCancel = (items) => {
        
        if(items.length < 1) {
            return;
        }
        let fileIds = [];
        items.map((item)=>{
            fileIds.push(item.value.fileId);
        });
        SERVICE.cancelFavoritesDocFileBatch(this.state.containerId,fileIds).then(()=>{
            alert('ok');
            this._onCancelEdit();
            this.fetchData(0);
        }).catch(err=>{
            alert('failed');
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
        return <NoDataView image={require('app-images/doc/icon_doc_empty_fav.png')} text='暂无数据' />
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