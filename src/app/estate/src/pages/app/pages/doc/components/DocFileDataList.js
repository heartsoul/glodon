/**
 * Created by Soul on 2018/03/16.
 */
'use strict';
import { BarItems} from "app-components";
import React, { Component } from "react";
import {StatusBar, StyleSheet, View, Text, Platform} from "react-native";
import DataListBase from './DataListBase'
export default class extends DataListBase {
   
    
    constructor(props) {
        super(props);
    }
    /**
     * 构建工具条
     * 这个父窗体会调用，
     * needToolbar：是否需要工具调，不需要时就是null
     */
    renderToolbar = (needToolbar)=> {
       return null;
    }

    
    componentDidMount() {
        //请求数据
        this.fetchData(0);
    }

    /**
     * 数据项点击事件处理
     *
     */
    _itemClick = (item, index) => {
        
    }

    /**
     * 列表
     */
    renderList = () => {
        return <NoDataView text="这里需要实现了才能正常使用" />
        // return (
        //     <DataListBase 
        //     dataArray={this.state.dataArray} 
        //     renderItemView={(<View />)}
        //     isLoading={this.isLoading}
        //     refreshing={this.refreshing}
        //     />
        // );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
});