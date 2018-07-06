/**
 * Created by Soul on 2018/03/16.
 */
'use strict';
import { BarItems} from "app-components";
import React, { Component } from "react";
import {StatusBar, StyleSheet, View, Text, Platform} from "react-native";

export default class extends Component {
   
    static navigationOptions = ({ navigation }) => {
        const { params={} } = navigation.state ;
        const {renderTitle,renderLeft,renderRight} = params;
        const renderNavTitle = ()=>{
            if(renderTitle) {
                return renderTitle();
            }
            const title = navigation.getParam('title');
            return <BarItems.TitleBarItem text={title ? title : '列表'} />;        
        }
        const renderNavRight= ()=>{
            if(renderRight) {
                return renderRight();
            }
            return (<BarItems.RightBarItem navigation={navigation} textStyle={{fontSize:22,height:30,}} text=" " onPress={null} />);     
        }
        
        return {
            headerTitle: renderNavTitle(),
            headerRight: renderNavRight(),
            headerLeft: renderLeft && renderLeft(),
        }
    };
    
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            refreshing: false,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [],
            page: 0,
            hasMore: true,
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
     * 获取数据
     *
     */
    fetchData = (page) => {
        this.setState({
            //复制数据源
            dataArray: [],
            isLoading: false,
            refreshing: false,
            page: page + 1,
            hasMore:false
        });
    }
    
    /**
     * 列表数据组合
     *
     */
    handleData = (dataOrign,page) => {
        let data = this.willHandelData(dataOrign,page);
        let last = false;

        let dataBlob = [];
        if (data.length > 0) {
            if (page > 0) {
                dataBlob = this.state.dataArray;
            }
            let i = 0;
            data.forEach(item => {
                dataBlob.push({
                    key: "P0" + item.fileId,
                    value: item,
                })
                i++;
            });
            dataBlob = this.didHandelData(dataBlob);
            this.setState({
                //复制数据源
                dataArray: dataBlob,
                isLoading: false,
                refreshing: false,
                page: page + 1,
                hasMore: last ? false : true
            });
        } else {
            this.setState({
                isLoading: false,
                refreshing: false,
            });
        }
        dataBlob = null;
        return;
    }

    /**
     * 列表数据组合前处理
     *
     */
    willHandelData = (data,page) => {
        return data;
    }

    /**
     * 列表数据组合后处理
     *
     */
    didHandelData = (data,page) => {
        return data;
    }
    
    componentDidMount() {
        //请求数据
        this.fetchData(0);
    }

    //加载失败view
    renderErrorView(error) {
        if(SERVER_TYPE === "TEST") {
            return ( <NoDataView text={"error："+error} /> );
        }
        return ( <NoDataView text="加载失败" /> );
    }

    /**
     * 数据项点击事件处理
     *
     */
    _itemClick = (item, index) => {
        
    }

    /**
     * 数据分隔线
     *
     */
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#ededed',marginRight:20}} />;
    }

    onEndReached = () => {
    }

    /**
     * 刷新
     *
     */
    onRefreshing = () => {
        // console.log(this.state.refreshing);
        if (this.state.refreshing) {
            return;
        }
        //设置刷新状态为正在刷新
        this.setState({
            refreshing: true,
            page: 0,
        });
        //延时加载
        const timer = setTimeout(() => {
            clearTimeout(timer);
            this.fetchData(this.state.page);
        }, 500);
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

    render = () => {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                {this.renderList()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
});