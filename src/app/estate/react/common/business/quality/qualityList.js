/**
 * Created by JokAr on 2017/4/12.
 */
'use strict';
import React, {Component,PureComponent} from "react";
import {ActivityIndicator, Animated, SectionList,FlatList,
     ScrollView, StyleSheet, Text, View,StatusBar,Image,
     RefreshControl,Button,TouchableHighlight,TouchableOpacity} from "react-native";
import * as API from "../service/api/api+quality"; 
import QualityListCell from "./qualityListCell"; 
var Dimensions = require("Dimensions");
var { width, height } = Dimensions.get("window");
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);
 
export default class qualityList extends PureComponent {
    static navigationOptions = {
        title: '质检清单',
        tabBarVisible:false,
        headerTintColor:"#FFF",
        headerStyle:{backgroundColor:"#00baf3"},
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [],
            sectionArray:[],
            qcState:'',
            currentPage:0,
            hasMore:true,
            refreshing:true,
        }
    }
    _keyExtractor = (item, index) => index;
    //网络请求
    fetchData = (qcState)=> {
        this._fetchData(qcState, 0);
    }
    //网络请求
    _fetchData = (qcState,page)=> {
        // 这个是js的访问网络的方法
        API.getQualityInspectionAll(global.storage.loadProject(),qcState, page,35).then(
            (responseData) => {
                let data = responseData.data.content;
                let hasData = responseData.data.last == false;
                let dataBlob = [];
                let groupMap = new Map();
                let i = 0,j=0;
                let sectionLob = [];
                if(page !=0) {
                    groupMap = this.state.groupMap;
                }
                data.forEach(item => {
                    item.showTime = ""+ API.formatUnixtimestamp(item.updateTime);
                    item.index = i;
                    item.qcStateShow = ""+API.toQcStateShow(item.qcState);
                    if(item.files && item.files.size > 0) {
                        item.url = item.files[0].url;
                        console.log(item.url);
                    }
                    let groupTime = item.showTime.substring(0,10);
                    let dataBlob = groupMap.get(groupTime);
                    if(dataBlob == undefined) {
                        dataBlob = [];
                        groupMap.set(groupTime,dataBlob);
                    }
                    dataBlob.push({
                        key: ""+item.id,
                        value: item,
                    });
                    i++;
                });
            
                groupMap.forEach(function (value, key, map) {
                    sectionLob.push({
                        key: key,
                        data: value,
                    });
                 });

                this.setState({
                    //复制数据源
                    sectionArray: sectionLob,
                    groupMap:groupMap,
                    isLoading: false,
                    refreshing:false,
                    currentPage:page + 1,
                    hasMore:hasData
                });
                data = null;
                dataBlob = null;
                sectionLob = null;
                groupMap = null;
            }
        );
    }

    componentDidMount() {
        //请求数据
        this._onRefresh();
    }

    //加载等待的view
    renderLoadingView() {
        return (
            <View style={styles.container}>
            <StatusBar
          barStyle="light-content"
          backgroundColor="#ecf0f1"
        />
                <ActivityIndicator
                    animating={true}
                    style={[styles.gray, {height: 80}]}
                    color='green'
                    size="large"
                />
            </View>
        );
    }

    //加载失败view
    renderErrorView(error) {
        return (
            <View style={styles.container}>
            <StatusBar
          barStyle="light-content"
          backgroundColor="#ecf0f1"
        />
                <Text>
                    Fail: {error}
                </Text>
            </View>
        );
    }
    
    //返回itemView
    renderItemView=({item,index})=> {
        return (
            <QualityListCell item={item} index={index} />
        );
    }
    _sectionComp = (info) => {
        var txt = info.section.key;
        return <View style={styles.groupHeaderView}>
            <View style={styles.headerLine}></View> 
        <Text
            style={styles.groupTitle}>{txt}</Text>
            </View>
    }
    _onFilter = (qcState) => {
        this.setState({
            refreshing: true,
            currentPage:0,
            hasMore:true,
            qcState:qcState,
            isLoading:true,
        });
        this.fetchData(qcState);
    }
    _onEndReached = () => {
        if(this.state.refreshing || this.state.isLoading||this.state.hasMore == false) {
            return;
        }
        this.setState({
            refreshing: true,
        });
        this._fetchData(this.state.qcState,this.state.currentPage);
    }
    _onRefresh = () => {
        // this.setState({
        //     refreshing: true,
        //     currentPage:0,
        // });
        this._onFilter(this.state.qcState);
    }
    renderData() {
        return (
        <View style={styles.contentList}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#ecf0f1"
        />
        <ScrollView pagingEnabled={false}
        horizontal={true} style={styles.contentHeader} >
        <Button style={styles.headerButton} color={this.state.qcState==''?'#00baf3' : '#333333'} onPress={()=>this._onFilter('')} title="全部" ></Button>
        <Button style={styles.headerButton} color={this.state.qcState=='staged'?'#00baf3' : '#333333'} onPress={()=>this._onFilter('staged')} title="待提交" ></Button>
        <Button style={styles.headerButton} color={this.state.qcState=='unrectified'?'#00baf3' : '#333333'} onPress={()=>this._onFilter('unrectified')} title="待整改" ></Button>
        <Button style={styles.headerButton} color={this.state.qcState=='unreviewed'?'#00baf3' : '#333333'} onPress={()=>this._onFilter('unreviewed')} title="待复查" ></Button>
        <Button style={styles.headerButton} color={this.state.qcState=='inspected'?'#00baf3' : '#333333'} onPress={()=>this._onFilter('inspected')} title="已检查" ></Button>
        <Button style={styles.headerButton} color={this.state.qcState=='reviewed'?'#00baf3' : '#333333'} onPress={()=>this._onFilter('reviewed')} title="已复查" ></Button>
        <Button style={styles.headerButton} color={this.state.qcState=='delayed'?'#00baf3' : '#333333'} onPress={()=>this._onFilter('delayed')} title="已延迟" ></Button>
        <Button style={styles.headerButton} color={this.state.qcState=='accepted'?'#00baf3' : '#333333'} onPress={()=>this._onFilter('accepted')} title="已验收" ></Button>
        </ScrollView >
        {/* var sectionList; */}
                <AnimatedSectionList
                    ref = 'sectionList'
                    sections={this.state.sectionArray}
                    renderItem={this.renderItemView}
                    // keyExtractor={this._keyExtractor}
                    renderSectionHeader={this._sectionComp}
                   // ItemSeparatorComponent={this._separator}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                        />
                    }
                    onRefresh={this._onRefresh}
                    refreshing={this.state.refreshing}
                    onEndReached={this._onEndReached}
                    onEndReachedThreshold={1}
                />
                {/* <TouchableOpacity style={styles.topBtn} onPress={() => this.refs.sectionList.scrollToIndex({animated: true, viewPosition: 0, index: 0})}
        >
            <Text style={styles.topBtnText}>置顶</Text>
      </TouchableOpacity> */}
            </View>
        );
    }

    render() {
        //第一次加载等待的view
        // if (this.state.isLoading && !this.state.error) {
        //     return this.renderLoadingView();
        // } else 
        if (this.state.error) {
            //请求失败view
            return this.renderErrorView(this.state.errorInfo);
        }
        //加载数据
        return this.renderData();
    }
}

