/**
 * Created by soul on 2018/4/12.
 */
'use strict';
import React, { Component, PureComponent } from "react";
import {
    ActivityIndicator, SectionList, StyleSheet, Text, View, StatusBar, Image,
    RefreshControl, Dimensions
} from "react-native";
import * as API from "app-api";
import { connect } from 'react-redux' // 引入connect函数
import * as actions from '../../actions/qualityListAction'
import QualityListCell from "./qualityListCell";
var { width, height } = Dimensions.get("window");

class QualityListView extends PureComponent {
    
    constructor(props) {
        super(props);
        if(props.onRef) {
            props.onRef(this);
        }
    }
    _sectionData=(index) =>{
        return this.state.sectionArray;
    }
    _keyExtractor = (item, index) => index;
    //网络请求
    fetchData = (qcState) => {
        // if(this.props.page > 0) {
        //     return;
        // }
        this._fetchData(qcState, 0, this.props.qualityCheckpointId,this.props.qualityCheckpointName);
    }
    //网络请求
    _fetchData = (qcState, page) => {
       this.props.fetchData(qcState, page, this.props.dataMap,this.props.qualityCheckpointId,this.props.qualityCheckpointName);
       if(page < 1 && this.props.updateNumber) {
        this.props.updateNumber();
    }
    }

    componentDidMount() {
        if(this.props.loadData === true) {
            this.fetchData(this.props.qcState,this.props.qualityCheckpointId,this.props.qualityCheckpointName);
        }
    }

    componentWillReceiveProps= (nextProps) =>{
        if (nextProps.updateIndex != this.props.updateIndex && this.props.selected) {
            this.fetchData(this.props.qcState,this.props.qualityCheckpointId,this.props.qualityCheckpointName);
            if(this.props.updateNumber) {
                this.props.updateNumber();
            }
            return true;
        }
        return true;
    }

    //加载等待的view
    renderLoadingView() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <ActivityIndicator
                    animating={true}
                    style={[styles.gray, { height: 80 }]}
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
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <Text>Fail:</Text>
            </View>
        );
    }
    onCellAction = (item, index, type) => {
        if(type == 'delete') {
            this.props.deleteData(this.props.qcState,item.value.id, item.value.inspectionType,this.props.qualityCheckpointId,this.props.qualityCheckpointName)
            return;
        }
        if(type == 'submit') {
            this.props.submitData(this.props.qcState,item.value.id, item.value.inspectionType,this.props.qualityCheckpointId,this.props.qualityCheckpointName)
            return;
        }
        
    }
    //返回itemView
    renderItemView = ({ item, index }) => {
        return (
            <QualityListCell onCellAction={this.onCellAction} item={item} index={index} />
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
    _onEndReached = () => {
        if (this.props.isLoading || this.props.hasMore == false) {
            return;
        }
        this._fetchData(this.props.qcState, this.props.page);
    }
    _onRefresh = () => {
        this._fetchData(this.props.qcState, -1);
    }
   
    _emptyView = () => {
        return (<View style={{ alignItems: 'center', justifyContent: 'center', height: height - 44 - 20 - 49 }}><Text style={{ color: 'gray' }}>暂无数据</Text></View>);
    }
    scrollToOffset = () =>{
        if(this.refs.sectionList.scrollTo) {
            this.refs.sectionList.scrollTo();
        }
        
    }
    renderData= ()=> {
        return (
        <SectionList
            ref='sectionList'
            sections={this.props.dataArray}
            renderItem={this.renderItemView}
            // keyExtractor={this._keyExtractor}
            renderSectionHeader={this._sectionComp}
            // ItemSeparatorComponent={this._separator}
            stickySectionHeadersEnabled={false}
            onRefresh={this._onRefresh}
            refreshing={this.props.isLoading}
            onEndReached={this._onEndReached}
            onEndReachedThreshold={1}
            ListEmptyComponent={this._emptyView}
        />

        );
    }
    render() {
       // 第一次加载等待的view
        if (this.props.isLoading && !this.props.error) {
            return this.renderLoadingView();
        } else 
        if (this.props.error) {
            //请求失败view
            return this.renderErrorView(this.props.error);
        }
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
    gray: {
        top: 100,
        left: width / 2 - 30,
        position: 'absolute',
    },
 
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        // height:180
    },

    groupHeaderView: {
        backgroundColor: '#fafafa',
        height: 30,
    },
    headerLine: {
        backgroundColor: '#e6e6e6',
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
        backgroundColor: '#fafafa',
    }
});

function mapStateToProps(state) {
    return {...state}
  }

  function mapDispatchToProps(dispatch) {
    return {
        fetchData: (qcState,page,dataMap,qualityCheckpointId,qualityCheckpointName) =>{
          if(dispatch) {
            dispatch(actions.fetchData(qcState,page,dataMap,qualityCheckpointId,qualityCheckpointName))
          }
        },
        resetData: (qcState,qualityCheckpointId,qualityCheckpointName) =>{
          if(dispatch) {
            dispatch(actions.reset(qcState,qualityCheckpointId,qualityCheckpointName))
          }
        },
        deleteData: (qcState, inspectId, inspectionType,qualityCheckpointId,qualityCheckpointName) =>{
            if(dispatch) {
              dispatch(actions.deleteData(qcState, inspectId, inspectionType,qualityCheckpointId,qualityCheckpointName))
            }
          },
        submitData: (qcState, inspectId, inspectionType,qualityCheckpointId,qualityCheckpointName) =>{
            if(dispatch) {
              dispatch(actions.submitData(qcState, inspectId, inspectionType,qualityCheckpointId,qualityCheckpointName))
            }
          },
      }
  }

function mergeProps(stateProps, dispatchProps, ownProps) {
    if(ownProps.qualityCheckpointId != 0) {
        return Object.assign({}, ownProps,dispatchProps, {
            dataArray: stateProps.qualityList.datas_n[ownProps.qcState].data,
            dataMap:stateProps.qualityList.datas_n[ownProps.qcState].dataMap,
            page:stateProps.qualityList.datas_n[ownProps.qcState].page,
            isLoading: stateProps.qualityList.datas_n[ownProps.qcState].isLoading,
            error:stateProps.qualityList.datas_n[ownProps.qcState].error,
            hasMore:stateProps.qualityList.datas_n[ownProps.qcState].hasMore,
            updateIndex:stateProps.updateData.updateIndex
        })
    }
    return Object.assign({}, ownProps,dispatchProps, {
        dataArray: stateProps.qualityList.datas[ownProps.qcState].data,
        dataMap:stateProps.qualityList.datas[ownProps.qcState].dataMap,
        page:stateProps.qualityList.datas[ownProps.qcState].page,
        isLoading: stateProps.qualityList.datas[ownProps.qcState].isLoading,
        error:stateProps.qualityList.datas[ownProps.qcState].error,
        hasMore:stateProps.qualityList.datas[ownProps.qcState].hasMore,
        updateIndex:stateProps.updateData.updateIndex
    })
    
  }
  
  
export default connect(mapStateToProps,mapDispatchToProps,mergeProps)(QualityListView)