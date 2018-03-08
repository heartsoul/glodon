/**
 * Created by JokAr on 2017/4/12.
 */
'use strict';
import React, {Component,} from "react";
import {ActivityIndicator, Animated, SectionList,FlatList,
     ScrollView, StyleSheet, Text, View,StatusBar,Image,
     RefreshControl,Button,TouchableHighlight} from "react-native";
import * as API from "../service/api/api+quality"; 
var Dimensions = require("Dimensions");
var { width, height } = Dimensions.get("window");
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);
const CLASSIFY_STATES = ["","staged","unrectified","unreviewed","inspected","reviewed","delayed","accepted"];
const CLASSIFY_NAMES = ["全部","待提交","待整改","待复查","已检查","已复查","已延迟","已验收"];
function toQcStateShow(qcState) {
    let index = CLASSIFY_STATES.indexOf(qcState);
    if(index > 0) {
        return CLASSIFY_NAMES[index];
    }
    return "";
}
function formatUnixtimestamp(inputTime) {  
    var date = new Date(inputTime*1000);  
    var y = date.getFullYear();    
    var m = date.getMonth() + 1;    
    m = m < 10 ? ('0' + m) : m;    
    var d = date.getDate();    
    d = d < 10 ? ('0' + d) : d;    
    var h = date.getHours();  
    h = h < 10 ? ('0' + h) : h;  
    var minute = date.getMinutes();  
    var second = date.getSeconds();  
    minute = minute < 10 ? ('0' + minute) : minute;    
    second = second < 10 ? ('0' + second) : second;   
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;    
}; 
export default class qualityList extends Component {
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
            hasMore:true
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
        API.getQualityInspectionAll(global.storage.projectId,qcState, page,35).then(
            (responseData) => {
                let data = responseData.data.content;
                let dataBlob = [];
                let groupMap = new Map();
                let i = 0,j=0;
                let sectionLob = [];
                if(page !=0) {
                    groupMap = this.state.groupMap;
                }
                data.forEach(item => {
                    item.showTime = ""+ formatUnixtimestamp(item.inspectionDate);
                    item.index = i;
                    item.qcStateShow = ""+toQcStateShow(item.qcState);
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
                    currentPage:page + 1
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
        this.fetchData('');
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
    renderItemView({item,index}) {
        return (
            <View style={[styles.containerView,]}>
             <Image
          source={require("../../res/images/icon_time_black.png")}
          style={styles.imageTime}/> 
                 <Text style={styles.contentTime}>{item.value.showTime}</Text>
                 <Text style={styles.contentStatus}>{item.value.qcStateShow}</Text>
                 <View style={styles.contentView}>
                 <Image
          source={require("../../res/images/icon_choose_project_item.png")}
          style={styles.image}/> 
                 <Text style={styles.content}>{item.value.description}</Text>
                 </View>
                 {
                       index % 2 ==0 ? (
                            null
                        ) : (
                            <View style={[styles.contentActionView]} >
                 <TouchableHighlight onPress={()=>{alert('删除')}} style={[styles.contentActionButton,styles.contentActionButtonDelete]}><Text style={styles.contentActionButtonText}>删除</Text>
                 </TouchableHighlight>
                 <TouchableHighlight onPress={()=>{alert('提交')}} style={styles.contentActionButton}><Text style={styles.contentActionButtonText}>提交</Text></TouchableHighlight>
                 </View>
                        )
                    }
                 
            </View>
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
        this.state.currentPage = 0;
        this.state.hasMore = true;
        this.state.qcState = qcState;
        this.fetchData(qcState);
    }
    _onEndReached = () => {
        this._fetchData(this.state.qcState,this.state.currentPage + 1);
    }
    _onRefresh = () => {
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
        <Button style={styles.headerButton} color={this.state.qcState==''?'#000099' : '#999999'} onPress={()=>this._onFilter('')} title="全部" ></Button>
        <Button style={styles.headerButton} color={this.state.qcState=='staged'?'#000099' : '#999999'} onPress={()=>this._onFilter('staged')} title="待提交" ></Button>
        <Button style={styles.headerButton} color={this.state.qcState=='unrectified'?'#000099' : '#999999'} onPress={()=>this._onFilter('unrectified')} title="待整改" ></Button>
        <Button style={styles.headerButton} color={this.state.qcState=='unreviewed'?'#000099' : '#999999'} onPress={()=>this._onFilter('unreviewed')} title="待复查" ></Button>
        <Button style={styles.headerButton} color={this.state.qcState=='inspected'?'#000099' : '#999999'} onPress={()=>this._onFilter('inspected')} title="已检查" ></Button>
        <Button style={styles.headerButton} color={this.state.qcState=='reviewed'?'#000099' : '#999999'} onPress={()=>this._onFilter('reviewed')} title="已复查" ></Button>
        <Button style={styles.headerButton} color={this.state.qcState=='delayed'?'#000099' : '#999999'} onPress={()=>this._onFilter('delayed')} title="已延迟" ></Button>
        <Button style={styles.headerButton} color={this.state.qcState=='accepted'?'#000099' : '#999999'} onPress={()=>this._onFilter('accepted')} title="已验收" ></Button>
        </ScrollView >
                <AnimatedSectionList
                    sections={this.state.sectionArray}
                    renderItem={this.renderItemView}
                    keyExtractor={this._keyExtractor}
                    renderSectionHeader={this._sectionComp}
                    ItemSeparatorComponent={this._separator}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                        />
                    }
                    // refreshing={refreshing}
                    // onRefresh={this._onRefresh}
                    onEndReached={this._onEndReached}
                    onEndReachedThreshold={0.1}
                />
            </View>
        );
    }

    render() {
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
    contentHeader:{},
    contentList:{},
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
    contentActionView: {
        height:40,
    },
    contentActionButtonText: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        marginTop: 5,
        marginLeft: 5,
        color:'#0000FF'
    },
    contentActionButton:{
        width:80,
        left:width-140,
        backgroundColor:'#EEEEEE',
        // flex:1,
        top: -30,
        height:30,
        borderRadius:15,
        borderColor:'gray',
        borderWidth:1,
    },
    contentActionButtonDelete:{
        left:width-100 - 140,
        top:0,
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
    title: {
        fontSize: 15,
        color: 'blue',
    },
    content: {
        left: 80,
        top: -50,
        fontSize: 15,
        color: 'black',
    },
    contentView: {
        left: 0,
        top: -10,
        backgroundColor: '#ededed',
        overflow:'hidden',
        borderRadius:8,
    },
    image:{
        left:10,
        top:10,
        width:60,
        height:60,
    },
    imageTime:{
        left:10,
        top:10,
        width:20,
        height:20,
    },
    contentTime: {
        left: 35,
        top: -8,
        fontSize: 14,
        color: 'black',
    },
    contentStatus: {
        right: 10,
        top: -28,
        textAlign:'right',
        fontSize: 15,
        color: 'green',
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