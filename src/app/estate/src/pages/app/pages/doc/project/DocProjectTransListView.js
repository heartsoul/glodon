/**
 * Created by Soul on 2018/03/16.
 */
'use strict';
import SERVICE from 'app-api/service';
import { BarItems, LoadingView, NoDataView, ShareManager } from "app-components";
import React, { Component } from "react";
import { FlatList, RefreshControl, StatusBar, StyleSheet, View, Platform,TouchableOpacity,Text } from "react-native";
import { Menu,TabView } from 'app-3rd/teaset';
import { SERVER_TYPE } from "common-module"
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
    onSelectPage = () => {
        this.props.navigation.setParams({ renderTitle: this.renderHeaderTitle, renderLeft: this.renderHeaderLeftButtons, renderRight: this.renderHeaderRightButtons });
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
    _onMorePress = (navigation, event, barItem) => {
        // 菜单

        let fromView = barItem;

        fromView.measureInWindow((x, y, width, height) => {
            let showMenu = null;
            let items = [
                { title: <Text>更多...</Text>, onPress:()=>{}},
                { title: <View><TouchableOpacity onPress={()=>{Menu.hide(showMenu);this._changeOrderType('time');}}><Text style={{lineHeight:30,color:this.state.orderType !== 'time' ? '#000000' : '#00baf3'}}>文件时间</Text></TouchableOpacity><TouchableOpacity  onPress={()=>{Menu.hide(showMenu);this._changeOrderType('name');}} style={{}}><Text style={{lineHeight:30,color:this.state.orderType !== 'name' ? '#000000' : '#00baf3'}}>文件名称</Text></TouchableOpacity></View>}
            ];
            
            showMenu = Menu.show({ x, y, width, height }, items,{align:'end',showArrow:true,shadow:Platform.OS === 'ios' ? true : false,popoverStyle:[{paddingLeft:10,paddingRight:10}],directionInsets:0,alignInsets:-5,paddingCorner:10});
        });
    }
    
    renderHeaderTitle = () => {
        const title = this.props.navigation.getParam('title');
        return <BarItems.TitleBarItem text={title ? title : '传输列表'} />;
    }
    renderHeaderLeftButtons = () => {
        let power = false;
        return (<BarItems navigation={this.props.navigation}>
        <BarItems.LeftBarItem navigation={this.props.navigation} imageSource={require('app-images/icon_back_white.png')} onPress={(navigation) => {storage.pop(navigation,1);}} />
       {power ? <BarItems.LeftBarItem navigation={this.props.navigation} imageSource={require('app-images/icon_module_create_white.png')} onPress={(navigation) => this.onAdd(navigation)} /> : null}
        </BarItems>);
    }
    renderHeaderRightButtons = () => {
       return (<BarItems navigation={this.props.navigation}>
        <BarItems.RightBarItem navigation={this.props.navigation} textStyle={{fontSize:22,height:30,}} text="..." onPress={(navigation,event,barItem) => this._onMorePress(navigation,event,barItem)} />
        </BarItems>);
    }
   
    _keyExtractor = (item, index) => index;

    fetchData = (page) => {
        this.fetchDataInner(0, this.state.containerId);      
    }
    //网络请求
    fetchDataInner = (page, containerId) => {   
        this._handleData([],page);     
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
        this.fetchData(0);
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
            storage.pushNext(navigator, "DocProjectPage", { fileId: item.value.fileId, containerId:this.state.containerId,orderType:this.state.orderType,userPrivilege:this.state.fileData.userPrivilege, dataType: this.state.dataType, pageType: this.state.pageType });
        } else {
            if(this.state.isEdit) {
                // 这里需要处理编辑状态，
                return;
            }
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
            view && data.push(DocActionSheet.dataItemFavorite);
            create && data.push(DocActionSheet.dataItemRename);
        } else {
            download && data.push(DocActionSheet.dataItemDownload);
            view && data.push(DocActionSheet.dataItemShare); // 目录暂时不支持分享
            deleteItem && data.push(DocActionSheet.dataItemDelete);
            create && data.push(DocActionSheet.dataItemCopyto);
            deleteItem && data.push(DocActionSheet.dataItemMoveto);
            view && data.push(DocActionSheet.dataItemFavorite);
            create && data.push(DocActionSheet.dataItemRename);
        }
       
        // ShareManager.share(this.state.containerId, item.value.fileId);
        if(data.length < 1) {
            return;
        }
        DocActionSheet.show(data,(actionItem)=>{
            if(actionItem.itemKey === 'share') {
                ShareManager.share(this.state.containerId, item.value.fileId);
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
            onPress = null;
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
        return <NoDataView text="暂无数据传输" image={NoDataView.NoDataImage} />
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