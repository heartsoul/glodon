/**
 * Created by JokAr on 2017/4/12.
 */
'use strict';
import React, { Component, PureComponent } from "react";
import { StyleSheet, View, StatusBar, Dimensions, Text } from "react-native";
import { SegmentedView,Badge } from 'app-3rd/teaset';

import * as API from "app-api";
import { AuthorityManager } from "app-entry";
import EquipmentListView from "./equipmentListView";

var { width, height } = Dimensions.get("window");
class QualityListTitle extends Component {
    render = () => {
        let {text,activeTitleStyle,titleStyle,select,badge,style} = this.props;
        let w = 28;
        let right = -7;
        if(text.length >= 3) {
            w = 41;
            right = 0;
        }
        text ='      ' + text + '      ';
        return <View style={{alignItems:'center',alignContent:'center',paddingTop:3}}>
            <Text style={[{...style},select ? activeTitleStyle : titleStyle]} >{text}</Text>
            <View style={{width:w,height:3,marginTop:0,alignSelf:'center'}}>
               {select ? <View style={{width:w,height:2,backgroundColor:'#00baf3',position:'absolute',top:8.5}} resizeMode='contain'/> : null}
            </View>
            <Badge count={badge} style={[{position:'absolute',top:-5,right:right},badge > 0 ? {} :{backgroundColor:'#ffffff'}]} />
        </View>
    }
} 
export default class extends PureComponent {
    static navigationOptions = {
        title: '材设清单',
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
            equipmentView: [{}, {}, {}, {}],
            equipmentBadge: {
                item: [0, 0, 0, 0]
            },
        }
    }
    _keyExtractor = (item, index) => index;
    _loadInspectionSummary = () => {
        let eShow = AuthorityManager.isEquipmentBrowser()
        if (!eShow) {
            return;
        }
        API.equipmentListNum(storage.loadProject()).then(
            (responseData) => {
                // console.log('getQualityInspectionSummary' + JSON.stringify(responseData.data))
                let items = responseData.data;
                let qualityBadgeItem = [0, 0, 0, 0];
                API.EQUIPMENT_CLASSIFY_STATES_SUMMARY.map((item, index) => {
                    let find = items[item];
                    if (find) {
                        qualityBadgeItem[index] = find;
                    }
                });
                // console.log(JSON.stringify(qualityBadgeItem));
                this.setState({
                    equipmentBadge: { item: qualityBadgeItem },
                })
                // 获取数量数据
            }
        ).catch(err => {

        });
    }
    componentDidMount = () => {
        storage.equipmentNavigation = this.props.navigation;
        // this._loadInspectionSummary();
    }

    _onSegmentedBarChange = (index) => {
        if(this.state.activeIndex == index) return;
        this.setState({ activeIndex: index });
        if(this.state.equipmentView[index].fetchData) {
            this.state.equipmentView[index].fetchData(API.EQUIPMENT_CLASSIFY_STATES[index]);
        }
    }
    _toTop = () => {
        let index = this.state.activeIndex;
        let equipmentView = this.state.equipmentView[index];
        if (equipmentView.scrollToOffset) {
            equipmentView.scrollToOffset();
        }
    }
    renderData() {
        return (
            <View style={[styles.contentList]}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <View style={{height:5,width:'100%',backgroundColor:'white'}}/>
                <SegmentedView  indicatorLineWidth={0}  autoScroll={false} animated={this.state.activeIndex == 0?false:true} style={{ flex: 1 }} barStyle={{paddingLeft:0,paddingRight:0}} justifyItem={'fixed'} type={'projector'} onChange={(index) => this._onSegmentedBarChange(index)} activeIndex={this.state.activeIndex}>
                    {
                        API.EQUIPMENT_CLASSIFY_STATUS_LIST.map((item, index) => {
                            return (
                                <SegmentedView.Sheet key={item.name} title={<QualityListTitle key={item.name} text={item.name} badge={this.state.equipmentBadge.item[index]}  select={this.state.activeIndex == index} activeTitleStyle={{color:'#00baf3',fontSize:14}} titleStyle={{color:'#666666',fontSize:14}} />}>
                                    <EquipmentListView
                                        onRef={(ref) => { this.state.equipmentView[index] = ref }}
                                        style={{ flex: 1 }}
                                        qcState={'' + item.state}
                                        updateNumber={() => { this._loadInspectionSummary() }}
                                        selected = {this.state.activeIndex == index}
                                        loadData={index == 0 ? true : false} />
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
        // console.log('render:' + JSON.stringify(this.state.equipmentBadge))
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