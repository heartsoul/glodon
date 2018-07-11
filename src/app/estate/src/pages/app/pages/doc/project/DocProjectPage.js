/**
 * Created by Soul on 2018/03/16.
 */
'use strict';
import { TabView } from 'app-3rd/teaset';
import API from 'app-api';
import { BarItems } from "app-components";
import React, { Component } from "react";
import { SafeAreaView, View } from "react-native";
import DocProjectFavListView from './DocProjectFavListView';
import DocProjectFileListView from './DocProjectFileListView';
import DocProjectTransListView from './DocProjectTransListView';
import DocProjectTrashListView from './DocProjectTrashListView';
const PAGE_INNDX_DOC_FILE = 'file';
const PAGE_INNDX_DOC_TRANS = 'trans';
const PAGE_INNDX_DOC_FAV = 'fav';
const PAGE_INNDX_DOC_TRASH = 'trash';

export default class DocProjectPage extends Component {

    static navigationOptions = ({ navigation, screenProps }) => {
        const { params = {} } = navigation.state;
        const { renderLeft, renderRight, renderTitle } = params;

        const renderNavTitle = () => {
            if (renderTitle) {
                return renderTitle();
            }
            const title = navigation.getParam('title');
            return <BarItems.TitleBarItem text={title ? title : '项目文档'} />;
        }
        const renderNavRight = () => {
            if (renderRight) {
                return renderRight();
            }
            return (<BarItems.RightBarItem navigation={navigation} textStyle={{ fontSize: 22, height: 30, }} text="..." onPress={() => { }} />);
        }

        return {
            headerTitle: renderNavTitle(),
            headerRight: renderNavRight(),
            headerLeft: renderLeft && renderLeft(),
        }
    };


    constructor(props) {
        super(props);
        let activeIndex = 0;
        if (props.navigation.getParam('activeIndex')) {
            activeIndex = props.navigation.getParam('activeIndex') || 0;
        }
        this.state = {
            activeIndex: activeIndex
        };
    }
    doChangePage = (pageView) => {
        pageView && pageView.onSelectPage && pageView.onSelectPage(false);
    }
    onChange = (index) => {

        this.state.activeIndex = index;
        // 切换到项目文档
        if (index == 0) {
            return this.doChangePage(this.refs._DocFile);
        }
        // 切换到传输列表
        if (index == 1) {
            return this.doChangePage(this.refs._DocTrans);
        }
        // 切换到收藏列表
        if (index == 2) {
            return this.doChangePage(this.refs._DocFav);
        }
        // 切换到回收站列表
        if (index == 3) {
            return this.doChangePage(this.refs._DocTrash);
        }
    }

    doChangePageToolbar = (pageView) => {
        
         if(pageView && pageView.renderToolbar) {
            return pageView.renderToolbar();
         } 
         return null;
       
    }

    renderEditToolbar() {
        let index = this.state.activeIndex;
        // 切换到项目文档
        if (index == 0) {
            return this.doChangePageToolbar(this.refs._DocFile);
        }
        // 切换到传输列表
        if (index == 1) {
            return this.doChangePageToolbar(this.refs._DocTrans);
        }
        // 切换到收藏列表
        if (index == 2) {
            return this.doChangePageToolbar(this.refs._DocFav);
        }
        // 切换到回收站列表
        if (index == 3) {
            return this.doChangePageToolbar(this.refs._DocTrash);
        }
    }
    render() {
        return (
            <SafeAreaView style={{ height: '100%', backgroundColor: "#f5f8f9" }}>
                <TabView onChange={this.onChange} style={{ flex: 1, overflow: 'visible' }} type='projector'>
                    <TabView.Sheet
                        title={'项目文档'}
                        icon={require('app-images/doc/icon_doc_maim_file.png')}
                        activeIcon={require('app-images/doc/icon_doc_maim_file_click.png')}
                    >
                        <DocProjectFileListView isRoot={true} ref='_DocFile' navigation={this.props.navigation} />
                    </TabView.Sheet>
                    <TabView.Sheet
                        title={'传输列表'}
                        icon={require('app-images/doc/icon_doc_main_trans.png')}
                        activeIcon={require('app-images/doc/icon_doc_main_trans_click.png')}
                    >
                        <DocProjectTransListView isRoot={true} ref='_DocTrans' navigation={this.props.navigation} />
                    </TabView.Sheet>
                    <TabView.Sheet
                        title={'收藏列表'}
                        icon={require('app-images/doc/icon_doc_main_fav.png')}
                        activeIcon={require('app-images/doc/icon_doc_main_fav_click.png')}
                    >
                        <DocProjectFavListView isRoot={true} ref='_DocFav' navigation={this.props.navigation} />
                    </TabView.Sheet>
                    <TabView.Sheet
                        title={'回收站'}
                        icon={require('app-images/doc/icon_doc_main_trash.png')}
                        activeIcon={require('app-images/doc/icon_doc_main_trash_click.png')}
                    // badge={'new'}
                    >
                        <DocProjectTrashListView isRoot={true} ref='_DocTrash' navigation={this.props.navigation} />
                    </TabView.Sheet>
                </TabView>
                {this.renderEditToolbar()}
            </SafeAreaView>);

    }
}
