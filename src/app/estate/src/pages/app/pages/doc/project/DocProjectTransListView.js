/**
 * Created by Soul on 2018/03/16.
 */
'use strict';
import SERVICE from 'app-api/service';
import API from 'app-api';
import { BarItems, LoadingView, NoDataView, StatusActionButton } from "app-components";
import React, { Component } from "react";
import { SectionList, StatusBar, StyleSheet, View, Platform,TouchableOpacity,Text } from "react-native";
import DocTaskItemView from './../components/DocTaskItemView';

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
    _onMorePress = (navigation, event, barItem) => {
        // // 菜单

        // let fromView = barItem;

        // fromView.measureInWindow((x, y, width, height) => {
        //     let showMenu = null;
        //     let items = [
        //         { title: <Text>更多...</Text>, onPress:()=>{}},
        //         { title: <View><TouchableOpacity onPress={()=>{Menu.hide(showMenu);this._changeOrderType('time');}}><Text style={{lineHeight:30,color:this.state.orderType !== 'time' ? '#000000' : '#00baf3'}}>文件时间</Text></TouchableOpacity><TouchableOpacity  onPress={()=>{Menu.hide(showMenu);this._changeOrderType('name');}} style={{}}><Text style={{lineHeight:30,color:this.state.orderType !== 'name' ? '#000000' : '#00baf3'}}>文件名称</Text></TouchableOpacity></View>}
        //     ];
            
        //     showMenu = Menu.show({ x, y, width, height }, items,{align:'end',showArrow:true,shadow:Platform.OS === 'ios' ? true : false,popoverStyle:[{paddingLeft:10,paddingRight:10}],directionInsets:0,alignInsets:-5,paddingCorner:10});
        // });
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
   
    _keyExtractor = (item, index) => {return item.value.randomKey+'-'+index};

    fetchData = (page) => {
        this.fetchDataInner(0, this.state.containerId);      
    }
    //网络请求
    fetchDataInner = (page, containerId) => {   
        let taskItems = SERVICE.FileTask.loadTaskList() || [];
        this._handleData(taskItems,page);     
    }

    _handleData=(taskItems,page)=>{
        let dataRunning = [];
        let dataLogging = [];
        let i = 0;
        taskItems.forEach(item => {
            item.showTime = "" + API.formatUnixtimestamp(item.updateTime);
            item.index = i;
            
            dataRunning.push({
                key: "" + item.randomKey,
                value: item,
                type:'task',
            });
            dataLogging.push({
                key: "" + item.randomKey,
                value: item,
                type:'log',
            });
            i++;
        });
        this.setState({
            //复制数据源
            dataArray: [{type:'task',key:'进行中 ',data:dataRunning},{type:'log',key:'已完成 ',data:dataLogging}],
            isLoading: false,
            refreshing: false,
            page: 0,
            hasMore: false
        });    
        i = null;
        dataLogging = null;
        dataRunning = null;
    }

    componentDidMount() {
        //请求数据
        this.fetchData(0);
    }

    //加载失败view
    renderErrorView(error) {
        return ( <NoDataView text="加载失败" image={require('app-images/doc/icon_doc_empty_trans.png')} /> );
    }
    _itemClick = (item, index) => {
        // let navigator = this.props.navigation;
        // if (item.value.folder === true) {
        //     storage.pushNext(navigator, "DocProjectPage", { fileId: item.value.fileId, containerId:this.state.containerId,orderType:this.state.orderType,userPrivilege:this.state.fileData.userPrivilege, dataType: this.state.dataType, pageType: this.state.pageType });
        // } else {
        //     if(this.state.isEdit) {
        //         // 这里需要处理编辑状态，
        //         return;
        //     }
        //     alert('处理打开文件');
        //     // if (this.state.dataType === '图纸文件') {
        //     //     BimFileEntry.showBlueprintFromChoose(navigator, this.state.pageType, item.value.fileId, item.value.name);
        //     // } else {
        //     //     BimFileEntry.showModelFromChoose(navigator, this.state.pageType, item.value.fileId, item.value.buildingId, item.value.buildingName)
        //     // }
        //     // 进入预览页面

        // }
    }
    onMore = (item, index) => {
        let taskItem = item.value;
        SERVICE.FileTask.changeState(taskItem);
        this.fetchData(0);
    }
    onRunningAll = (bRun) => {
        if(bRun) {
            SERVICE.FileTask.stopTask(); 
        } else {
            SERVICE.FileTask.runTaskAll(); 
        }
        this.fetchData(0);
    }
    onClearAllLoging = () => {
        // SERVICE.FileTask.clearAll(SERVICE.TAKS_ITEM_STATUS.finished); 
        SERVICE.FileTask.clearAll(null); 
        // SERVICE.FileTask.clearAll(SERVICE.TAKS_ITEM_STATUS.failed); 
        this.fetchData(0);
    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#ededed',marginRight:20}} />;
    }

    //返回itemView
    renderItemView = ({ item, index }) => {
        if (item.type == 'task') {
            return this.renderTaskItemView({ item, index });
        } else {
            return this.renderLogItemView({ item, index });
        }
    }
    renderTaskItemView = ({ item, index }) => {
        let onPress = () => {this._itemClick(item, index)};
        let onMore = ()=>{this.onMore(item, index)};
        return (
            <DocTaskItemView onMore={onMore} data={item.value}>
                <DocTaskItemView.DocTaskRunningItemView key={index} onPress={onPress}
             content={item.value.name} time={item.value.size} fileId={item.value.fileId} ext={item.value.name}/>
             </DocTaskItemView>
        );
    }

    renderLogItemView = ({ item, index }) => {
        let onPress = () => {this._itemClick(item, index)};
        return (
            <DocTaskItemView>
            <DocTaskItemView.DocTaskLoggingItemView key={index} onPress={onPress}
            content={item.value.name} time={item.value.size} ext={item.value.name}/></DocTaskItemView>
        );
    }

    renderFooterView = () => {
        return <View style={{height:50,width:'100%'}} />
    }
    renderEmptyView = () => {
        return <NoDataView image={require('app-images/doc/icon_doc_empty_trans.png')} text="暂无数据传输"/>
    }
    renderSectionHeaderTasking = (info) => {
        let txt = `${info.section.key} (${info.section.data.length})`;
        let isRun = SERVICE.FileTask.isRunning();
        return <View style={{flexDirection:'row',height:44, alignItems:'center',paddingLeft:10,paddingRight:14}}>
        <Text style={{flex:1}}>{txt}</Text>
        <StatusActionButton textStyle={{fontSize:14}} text={isRun?"全部暂停":"全部开始"} color='#FFFFFF' style={{width:90,borderRadius:14,height:28,backgroundColor:isRun?'#F56323':'#31C2F3'}} onClick={(event) => { event && event.preventDefault && event.preventDefault(); this.onRunningAll(isRun);}}/>
        </View>
    }
    renderSectionHeaderLog = (info) => {
        let txt = `${info.section.key} (${info.section.data.length})`;
        return <View style={{flexDirection:'row',height:44,alignItems:'center',paddingLeft:10,paddingRight:14}}>
        <Text style={{flex:1}}>{txt}</Text>
        <StatusActionButton textStyle={{fontSize:14}} text="全部清空" color='#FFFFFF' style={{width:90,borderRadius:14,height:28,backgroundColor:'#31C2F3'}} onClick={(event) => { event && event.preventDefault && event.preventDefault(); this.onClearAllLoging();}}/>
        </View>
    }
    renderSectionHeader = (info) => {
        var type = info.section.type;
        if(type == 'task') {
            return this.renderSectionHeaderTasking(info);
        }
        return this.renderSectionHeaderLog(info);
    }
    /**
     * 列表
     */
    renderList = () => {
        return (
            <SectionList style={{backgroundColor:'rgba(0,0,0,0.1)'}}
                sections={this.state.dataArray}
                renderItem={this.renderItemView}
                keyExtractor={this._keyExtractor}
                renderSectionHeader={this.renderSectionHeader}
                stickySectionHeadersEnabled={false}
                ListFooterComponent={this.renderFooterView}
                ListEmptyComponent={this.renderEmptyView}
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