const styles = StyleSheet.create({
    contentHeader:{},
    contentList:{},
    gray:{
        top:100,
        left:width/2 - 30,
        position:'absolute',
    },
    topBtn:{
        width:50,
        height:25,
        backgroundColor:'#0007',
        borderRadius:8,
        justifyContent:'center',
        alignItems:'center',
        top:height-100,
        left:width - 60,
        position:'absolute',
    },
    topBtnText:{
        fontSize:12,
        color:'#fff'
    },
    headerButton:{
        color:'#333333',
        fontSize:14,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        // height:180
    },
    containerView:{
        flex: 1,
        borderRadius:8,
        // borderWidth:1,
        // borderColor:"#0F0",
        // height:119,
        marginTop: 5,
        
        marginBottom: 5,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#FFF',
        elevation:100, // android 
        shadowColor:"#333", // iOS
        shadowOffset:{width:3,height:7}, // iOS
        shadowOpacity:0.15, // iOS
        shadowRadius:3, // iOS
    },
   
    groupHeaderView: {
        // backgroundColor:'#eee',
        height:40,
    },
    headerLine: {
        backgroundColor:'#999',
        height:1,
         top: 19,
         marginLeft:20,
         marginRight:20,
    },
    groupTitle: {
        height: 20, 
        textAlign: 'center', 
        textAlignVertical: 'center', 
        color: '#999', 
        fontSize: 14,
        width: 100,
        top:10,
        left:width/2-50,
        backgroundColor:'#ededed',
    }
});