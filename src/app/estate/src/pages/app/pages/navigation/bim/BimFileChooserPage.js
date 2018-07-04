/**
 * Created by Soul on 2018/03/16.
 */
'use strict';
import API from 'app-api';
import { BarItems, LoadingView } from "app-components";
import React, { Component } from "react";
import { Dimensions, FlatList, Image, RefreshControl, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Breadcrumb from "./../../../components/Breadcrumb";
import * as BimFileEntry from "./BimFileEntry";
import BimFileFilterView from "./BimFileFilterView";
import ThumbnailImage from "./ThumbnailImage";
import { NoDataView} from 'app-components';
import { SERVER_TYPE } from 'common-module';
import {DeviceEventEmitter} from 'app-3rd/index';
import OfflineManager from '../../../../offline/manager/OfflineManager';
import {CircleProgressBar} from 'app-components';
import BimFileChooserPageUtil from './BimFileChooserPageUtil';
import OfflineStateUtil from "../../../../../common/utils/OfflineStateUtil";
import DownloadModel from "../../../../offline/model/DownloadModel"
import { NotWifiOverLay } from 'app-components';

var { width, height } = Dimensions.get("window");
let modelList= null;//模型列表
let blueprintList = null;//图纸列表
let isDownloadPage = false;//是否是模型下载页面
let downloadedPage = false;//模型已下载页面
let selectedArr = [];//选中的item的数组
class RightBarButtons extends React.Component {
    _onSearchPress = (navigation) => {
        global.storage.pushNext(navigation, "BimSearchPage", { dataType: navigation.state.params.dataType, pageType: navigation.state.params.pageType });

    }
    render() {
        return (
            <BarItems navigation={this.props.navigation}>
                <BarItems.RightBarItem navigation={this.props.navigation} imageSource={require('app-images/icon_search_white.png')} onPress={(navigation) => this._onSearchPress(navigation)} />
            </BarItems>)
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
            headerTitle: (<BarItems.TitleBarItem text={title ? title : ''} />),
            headerRight: (<RightBarButtons navigation={navigation} />),
            headerLeft: (
                <BarItems top={navigation.getParam('top')} navigation={navigation} currentItem={currentItem} />
            ),
        }
    };


    constructor(props) {
        super(props);
        let params = this.props.navigation.state.params;
        let fileId = params.fileId || 0;
        let dataType = params.dataType || '';
        isDownloadPage = params.isDownloadPage;
        downloadedPage = params.downloadedPage;
        let navData = params.navData ? params.navData : [];

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
            navData: navData,//导航条面包屑数据
        }

        //本地数据库获取所有的模型和图纸列表
        // let bm = OfflineManager.getBasicInfoManager();
        // modelList = bm.getModelList();
        // console.log('-----------modellist--------------')
        // console.log(modelList);
        // blueprintList = bm.getBlueprintList();
        // console.log('------------blueprintlist-------------')
        // console.log(blueprintList);
        // this.state.dataType=='图纸文件'?blueprintList = bm.getBlueprintList():modelList = bm.getModelList();

    }

    //根据父id查询数据
    _filterByFileId=(id,list)=>{
        if(list && list.length>0){
            let parentId = id==0?'0':id;
            let data = list.filter((item) => {
                return item.parentId === parentId;
            });
            return data;
        }
        return [];
    }
    //根据专业查询数据
    _filterBySpecial=(specialtyCode,list)=>{
        if(specialtyCode=='all'){
            return list;
        }
        if(list && list.length>0){
            let data = list.filter((item) => {
                return item.specialtyCode === specialtyCode;
            });
            return data;
        }
        return [];
    }
    //根据单体查询数据
    _filterByBuilding=(buildingId,list)=>{
        if(buildingId==0){
            return list;
        }
        if(list && list.length>0){
            let data = list.filter((item) => {
                return item.buildingId === buildingId;
            });
            return data;
        }
        return [];
    }

    _keyExtractor = (item, index) => index;

    fetchData = (page) => {
        if (this.state.latestVersion === '') {
            API.getModelLatestVersion(storage.loadProject()).then((responseData) => {
                let latestVersion = responseData.data.data.versionId;
                storage.projectIdVersionId = latestVersion;
                storage.setLatestVersionId(storage.loadProject(),latestVersion);
                this.setState({
                    latestVersion: latestVersion,
                });
                this.fetchDataInner(page, storage.loadProject(), latestVersion);
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
            this.fetchDataInner(page, storage.loadProject(), this.state.latestVersion);
        }

    }
    //网络请求
    fetchDataInner = (page, projectId, latestVersion) => {
        
        if(downloadedPage){
            let mm = OfflineManager.getModelManager();
            modelList = mm.getDownloadedModelList();
            console.log('------------------000000000000000000000'+page)
            console.log(modelList)
            this._handleList(page,modelList);

        }else if(OfflineStateUtil.isOnLine()){
            if(this.state.dataType=='图纸文件'){
                BimFileChooserPageUtil.downloadBluePrint(projectId, latestVersion, (list)=>{
                    blueprintList = list;
                    this._handleList(page,list);
                })
            }else{

                BimFileChooserPageUtil.downloadModel(projectId, latestVersion, (list)=>{
                    modelList = list;
                    let bm = OfflineManager.getBasicInfoManager();
                    bm.setModelList(modelList);//获取到模型列表后存储到本地数据库
                    let mm = OfflineManager.getModelManager();
                    mm.createOfflineZips(list);//调用生成离线包
                    this._handleList(page,list);
                })
            }
        }else{
            let bm = OfflineManager.getBasicInfoManager();
            this.state.dataType=='图纸文件'?blueprintList = bm.getBlueprintList():modelList = bm.getModelList();
            let list = this.state.dataType=='图纸文件'?blueprintList:modelList;
            this._handleList(page,list);
        }
        
        
    }

    _handleList =(page,list)=>{
        console.log('fileId='+this.state.fileId)
        let dataList = this._filterByFileId(this.state.fileId,list);
        console.log(dataList)
        this._handleData(dataList,page);
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
                        dataArray:[],
                    });
                }

                // data = null;
                dataBlob = null;
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
        
        //请求数据
        this.fetchData(1);
        this.deEmitter = DeviceEventEmitter.addListener('changeDir',
            (data) => {
                let len = this.state.navData.length;
                if (len - 1 === data.index) {
                    if (this.state.fileId !== data.value.fileId) {
                        let navData = [].concat(this.state.navData);
                        navData[data.index] = { ...navData[data.index], ...data.value }
                        this.setState({
                            fileId: data.value.fileId,
                            navData: navData,
                            refreshing: true,
                            page: 0,
                        }, () => {
                            this.fetchData(0);
                        })
                    }
                }
            });
    }
    componentWillUnmount() {
        if (this.deEmitter) {
            this.deEmitter.remove();
        }
    }

    getDirData = () => {
        let dir = [];
        if (this.state.dataArray) {
            for (let index in this.state.dataArray) {
                if (this.state.dataArray[index].value.folder) {
                    dir.push(this.state.dataArray[index].value);
                } else {
                    break;
                }
            }
        }
        return dir;
    }

    getParentDir = () => {
        let dir = []
        if (this.state.navData && this.state.navData.length > 0) {
            dir = this.state.navData[this.state.navData.length - 1].dir;
        }
        return dir;
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
            let navData = [];
            this.state.navData.forEach((child) => {
                navData.push(child);
            })
            let d = { ...item.value, dir: this.getDirData() }
            navData.push(d);
            if (this.state.dataType === '图纸文件') {
                storage.pushNext(navigator, "BimFileChooserPage", { fileId: item.value.fileId, dataType: this.state.dataType, pageType: this.state.pageType, navData: navData});
            }else{
                if(isDownloadPage){//下载
                    storage.pushNext(navigator, "BimFileChooserPage", { fileId: item.value.fileId, dataType: this.state.dataType, pageType: this.state.pageType, navData: navData ,isDownloadPage:true});
                }else if(downloadedPage){
                    storage.pushNext(navigator, "BimFileChooserPage", { fileId: item.value.fileId, dataType: this.state.dataType, pageType: this.state.pageType, navData: navData,downloadedPage:true });
                }else{
                    storage.pushNext(navigator, "BimFileChooserPage", { fileId: item.value.fileId, dataType: this.state.dataType, pageType: this.state.pageType, navData: navData});
                }
            }
            
        } else {
            if (this.state.dataType === '图纸文件') {
                BimFileEntry.showBlueprintFromChoose(navigator, this.state.pageType, item.value.fileId, item.value.name);
            } else {
                BimFileEntry.showModelFromChoose(navigator, this.state.pageType, item.value.fileId, item.value.buildingId, item.value.buildingName)
            }

        }
    }

    _separator = () => {
        return <View style={{ height: 0.5, backgroundColor: '#CCCCCC', marginLeft: 20 }} />;
    }

    //返回itemView
    renderItemView = ({ item, index }) => {
        if (item.value.folder) {
            if(isDownloadPage){//下载中
                return this.renderFolderViewDownload({ item, index });
            }else if(downloadedPage){//已下载
                return this.renderFolderViewDownloaded({ item, index });
            }else{
                return this.renderFolderView({ item, index });
            }
            
        } else {
            if(isDownloadPage){
                return this.renderFileViewDownload({ item, index });
            }else if(downloadedPage){
                return this.renderFileViewDownloaded({ item, index });
            }else{
                return this.renderFileView({ item, index });
            }
        }
    }

    //文件  普通查看
    renderFileView = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} activeOpacity={0.5} onPress={(event) =>{event.preventDefault(); this._itemClick(item, index)}}>
                <View style={styles.containerFileView}>
                    <ThumbnailImage fileId={item.value.fileId} />
                    <Text style={styles.content}> {item.value.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    //文件夹  普通查看
    renderFolderView = ({ item, index }) => {
        // console.log('-------------renderFolder-----------')
        // console.log(item)
        return (
            <TouchableOpacity key={index} activeOpacity={0.5} onPress={(event) =>{event.preventDefault(); this._itemClick(item, index)}}>
                <View style={styles.containerFolderView}>
                    <Image
                        source={require("app-images/icon_blueprint_file.png")}
                        style={styles.image} />
                    <Text style={styles.content}> {item.value.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }


    //条目前面的选中框的回调
    _select=(selected,item)=>{
        if(selected){
            //选中
            selectedArr = [...selectedArr,item];
        }else{
            //取消选中
            selectedArr.splice(selectedArr.findIndex(x => x.key ==item.key), 1)
        }
    }

    //点击选择全部
    _selectAll=(selected)=>{
        if(selected){
            selectedArr = [...this.state.dataArray];
            DeviceEventEmitter.emit("selectAll",{selectAll:true})
        }else{
            selectedArr = []
            DeviceEventEmitter.emit("selectAll",{selectAll:false})
        }
    }
    
//                         { key: 'P000b65543f97649748f82214f9b226d0c',
// I/ReactNativeJS(19072):   value:
// I/ReactNativeJS(19072):    { fileId: '00b65543f97649748f82214f9b226d0c',
// I/ReactNativeJS(19072):      workspaceId: '528f001ad70e4dc6a91dd01d77ec621b',
// I/ReactNativeJS(19072):      name: 'LHC1-25-SUP-MEP 分离.rvt',
// I/ReactNativeJS(19072):      suffix: 'rvt',
// I/ReactNativeJS(19072):      folder: false,
// I/ReactNativeJS(19072):      length: 77561856,
// I/ReactNativeJS(19072):      parentId: '0',
// I/ReactNativeJS(19072):      appKey: null,
// I/ReactNativeJS(19072):      creatorId: '6260730431164916541',
// I/ReactNativeJS(19072):      creatorName: 'chengr',
// I/ReactNativeJS(19072):      createTime: 1529577519000,
// I/ReactNativeJS(19072):      digest: '3fb5a95e95fb47faafdb23452e456a59',
// I/ReactNativeJS(19072):      thumbnail: null,
// I/ReactNativeJS(19072):      versionIndex: 1,
// I/ReactNativeJS(19072):      filePath: null,
// I/ReactNativeJS(19072):      revisionId: null,
// I/ReactNativeJS(19072):      current: false,
// I/ReactNativeJS(19072):      alias: null,
// I/ReactNativeJS(19072):      index: null,
// I/ReactNativeJS(19072):      fileParentList: null,
// I/ReactNativeJS(19072):      convertStatus: 'success',
// I/ReactNativeJS(19072):      userPrivilege: null,
// I/ReactNativeJS(19072):      buildingId: 5214781,
// I/ReactNativeJS(19072):      buildingName: '25',
// I/ReactNativeJS(19072):      fileFolderAssocStatus: null,
// I/ReactNativeJS(19072):      specialtyCode: null,
// I/ReactNativeJS(19072):      specialtyName: null,
// I/ReactNativeJS(19072):      elementLinkDoc: false } }
    //文件  下载时
    renderFileViewDownload = ({ item, index }) => {
        return (
            <View style={{flexDirection:'row',alignItems:'center'}} >
                <SelectView data={item} callback={this._select} />
                <View style={styles.containerFileView}>
                    <ThumbnailImage fileId={item.value.fileId} />
                    <TouchableOpacity key={index} activeOpacity={0.5} onPress={(event) =>{event.preventDefault(); this._itemClick(item, index)}}>
                        <Text style={styles.content}> {item.value.name}</Text>
                    </TouchableOpacity>
                </View>
                <ProgressView callback={this._downloadFile} data={item} />
            </View>
        );
    }

     //文件  已下载
     renderFileViewDownloaded = ({ item, index }) => {
        let mm = OfflineManager.getModelManager();
        let size = mm.getFileSize(item.value.fileId);
        return (
            <View style={{flexDirection:'row',alignItems:'center'}} >
                <SelectView data={item} callback={this._select} />
                <View style={styles.containerFileView}>
                    <ThumbnailImage fileId={item.value.fileId} />
                    <TouchableOpacity key={index} activeOpacity={0.5} onPress={(event) =>{event.preventDefault(); this._itemClick(item, index)}}>
                        <Text style={styles.content}> {item.value.name}</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{color:'#999999',fontSize:12,marginRight:12}} >{size}M</Text>
            </View>
        );
    }

    _downloadFile =()=>{

    }
    _downloadFolder=()=>{

    }
    //文件夹 下载时
    renderFolderViewDownload = ({ item, index }) => {
        return (
            <View style={{flexDirection:'row',alignItems:'center'}} >
                <SelectView data={item} callback={this._select}  />
                    <View style={styles.containerFolderView}>
                        <Image
                            source={require("app-images/icon_blueprint_file.png")}
                            style={styles.image} />
                        <TouchableOpacity key={index} activeOpacity={0.5} onPress={(event) =>{event.preventDefault(); this._itemClick(item, index)}}>
                            <Text style={styles.content}> {item.value.name}</Text>
                        </TouchableOpacity>
                    </View>
                <ProgressView callback={this._downloadFolder} data={item} />
            </View>
        );
    }

    //文件夹 下载完成
    renderFolderViewDownloaded = ({ item, index }) => {
        let mm = OfflineManager.getModelManager();
        let size = mm.getFolderSize(item.value.fileId);
        return (
            <View style={{flexDirection:'row',alignItems:'center'}} >
                <SelectView data={item} callback={this._select}  />
                    <View style={styles.containerFolderView}>
                        <Image
                            source={require("app-images/icon_blueprint_file.png")}
                            style={styles.image} />
                        <TouchableOpacity key={index} activeOpacity={0.5} onPress={(event) =>{event.preventDefault(); this._itemClick(item, index)}}>
                            <Text style={styles.content}> {item.value.name}</Text>
                        </TouchableOpacity>
                    </View>
                <Text style={{color:'#999999',fontSize:12,marginRight:12}} >{size}M</Text>
            </View>
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
        let specialtyCode = specialty ? specialty.code : "";
        let buildingId = building ? building.id : 0;
        let datalist = this.state.dataType=='图纸文件'?blueprintList:modelList;
        let fileList = this._filterByFileId(this.state.fileId,datalist);
        let speList = this._filterBySpecial(specialtyCode,fileList);
        let list = this._filterByBuilding(buildingId,speList);

    

        let dataBlob = [];
        if (list.length > 0) {
            list.forEach(item => {
                // item.name = item.fileName;
                dataBlob.push({
                    key: "P0" + item.fileId,
                    value: item
                });
            })
        }
        dataBlob = this.sortData(dataBlob);
        this.setState({
            dataArray: dataBlob,
        });
        
    }
    /**
     * 模型图纸列表
     */
    renderList = () => {
        return (
            <FlatList style={{marginBottom:170}}
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

   

    //普通查看时的list
    _normalBread=()=>{
        return (
            <Breadcrumb
                childView={this.renderList()}
                data={this.state.navData}
                onItemClick={(item, index) => {
                    DeviceEventEmitter.emit('changeDir', { value: item, index: index });
                    let len = this.state.navData.length;
                    this.props.navigation.pop(len - index - 1);
                }}>

            </Breadcrumb>
        )
    }

    //下载中  点击下载 全部
    clickDownload=()=>{
        console.log(selectedArr)

        if(selectedArr && selectedArr.length>0){
            let dm = new DownloadModel();
            //非wifi提示
            NotWifiOverLay.show(
                ()=>{//继续下载
                    console.log('goon')
                    for(let item of selectedArr){
                        // console.log(item)
                        if(item.value.folder){
                            //下载文件夹
                            let list = this._getChildren(item.value.fileId);
                            // console.log(list)
                            //下载所有的筛选出的列表   list为modelList的item的集合
                            dm.downloadMultiItems(list);
                        }else{
                            //下载文件
                            dm.downloadSingleItem(item.value);
                        }
                    }
                },
                ()=>{//暂停  wifi下自动下载
                    console.log('pause')
                },
                ()=>{//取消
                    console.log('cancel')
                },
                22
            )

            
            
        }
    }

    _getChildren=(parentId)=>{
        let list = [];
        if(modelList && modelList.length>0){
            for(let item of modelList){
                if(item.parentId == parentId){
                    if(item.folder){
                        let result = this._getChildren(item.fileId);
                        list = [...list,...result]
                    }else{
                        list = [...list,item];
                    }
                }
                
            }
        }
        
        return list;
    }
    //下载时  显示的listview
    _downloadBread=()=>{
        return (
        <View  >
            {this._normalBread()}
            
            <View style={{position: "absolute",bottom:130,backgroundColor:'#ffffff'}}>
                <View style={{backgroundColor:'#e9e9e9',height:1,width:width}} />
                <View style={{flexDirection:'row',alignItems:'center',height:49,width:width}} >
                    <SelectView callback={this._selectAll} isAll={true}/>
                    <Text style={{color:'#666666',fontSize:13,marginLeft:8,flex:1}}>全选</Text>
                    <TouchableOpacity onPress={this.clickDownload}>
                        <View style={{backgroundColor:'#00b5f2',width:58,height:28,alignItems:'center',justifyContent:'center',borderRadius:100,marginLeft:10,marginRight:10}} >
                        <Text style={{fontSize:14,color:'#ffffff'}} >缓存</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>)
    }

    //已下载 点击移除
    _clickdelete=()=>{
        console.log('---------------------')
        console.log(selectedArr)
        console.log(modelList)
        if(selectedArr && selectedArr.length>0){
            let mm = OfflineManager.getModelManager();
            for(let item of selectedArr){
                let fileId = item.value.fileId;
                if(item.value.folder){
                    let list = this._getChildren(item.value.fileId);
                    if(list && list.length>0){
                        list.forEach((item,index)=>{
                            mm.deleteByFileId(item.fileId);
                        })
                    }
                }else{
                    mm.deleteByFileId(fileId);
                }
                
            }
            const timer = setTimeout(() => {
                clearTimeout(timer);
                this.fetchData(0);
            }, 500);
            //修改当前列表
            // for(let item of selectedArr){
            //     modelList.splice(modelList.findIndex(x => x.fileId ==item.value.fileId), 1)
            //     this._handleList(0,modelList);
            // }
            // modelList = mm.getDownloadedModelList();
            // this._handleList(page,modelList);
        }
    }
    //已下载  点击更新
    _clickUpdate=()=>{
        
    }
    //已下载  显示的listview
    _downloadedBread=()=>{
        return (
        <View  >
            {this._normalBread()}
            <View style={{position: "absolute",bottom:130,backgroundColor:'#ffffff'}}>
                <View style={{backgroundColor:'#e9e9e9',height:1,width:width}} />
                <View style={{flexDirection:'row',alignItems:'center',height:49,width:width,justifyContent:'flex-end'}} >
                    <TouchableOpacity onPress={this._clickdelete}>
                        <View style={{backgroundColor:'#f9f9f9',width:58,height:28,borderColor:'#cccccc',borderWidth:1,borderRadius:100,alignItems:'center',justifyContent:'center'}} >
                        <Text style={{fontSize:14,color:'#cccccc',}} >移除</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._clickUpdate}>
                        <View style={{backgroundColor:'#00b5f2',width:58,height:28,alignItems:'center',justifyContent:'center',borderRadius:100,marginLeft:10,marginRight:10}} >
                        <Text style={{fontSize:14,color:'#ffffff'}} >更新</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>)
    }

    _getBread = ()=>{
        if(isDownloadPage){
            return this._downloadBread();
        }else if(downloadedPage){
            return this._downloadedBread();
        }else{
            return this._normalBread();
        }
    }
    renderData = () => {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <View>
                    <BimFileFilterView onFilterChange={(specialty, building) => { this.onFilterChange(specialty, building) }} 
                    
                    children={
                        this._getBread()
                    }

                    />
                 </View>

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

//选中按钮
class SelectView extends Component{
    constructor(){
      super();
      this.state={
        selected:false
      }
    }
  
    click=()=>{
      let item = this.props.data;
      let callback = this.props.callback;
      if(callback){
          callback(!this.state.selected,item);
      }

      this.setState((pre)=>{
        return {
          selected:!pre.selected
        }
      })
    }

    componentDidMount(){
        let isAll = this.props.isAll;//判断是否全部
        if(!isAll){
            //未下载
            this.subscription = DeviceEventEmitter.addListener('selectAll', (params)=>{
                // {selectAll:true}
                this.setState((pre)=>{
                    return {
                    selected:params.selectAll
                    }
                })
                });
        }
        
    }

    componentWillUnmount(){
        this.subscription && this.subscription.remove();
    }
  
    render(){
      let url = this.state.selected?require('app-images/icon_downloading_selected.png'):require('app-images/icon_downloading_unselected.png');
      return (
        <TouchableOpacity onPress = {this.click} >
          <Image style={{ width:16,height:16,marginLeft:11}} source= {url} />
        </TouchableOpacity>
      );
    }
  }
  
  //进度条
  class ProgressView extends Component{
    constructor(){
      super();
      this.state={
        progress:null,
        totalNum:null,
      }
    }
  
    _getChildren=(parentId)=>{
        let list = [];
        if(modelList && modelList.length>0){
            for(let item of modelList){
                if(item.parentId == parentId){
                    if(item.folder){
                        let result = this._getChildren(item.fileId);
                        list = [...list,...result]
                    }else{
                        list = [...list,item];
                    }
                }
                
            }
        }
        
        return list;
    }

    //开始下载
    _startDownload=(item)=>{

        let dm = new DownloadModel();
            //非wifi提示
            NotWifiOverLay.show(
                ()=>{//继续下载
                    console.log('goon')
                    // console.log(item)
                    if(item.value.folder){
                        //下载文件夹
                        let list = this._getChildren(item.value.fileId);
                        // console.log(list)
                        //下载所有的筛选出的列表   list为modelList的item的集合
                        dm.downloadMultiItems(list);
                    }else{
                        //下载文件
                        dm.downloadSingleItem(item.value);
                    }
                },
                ()=>{//暂停  wifi下自动下载
                    console.log('pause')
                },
                ()=>{//取消
                    console.log('cancel')
                },
                22
            )
        
    }
    _stopDownload=(item)=>{
  
    }
  
  
    componentDidMount(){
      // {"item":{"key":"1528843027521","value":"{\"startTime\":1526164627521,\"endTime\":1528843027521,\"qcState\":[\"\"],\"timeText\":\"近1月\",\"downloadTime\":\"2018-6-12 22:37\",\"size\":29,\"title\":\"检查单\",\"subTitle\":\"( 全部 )\",\"progress\":108,\"total\":174}","downloading":"true"},"index":0,"separators":{}}
      let callback = this.props.callback;
      let item = this.props.data;
      // let value = JSON.parse(item.item.value);
      // let dm = OfflineManager.getDownloadingManager();
      //查看该条是否已经下载
      let projectId = storage.loadProject();
      let projectVersionId = storage.getLatestVersionId(projectId);
    //   console.log('----------------------------')
    //   console.log(projectId)
    //   console.log(projectVersionId)
    //   console.log(item)
      
      let key = item.value.fileId+"_"+projectVersionId
      let mm = OfflineManager.getModelManager();
      if(item.value.folder){
            let result = mm.isFolderDownloaded(item.value.fileId);
            console.log(result)
            if(result){
                if(result.done){
                    this.setState((pre)=>{
                        return {
                            ...pre,
                            progress:result.progress,
                            totalNum:result.total,
                            size:result.size,
                        }
                        })
                }else{
                    //未下载
                    this.subscription = DeviceEventEmitter.addListener(key, (params)=>{
                        // key,value,projectVersionId,fileId,progress,total,done,size
                            let progress = Number.parseInt(params.progress+'');
                            let total = Number.parseInt(params.total+'');
                            let size = Number.parseFloat(params.size+'');
                            
                            this.setState((pre)=>{
                                return {
                                ...pre,
                                progress:progress,
                                totalNum:total,
                                }
                            })
                            if(progress == total){
                                this.subscription&&this.subscription.remove();
                                if(callback!=null){
                                callback();
                                callback = null;
                                }
                                
                            }
                        });
                }
            }else{
                //未下载
                this.subscription = DeviceEventEmitter.addListener(key, (params)=>{
                    // key,value,projectVersionId,fileId,progress,total,done,size
                        let progress = Number.parseInt(params.progress+'');
                        let total = Number.parseInt(params.total+'');
                        let size = Number.parseFloat(params.size+'');
                        this.setState((pre)=>{
                            return {
                            ...pre,
                            progress:progress,
                            totalNum:total,
                            }
                        })
                        if(progress == total){
                            this.subscription&&this.subscription.remove();
                            if(callback!=null){
                            callback();
                            callback = null;
                            }
                            
                        }
                    });
            }
      }else{
            //进度条接收
            if(mm.isDownloaded(key)){
                //已经下载
                this.setState((pre)=>{
                return {
                    ...pre,
                    progress:100,
                    totalNum:100,
                }
                })
            }else{
                //未下载
                this.subscription = DeviceEventEmitter.addListener(key, (params)=>{
                // key,value,projectVersionId,fileId,progress,total,done,size
                    let progress = Number.parseInt(params.progress+'');
                    let total = Number.parseInt(params.total+'');
                    let size = Number.parseFloat(params.size+'');
                    this.setState((pre)=>{
                        return {
                        ...pre,
                        progress:progress,
                        totalNum:total,
                        }
                    })
                    if(progress == total){
                        this.subscription&&this.subscription.remove();
                        if(callback!=null){
                        callback();
                        callback = null;
                        }
                        
                    }
                });
            }
      }
      
      
    }
  
  
    render(){
        let item = this.props.data;
      return (
        <CircleProgressBar startDownload={()=>{this._startDownload(item)}} stopDownload={()=>{this._stopDownload(item)}} progress={this.state.progress} totalNum={this.state.totalNum} finishText={''}/>
      );
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
        alignItems: 'center',
        // backgroundColor: '#FFF',
    },
    title: {
        fontSize: 15,
        color: 'blue',
    },
    content: {
        left: 0,
        flex:1,
        top: 15,
        marginLeft: 8,
        marginRight:20,
        textAlign: "left",
        fontSize: 15,
        color: 'black',
        alignSelf: 'flex-start',
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