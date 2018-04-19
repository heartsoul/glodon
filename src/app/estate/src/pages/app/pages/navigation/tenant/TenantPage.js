/**
 * Created by Soul on 2018/03/16.
 */
'use strict';
import React, {Component,} from "react";
import {ActivityIndicator, Animated, FlatList, ScrollView, StyleSheet, Text, View,StatusBar,Image,TouchableOpacity} from "react-native";
import * as USERAPI from "app-api"; 
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default class tenantList extends Component {
    static navigationOptions = {
        title: '租户列表',
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

    //网络请求
    fetchData = ()=> {
        if(storage.userInfo && storage.userInfo["accountInfo"]) {
            
        } else {
            storage.gotoLogin(this.props.navigation);
            return;
        }
      let userTenants = storage.userInfo["accountInfo"]["userTenants"];
        if(userTenants) {
                let data = userTenants;
                let dataBlob = [];
                let i = 0;
                data.map(function (item) {
                    dataBlob.push({
                        key: "A0"+i,
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
        } else {
            this.setState({
                            error: true,
                            errorInfo: {"errorInfo":"未登录"},
                        });
        }
        //这个是js的访问网络的方法
        // fetch(REQUEST_URL)
        //     .then((response) => response.json())
        //     .then((responseData) => {
        //         let data = responseData.items;
        //         let dataBlob = [];
        //         let i = 0;
        //         data.map(function (item) {
        //             dataBlob.push({
        //                 key: i,
        //                 value: item,
        //             })
        //             i++;
        //         });
        //         this.setState({
        //             //复制数据源
        //             dataArray: dataBlob,
        //             isLoading: false,
        //         });
        //         data = null;
        //         dataBlob = null;
        //     })
        //     .catch((error) => {
        //         this.setState({
        //             error: true,
        //             errorInfo: error
        //         })
        //     })
        //     .done();
    }

    componentDidMount() {
        //请求数据
        this.fetchData();
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
  //点击列表点击每一行
    _clickItem = (item,index) => {
        //   alert(item.value.tenantId);
         USERAPI.setCurrentTenant(item.value.tenantId).then((responseData)=>{
            let navigator = this.props.navigation;
             storage.saveTenant(item.value.id);
             storage.pushNext(navigator, "ProjectPage")

         });
    }
    //返回itemView
    renderItemView = ({item,index}) => {
        return (
            <TouchableOpacity key={index} activeOpacity={0.5}  onPress={() => this._clickItem(item,index)}>
                <View style={styles.containerView}>
                 <Image
          source={require("app-images/icon_choose_tenant_item.png")}
          style={styles.image}/> 
                 <Text style={styles.content}> {item.value.tenantName}</Text>
                </View>
            </TouchableOpacity>
        );
    }
    createEmptyView() {
        return (
         <Text style={{fontSize: 40, alignSelf: 'center'}}>还没有数据哦！</Text>
        );
      }
      _keyExtractor = (item, index) => index;
    renderData() {
        return (
            <ScrollView >
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
        <Text style={{color:"transparent",height:30}}> 租户列表 </Text>
                <AnimatedFlatList
                    data={this.state.dataArray}
                    renderItem={this.renderItemView}
                    ListEmptyComponent={this.createEmptyView}
                    getItemLayout={(data, index) => ({
                        length: 60, offset: (44 + 1) * index, index
                      })}
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
        
        marginBottom: 15,
        marginLeft: 40,
        marginRight: 40,
        backgroundColor: '#FFF',
        elevation:5, // android 
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