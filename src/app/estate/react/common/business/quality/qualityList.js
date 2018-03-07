/**
 * Created by JokAr on 2017/4/12.
 */
'use strict';
import React, {Component,} from "react";
import {ActivityIndicator, Animated, FlatList, ScrollView, StyleSheet, Text, View,StatusBar,Image} from "react-native";
import * as API from "../service/api/api+quality"; 
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

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
        }
    }
    _keyExtractor = (item, index) => index;
    //网络请求
    fetchData = ()=> {
        // 这个是js的访问网络的方法
        API.getQualityInspectionAll(global.storage.projectId, 0,35).then(
            (responseData) => {
                let data = responseData.data.content;
                let dataBlob = [];
                let i = 0;
                data.forEach(item => {
                    dataBlob.push({
                        key: ""+i,
                        value: item,
                    })
                    i++; 
                });
            
                this.setState({
                    //复制数据源
                    dataArray: dataBlob,
                    isLoading: false,
                });
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
        this.fetchData();
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
    _header = () => {
        return <Text style={[styles.txt,{backgroundColor:'black'}]}>这是头部</Text>;
    }

    _footer = () => {
        return <Text style={[styles.txt,{backgroundColor:'black'}]}>这是尾部</Text>;
    }

    _separator = () => {
        return <View style={{height:2,backgroundColor:'yellow'}}/>;
    }
    //返回itemView
    renderItemView({item}) {
        return (
            <View style={styles.containerView}>
             <Image
          source={require("../../res/images/icon_choose_project_item.png")}
          style={styles.image}/> 
                 <Text style={styles.content}>{item.value.description}({item.value.qcState},{item.value.id})</Text>
            </View>
        );
    }

    renderData() {
        return (
            <ScrollView >
                <StatusBar
          barStyle="light-content"
          backgroundColor="#ecf0f1"
        />
        <Text style={{color:"transparent",height:30}}> 项目列表 </Text>
                <AnimatedFlatList
                    data={this.state.dataArray}
                    renderItem={this.renderItemView}
                    keyExtractor={this._keyExtractor}
                    ItemSeparatorComponent={this._separator}
                />
            </ScrollView>
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
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        height:180
    },
    containerView:{
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
    title: {
        fontSize: 15,
        color: 'blue',
    },
    content: {
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