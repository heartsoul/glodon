/**
 * Created by JokAr on 2017/4/12.
 */
'use strict';
import React, { Component, PureComponent } from "react";
import {StyleSheet, View, StatusBar, Dimensions} from "react-native";
import {SegmentedView} from 'app-3rd/teaset';

import * as API from "app-api";
import QualityListView from "./qualityListView";
import { AuthorityManager } from "app-entry";

var { width, height } = Dimensions.get("window");

export default class qualityList extends PureComponent {
    static navigationOptions = {
        title: '质检清单',
        gesturesEnabled: true,
    };

    constructor(props) {
        super(props);

        this.state = {
            //网络请求状态
            error: false,
            errorInfo: "",
            qcState: '',
            isLoading: true,
            activeIndex: 0,
            qualityView: [{}, {}, {}, {}, {}, {}, {}, {}],
            qualityBadge:{
                item:[0,0,0,0,0,0,0,0,0,0]
            },
        }
    }
    _keyExtractor = (item, index) => index;
    _loadInspectionSummary = () =>{
        let qShow = AuthorityManager.isQualityBrowser()
        if (!qShow) {
            return;
        }
        let qualityCheckpointId = this.props.navigation.getParam('qualityCheckpointId');
        let qualityCheckpointName = this.props.navigation.getParam('qualityCheckpointI');
        API.getQualityInspectionSummary(storage.loadProject(),qualityCheckpointId,qualityCheckpointName).then(
            (responseData) => {
                // console.log('getQualityInspectionSummary' + JSON.stringify(responseData.data))
                let items = responseData.data;
                let qualityBadgeItem = [0,0,0,0,0,0,0,0,0,0];
                items.map((item, index) => {
                    let find = API.CLASSIFY_STATES_SUMMARY.indexOf(item.qcState);
                    if (find > 0) {
                        qualityBadgeItem[find] = item.count;
                    }
                });
                console.log(JSON.stringify(qualityBadgeItem));
                 this.setState({
                        qualityBadge:{item:qualityBadgeItem},
                    })
                // 获取数量数据
            }
        ).catch(err=>{

        });
    }
    componentDidMount = () => {
        //请求数据
        // this._onRefresh();
        storage.qualityNavigation = this.props.navigation;
        // this._loadInspectionSummary();
        // this.refs.sectionList.fetchData(API.CLASSIFY_STATES[0]);
        // this._onSegmentedBarChange(0);
    }

    _onSegmentedBarChange = (index) => {
        this.setState({ activeIndex: index });
        this.state.qualityView[index].fetchData(API.CLASSIFY_STATES[index]);
        // this._loadInspectionSummary();
    }
    _toTop = () => {
        let index = this.state.activeIndex;
        let qualityView = this.state.qualityView[index];
        if(qualityView.scrollToOffset) {
            qualityView.scrollToOffset();
        }
    }
    renderData() {
        let qualityCheckpointId = this.props.navigation.getParam('qualityCheckpointId');
        let qualityCheckpointName = this.props.navigation.getParam('qualityCheckpointI');
        if(!qualityCheckpointId) {
            qualityCheckpointId = 0
        }
        if(!qualityCheckpointName) {
            qualityCheckpointName = ''
        }
        return (
            <View style={[styles.contentList]}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <SegmentedView style={{ flex: 1 }} justifyItem={'scrollable'} type={'carousel'} onChange={(index) => this._onSegmentedBarChange(index)} activeIndex={this.state.activeIndex}>
                    {
                       API.CLASSIFY_STATUS_LIST.map((item,index)=>{
                           return (
                               <SegmentedView.Sheet key={item.name} title={item.name} badge={this.state.qualityBadge.item[index]}>
                                <QualityListView 
                                onRef={ (ref) => {this.state.qualityView[index] = ref}} 
                                style={{flex:1}} 
                                qcState={''+item.state}
                                selected={this.state.activeIndex === index}
                                updateNumber={()=>{this._loadInspectionSummary()}}
                                qualityCheckpointId={qualityCheckpointId}
                                qualityCheckpointName = {qualityCheckpointName}
                                loadData={index ==0 ? true: false} /> 
                            </SegmentedView.Sheet>
                           );
                       })
                   }
                </SegmentedView>
                {/* <TouchableOpacity style={styles.topBtn} onPress={()=>this._toTop()}>
            <Text style={styles.topBtnText}>置顶</Text>
      </TouchableOpacity> */}
            </View>
        );
    }

    render() {
        // console.log('render:' + JSON.stringify(this.state.qualityBadge))
        //加载数据
        return this.renderData();
    }
}

const styles = StyleSheet.create({
    contentList: {
        flex: 1,
        backgroundColor: '#fafafa',
        paddingTop:5,
        //  height:120,
    },
    dataList: {
        // flex: 1,
        top: 0,
        height: height,
        backgroundColor: 'green',
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
});