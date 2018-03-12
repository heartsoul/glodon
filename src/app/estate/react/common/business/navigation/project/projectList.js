/**
 * Created by JokAr on 2017/4/12.
 */
'use strict';
import React, {Component,} from "react";
import {ActivityIndicator, Animated, FlatList,SectionList, 
    ScrollView, StyleSheet, 
    Text, View,StatusBar,Image,TouchableHighlight,RefreshControl} from "react-native";
import * as USERAPI from "../../../login/api+user"; 
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
export default class projectList extends Component {
    static navigationOptions = {
        title: '项目列表',
        tabBarVisible:false,
        headerTintColor:"#FFF",
        headerStyle:{backgroundColor:"#00baf3"},
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            refreshing:false,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [],
            page:0,
            hasMore:true,
        }
    }
    _keyExtractor = (item, index) => index;
    //网络请求
    fetchData = (page)=> {
        // 这个是js的访问网络的方法
        USERAPI.getProjects(page,35).then(
            (responseData) => {
                let data = responseData.data.content;
                let last = responseData.data.last;

                let dataBlob = [];
                if(data.length > 0) {
                    if(page > 0) {
                        dataBlob = this.state.dataArray;
                    }
                    let i = 0;
                    data.forEach(item => {
                        dataBlob.push({
                            key: "P0"+item.id,
                            value: item,
                        })
                        i++; 
                    });
                    // alert(2);
                    this.setState({
                        //复制数据源
                        dataArray: dataBlob,
                        isLoading: false,
                        refreshing:false,
                        page:page+1,
                        hasMore:last?false:true
                    });
                } else {
                    // alert(3);
                    this.setState({
                        isLoading: false,
                        refreshing:false,
                    });
                }
                
                data = null;
                dataBlob = null;
            }
        );
        // {
        //     "content": [{
        //         "id": 5212498,
        //         "code": "201801031653",
        //         "name": "201801031653",
        //         "simpleName": null,
        //         "parentDeptId": 800,
        //         "parentDeptName": "广联达科技股份有限公司",
        //         "deptId": 5212498,
        //         "responder": null,
        //         "scale": null,
        //         "projectTypeCode": "Estate_Project_Type_House",
        //         "projectTypeName": "住宅",
        //         "countryCode": null,
        //         "regionCode": "Estate_Project_Region_NortheastChina",
        //         "regionName": "东北",
        //         "address": null,
        //         "plannedDuration": 0,
        //         "plannedStart": null,
        //         "plannedEnd": null,
        //         "actualDuration": 0,
        //         "actualStart": null,
        //         "actualEnd": null,
        //         "projectStatusCode": null,
        //         "projectStatusName": null,
        //         "description": null,
        //         "attachmentInfo": null,
        //         "concerned": false
        //     }],
        //     "totalElements": 385,
        //     "last": false,
        //     "totalPages": 15,
        //     "sort": null,
        //     "first": false,
        //     "numberOfElements": 26,
        //     "size": 26,
        //     "number": 1
        // }
    }

    componentDidMount() {
        //请求数据
        this.fetchData(0);
    }

    //加载等待的view
    renderLoadingView() {
        return (
            <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
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
            <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <Text>
                    Fail: {error}
                </Text>
            </View>
        );
    }
    _itemClick = (item,index) => {
        global.storage.saveProject(""+item.value.id);
        global.storage.gotoMain();
    }

    _separator = () => {
        return <View style={{height:1,backgroundColor:'#ededed',marginLeft:40}}/>;
    }
    //返回itemView
    renderItemView = ({item,index}) => {
        const _ = this;
        return (
            <TouchableHighlight key={index} activeOpacity={0.5} onPress={()=>_._itemClick(item,index)}>
            <View style={styles.containerView}>
                 <Text style={styles.content}> {item.value.name}</Text>
            </View>
            </TouchableHighlight>
        );
    }

    //返回itemView
    renderItemSimpleView = ({item,index}) => {
        const _ = this;
        return (
            <TouchableHighlight key={index} activeOpacity={0.5} onPress={()=>_._itemClick(item,index)}>
            <View style={styles.containerSimpleView}>
             <Image
          source={require("../../../res/images/icon_choose_project_item.png")}
          style={styles.image}/> 
                 <Text style={styles.contentSimple}> {item.value.name}</Text>
            </View>
            </TouchableHighlight>
        );
    }
    _onEndReached = () => {
        // if(!this.setState.hasMore) {
        //     return;
        // }
        console.log(this.state.refreshing);
        if(this.state.refreshing) {
            return;
        }
        this.setState({
            refreshing: true,
        });
        const timer = setTimeout(() => {
            clearTimeout(timer);
            this.fetchData(this.state.page);
        }, 1500);
    }
    _onRefreshing = () => {
        console.log(this.state.refreshing);
        if(this.state.refreshing) {
            return;
        }
        //设置刷新状态为正在刷新
        this.setState({
            refreshing: true,
            page:0,
        });
        //延时加载
        const timer = setTimeout(() => {
            clearTimeout(timer);
            this.fetchData(this.state.page);
        }, 1500);
    }
    renderData = () => {
        return (
            <View style={{backgroundColor:"#FFFFFF"}}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
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
            </View>
        );
    }

    renderDataSimple = () => {
        return (
            <View >
               <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
        <Text style={{color:"transparent",height:30}}> 项目列表 </Text>
                <AnimatedFlatList
                    data={this.state.dataArray}
                    renderItem={this.renderItemSimpleView}
                />
            </View>
        );
    }

    render = () =>  {
        //第一次加载等待的view
        if (this.state.isLoading && !this.state.error) {
            return this.renderLoadingView();
        } else if (this.state.error) {
            //请求失败view
            return this.renderErrorView(this.state.errorInfo);
        }
        if(this.state.dataArray.length < 5) {
            //加载数据
        return this.renderDataSimple();
        }
        //加载数据
        return this.renderData();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    containerSimpleView:{
        flex: 1,
        borderRadius:8,
        // borderWidth:1,
        // borderColor:"#0F0",
        height:60,
        marginTop: 5,
        
        marginBottom: 5,
        marginLeft: 40,
        marginRight: 40,
        backgroundColor: '#FFF',
        elevation:100, // android 
        shadowColor:"#333", // iOS
        shadowOffset:{width:3,height:7}, // iOS
        shadowOpacity:0.15, // iOS
        shadowRadius:3, // iOS

    },
    containerView:{
        flex: 1,
        height:50,
        marginLeft: 40,
        marginRight: 40,
        // backgroundColor: '#FFF',
    },
    title: {
        fontSize: 15,
        color: 'blue',
    },
    content: {
        left: 0,
        top:15,
        alignItems: "center",
        textAlign: "left",
        fontSize: 15,
        color: 'black',
    },
    contentSimple: {
        left: 60,
        top: -20,
        fontSize: 15,
        color: 'black',
    },
    image:{
        left:10,
        top:10,
        width:40,
        height:40,
    }

});