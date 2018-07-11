/**
 * Created by Soul on 2018/03/16.
 */
'use strict';
import SERVICE from 'app-api/service';
import { BarItems, LoadingView, NoDataView, ShareManager, ActionModal, ActionInputModal,StatusActionButton } from "app-components";
import React, { Component } from "react";
import {Image, FlatList, RefreshControl, StatusBar, StyleSheet, View, Platform,TouchableOpacity,Text } from "react-native";
import { Menu, TabView} from 'app-3rd/teaset';
import {Toast} from 'antd-mobile'
import DocView from './../components/DocView';
import DocActionSheet from './../components/DocActionSheet';
import DocOrderMenuView,{OrderDirectionDefault,OrderTypeDefault} from './../components/DocOrderMenuView';
import DocEditFileDataList from './../components/DocEditFileDataList';
var newFolderIndex = 1;
export default class extends Component {
   
    static navigationOptions = ({ navigation }) => {
        const { params={} } = navigation.state ;
        const {renderTitle,renderLeft,renderRight} = params;
        const renderNavTitle = ()=>{
            if(renderTitle) {
                return renderTitle();
            }
            const title = navigation.getParam('title');
            return <BarItems.TitleBarItem text={title ? title : '项目文档'} />;        
        }
        const renderNavRight= ()=>{
            if(renderRight) {
                return renderRight();
            }
            return (<BarItems.RightBarItem navigation={navigation} textStyle={{fontSize:22,height:30,}} text="..." onPress={() => {}} />);     
        }
        
        return {
            headerTitle: renderNavTitle(),
            headerRight: renderNavRight(),
            headerLeft: renderLeft && renderLeft(),
        }
    };
    
