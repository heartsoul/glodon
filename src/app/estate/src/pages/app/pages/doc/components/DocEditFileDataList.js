/**
 * Created by Soul on 2018/03/16.
 */
'use strict';
import { BarItems} from "app-components";
import React, { Component } from "react";
import {StatusBar, StyleSheet, View, Text, Platform} from "react-native";
import DocFileDataList from './DocFileDataList';
export default class extends DocFileDataList {
  
    constructor(props) {
        super(props);
        this.state = {
            isEdit: true,
        }
        this.updateNavigationBar();
    }
    /**
     * 构建工具条
     * 这个父窗体会调用，
     * needToolbar：是否需要工具调，不需要时就是null
     */
    renderToolbar = (needToolbar)=> {
       return null;
    }

    //  ===========导航处理==========
    /**
     * 页面变更时及时更新标题
     *
     */
    updateNavigationBar = () =>{
        this.props.navigation.setParams({renderTitle: this.renderHeaderTitle, renderLeft: this.renderHeaderLeftButtons, renderRight:this.renderHeaderRightButtons })
    }

    /**
     * 处理导航标题
     *
     */
    renderHeaderTitle = () => {
        const title = this.props.navigation.getParam('title');
        return <BarItems.TitleBarItem text={title ? title : '列表'} />;
    }

    

    /**
     * 处理导航左侧按钮
     *
     */
    renderHeaderLeftButtons = () => {
      return null;
    }

    

    /**
     * 处理导航右侧按钮
     *
     */
    renderHeaderRightButtons = () => {
       return null;
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