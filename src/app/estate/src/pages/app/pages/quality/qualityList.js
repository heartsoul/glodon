/**
 * Created by JokAr on 2017/4/12.
 */
'use strict';
import React, { Component, PureComponent } from "react";
import {StyleSheet, View, StatusBar, Dimensions, Text} from "react-native";
import {SegmentedView,Badge} from 'app-3rd/teaset';

import * as API from "app-api";
import QualityListView from "./qualityListView";
import { AuthorityManager } from "app-entry";

var { width, height } = Dimensions.get("window");
class QualityListTitle extends Component {
    render = () => {
        let {text,activeTitleStyle,titleStyle,select,badge} = this.props;
        let w = 28;
        let right = 0;
        let alignItems = 'center';
        if(text.length >= 3) {
            w = 42;
            right = 7;
            if(badge > 9) {
                right = 0;
            }
            text = text + '        ';
            alignItems = 'flex-start';
        } else {
            text = '     '+ text + '     ';
        }
        
        return <View style={{alignItems:alignItems,alignContent:'center',paddingTop:3,overflow:'visible'}}>
            <Text style={select ? activeTitleStyle : titleStyle} >{text}</Text>
            <View style={{width:w,height:3,marginTop:0}}>
               {select ? <View style={{width:w,height:2,backgroundColor:'#00baf3',position:'absolute',top:8.5}} resizeMode='contain'/> : null}
            </View>
            <Badge count={badge} style={[{position:'absolute',top:-5,right:right},badge > 0 ? {} :{backgroundColor:'#ffffff'}]} />
        </View>
    }
} 
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
        let qualityCheckpointName = this.props.navigation.getParam('qualityCheckpointName');
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
        if(this.state.activeIndex == index) return;
        this.setState({ activeIndex: index });
        if(this.state.qualityView[index].fetchData) {
            this.state.qualityView[index].fetchData(API.CLASSIFY_STATES[index]);
        }
        
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
        let qualityCheckpointName = this.props.navigation.getParam('qualityCheckpointName');
        if(!qualityCheckpointId) {
            qualityCheckpointId = 0
        }
        if(!qualityCheckpointName) {
            qualityCheckpointName = ''
        }
        return (
            <View style={[styles.contentList]}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <View style={{height:3,width:'100%',backgroundColor:'white'}}/>
                <SegmentedView indicatorLineWidth={0}  autoScroll={this.state.activeIndex == 0?false:true} animated={this.state.activeIndex == 0?false:true} style={{ flex: 1 }} barStyle={{paddingLeft:0,paddingRight:0}} justifyItem={'scrollable'} type={'projector'} onChange={(index) => this._onSegmentedBarChange(index)}>
                    {
                       API.CLASSIFY_STATUS_LIST.map((item,index)=>{
                           return (
                               <SegmentedView.Sheet key={item.name} title={<QualityListTitle key={item.name} text={item.name} badge={this.state.qualityBadge.item[index]}  select={this.state.activeIndex == index} activeTitleStyle={{color:'#00baf3',fontSize:14}} titleStyle={{color:'#6f899b',fontSize:14}} />}>
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
                <View style={{position:'absolute',top:41,left:0,height:1,width:'100%',backgroundColor:'#e9e9e999'}} />
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
        paddingBottom: 5,
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
        backgroundColor: '#f8f8f8',
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