    constructor(props) {
        super(props);
        const {params={}} = this.props.navigation.state ;
        let fileId = params.fileId || 0;
        let rootFileId = params.rootFileId || 0;
        let dataType = params.dataType || '';
        let isEdit = params.isEdit || false;
        let isCopyItem = params.isCopyItem || false;
        let isMoveItem = params.isMoveItem || false;
        let deep = params.deep || 1;
        let fromDeep = params.fromDeep || 1;
        let orderType = params.orderType || OrderTypeDefault;
        let orderDirection = params.orderDirection || OrderDirectionDefault;
        let selectedItems = params.selectedItems || [];
        let fromNavigation = params.fromNavigation || null;
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
            isCopyItem:isCopyItem,
            isMoveItem:isMoveItem,
            rootFileId:rootFileId,
            deep:deep,
            fromDeep:fromDeep,
            fromNavigation:fromNavigation,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [],
            page: 0,
            isEdit:isEdit,
            hasMore: true,
            orderType:orderType,
            orderDirection:orderDirection,
            projectId: storage.loadProject(),
            latestVersion: storage.projectIdVersionId,
            fileId: fileId,
            dataType: dataType,//图纸文件 模型文件 ·
            pageType: params.pageType,
            containerId:params.containerId || null,
            fileData:{fileId:fileId,userPrivilege: userPrivilege},
            selectedItems:selectedItems,
        }
        this.onSelectPage();
    }

    componentDidMount = () => {
        this.fetchData(0);
        // this.props.navigation.addListener(
        //     'didFocus',
        //     payload => {
        //         const {params={}} = this.props.navigation.state ;
        //     // if((params.isCopyItem || params.isEdit || params.isMoveItem) != (this.state.isCopyItem || this.state.isEdit || this.state.isMoveItem)) {
        //         console.log('>>>>>>>>sdfsd.>>>>ds');
        //         this.onSelectPage();
        //     // }
    
        //     }
        // );
    }
    
    renderToolbar = () => {
        if (this.state.isEdit) {
            // 编辑状态
            return (<TabView style={{ height: 49, bottom: 0, right: 0, left: 0, overflow: 'visible', position: 'absolute' }}>
                <TabView.Sheet
                    title={'下载'}
                    type='button'
                    icon={require('app-images/doc/icon_doc_bar_download.png')}
                    activeIcon={require('app-images/doc/icon_doc_bar_download_click.png')}
                    onPress={(event) => { event.preventDefault(); this.doDownload(this.state.selectedItems) }}
                >
                </TabView.Sheet>
                <TabView.Sheet
                    title={'分享'}
                    type='button'
                    icon={require('app-images/doc/icon_doc_bar_share.png')}
                    activeIcon={require('app-images/doc/icon_doc_bar_share_click.png')}
                    onPress={(event) => { event.preventDefault(); this.doShare(this.state.selectedItems) }}
                >
                </TabView.Sheet>

                <TabView.Sheet
                    title={'删除'}
                    type='button'
                    icon={require('app-images/doc/icon_doc_bar_delete.png')}
                    activeIcon={require('app-images/doc/icon_doc_bar_delete_click.png')}
                    onPress={(event) => { event.preventDefault(); this.doDelete(this.state.selectedItems) }}
                >
                </TabView.Sheet>
                <TabView.Sheet
                    type='button'
                    icon={require('app-images/doc/icon_doc_bar_more.png')}
                    activeIcon={require('app-images/doc/icon_doc_bar_more_click.png')}
                    onPress={(event) => { event.preventDefault(); this.onMoreEdit() }}
                // badge={'new'}
                >
                </TabView.Sheet>
            </TabView>);
        }
        // 复制
        if (this.state.isCopyItem) {
            // 复制状态
            return (<View style={{flexDirection:'row',borderTopColor:'#E6E6E6',borderTopWidth:1, height: 49, bottom: 0, right: 0, left: 0, overflow: 'visible', position: 'absolute' }}>
                <StatusActionButton textStyle={{fontSize:15}} text="取消" color='#666666' style={{width:'50%',height:'100%',backgroundColor:'#FFFFFF'}} onClick={(event) => { event && event.preventDefault && event.preventDefault(); this.onCancelCopyOrMove();}}/>
                <StatusActionButton textStyle={{fontSize:15}} text="复制到此处" color='#FFFFFF' style={{width:'50%',height:'100%',backgroundColor:'#00baf3'}} onClick={(event) => { event && event.preventDefault && event.preventDefault(); this.copyto(this.state.selectedItems);}}/>
            </View>);
        }
        // 移动
        if (this.state.isMoveItem) {
            // 移动状态
            return (<View style={{flexDirection:'row',borderTopColor:'#E6E6E6',borderTopWidth:1, height: 49, bottom: 0, right: 0, left: 0, overflow: 'visible', position: 'absolute' }}>
                <StatusActionButton textStyle={{fontSize:15}} text="取消" color='#666666' style={{width:'50%',height:'100%',backgroundColor:'#FFFFFF'}} onClick={(event) => { event && event.preventDefault && event.preventDefault(); this.onCancelCopyOrMove();}}/>
                <StatusActionButton textStyle={{fontSize:15}} text="移动到此处" color='#FFFFFF' style={{width:'50%',height:'100%',backgroundColor:'#00baf3'}} onClick={(event) => { event && event.preventDefault && event.preventDefault(); this.moveto(this.state.selectedItems);}}/>
            </View>);
        }
        return null;
    }
    onCancelCopyOrMove = () => {
        storage.pop(this.props.navigation, this.state.deep - this.state.fromDeep);
    }
    onSelectPage = (bInnerCall=true) =>{
        this.props.navigation.setParams({isMoveItem:this.state.isMoveItem, isCopyItem:this.state.isCopyItem, isEdit:this.state.isEdit,renderTitle: this.renderHeaderTitle, renderLeft: this.renderHeaderLeftButtons, renderRight:this.renderHeaderRightButtons })
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
    _onEditModePress = () => {
        // 打开搜索页面。
        this.state.isEdit=true;
        this.onSelectPage();
        this.forceUpdate();
    }
    _onMorePress = (navigation, event, barItem) => {
        // 菜单
        let fromView = barItem;
        fromView.measureInWindow((x, y, width, height) => {
            let showMenu = null;
            let items = [
                { icon: <Text style={{ color: '#FFFFFF' }}>选择...</Text>, onPress: this._onEditModePress },
                { icon: <DocOrderMenuView orderType={this.state.orderType} orderDirection={this.state.orderDirection} onChangeOrderType={(event,orderType)=>{Menu.hide(showMenu);this._changeOrderType(orderType)}} />}
            ];

            showMenu = Menu.show({ x, y, width, height }, items, { align: 'end', showArrow: true, shadow: Platform.OS === 'ios' ? true : false, popoverStyle: [{ paddingLeft: 0, paddingRight: 0 }], directionInsets: 0, alignInsets: -5, paddingCorner: 10 });
        });
    }
    renderHeaderTitle = () => {
        if(this.state.isEdit) {
            let title = '请选择文件';
            if(this.state.selectedItems.length > 0) {
                title = `选中${this.state.selectedItems.length}项`;
            }
            return <BarItems.TitleBarItem text={title ? title : '项目文档'} />;
        }
        if(this.state.isCopyItem) {
            const title = '选择复制位置';
            return <BarItems.TitleBarItem text={title ? title : '项目文档'} />;
        }
        if(this.state.isMoveItem) {
            const title = '选择移动位置';
            return <BarItems.TitleBarItem text={title ? title : '项目文档'} />;
        }
        const title = this.props.navigation.getParam('title');
        
        return <BarItems.TitleBarItem text={title ? title : '项目文档'} />;
    }

    _itemSelected = (selected, item, index) => {
        if(!this.state.isEdit) {
            return;
        }
        item.value.selected = !selected;
        
        this.state.selectedItems = this.state.dataArray.filter(function (element, index, self) {
            return element.value.selected === true;
        });
        this.setState({dataArray:this.state.dataArray});
        this.onSelectPage(); // 更新标题 
    }
    onSelectAll = () =>{
        if(!this.state.isEdit) {
            return;
        }
        let ret = [];
        this.state.dataArray.map((item)=>{
            item.value.selected = true;
        });

        this.state.selectedItems = this.state.dataArray;
        this.setState({dataArray:this.state.dataArray}); 
        this.onSelectPage(); // 更新标题 
    }
    updateView = (params) => {
        this.setState({...params},()=>{
            this.onSelectPage(); // 更新标题 
        });

    }
    _goBack = (navigation) => {
        this.state.fromNavigation && this.state.fromNavigation.updateView && this.state.fromNavigation.updateView({isCopyItem:this.state.isCopyItem,isMoveItem:this.state.isMoveItem,isEdit:this.state.isEdit});
        storage.goBack(navigation);
    }
    renderHeaderLeftButtons = () => {
        if(this.state.isEdit) {
            return (<BarItems navigation={this.props.navigation}>
                        <BarItems.LeftBarItem navigation={this.props.navigation} text="全选" onPress={(navigation) => this.onSelectAll(navigation)} />
                </BarItems>);
        }
        let power = (this.state.fileData && this.state.fileData.userPrivilege && this.state.fileData.userPrivilege.create&& (this.state.fileData.userPrivilege.create == true));
        if(this.state.isCopyItem || this.state.isMoveItem) {
            return (<BarItems navigation={this.props.navigation}>
                <BarItems.LeftBarItem navigation={this.props.navigation} imageSource={require('app-images/icon_back_white.png')} onPress={(navigation) => {this._goBack(navigation)}} />
               {power ? <BarItems.LeftBarItem navigation={this.props.navigation} imageSource={require('app-images/icon_module_create_white.png')} onPress={(navigation) => this.doNewFolder({value:{name:null}})} /> : null}
                </BarItems>);
        } else {
            
            return (<BarItems navigation={this.props.navigation}>
            <BarItems.LeftBarItem navigation={this.props.navigation} imageSource={require('app-images/icon_back_white.png')} onPress={(navigation) => {this._goBack(navigation)}} />
           {power ? <BarItems.LeftBarItem navigation={this.props.navigation} imageSource={require('app-images/icon_module_create_white.png')} onPress={(navigation) => this.onAdd(navigation)} /> : null}
            </BarItems>);
        }
       
    }

    _onCancelEdit = () =>{
        this.state.selectedItems = [];
        this.state.isEdit = false;
        this.state.isCopyItem = false;
        this.state.isMoveItem = false;
        this.forceUpdate();
        this.onSelectPage(); // 更新标题 
    }

    renderHeaderRightButtons = () => {
        if (this.state.isEdit) {
            return (<BarItems navigation={this.props.navigation}>
                <BarItems.RightBarItem navigation={this.props.navigation} text="取消" onPress={(navigation,event) => this._onCancelEdit(navigation,event)} />
                </BarItems>);
        } else if (this.state.isCopyItem || this.state.isMoveItem) {
            return (<BarItems navigation={this.props.navigation}>
                <BarItems.RightBarItem navigation={this.props.navigation} imageSource={require('app-images/icon_search_white.png')}  onPress={(navigation,event,barItem) => this._onSearchPress(navigation,event,barItem)} />
                </BarItems>);
        } else {
            return (<BarItems navigation={this.props.navigation}>
            <BarItems.RightBarItem navigation={this.props.navigation} imageSource={require('app-images/icon_search_white.png')}  onPress={(navigation,event,barItem) => this._onSearchPress(navigation,event,barItem)} />
                <BarItems.RightBarItem navigation={this.props.navigation} imageSource={require('app-images/doc/icon_doc_more_white.png')} onPress={(navigation,event,barItem) => this._onMorePress(navigation,event,barItem)} />
                </BarItems>);        
        }
       
    }
   
    _keyExtractor = (item, index) => item.value.id+'-'+index;

    fetchData = (page) => {
        if (this.state.fileId === '0' || this.state.fileId === 0 ) {
            console.log(SERVICE.getDocContainer);
            SERVICE.getDocContainer(storage.loadProject()).then((responseData) => {
                this.state.containerId = responseData.id;
                SERVICE.getDocRootDir(storage.loadProject()).then((responseData) => {
                    this.state.fileData = responseData;
                    this.state.fileId = this.state.fileData.fileId;
                    this.state.rootFileId = this.state.fileId;
                    this.props.navigation.setParams({ renderTitle: this.renderHeaderTitle, renderLeft: this.renderHeaderLeftButtons, renderRight:this.renderHeaderRightButtons });
                    this.fetchDataInner(page, this.state.containerId, this.state.fileData, this.state.orderType);
                });
            })
            // .catch((error) => {
            //     this.setState(
            //         {
            //             isLoading: false,
            //             error: true,
            //             errorInfo: error,
            //         }
            //     );
            // });
        } else {
            this.fetchDataInner(page, this.state.containerId, this.state.fileData, this.state.orderType);
        }

    }
    //网络请求
    fetchDataInner = (page, containerId, fileData, orderType = null) => {
        SERVICE.getDocFileChildrens(containerId, fileData.fileId, orderType).then((responseData) => {
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

    // componentDidMount() {
    //     //请求数据
    //     this.fetchData(0);
    // }

    //加载失败view
    renderErrorView(error) {
        return ( <NoDataView text="加载失败" image={require('app-images/doc/icon_doc_empty_doc.png')} /> );
    }
    _itemClick = (item, index) => {
        if(this.state.isEdit) {
            // 这里需要处理编辑状态，
            this._itemSelected(item.value.selected,item,index);
            return;
        }
        let navigator = this.props.navigation;
        if(this.state.isCopyItem || this.state.isMoveItem) {
            if (item.value.folder === true) {
                // const title = navigator.getParam('title');
                this.openChoose(item.value.name, item.value.fileId, item.value.userPrivilege, this.state.isEdit, this.state.selectedItems, this.state.isMoveItem, this.state.isCopyItem,this.state.fromDeep,this);
            } else {
                // alert('处理打开文件');
                // if (this.state.dataType === '图纸文件') {
                //     BimFileEntry.showBlueprintFromChoose(navigator, this.state.pageType, item.value.fileId, item.value.name);
                // } else {
                //     BimFileEntry.showModelFromChoose(navigator, this.state.pageType, item.value.fileId, item.value.buildingId, item.value.buildingName)
                // }
                // 进入预览页面
    
            }
            return;
        }
        if (item.value.folder === true) {
            this.openChoose(item.value.name, item.value.fileId, item.value.userPrivilege, this.state.isEdit, this.state.selectedItems, this.state.isMoveItem, this.state.isCopyItem,this.state.deep,null);
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
        DocActionSheet.showAdd(data,(actionItem)=>{
            if(actionItem.itemKey == 'newfolder') {
                this.doNewFolder({value:{name:null}});
                return;
            }
            
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
            if(actionItem.itemKey === 'favorite') {
                this.doFavorite([item]);
                return;
            }
            if(actionItem.itemKey === 'download') {
                this.doDownload([item]);
                return;
            }
            if(actionItem.itemKey === 'rename') {
                this.doRename(item);
                return;
            }
            if(actionItem.itemKey === 'delete') {
                this.doDelete([item]);
                return;
            }
            alert(actionItem.itemKey); // 处理点击了哪个项目 因为项目数量不确定，就不能用索引来操作了，通过数据项目的可以来搞定就可以了。
        });
    }
// actions

    /**
     * 工具条上的更多，点击打开无法显示开的功能项目
     *
     */
    onMoreEdit = () => {
        // 处理权限
        const userPrivilege = this.state.fileData && this.state.fileData.userPrivilege || {};
        const { enter=false, view=false, download=false, create=false,delete:deleteItem=false, update=false,grant=false} = userPrivilege || {};
        let data =[];
        create && data.push(DocActionSheet.dataItemCopyto);
        deleteItem && data.push(DocActionSheet.dataItemMoveto);
        view && data.push(DocActionSheet.dataItemFavorite);
        if(data.length < 1) {
            return;
        }
        DocActionSheet.show(data,(actionItem)=>{
            if(actionItem.itemKey === 'copyto') {
                this.doCopyto(this.state.selectedItems);
                return;
            }
            if(actionItem.itemKey === 'moveto') {
                this.doMoveto(this.state.selectedItems);
                return;
            }
            if(actionItem.itemKey === 'favorite') {
                this.doFavorite(this.state.selectedItems);
                return;
            }
            alert(actionItem.itemKey); // 处理点击了哪个项目 因为项目数量不确定，就不能用索引来操作了，通过数据项目的可以来搞定就可以了。
        });
    }

    /**
     * 分享数据
     * items: 数据列表
     */
    doShare = (items) => {
        if(items.length !== 1) {
            alert('暂不支持批量分享');
            return;
        }
        ShareManager.share(this.state.containerId, items[0].value.fileId); 
    }

    /**
     * 删除数据
     * items: 数据列表
     */
    doDelete = (items) => {
        const userPrivilege = this.state.fileData && this.state.fileData.userPrivilege || {};
        const { enter=false, view=false, download=false, create=false,delete:deleteItem=false, update=false,grant=false} = userPrivilege || {};
        if(!deleteItem) {
            Toast.fail("没有权限", 1.500);
            return;
        }
        if(items.length < 1) {
            return;
        }
        ActionModal.alertConfirm(`确定要删除所选的${items.length}项内容吗？`,'您可以在回收站找到误删的文件', {text:'删除',style:{color:'red',fontSize:18},onPress:()=>{
            let fileIds = [];
            items.map((item)=>{
                fileIds.push(item.value.fileId);
            });
            SERVICE.deleteDocFileBatch(this.state.containerId,fileIds).then(()=>{
                Toast.success('删除成功',1.500);
                this._onCancelEdit();
                this.fetchData(0);
            }).catch(err=>{
                alert('failed');
            });
        }}, {text:'取消'});
    }


    /**
     * 下载数据
     * items: 数据列表
     */
    doDownload = (items) => {
        const userPrivilege = this.state.fileData && this.state.fileData.userPrivilege || {};
        const { enter=false, view=false, download=false, create=false,delete:deleteItem=false, update=false,grant=false} = userPrivilege || {};
        if(!download) {
            Toast.fail("没有权限", 1.500);
            return;
        }
    }


    /**
     * 移动数据
     * items: 数据列表
     */
    moveto = (items) => {
        const userPrivilege = this.state.fileData && this.state.fileData.userPrivilege || {};
        const { enter=false, view=false, download=false, create=false,delete:deleteItem=false, update=false,grant=false} = userPrivilege || {};
        if(!create) {
            Toast.fail("没有权限", 1.500);
            return;
        }
        if(items.length < 1) {
            return;
        }
        let fileIds = [];
        items.map((item)=>{
            fileIds.push(item.value.fileId);
        });
        SERVICE.moveDocFileBatch(this.state.containerId,fileIds,this.state.fileId).then(()=>{
            Toast.success('移动成功',1.500);
            this._onCancelEdit();
            this.fetchData(0);
            const timer = setTimeout(() => {
                clearTimeout(timer);
                storage.resetActions(this.props.navigation,{isCopyItem:false,isEdit:false,isMoveItem:false},2, this.state.fromDeep);
            }, 1000);
        }).catch(err=>{
            alert('failed');
        });
    }


    /**
     * 复制数据
     * items: 数据列表
     */
    copyto = (items) => {
        const userPrivilege = this.state.fileData && this.state.fileData.userPrivilege || {};
        const { enter=false, view=false, download=false, create=false,delete:deleteItem=false, update=false,grant=false} = userPrivilege || {};
        if(!create) {
            Toast.fail("没有权限", 1.500);
            return;
        }
        if(items.length < 1) {
            return;
        }
        let fileIds = [];
        items.map((item)=>{
            fileIds.push(item.value.fileId);
        });
        SERVICE.copyDocFileBatch(this.state.containerId,fileIds,this.state.fileId).then(()=>{
            Toast.success('复制成功',1.500);
            this._onCancelEdit();
            this.fetchData(0);
            const timer = setTimeout(() => {
                clearTimeout(timer);
                storage.resetActions(this.props.navigation,{isCopyItem:false,isEdit:false,isMoveItem:false},2, this.state.fromDeep);
            }, 1000);
        }).catch(err=>{
            alert('failed');
        });
    }

    openChoose = (title, rootFileId, userPrivilege,isEdit = false,selectedItems = [], isMoveItem = false, isCopyItem = false,fromDeep=0,fromNavigation=null) =>{
        storage.pushNext(this.props.navigation, "DocProjectFileListView", 
        {
            fromDeep:fromDeep,
            rootFileId:this.state.rootFileId,
            deep:this.state.deep+1,
            parentNavigation:this.props.navigation,
            fromNavigation: fromNavigation || this.state.fromNavigation,
            isCopyItem:isCopyItem,
            isMoveItem:isMoveItem,
            orderDirection:this.state.orderDirection,
            orderType:this.state.orderType,
            isEdit:isEdit,
            selectedItems:selectedItems,
             title:title, 
             fileId: rootFileId, 
             containerId:this.state.containerId,
             userPrivilege:userPrivilege })
    }
    /**
     * 移动数据
     * items: 数据列表
     */
    doMoveto = (items) => {
        const userPrivilege = this.state.fileData && this.state.fileData.userPrivilege || {};
        const { enter=false, view=false, download=false, create=false,delete:deleteItem=false, update=false,grant=false} = userPrivilege || {};
        if(!deleteItem) {
            Toast.fail("没有权限", 1.500);
            return;
        }
        if(items.length < 1) {
            return;
        }
        this.openChoose('选择移动位置', 0, null, false, items, true, false, this.state.deep,this.props.navigation);
    }


    /**
     * 复制数据
     * items: 数据列表
     */
    doCopyto = (items) => {
        if(items.length < 1) {
            return;
        }
        this.openChoose('选择复制位置', 0, null, false, items, false, true, this.state.deep,this.props.navigation);
   
    }

    /**
     * 收藏数据
     * items: 数据列表
     */
    doFavorite = (items) => {
        if(items.length < 1) {
            return;
        }
        let fileIds = [];
        items.map((item)=>{
            fileIds.push(item.value.fileId);
        });
        SERVICE.favoritesDocFileBatch(this.state.containerId,fileIds).then(()=>{
            this._onCancelEdit();
            this.fetchData(0);
            Toast.success('收藏成功',1.500);
        }).catch(err=>{
            alert('failed');
        });
    }

    /**
     * 显示重命名对话框
     *
     */
    doRename = (item,errorMessage='') => {
        const userPrivilege = this.state.fileData && this.state.fileData.userPrivilege || {};
        const { enter=false, view=false, download=false, create=false,delete:deleteItem=false, update=false,grant=false} = userPrivilege || {};
        if(!create) {
            Toast.fail("没有权限", 1.500);
            return;
        }
       // 显示重命名对话框
       ActionInputModal.showConfirm('重命名',null,{},{onPress:(e,textValue)=>{
        item.value.name = textValue;
        this.rename(item);}
    },item.value.name,errorMessage);
    }

    /**
     * 修改名称
     *
     */
    rename = (item) => {
        SERVICE.renameDocFile(this.state.containerId,item.value.fileId,item.value.name).then(()=>{
            Toast.success('重命名成功',1.5);
            this._onCancelEdit();
            this.fetchData(0);
        }).catch(err=>{
            let msg = '重命名失败!';
            if(err.response) {
                let ret = err.response.json();
                if(ret) {
                    ret.then(data=>{
                        if(data && data.code && data.message){
                            msg = data.message;
                        }
                        this.doRename(item,msg);
                    });
                } else {
                    this.doRename(item,msg);
                }
            } else {
                this.doRename(item,msg);
            }
        });
    }
     /**
     * 显示新建文件夹对话框
     *
     */
    doNewFolder = (item,errorMessage='') => {
        const userPrivilege = this.state.fileData && this.state.fileData.userPrivilege || {};
        const { enter=false, view=false, download=false, create=false,delete:deleteItem=false, update=false,grant=false} = userPrivilege || {};
        if(!create) {
            Toast.fail("没有权限", 1.500);
            return;
        }
        let newName = item.value.name || `新建文件夹${newFolderIndex}`;
        // 显示新建文件夹对话框
        ActionInputModal.showConfirm('新建文件夹',null,{},{onPress:(e,textValue)=>{
            item.value.name = textValue;
            this.newFolder(item);}
        },newName,errorMessage);
    }

    /**
     * 新建文件夹
     *
     */
    newFolder = (item) => {
        SERVICE.createDocDir(this.state.containerId,this.state.fileId,item.value.name).then(()=>{
            Toast.success('创建成功',1.500);
            newFolderIndex++;
            this.fetchData(0);
        }).catch(err=>{
            let msg = '创建失败!';
            if(err.docError) {
                msg = err.docError.message;
            }
            this.doNewFolder(item,msg);
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
            if(this.state.isCopyItem || this.setState.isMoveItem) {
                onMore = null;
            }
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
            if(this.state.isCopyItem || this.setState.isMoveItem) {
                onMore = null;
            }
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
        }, 1.500);
    }
    renderFooterView = () => {
        return <View style={{height:50,width:'100%'}} />
    }
    renderEmptyView = () => {
        return <NoDataView image={require('app-images/doc/icon_doc_empty_doc.png')} text='暂无数据' />
    }
    /**
     * 列表
     */
    renderList = () => {
        return (
            <FlatList
                data={this.state.dataArray}
                renderItem={this.renderItemView}
                ListFooterComponent={this.renderFooterView}
                ListEmptyComponent={this.renderEmptyView}
                ItemSeparatorComponent={this._separator}
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
                {this.props.isRoot === true ? null : this.renderToolbar(true)}
            </View>
        );
    }
    componentWillUnmount = () => {
        console.log('DocProjectFileListView componentWillUnmount');
    }
    render = () => {
        console.log('DocProjectFileListView render');
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