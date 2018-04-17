/**
 * Created by JokAr on 2017/4/12.
 */
'use strict';
import React, { Component, PureComponent } from "react";
import {
    ActivityIndicator, Animated, SectionList, FlatList,
    ScrollView, StyleSheet, Text, View, StatusBar, Image,
    RefreshControl, Button,Dimensions, TouchableHighlight, TouchableOpacity
} from "react-native";
import * as API from "app-api";
import QualityListCell from "./qualityListCell";
import QualityListView from "./qualityListView";
import { SegmentedBar,SegmentedView, Drawer, Label } from 'app-3rd/teaset';

var { width, height } = Dimensions.get("window");
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

//   drawer.close(); //如需要可代码手动关上抽屉
export default class qualityList extends PureComponent {
    static navigationOptions = {
        title: '质检清单',
        tabBarVisible: false,
        headerTintColor: "#FFF",
        headerStyle: { backgroundColor: "#00baf3" },
        gesturesEnabled: false,
    };
    

    constructor(props) {
        super(props);
        
        this.state = {
            //网络请求状态
            error: false,
            errorInfo: "",
            qcState: '',
            isLoading:true,
            activeIndex:0,
            qualityView: [{},{},{},{},{},{},{},{}],
           }
    }
    _keyExtractor = (item, index) => index;
  
    componentDidMount=()=> {
        //请求数据
        // this._onRefresh();
        storage.qualityNavigation = this.props.navigation;
        // this.refs.sectionList.fetchData(API.CLASSIFY_STATES[0]);
        // this._onSegmentedBarChange(0);
    }

    _onSegmentedBarChange = (index) => {
        this.setState({activeIndex:index});
        this.state.qualityView[index].fetchData(API.CLASSIFY_STATES[index]);
    }
    _toTop = () =>{
        // this.state.sectionList.scrollToOffset({animated: true, offset:0});
    }
    renderData() {
           
        return (
            <View style={[styles.contentList]}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                {/* <SegmentedBar style={styles.contentHeader} ref = {'segmentedBar'} onChange={(index) => this._onSegmentedBarChange(index)} justifyItem='scrollable'>
                   {
                    //    API.CLASSIFY_NAMES.map((item,index)=>{
                    //        return (
                    //         <SegmentedBar.Item key={item} title={item} />
                    //        );
                    //    })
                   }
                    <SegmentedBar.Item title='全部' />
                    <SegmentedBar.Item badge={29} title='待提交' />
                    <SegmentedBar.Item badge={5} title='待整改' />
                    <SegmentedBar.Item badge={'...'} title='待复查' />
                    <SegmentedBar.Item title='已检查' />
                    <SegmentedBar.Item title='已复查' />
                    <SegmentedBar.Item title='已延迟' />
                    <SegmentedBar.Item title='已验收' />

                </SegmentedBar>
                <QualityListView  ref='sectionList'  qcState = {''} />  */}
                <SegmentedView style={{flex:1}} justifyItem={'scrollable'} type={'carousel'} onChange={(index) => this._onSegmentedBarChange(index)} activeIndex={this.state.activeIndex}> 
                 {
                       API.CLASSIFY_STATUS_LIST.map((item,index)=>{
                           return (
                               <SegmentedView.Sheet key={item.name} title={item.name}>
                                <QualityListView ref={ (e) => {
                                    this.state.qualityView[index] = e
                                    } } style={{flex:1}} qcState={''+item.state} loadData={index ==0 ? true: false} /> 
                            </SegmentedView.Sheet>
                           );
                       })
                   }
           </SegmentedView>
                {/* <TouchableOpacity style={styles.topBtn} onPress={this._toTop.bind(this)}>
            <Text style={styles.topBtnText}>置顶</Text>
      </TouchableOpacity> */}
            </View>
        );
    }

    render() {
        //加载数据
        return this.renderData();
    }
}

const styles = StyleSheet.create({
    contentHeader: {
        // flex:1,
        height:30,
        top:0,
    },
    contentList: {
     flex:1,
         backgroundColor:'#dedede',
        //  height:120,
    },
    dataList: {
        // flex: 1,
        top:0, 
        height:height,
        backgroundColor:'green',
    },
    gray: {
        top: 100,
        left: width / 2 - 30,
        position: 'absolute',
    },
    topBtn: {
        width: 50,
        height: 25,
        backgroundColor: '#0007',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        top: height - 100,
        left: width - 60,
        position: 'absolute',
    },
    topBtnText: {
        fontSize: 12,
        color: '#fff'
    },
    headerButton: {
        color: '#333333',
        fontSize: 14,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        // height:180
    },
    containerView: {
        flex: 1,
        borderRadius: 8,
        // borderWidth:1,
        // borderColor:"#0F0",
        // height:119,
        marginTop: 5,

        marginBottom: 5,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#FFF',
        elevation: 100, // android 
        shadowColor: "#333", // iOS
        shadowOffset: { width: 3, height: 7 }, // iOS
        shadowOpacity: 0.15, // iOS
        shadowRadius: 3, // iOS
    },

    groupHeaderView: {
        // backgroundColor:'#eee',
        height: 40,
    },
    headerLine: {
        backgroundColor: '#999',
        height: 1,
        top: 19,
        marginLeft: 20,
        marginRight: 20,
    },
    groupTitle: {
        height: 20,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#999',
        fontSize: 14,
        width: 100,
        top: 10,
        left: width / 2 - 50,
        backgroundColor: '#ededed',
    }
});